/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.plmn.domain;

import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class PlmnsDomain extends BaseDomain {

    /**
     * 
     */
    private static final long serialVersionUID = 8567695837798564786L;
    private String plmnId;
    private String plmnNm;
    private Long cmpnId;
    private String cmpnNm;
    private String mccId;
    private String mncId;
    private String efctStDt;
    private String expDt;
    private String orgMccId;
    private String orgMncId;
    
    private String cntryCd;
    private String cntryNm;
    private String plmnIdCnt;
    private String mncIdCnt;
    private String plmnStat;
    
}
