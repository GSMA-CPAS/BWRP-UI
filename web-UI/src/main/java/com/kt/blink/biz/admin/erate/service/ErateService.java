/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.erate.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.blink.biz.admin.erate.domain.ErateDomain;
import com.kt.blink.biz.admin.erate.mapper.ErateMapper;
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
public class ErateService {

    @Autowired
    private ErateMapper erateMapper;
            
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * retrieve erate list
     * @param dataTablesRequest
     * @param errorMessage
     * @return
     */
    public DataTablesResponse<ErateDomain> retrieveErateList(DataTablesRequest dataTablesRequest) {
        try {
            List<ErateDomain> items = Optional.ofNullable(erateMapper.retrieveErateList(dataTablesRequest)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(ErateDomain::getTotalCount).findFirst().orElse(0L);
            
            
            return responseUtil.dataTablesResponse(totalCount, dataTablesRequest.getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    /**
     * get Period M, M+1
     * @return
     */
    public List<ErateDomain> getTgtMons() {
        try {
            return erateMapper.getTgtMons();
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * periods list
     * @return
     */
    public List<ErateDomain> getPeriods() {
        try {
            return erateMapper.getPeriods();
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }

    /**
     * find erate detail
     * @param erate
     * @param locale
     * @return
     */
    public RestResponse findErateInfo(ErateDomain erate) {
        try {            
            return responseUtil.restReponse(erateMapper.findErateInfo(erate));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * insert erate
     * @param erate
     * @param locale
     * @return
     */
    public RestResponse insertErate(ErateDomain erate) {
        try {
            return responseUtil.restReponse(erateMapper.insertErate(erate));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * update erate
     * @param erate
     * @return
     */
    public RestResponse updateErate(ErateDomain erate) {
        try {
            
            erateMapper.insertErateHst(erate);
            
            return responseUtil.restReponse(erateMapper.updateErate(erate));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * delete erate
     * @param erate
     * @return
     */
    public RestResponse deleteErate(ErateDomain erate) {
        try {
            log.info("==============>{}", erate);
            return responseUtil.restReponse(erateMapper.deleteErate(erate));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9004"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * dup check
     * @param erate
     * @return
     */
    public ErateDomain dupCheckErate(ErateDomain erate) {
        try {
            log.info("==============>{}", erate);
            return erateMapper.dupCheckErate(erate);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
      
}
