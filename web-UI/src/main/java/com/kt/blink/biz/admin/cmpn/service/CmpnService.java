/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cmpn.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.blink.biz.admin.cmpn.domain.BankDomain;
import com.kt.blink.biz.admin.cmpn.domain.CmpnDomain;
import com.kt.blink.biz.admin.cmpn.mapper.CmpnMapper;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@Service
public class CmpnService {

    @Autowired
    private CmpnMapper cmpnMapper;
        
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * retrieve cmpn list
     * @param dataTablesRequest
     * @param errorMessage
     * @return
     */
    public DataTablesResponse<CmpnDomain> retrieveCmpnList(DataTablesRequest dataTablesRequest) {
        try {
            List<CmpnDomain> items = Optional.ofNullable(cmpnMapper.retrieveCmpnList(dataTablesRequest)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(CmpnDomain::getTotalCount).findFirst().orElse(0L);
            
            
            return responseUtil.dataTablesResponse(totalCount, dataTablesRequest.getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }

    /**
     * find cmpn detail
     * @param cmpn
     * @param locale
     * @return
     */
    public RestResponse findCmpnInfo(CmpnDomain cmpn) {
        try {
            
            CmpnDomain data = cmpnMapper.findCmpnInfo(cmpn);
            if(data != null && StringUtils.isNotBlank(data.getCmpnId())) {
                data.setBanks(cmpnMapper.findBankInfo(data));
            }
            
            return responseUtil.restReponse(data);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * search cmpnNm
     * @param cmpn
     * @param locale
     * @return
     */
    public RestResponse getCmpnList(CmpnDomain cmpn) {
        try {
            
            return responseUtil.restReponse(cmpnMapper.getCmpnList(cmpn));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * insert cmpn
     * @param cmpn
     * @param locale
     * @return
     */
    public RestResponse insertCmpn(CmpnDomain cmpn) {
        try {
            
            if(cmpnMapper.insertCmpn(cmpn) == 1) {
                if(cmpn.getBankNm() != null && !cmpn.getBankNm().isEmpty()) {
                    int i = 0;
                    for(String bankNm : cmpn.getBankNm()) {
                        BankDomain bank = new BankDomain();
                                                
                        bank.setBankNm(bankNm);
                        bank.setBankType(cmpn.getBankType().get(i));
                        bank.setAccNm(cmpn.getAccNm().get(i));
                        bank.setAccNo(cmpn.getAccNo().get(i));
                        bank.setCmpnId(cmpn.getCmpnId());
                        bank.setSwiftCd(cmpn.getSwiftCd().get(i));
                        bank.setIbanNo(cmpn.getIbanNo().get(i));
                        bank.setCorrespBankNm(cmpn.getCorrespBankNm().get(i));
                        bank.setCorrespSwiftCd(cmpn.getCorrespSwiftCd().get(i));
                        bank.setSysSvcId(cmpn.getSysSvcId());
                        bank.setSysTrtrId(cmpn.getSysTrtrId());
                        
                        log.info("############################ insert bank {} ", bank);
                        
                        cmpnMapper.insertBank(bank);
                        i++;
                        
                    }
                }
            }
            
            return responseUtil.restReponse("OK");
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }

    /**
     * 
     * @param cmpn
     * @return
     */
    public RestResponse updateCmpn(CmpnDomain cmpn) {
        try {
//            cmpn = this.processLogoPhoto(cmpn);
            log.info("[PHOTO]==============>{}", cmpn);
            
            if(cmpnMapper.updateCmpn(cmpn) == 1) {
                if(cmpn.getBankNm() != null && !cmpn.getBankNm().isEmpty()) {
                    int i = 0;
                    for(String bankNm : cmpn.getBankNm()) {
                        BankDomain bank = new BankDomain();
                                                
                        bank.setBankNm(bankNm);
                        bank.setBankType(cmpn.getBankType().get(i));
                        bank.setAccNm(cmpn.getAccNm().get(i));
                        bank.setAccNo(cmpn.getAccNo().get(i));
                        bank.setCmpnId(cmpn.getCmpnId());
                        bank.setSwiftCd(cmpn.getSwiftCd().get(i));
                        bank.setIbanNo(cmpn.getIbanNo().get(i));
                        bank.setCorrespBankNm(cmpn.getCorrespBankNm().get(i));
                        bank.setCorrespSwiftCd(cmpn.getCorrespSwiftCd().get(i));
                        bank.setSysSvcId(cmpn.getSysSvcId());
                        bank.setSysTrtrId(cmpn.getSysTrtrId());
                        
                        String isBankStat = StringUtils.defaultIfBlank(cmpn.getIsBankStat().get(i),"I");
                        
                        log.info("############################ update bank {} ", bank);
                        if(StringUtils.equals(isBankStat, "U")) {
                            cmpnMapper.updateBank(bank);
                        }else {
                            if(StringUtils.isNotBlank(bankNm)) {
                                cmpnMapper.insertBank(bank);
                            }
                        }
                        
                        i++;
                        
                    }
                }
            }
            
            return responseUtil.restReponse("OK");
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * 
     * @param cmpn
     * @return
     */
    public RestResponse deleteCmpn(CmpnDomain cmpn) {
        try {
            log.info("[PHOTO]==============>{}", cmpn);
            return responseUtil.restReponse(cmpnMapper.deleteCmpn(cmpn));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9004"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
 
}
