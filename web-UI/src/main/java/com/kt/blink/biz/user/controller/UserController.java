/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.utils.CaptchaUtil;
import com.kt.blink.biz.common.utils.RSAUtil;
import com.kt.blink.biz.user.domain.User;
import com.kt.blink.biz.user.service.UserService;

import lombok.extern.slf4j.Slf4j;
import nl.captcha.Captcha;

/**
 * User Controller
 */
@Slf4j
@Controller
public class UserController {

    @Autowired
    private RSAUtil rsaUtil;

    @Autowired
    private CaptchaUtil captchaUtil;
    
    @Autowired
    private UserService userService;
    
    
    /**
     * login
     * 
     * @param model
     * @param session
     * @param request
     * @return
     */
    @GetMapping({"/", "/login"})
    public String login(HttpSession session, Model model, HttpServletRequest request) {
        if (session.getAttribute(AppConst.LOGIN_SESSION) != null) {
            log.warn("▶▶▶ Redirecting to the landing page because the user is already logged in.");
            model.asMap().clear();
            return "redirect:/dashboard";
        }
        
        String publickeymodulus = rsaUtil.getRSAPublicKeyModulus();
        String publickeyexponent = rsaUtil.getRSAPrivateKeyExponent();
        model.addAttribute("publickeymodulus", publickeymodulus);
        model.addAttribute("publickeyexponent", publickeyexponent);
        return "blink/user/login";
    }
    
    
    /**
     * change user password
     * 
     * @param user
     * @return
     */
    @PostMapping("/changeCredential")
    public ModelAndView changeCredential(@ModelAttribute final User user, RedirectAttributes redirectAttributes) {
        ModelAndView mav = new ModelAndView();
        Integer rc = userService.changeUserCredential(user);
        log.info("[RESULT]===========>{}", rc);
        if (rc.equals(NumberUtils.INTEGER_ZERO)) {
            redirectAttributes.addFlashAttribute("rtnMsg", "passwordChangeFailed");
        } else {
            redirectAttributes.addFlashAttribute("rtnMsg", "passwordChanged");
        }
        mav.setViewName("redirect:/login");
        return mav;
    }
    
   
    
    /**
     * generate captcha code
     * 
     * @param rand
     * @param request
     * @param response
     * @param session
     */
    @GetMapping(value = "/captcha")
    public void getCaptchaCode(@RequestParam("rand") String rand, HttpServletRequest request, 
            HttpServletResponse response, HttpSession session) {
        
        if (!rand.equals(session.getAttribute("rand"))) {
            captchaUtil.getCaptchaCode(request, response);
            Captcha captcha = (Captcha) session.getAttribute(Captcha.NAME);
            String getAnswer = captcha.getAnswer();
            session.setAttribute("getAnswer", getAnswer);
            session.setAttribute("rand", StringUtils.isBlank(rand) ? StringUtils.EMPTY : rand);
        }
    }
    
    
    /**
     * License Notice
     */
    @GetMapping("/licenseNotice")
    public String licenseNotice() {
        return "blink/user/licenseNotice";
    }
    

}
