/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.aop;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import lombok.extern.slf4j.Slf4j;

/**
 * LogAspect
 */
@Slf4j
@Aspect
@Component
public class LogAspect {
    
    /**
     * Logging Exclusion *Method* name of Controller or Service 
     */
    private static final List<String> EXCLUDED_METHOD_PREFIXES 
        = Collections.unmodifiableList(Arrays.asList(
            "login",
            "logout",
            "getCaptchaCode",
            "downloadBoardAtcFile",
            "downloadNoticeAtcFile",
            "downloadAtcFile",
            "boardDetail",
            "noticeDetail"
        ));
    
    @Around("execution(* com.kt.blink.biz.*.controller.*.*(..)) "
            + "|| execution(* com.kt.blink.biz.*.controller.*.*(..))"
            + "|| execution(* com.kt.blink.biz.*.*.service.*.*(..))"
            + "|| execution(* com.kt.blink.biz.*.service.*.*(..))")
    public Object controllerLog(ProceedingJoinPoint pjp) throws Throwable {
        log.info("#################################################################################");
        log.info("◈[LogAspect : Start] - {}/{}", pjp.getSignature().getDeclaringTypeName(), pjp.getSignature().getName());
        long startTime = System.currentTimeMillis();
        
        Object[] signatrueArgs = pjp.getArgs();
        for (Object signatrueArg : signatrueArgs) {
            this.printJsonFormatParamLog(pjp, signatrueArg);
        }
        
        Object result = pjp.proceed();
        long endTime = System.currentTimeMillis();
        log.info("◈{} took {} seconds", pjp.getSignature().getName(), TimeUnit.MILLISECONDS.toSeconds(endTime - startTime));
        log.info("◈[LogAspect : End] - {}/{}", pjp.getSignature().getDeclaringTypeName(), pjp.getSignature().getName());
        log.info("#################################################################################");
        return result;
    }
    
    
    /**
     * print controller, service method params in json format
     * 
     * @param method
     * @param pjp, arg
     * @throws JsonProcessingException
     */
    public void printJsonFormatParamLog(ProceedingJoinPoint pjp, Object arg) {
        
        if (StringUtils.startsWithAny(pjp.getSignature().getName(), 
                EXCLUDED_METHOD_PREFIXES.toArray(new String[0])) || arg == null) {
            return;
        }
        
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        log.info("◈[{}] parameters ==>\r\n{}", pjp.getSignature().getName(), gson.toJson(arg));
    }


}
