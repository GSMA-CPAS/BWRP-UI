/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.user.domain.User;
import com.kt.blink.biz.user.domain.UserAccessHist;

/**
 * User Query Mapper
 */
@Mapper
@Repository
public interface UserMapper {

    /**
     * inquiry login user
     * 
     * @param username
     * @return
     */
    User findByUsername(@Param("username") String username);
    
    
    /**
     * inquiry the record of the user's login attempt count by user ID
     *
     * @param username
     * @return
     */
    Integer findUserLoginAttemps(@Param("username") String username);
    
    
    /**
     * change user passwd
     * 
     * @param user
     * @return
     */
    Integer changeUserCredential(@Param("user") User user);
    
    /**
     * check if passwd reset or not
     * 
     * @param username
     * @return
     */
    Boolean findCredentialReset(@Param("username") String username);
    
    
    /**
     * increase count when user attempts login
     * 
     * @param member
     */
    void increaseUserLoginAttempts(@Param("username") String username, @Param("attempts") Integer attempts);
    
    /**
     * initialize the user's login attempt history on successful login
     * 
     * @param username
     */
    void resetUserLoginAttempts(@Param("username") String username);
    
    
    /**
     * User account lockout process for n times login attempts
     * 
     * @param username
     */
    void lockUserAccount(@Param("username") String username);

    /**
     * inquiry user's last login attempt date 
     * 
     * @param username
     * @return
     */
    UserAccessHist findUserLastAttempts(@Param("username") String username);
    
    
    /**
     * Reset to the default password when user login  errors 5 times
     * 
     * @param username, defaultCredential
     * @return
     */
    void resetUserCredentialToDefault(@Param("username") String username, @Param("credential") String credential);
    
    
    /**
     * create user access history
     * 
     * @param userAccessHist
     */
    void saveUserAccessLog(UserAccessHist userAccessHist);
    
    
    /**
     * check if user login is reset
     * 
     * @param username
     * @return
     */
    boolean findUserResetPasswordYn(@Param("username") String username);
    
    
}
