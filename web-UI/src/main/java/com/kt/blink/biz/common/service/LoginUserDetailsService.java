/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.service;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.user.domain.User;
import com.kt.blink.biz.user.domain.UserAccessHist;
import com.kt.blink.biz.user.domain.UserContext;
import com.kt.blink.biz.user.mapper.UserMapper;

@Service("userDetailsService")
public class LoginUserDetailsService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * find user info
     * 
     * @param username
     * @return userContext
     */
    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = userMapper.findByUsername(username);
        
        if (user == null) {
            throw new UsernameNotFoundException(username + " not exists");
        }

        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;

        return new UserContext(user.getUsername(), user.getPassword(), 
                enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities(user), 
                user.getFirstname(), user.getLastname(), user.getFullname(), user.getCompany(), user.getCmpnId(), user.getBtnRole(), user.getTempPwdIssYn());

    }
    

    /**
     * set user authorities
     * 0 : User, 
     * 1 : Admin
     * @param user
     * @return
     */
    private static Collection<GrantedAuthority> authorities(User user) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() == 0) {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        } else if (user.getRole() == 1){
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return authorities;
    }
    
    
    /**
     * check if user password is reset
     * 
     * @param username
     * @return
     */
    public Boolean findCredentialReset(String username) {
        try {
            return userMapper.findCredentialReset(username);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * query the number of user login attempts
     * 
     * @param username
     * @return
     */
    public Integer findUserLoginAttemps(String username) {
        try {
            return userMapper.findUserLoginAttemps(username);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * increase count value when user login attempts
     * 
     * @param username, attempts
     */
    public void increaseUserLoginAttempts(String username, Integer attempts) {
        try {
            userMapper.increaseUserLoginAttempts(username, attempts);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
//    public void increaseUserLoginAttempts(String username) {
//        User user = userMapper.findByUsername(username);
//        if (user == null)
//            return;
//        
//        Integer attempts = user.getAttempts();
//        attempts++;
//        
//        userMapper.increaseUserLoginAttempts(username, attempts);
//
//        if (attempts.equals(AppConst.MAX_ATTEMPTS)) { // n times
//            userMapper.lockUserAccount(username);
//        }
//        
//    }
    
    
    /**
     * Reset the number of user login attempts
     * 
     * @param username
     * @return
     */
    public void resetUserLoginAttempts(String username) {
        try {
            userMapper.resetUserLoginAttempts(username);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * Reset to the default password when there are 5 user login attempt errors
     * 
     * @param username, credential
     * @return
     */
    public void resetUserCredentialToDefault(String username, String credential) {
        try {
            userMapper.resetUserCredentialToDefault(username, passwordEncoder.encode(credential));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * save user access log
     * 
     * @param userAccessHist
     */
    public void saveUserAccessLog(UserAccessHist userAccessHist) {
        try {
        	userMapper.saveUserAccessLog(userAccessHist);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * check if user login is reset
     * 
     * @param username
     * @return
     */
	public boolean findUserResetPasswordYn(String username) {
        try {
            return userMapper.findUserResetPasswordYn(username);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
}
