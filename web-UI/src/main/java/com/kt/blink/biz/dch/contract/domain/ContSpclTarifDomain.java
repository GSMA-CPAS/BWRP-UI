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
 * Contract special rate condition
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class ContSpclTarifDomain extends BaseDomain {
    
    private static final long serialVersionUID = 4360570415348615559L;
    
    private String contSpclTarifId;
    
    private String modelTypeCd;
    
    private String callTypeCd;
    
    private Double thrsMin;
    
    private Double thrsMax;
    
    private String thrsUnit;
    
    private Integer stepNo;
    
    private String contDtlId;
    
    private Double fixAmt;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate fixAmtDate;
    
    private String fixAmtCur;
    
    private String spclMemo;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate spclNotiDate;
    
    private String thrsTypeCd;
    
    private List<ContSpclBasTarifDomain> contSpclBasTarifs;

}
