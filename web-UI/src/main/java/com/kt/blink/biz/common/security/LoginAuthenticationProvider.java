/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.security;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.common.exception.domain.BadCaptchaException;
import com.kt.blink.biz.common.exception.domain.CaptchaCreateException;
import com.kt.blink.biz.common.exception.domain.NewUserAlarmException;
import com.kt.blink.biz.common.exception.domain.ResetCredentialException;
import com.kt.blink.biz.common.exception.domain.BadLoginException;
import com.kt.blink.biz.common.service.LoginUserDetailsService;
import com.kt.blink.biz.common.utils.RSAUtil;
import com.kt.blink.biz.user.domain.UserAccessHist;

import lombok.extern.slf4j.Slf4j;

/**
 * Login Auth Provider
 */
@Slf4j
@Component
public class LoginAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {
    
    private static final boolean LOGIN_FAILURE = false;
    
    private static final String BAD_CREDENTIAL = "badCredential";
    
    private static final String ATTEMPTS_EXCEEDED = "attemptsExceeded";
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private RSAUtil rasUtil;

    @Autowired
    private LoginUserDetailsService userDetailsService;
    
    
    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) {
        
        /**
         * Password RSA DECRYPT
         */
        String presentedPassword = authentication.getCredentials().toString();
        String username = userDetails.getUsername();
        String privateKey = rasUtil.getRSAPrivateKey();
        String decryptedPassword = rasUtil.webDecrypt(presentedPassword, privateKey);
        log.info("[RSA]username=======================>{}", userDetails.getUsername());
        log.info("[RSA]presentedPassword==============>{}", presentedPassword);
        log.info("[RSA]decryptedPassword==============>{}", decryptedPassword);
        Integer attempts = userDetailsService.findUserLoginAttemps(username);
        boolean resetPasswordYn = userDetailsService.findUserResetPasswordYn(username);
        log.error("[resetPasswordYn]====================================>{}", resetPasswordYn);
        
        // New User or Password Reset User
        if (attempts.equals(NumberUtils.INTEGER_ZERO) && resetPasswordYn) {
            log.error("[New User Error]====================================>");
            throw new NewUserAlarmException("New users are requested to log in after changing default password.");
        }
        
        // Initialization Message to User with Password Error 5 times
        if (!attempts.equals(NumberUtils.INTEGER_ZERO) && resetPasswordYn) {
            throw new ResetCredentialException("Password has been reset. Please change your password.");
        }
        
        if (!passwordEncoder.matches(decryptedPassword, userDetails.getPassword())) {
            log.error("[Password Error]====================================");
            UserAccessHist userAccessHist = new UserAccessHist();
            userAccessHist.setUsername(username);
            userAccessHist.setSuccessYn(LOGIN_FAILURE);
            
            // increase fail count
            attempts++;
            
            log.info("[Password attempts]===========>{}", attempts);
            if (attempts < 5 ) {
                
                userDetailsService.increaseUserLoginAttempts(username, attempts);
                
                if (!StringUtils.isBlank(username)) {
                    userAccessHist.setReason(BAD_CREDENTIAL);
                    userDetailsService.saveUserAccessLog(userAccessHist);
                }
                
                throw new BadLoginException(Integer.toString(attempts)); // set credential error count
                //throw new BadCredentialsException(messageUtil.getMessage("app.login.m011", new String[] { Integer.toString(attempts) }));
            
            } else if (attempts >= 5) {
                
                userDetailsService.increaseUserLoginAttempts(username, attempts);
                
                if (!StringUtils.isBlank(username)) {
                    userAccessHist.setReason(ATTEMPTS_EXCEEDED);
                    userDetailsService.saveUserAccessLog(userAccessHist);
                }
                
                userDetailsService.resetUserCredentialToDefault(username, AppConst.DEFAULT_CREDENTIAL);
                
                throw new ResetCredentialException("Password has been reset. Please change your password.");
            }
            
        } else {
            userDetailsService.resetUserLoginAttempts(username);
        }
        
        // Reset Fail Count if Login succeeded
        Boolean tempPwdIssYn = userDetailsService.findCredentialReset(username);
        log.info("[RESET]tempPwdIssYn==============>{}", tempPwdIssYn);
        
    }
    
    
    // Get Captcha code and validate it
    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) {
        log.error("retrieveUser===================>{}",  authentication);
        log.error("username=======================>{}",  username);
        String[] usernameCaptcha = StringUtils.split(username, CharConst.PIPE);
        
        if (usernameCaptcha == null || usernameCaptcha.length != 2) {
            throw new UsernameNotFoundException("Username and Captcha must be provided");
        }
        
        log.info("[IN]username===================>{}",  usernameCaptcha[0]);
        log.info("[IN]captchar===================>{}",  usernameCaptcha[1]);
        
        String captcharStatus = usernameCaptcha[1];
        
        if (AppConst.CAPTCHA_NG.equals(captcharStatus)) {
            throw new BadCaptchaException("Captcha does not match.");
        } else if (AppConst.CAPTCHA_ERROR.equals(captcharStatus)) {
            throw new CaptchaCreateException("An error occurred while generating the CAPTCHA.");
        }
        
        UserDetails loadedUser = userDetailsService.loadUserByUsername(usernameCaptcha[0]);
        
        log.info("[IN]1.loadedUser===================>{}",  loadedUser);
        
        if (loadedUser == null) {
        	log.info("[IN]2.loadedUser===================>{}",  loadedUser);
            throw new InternalAuthenticationServiceException("UserDetailsService returned null, which is an interface contract violation");
        }
        
        return loadedUser;
        
    }
}
