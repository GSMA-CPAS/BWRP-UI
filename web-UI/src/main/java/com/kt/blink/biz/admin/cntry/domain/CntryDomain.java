/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cntry.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntryDomain extends BaseDomain {
    /**
     * 
     */
    private static final long serialVersionUID = -4153423410381040596L;
    
    private String cntryCd;
    private String mccId;
    private String isoCntryDgt2;
    private String cntryNm;
    private String orgMccId;
    
    private String cntryCdCnt;
    private String isoCntryDgt2Cnt;
    private String mccIdCnt;
    private String cntryNmCnt;
    
    private String cntryStat;
    
    
}
