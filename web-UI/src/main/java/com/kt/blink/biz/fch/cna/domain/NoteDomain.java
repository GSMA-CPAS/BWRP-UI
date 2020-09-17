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
public class NoteDomain extends BaseDomain {
    
    
    /**
     * 
     */
    private static final long serialVersionUID = -3125882012396410093L;

    /**
     * sender plmn id
     */
    private String trmPlmnId;
    /**
     * receiver plmn id 
     */
    private String rcvPlmnId;
    /**
     * creation date 
     */
    private String creDateVal;
    /**
     * ref. number
     */
    private String noteRefNum;

    /**
     *org ref. number
     */
    private String orgNoteRefNum;

    /**
     * ref. number
     */
    private String cnaNoteRefNum;

    /**
     * ref. number
     */
    private String cnNoteRefNum;

    /**
     * ref. number
     */
    private String dnNoteRefNum;
    /**
     * TRAFFIC duration
     */
    private String trafcDay;
    /**
     * amount  
     */
    private String noteAmt;
    /**
     * contracct currency code
     */
    private String contCurCd;
    /**
     * requesst reason
     */
    private String reqReason;
    /**
     * contact name
     */
    private String contNm;
    /**
     * contact tel number
     */
    private String contTelNo;
    /**
     * FAX number
     */
    private String contFaxNo;
    /**
     * EMAIL
     */
    private String contEmail;
    /**
     * status code
     */
    private String noteStatusCd;
    /**
     * kind code
     */
    private String noteKindCd;

    /**
     * kind code
     */
    private String noteKindCdNm;
        
    /**
     * invoice id
     */
    private String invocId;
    /**
     * invoice name
     */
    private String invocNm;
    
    /**
     * contract id
     */
    private String contDtlId;
    
    /**
     * sender company name
     */
    private String trmCmpnNm;
    /**
     * sender company address
     */
    private String trmCmpnAdr;
    /**
     * receiver company name
     */
    private String rcvCmpnNm;
    /**
     * receiver company address
     */
    private String rcvCmpnAdr;
    /**
     * invoice direction
     */
    private String invocDirectCd;    
    /**
     * TAX included or not
     */
    private String taxInclYn;
    /**
     * TAX apply percent
     */
    private String taxAplyPecnt ;
    /**
     * TAX amount
     */
    private String taxAmt;
    /**
     * tax number
     */
    private String taxNo;
    /**
     * decimal
     */
    private String decPoint;
    /**
     * issue month
     */
    private String noteIssueMonth;
    
    
}
