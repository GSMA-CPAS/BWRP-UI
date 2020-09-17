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

import java.io.IOException;
import java.nio.file.AccessDeniedException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.user.domain.LoginRequest;

import lombok.extern.slf4j.Slf4j;
import nl.captcha.Captcha;

/**
 * Login Auth Filer
 */
@Slf4j
public class LoginAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    
    private ObjectMapper objectMapper;

    public LoginAuthenticationFilter(RequestMatcher requestMatcher, ObjectMapper objectMapper) {
        super(requestMatcher);
        this.objectMapper = objectMapper;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.error("attemptAuthentication============>{},{}", request, response);
        String captchaStatus = AppConst.CAPTCHA_OK;
        
        if (this.isAjax(request)) {
            
            LoginRequest loginRequest = objectMapper.readValue(request.getReader(), LoginRequest.class);
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();
            String userCaptcha = loginRequest.getCaptcha();
            
            // No Captchar session
            if (request.getSession() == null || request.getSession().getAttribute(Captcha.NAME) == null) {
                captchaStatus = AppConst.CAPTCHA_ERROR;
                
            } else {
                
                Captcha sessionCaptcha = (Captcha) request.getSession().getAttribute(Captcha.NAME);
                request.getSession().removeAttribute(Captcha.NAME);
                
                // Captchar mismatch
                if (!sessionCaptcha.getAnswer().equals(userCaptcha)) {
                    captchaStatus = AppConst.CAPTCHA_NG;
                }
                
                log.info("[GGG]sessionCaptcha===========>{}", sessionCaptcha.getAnswer());
                log.info("[GGG]userCaptcha==============>{}", userCaptcha);
                log.info("[GGG]captchaStatus============>{}", captchaStatus);
            }
            
            // concat username and captchar temporarily
            String usernameCaptcha = String.format("%s%s%s", username.trim(), CharConst.PIPE, captchaStatus);
            log.info("[GGG]usernameCaptcha============>{}", usernameCaptcha);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(usernameCaptcha, password);
            return getAuthenticationManager().authenticate(authentication);
            
        } else {
            throw new AccessDeniedException("Don't use content type for " + request.getContentType());
        }
    }

    private boolean isAjax(HttpServletRequest request) {
        return MediaType.APPLICATION_JSON_UTF8_VALUE.equalsIgnoreCase(request.getContentType());
    }
}
