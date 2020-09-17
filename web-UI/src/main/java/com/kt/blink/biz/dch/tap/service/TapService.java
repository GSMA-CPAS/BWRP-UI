package com.kt.blink.biz.dch.tap.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.dch.tap.domain.TapDetailDomain;
import com.kt.blink.biz.dch.tap.domain.TapFileDomain;
import com.kt.blink.biz.dch.tap.domain.TapListDomain;
import com.kt.blink.biz.dch.tap.mapper.TapMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Tap Service Mapper
 */
@Slf4j
@Service
public class TapService {

    @Autowired
    private TapMapper tapMapper;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
//    @Autowired
//    private AESUtil aesUtil;
    
    
    /**
     * inquiry TAP List 
     * 
     * @param dataTablesRequest
     * @return
     */
    public DataTablesResponse<?> findTapList(TapListDomain tapListDomain) {
        
        try {
            
            List<TapListDomain> tapListDomains = Optional.ofNullable(tapMapper.findTapList(tapListDomain))
                    .orElse(Collections.emptyList());
            
            if (!tapListDomains.isEmpty()) {
                tapListDomains = this.collectTapListNumberValueColumnSum(tapListDomains, tapListDomain);
            }
            
            // total page
            Long totalCount = tapListDomains.stream().map(TapListDomain::getTotalCount).findFirst().orElse(0L);
            
            return responseUtil.dataTablesResponse(totalCount, tapListDomain.getDataTablesRequest().getDraw(), tapListDomains);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * Tap List : sum of number value columns
     * 
     * @param tapListDomains
     * @param tapListDomain
     * @return
     */
    public List<TapListDomain> collectTapListNumberValueColumnSum(List<TapListDomain> tapListDomains, TapListDomain tapListDomain) {
        // Get first row to set total inforamtion of the search
        TapListDomain firstColumnRow = tapListDomains.stream().findFirst().orElseGet(TapListDomain::new);
        
        // Set No Pagination
        tapListDomain.getDataTablesRequest().setStart(AppConst.NO_PAGINATION);
        List<TapListDomain> columnTotalInfo = Optional.ofNullable(tapMapper.findTapList(tapListDomain))
                .orElse(Collections.emptyList());
        
        /**
         * Sum Of All Total
         */
        firstColumnRow.setSumRecdTotal(columnTotalInfo.stream().map(TapListDomain::getTotalRecdCnt).reduce(0, Integer::sum));
        firstColumnRow.setSumAmtTotal(columnTotalInfo.stream().mapToDouble(TapListDomain::getTotalCalcAmt).reduce(0, Double::sum));
        
        /**
         * Sum Of MOC Total
         */
        firstColumnRow.setSumRecdMoc(columnTotalInfo.stream().map(TapListDomain::getMocVoRecdCnt).reduce(0, Integer::sum));
        firstColumnRow.setSumUseMoc(columnTotalInfo.stream().mapToDouble(TapListDomain::getMocVoUseQnt).reduce(0, Double::sum));
        firstColumnRow.setSumAmtMoc(columnTotalInfo.stream().mapToDouble(TapListDomain::getMocVoCalcAmt).reduce(0, Double::sum));
        
        /**
         * Sum Of MTC Total
         */
        firstColumnRow.setSumRecdMtc(columnTotalInfo.stream().map(TapListDomain::getMtcVoRecdCnt).reduce(0, Integer::sum));
        firstColumnRow.setSumUseMtc(columnTotalInfo.stream().mapToDouble(TapListDomain::getMtcVoUseQnt).reduce(0, Double::sum));
        firstColumnRow.setSumAmtMtc(columnTotalInfo.stream().mapToDouble(TapListDomain::getMtcVoCalcAmt).reduce(0, Double::sum));
        
        /**
         * Sum Of DATA Total
         */
        firstColumnRow.setSumRecdData(columnTotalInfo.stream().map(TapListDomain::getDataRecdCnt).reduce(0, Integer::sum));
        firstColumnRow.setSumUseData(columnTotalInfo.stream().mapToDouble(TapListDomain::getDataUseQnt).reduce(0, Double::sum));
        firstColumnRow.setSumAmtData(columnTotalInfo.stream().mapToDouble(TapListDomain::getDataCalcAmt).reduce(0, Double::sum));
        
        /**
         * Sum Of SMS Total
         */
        firstColumnRow.setSumRecdSms(columnTotalInfo.stream().map(TapListDomain::getSmsRecdCnt).reduce(0, Integer::sum));
        firstColumnRow.setSumAmtSms(columnTotalInfo.stream().mapToDouble(TapListDomain::getSmsCalcAmt).reduce(0, Double::sum));
        
        return tapListDomains;
        
    }
    
    
    /**
     * inquiry TAP Detail list
     * 
     * @param dataTablesRequest
     * @return
     */
    public DataTablesResponse<?> findTapDetail(TapDetailDomain tapDetailDomain) {
        
        try {
            
            // encrypt imsiId for search if value exists
            //if (!StringUtils.isBlank(tapDetailDomain.getImsiId())) {
            //    String encryptedImsiId = aesUtil.encrypt(tapDetailDomain.getImsiId());
            //    log.info("encryptedImsiId=============>{}", encryptedImsiId);
            //    tapDetailDomain.setImsiId(encryptedImsiId);
            //}
            
            // set work_mem to '2GB'
            tapMapper.setWorkMemTapDetail();
            
            // Get Limit List
            List<TapDetailDomain> tapDetailDomains = Optional.ofNullable(tapMapper.findTapDetail(tapDetailDomain))
                    .orElse(Collections.emptyList());
            
            // First Low Of List
            TapDetailDomain firstColumnRow = tapDetailDomains.stream().findFirst().orElseGet(TapDetailDomain::new);
            Long totalCount = tapDetailDomain.getPreTotal();
            firstColumnRow.setPreTotal(totalCount);
            log.info("[TD]@pretotal===================>{}", totalCount);
            
            // Decrypt ImsiId then masking it
            tapDetailDomains = this.tapDetailImsiDecryptThenMask(tapDetailDomains);
            
            // Link Search Or Button Search Case
            if (!tapDetailDomains.isEmpty() && ( AppConst.TAP_LINK_SEARCH.equals(tapDetailDomain.getBtnSearch()) 
                  || AppConst.TAP_BTN_SEARCH.equals(tapDetailDomain.getBtnSearch()) )) {
                
                // Get Charge Sum
                //TapDetailDomain tapDetailChargeSum = tapMapper.findTapDetailChargeSum(tapDetailDomain);
                //Double sumCharge = tapDetailChargeSum.getSumCharge();
                //Double sumSetlCharge = tapDetailChargeSum.getSumSetlCharge();
                //log.info("[BTN]sumCharge====================>{}", sumCharge);
                //log.info("[BTN]tapDetailCount===============>{}", sumSetlCharge);
                
                // Set Sum To First Row Of List
                //firstColumnRow.setSumCharge(sumCharge);
                //firstColumnRow.setSumSetlCharge(sumSetlCharge);
                
                // if button search, replace preTotal
                totalCount = tapMapper.findTapDetailTotal(tapDetailDomain);
                firstColumnRow.setPreTotal(totalCount);
                log.info("[TD]@@totalCount==================>{}", totalCount);
                
              }
            
            // reset work_mem
            tapMapper.resetWorkMemTapDetail();
            
            return responseUtil.dataTablesResponse(totalCount, tapDetailDomain.getDataTablesRequest().getDraw(), tapDetailDomains);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    
    /**
     * Masking detailed Imsi value of TAP after decoding
     * 
     * @param tapDetailDomains
     * @return
     */
    public List<TapDetailDomain> tapDetailImsiDecryptThenMask(List<TapDetailDomain> tapDetailDomains) {
        
        tapDetailDomains.forEach(td -> {
            
            if (!StringUtils.isBlank(td.getImsiId())) {
                td.setImsiId(StringUtils.substring(td.getImsiId(), 0, 10) + "*****");
                //try {
                //    td.setImsiId(StringUtils.substring(aesUtil.decrypt(td.getImsiId()), 0, 10) + "*****");
                //} catch (Exception e) {
                //    td.setImsiId(StringUtils.substring(td.getImsiId(), 0, 10) + "*****");
                //}
            }
        });
        
        return tapDetailDomains;
    }
    
    
    /**
     * inquiry TAP File
     * 
     * @param dataTablesRequest
     * @return
     */
    public DataTablesResponse<?> findTapFile(TapFileDomain tapFileDomain) {
        try {
            
            List<TapFileDomain> tapFileDomains = Optional.ofNullable(tapMapper.findTapFile(tapFileDomain))
                    .orElse(Collections.emptyList());
            
            TapFileDomain firstColumnRow = tapFileDomains.stream().findFirst().orElseGet(TapFileDomain::new);
            
            if (!tapFileDomains.isEmpty()) {
                TapFileDomain tapFileStatusTotal = tapMapper.findTapFileStatusTotal(tapFileDomain);
                Long sumCdrCnt = tapFileStatusTotal.getSumCdrCnt();
                Long sumErrCnt = tapFileStatusTotal.getSumErrCnt();
                Long sumTotCdrCnt = tapFileStatusTotal.getSumTotCdrCnt();
                firstColumnRow.setSumCdrCnt(sumCdrCnt);
                firstColumnRow.setSumErrCnt(sumErrCnt);
                firstColumnRow.setSumTotCdrCnt(sumTotCdrCnt);
            }
            
            // total page
            Long totalCount = tapFileDomains.stream().map(TapFileDomain::getTotalCount).findFirst().orElse(0L);
            
            return responseUtil.dataTablesResponse(totalCount, tapFileDomain.getDataTablesRequest().getDraw(), tapFileDomains);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
}
