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

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * roaming contract or contract details
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class ContDtlDomain extends BaseDomain {
	
	private static final long serialVersionUID = 2117138542681006050L;
	
	// contract(detail) Seq
    private String contDtlId;
    
    // Agreement Seq
    private String contId;
    
    // contract start date
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate contStDate;
    
    // contract end date
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate contExpDate;
    
    // contaract end alarm date
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate contExpNotiDate;
    
    // whether the contract is automatically updated
    private String contAutoUpdYn;
    
    // contract detail meno
    private String contDtlMemo;
    
    // contract currency code
    private String contCurCd;
    
    // tax apply tyoe
    private String taxAplyTypeCd;
    
    // tax apply rate
    private Double taxAplyPecnt;
    
    // exception apply call
    private String exceptAplyCall;
    
    // blockchain contract id
    private String bcContId;
    
    // Working, Draft, Accepted, Declined
    private String contSttusCd;
    
    private List<ContBasTarifDomain> contBasTarifs;
    
    private List<ContSpclTarifDomain> contSpclTarifs;
    
    // contract direction
    private String direction;
   	

}
