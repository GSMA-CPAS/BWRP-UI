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

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Common Code Info Class
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class CodeInfo extends BaseDomain {

	private static final long serialVersionUID = -15491644449867007L;

	/**
     * Code Group Id
     */
    private String cdGroupId;
    
    /**
     * Code Group Name
     */
    private String cdGroupNm;
    
    /**
     * Code Id
     */
    private String cdId;
    
    /**
     * Code Description
     */
    private String cdDesc;
    
    /**
     * Code Value #1
     */
    private String cdVal1;
    
    /**
     * Code Value #2
     */
    private String cdVal2;
    
    /**
     * Code Value #3
     */
    private String cdVal3;
    
    /**
     * Code Order
     */
    private Integer otputPrirt;
    
    /**
     * Code Use Y/N
     */
    private Boolean useYn;
    
}
