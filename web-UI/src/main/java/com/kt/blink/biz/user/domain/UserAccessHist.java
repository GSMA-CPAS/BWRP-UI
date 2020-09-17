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

import java.util.Date;

import lombok.Data;

/**
 * User Login Access Logging Domain
 * 
 * @author Administrator
 */
@Data
public class UserAccessHist {
    
    /**
     * user id
     */
    private String username;
    
    /**
     * Whether login is successful
     */
    private Boolean successYn;
    
    /**
     * reason of login fail
     */
    private String reason;
    
    /**
     * last access time
     */
    private Date lastAccessed;

}
