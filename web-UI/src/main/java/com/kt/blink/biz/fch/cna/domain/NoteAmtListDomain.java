/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.cna.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoteAmtListDomain extends BaseDomain {
   
    /**
     * 
     */
    private static final long serialVersionUID = 4219313719954158727L;

    /**
     * ref. number
     */
    private String noteRefNum;
    /**
     * note currency
     */
    private String noteCur;
    /**
     * invoce charge amount
     */
    private String noteAmt;
    /**
     * tax amount
     */
    private String taxAmt;
    /**
     * total amount
     */
    private String totAmt;
    
    
}
