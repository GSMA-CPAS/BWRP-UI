/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.user.domain;

import java.io.Serializable;

import lombok.Data;

/**
 * LoginRequest
 */
@Data
public class LoginRequest implements Serializable {

	private static final long serialVersionUID = 3659837063777635715L;

	/**
     * userId or email
     */
    private String username;

    /**
     * passowrd
     */
    private String password;
    
    /**
     * confirm password
     */
    private String passwordConfirm;
    
    /**
     * captcha
     */
    private String captcha;
    

}
