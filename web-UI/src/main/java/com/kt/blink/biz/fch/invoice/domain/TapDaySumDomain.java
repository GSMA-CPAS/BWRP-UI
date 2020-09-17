/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.invoice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TapDaySumDomain extends BaseDomain {

    
    /**
     * 
     */
    private static final long serialVersionUID = 5098781898492781733L;
    
    /**
     * SDR aggregate amount
     */
    private String sdrSumAmt;
    /**
     * SDR tax amount 
     */
    private String sdrTaxAmt;
    /**
     * SDR result amount
     */
    private String sdrResltAmt;
    /**
     * file creation date
     */
    private String fileCretDateVal;
    /**
     * SDR aggregate amount
     */
    private String sdrTotSumAmt;
    /**
     * SDR tax 
     */
    private String sdrTotTaxAmt;
    /**
     * SDR result amount
     */
    private String sdrTotResltAmt;

    /**
     * start tap seq
     */
    private Long stTapSeq;
    /**
     * end TAP seq
     */
    private Long endTapSeq;
    
    
    
}
