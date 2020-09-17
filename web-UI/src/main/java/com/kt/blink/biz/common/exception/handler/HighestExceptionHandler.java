/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.exception.handler;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.exception.domain.BusinessLogicException;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.InfraServiceException;

import lombok.extern.slf4j.Slf4j;


/**
 * High Level(Custom) Exception Handle Controller
 */
@Slf4j
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class HighestExceptionHandler {
    
    /**
     * Handle handleInfraServiceException
     * @param request, exception
     * @return
     */
    @ExceptionHandler(InfraServiceException.class)
    public String handleInfraServiceException(HttpServletRequest request, InfraServiceException ex) {
        log.info("[LOW]handleInfraServiceException================================>");
        log.error("[{}]:{}", AppConst.APP_ERROR, ExceptionUtils.getStackTrace(ex));
        request.setAttribute("status", ex.getErrorCode());
        request.setAttribute("message", ex.getMessage());
        return "forward:/handling";
    }
    
    
    /**
     * Handle BusinessLogicException
     * @param request, exception
     * @return
     */
    @ExceptionHandler(BusinessLogicException.class)
    public String handleBusinessLogicException(HttpServletRequest request, BusinessLogicException ex) {
        log.info("[LOW]handleBusinessLogicException================================>");
        log.error("[{}]:{}", AppConst.APP_ERROR, ExceptionUtils.getStackTrace(ex));
        request.setAttribute("status", ex.getErrorCode());
        request.setAttribute("message", ex.getMessage());
        return "forward:/handling";
    }
    
    
    /**
     * Custom Exception(CommonException) 
     * @param request, exception
     * @return
     */
    @ExceptionHandler(CommonException.class)
    public String handleCommonException(HttpServletRequest request, CommonException ex) {
        log.info("[HIGH]handleCommonException================================>");
        log.error("[{}]:{}", AppConst.APP_ERROR, ExceptionUtils.getStackTrace(ex));
        request.setAttribute("status", ex.getErrorCode());
        request.setAttribute("message", ex.getMessage());
        return "forward:/handling";
    }
    

}
