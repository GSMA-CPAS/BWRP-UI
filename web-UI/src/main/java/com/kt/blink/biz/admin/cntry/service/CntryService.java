/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cntry.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.blink.biz.admin.cntry.domain.CntryDomain;
import com.kt.blink.biz.admin.cntry.mapper.CntryMapper;
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
public class CntryService {

    @Autowired
    private CntryMapper cntryMapper;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    /**
     * cntry code list
     * @param cntry
     * @param errorMessage
     * @return
     */
    public RestResponse getCntryList(CntryDomain cntry) {
        try {
            List<CntryDomain> items = null;
            if(cntry == null) {
                CntryDomain cnry = new CntryDomain();
                items = cntryMapper.getCntryList(cnry);
            }else {
                items = cntryMapper.getCntryList(cntry);
            }
            return responseUtil.restReponse(items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * cntry list
     * @param dataTablesRequest
     * @param errorMessage
     * @return
     */
    public DataTablesResponse<CntryDomain> retrieveCntryList(DataTablesRequest dataTablesRequest) {
        try {
            
            
            List<CntryDomain> items = Optional.ofNullable(cntryMapper.retrieveCntryList(dataTablesRequest))
                    .orElse(Collections.emptyList());
            Long totalCount = items.stream().map(CntryDomain::getTotalCount).findFirst().orElse(0L);
              
            return responseUtil.dataTablesResponse(totalCount, dataTablesRequest.getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * dup check
     * @param cntry
     * @param errorMessage
     * @return
     */
    public RestResponse dupCheckCntry(CntryDomain cntry) {
        try {
            CntryDomain item = cntryMapper.dupCheckCntry(cntry);
            return responseUtil.restReponse(item);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * cntry insert
     * @param cntry
     * @param errorMessage
     * @return
     */
    public RestResponse insertCntry(CntryDomain cntry) {
        try {
            Integer rc = cntryMapper.insertCntry(cntry);
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    

    /**
     * cntry update
     * @param cntry
     * @param errorMessage
     * @return
     */
    public RestResponse updateCntry(CntryDomain cntry) {
        try {
            Integer rc = cntryMapper.updateCntry(cntry);
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    

    /**
     * cntry delete
     * @param cntry
     * @param errorMessage
     * @return
     */
    public RestResponse deleteCntry(CntryDomain cntry) {
        try {
            Integer rc = cntryMapper.deleteCntry(cntry);
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9004"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
}
