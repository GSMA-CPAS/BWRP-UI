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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;

import lombok.extern.slf4j.Slf4j;


/**
 * Lower Level(Java Inernal) Exception Handle Controller
 */
@Slf4j
@ControllerAdvice
@Order(Ordered.LOWEST_PRECEDENCE)
public class LowestExceptionHandler {
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * handle MaxUploadSizeExceededException
     * 
     * @param request, exception
     * @return
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public String handleMaxUploadSizeExceededException(HttpServletRequest request, MaxUploadSizeExceededException ex) {
        log.info("[HIGH]handleMaxUploadSizeExceededException================================>");
        log.error("[{}]:{}", AppConst.APP_ERROR, ExceptionUtils.getStackTrace(ex));
        request.setAttribute("status", ErrorCode.INTERNAL_SERVER_ERROR);
        request.setAttribute("message", messageUtil.getMessage("app.error.9111"));
        return "forward:/handling";
    }
    
    
    /**
     * Handle MethodNotSupportedException
     * @param request, exception
     * @return
     */
//    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
//    public String handleMethodNotSupportedException(HttpServletRequest request, HttpRequestMethodNotSupportedException ex, Locale locale) {
//        log.info("[LOW]handleMethodNotSupportedException================================>");
//        log.error("[{}]:{}", AppConst.APP_ERROR, ExceptionUtils.getStackTrace(ex));
//        request.setAttribute("status", ErrorCode.METHOD_NOT_ALLOWED);
//        request.setAttribute("message", messageUtil.getMessage("app.error.405"));
//        return "forward:/handling";
//    }
    
    
    /**
     * Handle all exceptions except those defined
     * @param request, exception
     * @return
     */
    @ExceptionHandler(Exception.class)
    public String handleAnyException(HttpServletRequest request, Exception ex) {
        log.info("[LOW]handleAnyException================================>");
        log.error("[{}]:{}", AppConst.APP_ERROR, ExceptionUtils.getStackTrace(ex));
        request.setAttribute("status", ErrorCode.INTERNAL_SERVER_ERROR);
        request.setAttribute("message", messageUtil.getMessage("app.error.500"));
        return "forward:/handling";
    }
    
}
