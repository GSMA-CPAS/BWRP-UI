package com.kt.blink.biz.dch.tap.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.dch.tap.domain.RapDomain;
import com.kt.blink.biz.dch.tap.mapper.RapMapper;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RapService {

    @Autowired
    private RapMapper rapMapper;
            
    @Autowired
    private ResponseUtil responseUtil;

//    @Autowired
//    private AESUtil aesUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    /**
     * retrieveRapList list
     * @param inv
     * @return
     */
    public DataTablesResponse<RapDomain> retrieveRapList(InvoiceDomain inv) {
        try {
            List<RapDomain> items = Optional.ofNullable(rapMapper.retrieveRapList(inv)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(RapDomain::getTotalCount).findFirst().orElse(0L);
            
            if(!items.isEmpty()) {
                for(RapDomain data : items) {
                    String imsi = StringUtils.defaultIfBlank(data.getImsiId(), "");
//                    if(StringUtils.isNotBlank(imsi)) {
////                        imsi = "dNyd4Ra96O2oKoR4CZjhMA==";
//                        try {
//                            imsi = aesUtil.decrypt(imsi);
//                        }catch(Exception e) {
//                            log.error(" decrypt {}", e);
//                        }
//                    }
                    if(StringUtils.isNotBlank(data.getImsiId())) {
                        data.setImsiId(StringUtils.substring(imsi, 0, 10) + "*****");   //data.getImsiId(), 10
                    }else {
                        data.setImsiId(imsi);
                    }
                }
            }
            
            
            return responseUtil.dataTablesResponse(totalCount, inv.getDataTablesRequest().getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    /**
     * rap list
     * @param inv
     * @return
     */
    public DataTablesResponse<RapDomain> retrieRapList(InvoiceDomain inv) {
        try {
            List<RapDomain> items = Optional.ofNullable(rapMapper.retrieRapList(inv)).orElse(Collections.emptyList());
            Long totalCount = null;
            if(inv.getTotalCount()>0) {
                totalCount = inv.getTotalCount();
            }else if(!items.isEmpty()){
                totalCount = rapMapper.getRapCnt(inv);
            }else {
                totalCount = 0L;
            }
            
            if(!items.isEmpty()) {
                
                items.get(0).setTotalCount(totalCount);
                
                for(RapDomain data : items) {
                    String imsi = StringUtils.defaultIfBlank(data.getImsiId(), "");
                    if(StringUtils.isNotBlank(data.getImsiId())) {
                        data.setImsiId(StringUtils.substring(imsi, 0, 10) + "*****");   //data.getImsiId(), 10
                    }else {
                        data.setImsiId(imsi);
                    }
                }
            }
            
            
            return responseUtil.dataTablesResponse(totalCount, inv.getDataTablesRequest().getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
}
