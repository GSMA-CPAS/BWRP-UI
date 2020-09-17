/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.contract.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Basic Rate Conditions Included in Contract Special Rate Conditions
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class ContSpclBasTarifDomain extends BaseDomain {
	
	private static final long serialVersionUID = -2580027580145314573L;
	
    private String contBasTarifId;
    
    private String callTypeCd;
    
    // IOT
    private Double stelTarif;
    
    private Integer stelVlm;
    
    private String stelUnit;
    
    private String adtnFeeTypeCd;
    
    private Integer adtnFeeAmt;
    
    private String contSpclTarifId;
    
    private String contDtlId;
    
    // tax apply
    private String taxAply;
	

}
