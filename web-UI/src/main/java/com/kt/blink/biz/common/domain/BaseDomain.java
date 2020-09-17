/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.domain;

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

/**
 * Base Domain
 */
@Data
public class BaseDomain implements Serializable {

	private static final long serialVersionUID = 7592926963007287507L;

	/**
     * request username
     */
    private String sysTrtrId;
    
    /**
     * request url
     */
    private String sysSvcId;
    
    /**
     * created date
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date sysRecdCretDt;
    
    /**
     * updated date
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date sysRecdChgDt;
    
    /**
     * page totalcount
     */
    private Long totalCount;
    
    /**
     * order sequel
     */
    private String orderSequel;
    

}
