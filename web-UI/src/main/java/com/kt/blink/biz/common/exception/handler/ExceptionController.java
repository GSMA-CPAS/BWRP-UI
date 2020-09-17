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

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

/**
 * Exception Controller
 */
@Slf4j
@Controller
public class ExceptionController implements ErrorController {

    /** springboot default error path **/
    private static final String ERROR_PATH = "/error";
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * x-www-form-urlencoded - Custom Exception Handler
     * 
     * @param request
     * @return
     */
    @RequestMapping(value = "/handling", method = { RequestMethod.GET, RequestMethod.POST })
    public ModelAndView handleException(HttpServletRequest request) {
        String message = (String) request.getAttribute("message");
        ModelAndView mav = new ModelAndView("error/error");
        log.debug("handleFromException===========>message:{}", message);
        mav.addObject("message", message);
        return mav;
    }
    
    
    /**
     * rest - Custom Exception Handler
     * 
     * @param request, response
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/handling", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = { RequestMethod.GET, RequestMethod.POST })
    public ResponseEntity<?> handleRestException(HttpServletRequest request) throws IOException {
        String message = (String) request.getAttribute("message");
        log.debug("handleRestException===========>message:{}", message);
        RestResponse restResponse = new RestResponse();
        restResponse.setNG();
        restResponse.setMessage(message);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * 400, 401, 403, 404, 405, 500 error 
     * 
     * @return
     * @throws JsonProcessingException 
     */
    @GetMapping(value = ERROR_PATH)
    public String handleErrorForm(HttpServletRequest request, @AuthenticationPrincipal UserContext userCtx, RedirectAttributes redirectAttributes) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Integer statusCode = Integer.valueOf(status.toString());
        log.error("[{}]:{}", AppConst.APP_ERROR, statusCode);
        return formErrorReturn(statusCode, userCtx);
    }
    
    
    /**
     * 401, 403, 404, 405, 500 error 
     * 
     * @param request
     * @return
     */
    @GetMapping(value = ERROR_PATH, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> handleErrorAjax(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Integer statusCode = Integer.valueOf(status.toString());
        log.error("[{}]:{}", AppConst.APP_ERROR, statusCode);
        return ResponseEntity.ok(ajaxErrorReturn(statusCode));
    }
    
    
    /**
     * handle form request error
     * @param statusCode
     * @return
     */
    private String formErrorReturn(Integer statusCode, UserContext userCtx) {
        if (userCtx == null) {
            return "redirect:/login";
        }
        
        if (statusCode == HttpStatus.UNAUTHORIZED.value() || statusCode == HttpStatus.FORBIDDEN.value()) {
            //redirectAttributes.addFlashAttribute("rtnMsg", messageUtil.getMessage("app.error.403"));
            return "error/403";
        } else if (statusCode == HttpStatus.NOT_FOUND.value()) {
            return "error/404";
        } else {
            return "error/error";
        }
    }
    
    
    /**
     * handle ajax request error
     * @param statusCode
     * @param locale
     * @return
     */
    private RestResponse ajaxErrorReturn(Integer statusCode) {
        RestResponse restResponse = new RestResponse();
        restResponse.setNG();
        
        if (statusCode == HttpStatus.UNAUTHORIZED.value() || statusCode == HttpStatus.FORBIDDEN.value()) {
            restResponse.setData(HttpStatus.FORBIDDEN.value());
            restResponse.setMessage(messageUtil.getMessage("app.error.403"));
        } else if (statusCode == HttpStatus.NOT_FOUND.value()) {
            restResponse.setData(HttpStatus.NOT_FOUND.value());
            restResponse.setMessage(messageUtil.getMessage("app.error.404"));
        } else {
            restResponse.setData(HttpStatus.INTERNAL_SERVER_ERROR.value());
            restResponse.setMessage(messageUtil.getMessage("app.error.500"));
        }
        
        return restResponse;
    }
    
    
    
    /**
     * error path
     * 
     * @return
     */
    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }
    
    
    /**
     * check request is ajax
     * 
     * @param request
     * @return
     */
    public boolean isAjax(HttpServletRequest request) {
        return MediaType.APPLICATION_JSON_UTF8_VALUE.equalsIgnoreCase(request.getContentType());
    }   
    

}
