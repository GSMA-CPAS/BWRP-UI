/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.utils;

import static nl.captcha.Captcha.NAME;

import java.awt.Color;
import java.awt.Font;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import nl.captcha.Captcha;
import nl.captcha.backgrounds.BackgroundProducer;
import nl.captcha.backgrounds.GradiatedBackgroundProducer;
import nl.captcha.gimpy.GimpyRenderer;
import nl.captcha.gimpy.StretchGimpyRenderer;
import nl.captcha.servlet.CaptchaServletUtil;
import nl.captcha.text.renderer.DefaultWordRenderer;

/**
 * Common Util
 */
@Component
public class CaptchaUtil {

    private static final Integer WIDTH = 200; // captcha image width
    private static final Integer HEIGHT = 54; // captcha image height
    
    private static final List<Color> COLORS = new ArrayList<>();
    private static final List<Font> FONTS = new ArrayList<>();
    
    static {
        COLORS.add(Color.BLUE);
        COLORS.add(Color.RED);
        COLORS.add(Color.BLACK);

        FONTS.add(new Font("Arial", Font.ITALIC, 48));
        FONTS.add(new Font("Arial", Font.BOLD, 48));
        FONTS.add(new Font("Arial", Font.PLAIN, 48));
        FONTS.add(new Font("Courier", Font.ITALIC, 48));
        FONTS.add(new Font("Courier", Font.BOLD, 48));
        FONTS.add(new Font("Courier", Font.PLAIN, 48));
        FONTS.add(new Font("Geneva", Font.ITALIC, 48));
        FONTS.add(new Font("Geneva", Font.BOLD, 48));
        FONTS.add(new Font("Geneva", Font.PLAIN, 48));
    }

    /**
     * generate simple captcha
     *
     * @param HttpServletRequest
     * @param HttpServletResponse
     * @return
     */
    public void getCaptchaCode(HttpServletRequest req, HttpServletResponse res) {
        DefaultWordRenderer wordRenderer = new DefaultWordRenderer(COLORS, FONTS); 
        //NoiseProducer noiseProducer = new CurvedLineNoiseProducer(Color.BLUE, 3); 
        GimpyRenderer gimpyRenderer = new StretchGimpyRenderer(1.04d, 1.0d); 
        BackgroundProducer backgroundProducer = new GradiatedBackgroundProducer(Color.lightGray, Color.white);
        //BackgroundProducer backgroundProducer = new TransparentBackgroundProducer();
     
        // image setup
        Captcha captcha = new Captcha.Builder(WIDTH, HEIGHT)
               .addText(wordRenderer)
               .gimp(gimpyRenderer)
               .addBackground(backgroundProducer)
               //.addNoise(noiseProducer)
               .build();
            
         // save captcha on session
         req.getSession().setAttribute(NAME, captcha);
         CaptchaServletUtil.writeImage(res, captcha.getImage());
         
    }

}
