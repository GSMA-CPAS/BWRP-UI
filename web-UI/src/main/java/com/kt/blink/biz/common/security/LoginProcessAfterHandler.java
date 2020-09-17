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
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.exception.domain.BadCaptchaException;
import com.kt.blink.biz.common.exception.domain.CaptchaCreateException;
import com.kt.blink.biz.common.exception.domain.NewUserAlarmException;
import com.kt.blink.biz.common.exception.domain.ResetCredentialException;
import com.kt.blink.biz.common.exception.domain.BadLoginException;
import com.kt.blink.biz.common.service.LoginUserDetailsService;
import com.kt.blink.biz.user.domain.UserAccessHist;
import com.kt.blink.biz.user.domain.UserContext;

/**
 * login success, fail handler
 */
@Component
public class LoginProcessAfterHandler implements AuthenticationSuccessHandler, AuthenticationFailureHandler {
    
    private static final String BAD_CREDENTIAL = "badCredential";
    
    private static final String RESET_CREDENTIAL = "resetCredential";
    
    private static final String NEW_USER_ALARM = "newUserAlarm";
    
    private static final String BAD_CAPTCHA = "badCaptcha";
    
    private static final String CAPTCHA_CREATE_ERROR = "captchaCreateError";
    
    private static final boolean LOGIN_SUCCESS = true;
    
    private static final String BAD_LOGIN = "badLogin";
    
    
    @Value("#{servletContext.contextPath}")
    private String servletContextPath;
    
    @Autowired
    private LoginUserDetailsService userDetailsService;
    
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) throws IOException {
    	clearAuthenticationAttributes(req);
        createLoginSession(req, auth);
        String jsonString = this.createLoginSuccessMessage(auth);
        OutputStream out = res.getOutputStream();
        out.write(jsonString.getBytes());
    }

    
    @Override
    public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse res, AuthenticationException ex) throws IOException {
        String jsonString = this.createLoginFailureMessage(ex);
        OutputStream out = res.getOutputStream();
        out.write(jsonString.getBytes());
    }

    
    /**
     * create login session
     * 
     * @param req
     * @param res
     * @param auth
     */
    protected void createLoginSession(HttpServletRequest req, Authentication auth) {
        HttpSession session = req.getSession();
        UserContext authUser = (UserContext) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // session elements
        session.setAttribute("firstName", authUser.getFirstName());
        session.setAttribute("lastName", authUser.getLastName());
        session.setAttribute("fullname", authUser.getFullname());
        session.setAttribute("username", authUser.getUsername()); // userId(=email)
        session.setAttribute("company", authUser.getCompany());
        session.setAttribute("btnRole", authUser.getBtnRole());
        session.setAttribute("role", auth.getAuthorities());
        
        //MAX SESSION TIME
        //session.setMaxInactiveInterval(AppConst.SESSION_TIMEOUT_AFTER_HALF_HOUR); // 30min
        session.setMaxInactiveInterval(AppConst.SESSION_TIMEOUT_AFTER_ONE_HOUR); // 1hour
        
    }

    
    /**
     * create login success json message
     * 
     * @param auth
     * @return
     * @throws JsonProcessingException
     */
    protected String createLoginSuccessMessage(Authentication auth) throws JsonProcessingException {
        UserContext authUser = (UserContext) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ObjectMapper objectMapper = new ObjectMapper();
        RestResponse restResponse = new RestResponse();
        
        // login success logging service
        UserAccessHist userAccessHist = new UserAccessHist();
        userAccessHist.setUsername(authUser.getUsername());
        userAccessHist.setSuccessYn(LOGIN_SUCCESS);
        userDetailsService.saveUserAccessLog(userAccessHist);

        Map<String, Object> rtnMap = new HashMap<>();
        rtnMap.put("role", this.getUserRoles(auth));
        rtnMap.put("username", authUser.getUsername());
        rtnMap.put("targetUrl", this.determineTargetUrl(auth));

        restResponse.setOK();
        restResponse.setData(rtnMap);

        return objectMapper.writeValueAsString(restResponse);

    }

    
    /**
     * create login failure json message
     * 
     * @param auth
     * @return
     * @throws JsonProcessingException
     */
    protected String createLoginFailureMessage(AuthenticationException ex) throws JsonProcessingException {
        String throwType = null;
        
        if (ex instanceof BadCredentialsException) {
            throwType = BAD_CREDENTIAL;
        } else if (ex instanceof ResetCredentialException) {
            throwType = RESET_CREDENTIAL;
        } else if (ex instanceof NewUserAlarmException) {
            throwType = NEW_USER_ALARM;
        } else if (ex instanceof BadCaptchaException) {
            throwType = BAD_CAPTCHA;
        } else if (ex instanceof CaptchaCreateException) {
            throwType = CAPTCHA_CREATE_ERROR;
        } else if (ex instanceof BadLoginException) {
            throwType = BAD_LOGIN;
        }
        
        ObjectMapper objectMapper = new ObjectMapper();
        RestResponse restResponse = new RestResponse();
        
        restResponse.setNG();
        restResponse.setMessage(ex.getMessage());
        restResponse.setThrowType(throwType);

        return objectMapper.writeValueAsString(restResponse);

    }

    
    /**s
     * get user roles
     * 
     * @param authentication
     * @return
     */
    protected List<String> getUserRoles(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }


    /**
     * determine moving url
     * 
     * @param authentication
     * @return
     */
    protected String determineTargetUrl(Authentication authentication) {
        List<String> userRoles = this.getUserRoles(authentication);

        if (userRoles.isEmpty()) {
            throw new IllegalStateException();
        }

        if (userRoles.contains("ROLE_ADMIN")) {
            return servletContextPath + "/cmpn";
        } else {
            return servletContextPath + "/dashboard";
        }

    }

    /**
     * clear login processing errors
     * 
     * @param request
     */
    protected void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        session.invalidate();
        session = request.getSession(true);
        
        if (session == null) {
            return;
        }
        
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

}
