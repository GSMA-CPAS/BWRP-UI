/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.usermgr.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.blink.biz.admin.usermgr.domain.UserMgrDomain;
import com.kt.blink.biz.admin.usermgr.mapper.UserMgrMapper;
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
public class UserMgrService {

    @Autowired
    private UserMgrMapper userMgrMapper;   
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * user list
     * @param dataTablesRequest
     * @param errorMessage
     * @return
     */
    public DataTablesResponse<UserMgrDomain> retrieveUserMgrList(DataTablesRequest dataTablesRequest) {
        try {
            
            
            List<UserMgrDomain> items = Optional.ofNullable(userMgrMapper.retrieveUserMgrList(dataTablesRequest))
                    .orElse(Collections.emptyList());
            Long totalCount = items.stream().map(UserMgrDomain::getTotalCount).findFirst().orElse(0L);
              
            return responseUtil.dataTablesResponse(totalCount, dataTablesRequest.getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * dup check
     * @param user
     * @param errorMessage
     * @return
     */
    public RestResponse dupCheckUserMgr(UserMgrDomain user) {
        try {
            UserMgrDomain item = userMgrMapper.dupCheckUserMgr(user);
            return responseUtil.restReponse(item);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * user insert
     * @param user
     * @param errorMessage
     * @return
     */
    public RestResponse insertUserMgr(UserMgrDomain user) {
        try {
            Integer rc = userMgrMapper.insertUserMgr(user);
            
            
            
            
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }        
    }
    

    /**
     * user update
     * @param user
     * @param errorMessage
     * @return
     */
    public RestResponse updateUserMgr(UserMgrDomain user) {
        try {
            Integer rc = userMgrMapper.updateUserMgr(user);
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    

    /**
     * user delete
     * @param user
     * @param errorMessage
     * @return
     */
    public RestResponse deleteUserMgr(UserMgrDomain user) {
        try {
            Integer rc = userMgrMapper.deleteUserMgr(user);
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9004"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    

    /**
     * find user detail
     * @param user
     * @param locale
     * @return
     */
    public RestResponse findUserMgrInfo(UserMgrDomain user) {
        try {
            return responseUtil.restReponse(userMgrMapper.findUserMgrInfo(user));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * get user info
     * @param user
     * @param locale
     * @return
     */
    public UserMgrDomain getUserInfo(UserMgrDomain user) {
        try {
            return Optional.ofNullable(userMgrMapper.findUserMgrInfo(user)).orElseGet(UserMgrDomain::new);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
}
