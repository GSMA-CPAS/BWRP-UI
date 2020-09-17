/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.plmn.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.admin.plmn.mapper.PlmnsMapper;
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
public class PlmnsService {

    @Autowired
    private PlmnsMapper plmnsMapper;
            
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * retrieve plmn list
     * @param dataTablesRequest
     * @param errorMessage
     * @return
     */
    public DataTablesResponse<PlmnsDomain> retrievePlmnList(DataTablesRequest dataTablesRequest) {
        try {
            List<PlmnsDomain> items = Optional.ofNullable(plmnsMapper.retrievePlmnList(dataTablesRequest)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(PlmnsDomain::getTotalCount).findFirst().orElse(0L);
            
            
            return responseUtil.dataTablesResponse(totalCount, dataTablesRequest.getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }

    /**
     * find plmn detail
     * @param plmn
     * @param locale
     * @return
     */
    public RestResponse findPlmnInfo(PlmnsDomain plmn) {
        try {
            return responseUtil.restReponse(plmnsMapper.findPlmnInfo(plmn));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * insert plmn
     * @param plmn
     * @param locale
     * @return
     */
    public RestResponse insertPlmn(PlmnsDomain plmn) {
        try {
            return responseUtil.restReponse(plmnsMapper.insertPlmn(plmn));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * update plmn
     * @param plmn
     * @return
     */
    public RestResponse updatePlmn(PlmnsDomain plmn) {
        try {
            int res = plmnsMapper.updatePlmn(plmn);
            
            log.info("@@@@@@@@ updatePlmn res : {}", res);
            
            return responseUtil.restReponse(res);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * delete plmn
     * @param plmn
     * @return
     */
    public RestResponse deletePlmn(PlmnsDomain plmn) {
        try {
            log.info("==============>{}", plmn);
            return responseUtil.restReponse(plmnsMapper.deletePlmn(plmn));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9004"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * dup check
     * @param plmn
     * @return
     */
    public RestResponse dupCheckPlmn(PlmnsDomain plmn) {
        try {
            log.info("==============>{}", plmn);
            return responseUtil.restReponse(plmnsMapper.dupCheckPlmn(plmn));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
      
}
