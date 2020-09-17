/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.extern.slf4j.Slf4j;

/**
 * HttpMethod Filter (Only allow GET, POST)
 */
@Slf4j
@Component
public class HttpMethodFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String httpMethod = request.getMethod().toUpperCase();
        
        if ("GET".equals(httpMethod) || "POST".equals(httpMethod)) {
            filterChain.doFilter(request, response);
            
        } else {
            log.error("{}", httpMethod);
            response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            
        }
    
    }

}
