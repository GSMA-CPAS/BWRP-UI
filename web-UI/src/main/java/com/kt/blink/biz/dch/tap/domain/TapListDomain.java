/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.tap.domain;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * inquiry TAP List
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TapListDomain extends BaseDomain {
    
    private static final long serialVersionUID = 5781616932006352710L;
    
    /**
     * Sender PlmnId
     */
    private String trmPlmnId;
    private List<String> trmPlmnIds;
    
    /**
     * Receiver PlmnId
     */
    private String rcvPlmnId;
    private List<String> rcvPlmnIds;
    
    /**
     * Tap Sequence
     */
    private String tapSeq;
    
    /**
     * I. Total (MOC + MTC + DATA + SMS)
     */
    
    /**
     * total count of records 
     */
    private Integer totalRecdCnt;
    
    /**
     * total usage amount 
     */
    private Double totalCalcAmt;
    
    /**
     * Search Start Date
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    private String startDateStr;
    
    /**
     * Search End Date
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
    private String endDateStr;
    
    /** applied currency **/
    private String currency;
    
    /**
     * TAP File Direction
     */
    private String tapDirection;
    
    /**
     * File Creation Date
     */
    private String fileCretDateVal;
    
    private String bcDataTypeId;
    
    private String fileUtcOffset;
    
    /**
     * II. MOCVO : 
     */
    private Integer mocVoLoRecdCnt;
    
    private Double mocVoLoUseQnt;
    
    private String mocVoLoCalcUnit;
    
    private Double mocVoLoCalcAmt;
    
    private Integer mocVoHomeRecdCnt;
    
    private Double mocVoHomeUseQnt;
    
    private String mocVoHomeCalcUnit;
    
    private Double mocVoHomeCalcAmt;
    
    private Integer mocVoIntlRecdCnt;
    
    private Double mocVoIntlUseQnt;
    
    private String mocVoIntlCalcUnit;
    
    private Double mocVoIntlCalcAmt;
    
    /**
     * count of mocvo record
     */
    private Integer mocVoRecdCnt;// mocVoLoRecdCnt + mocVoHomeRecdCnt + mocVoIntlRecdCnt
    
    /**
     * usgae time of mocvo
     */
    private Double mocVoUseQnt; // mocVoLoUseQnt + mocVoHomeUseQnt + mocVoIntlUseQnt
    
    /**
     * charge amount of mocvo
     */
    private Double mocVoCalcAmt; // mocVoLoCalcAmt + mocVoHomeCalcAmt + mocVoIntlCalcAmt
    
    /**
     * III. MTCVO : 
     */
    
    /**
     * count of mtcvo record
     */
    private Integer mtcVoRecdCnt;
    
    /**
     * usgae time of mtcvo
     */
    private Double mtcVoUseQnt;
    
    /**
     * charge amount of mtcvo
     */
    private Double mtcVoCalcAmt;
    
    private String mtcVoCalcUnit;
    
    /**
     * V. DATA : 
     */
    
    /**
     *  count of data record
     */
    private Integer dataRecdCnt;
    
    /**
     * usage amount of data
     */
    private Double dataUseQnt;
    
    /**
     * charge amount of data
     */
    private Double dataCalcAmt;
    
    
    private String dataCalcUnit;
    
    /**
     * MOCSMS, MTCSMS : SMS
     */
    private Integer mocSmsRecdCnt;
    
    private Double mocSmsUseQnt;
    
    private String mocSmsCalcUnit;
    
    private Double mocSmsCalcAmt;
    
    private Integer mtcSmsRecdCnt;
    
    private Double mtcSmsUseQnt;
    
    private String mtcSmsCalcUnit;
    
    private Double mtcSmsCalcAmt;
    
    /**
     * IV. cound of SMS record
     */
    private Integer smsRecdCnt; // mocSmsRecdCnt + mtcSmsRecdCnt
    
    /**
     * charge amount of SMS
     */
    private Double smsCalcAmt; // mocSmsCalcAmt + mtcSmsCalcAmt
    
    /**
     * Other tap list info
     */
    private String taxInclYn;
    
    private Double taxAplyPecnt;
    
    private String taxAplyTypeCd;
    
    private Double taxAmt;
    
    private String setlMonth;
    
    private String curCd;
    
    private String invocId;
    
    private Integer stTapSeq;
    
    private Integer endTapSeq;
    
    /**
     * Sum Of The Amount Column
     */
    
    /**
     * Sum Of All Total
     */
    private Integer sumRecdTotal;
    
    private Double sumAmtTotal;
    
    /**
     * Sum Of MOC Total
     */
    private Integer sumRecdMoc;
    
    private Double sumUseMoc;
    
    private Double sumAmtMoc;
    
    /**
     * Sum Of MTC Total
     */
    private Integer sumRecdMtc;
    
    private Double sumUseMtc;
    
    private Double sumAmtMtc;
    
    /**
     * Sum Of DATA Total
     */
    private Integer sumRecdData;
    
    private Double sumUseData;
    
    private Double sumAmtData;
    
    /**
     * Sum Of SMS Total
     */
    private Integer sumRecdSms;
    
    private Double sumAmtSms;
    
    // buttonSearch
    private String btnSearch;
    
    /**
     * DataTables
     */
    private DataTablesRequest dataTablesRequest;
    
}

