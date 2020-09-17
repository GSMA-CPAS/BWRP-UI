/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.user.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.user.domain.User;
import com.kt.blink.biz.user.mapper.UserMapper;

/**
 * User Service
 */
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private MessageUtil messageUtil;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    
    /**
     * find user by user name
     * 
     * @param username
     * @return
     */
    public User findByUsername(String username) {
        try {
            return Optional.ofNullable(userMapper.findByUsername(username)).orElse(null);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.1018"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * find user info by user name
     * 
     * @param username
     * @return
     */
    public RestResponse findUserInfo(User user) {
        try {
            User userInfo = Optional.ofNullable(userMapper.findByUsername(user.getUsername())).orElse(null);
            return responseUtil.restReponse(userInfo);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.1018"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * change user passwd
     * 
     * @param user
     * @return
     */
    public Integer changeUserCredential(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userMapper.changeUserCredential(user);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    

}
