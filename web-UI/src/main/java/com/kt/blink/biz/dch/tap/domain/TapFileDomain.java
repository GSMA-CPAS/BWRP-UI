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
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * inquiry TAP File processing status
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TapFileDomain extends BaseDomain {
    
    private static final long serialVersionUID = -5331259573828167895L;
    
    /**
     * TAP File Name
     */
    private String inptFileNm;
    
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
     * Date Range Search Conditon [CRTDT/ TRTDT]
     */
    private String dateSearchCond;
    
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
    
    /**
     * file create date
     */
    private Date fileCretDtVal;
    
    /**
     * file process date
     */
    private Date trtFnsDt;
    
    /**
     * TAP File Direction
     */
    private String tapDirection;
    
    /**
     * File Process Status
     * W Wait for work-> S Work completed-> C Transfer file creation completed-> E Work failed
     */
    private String trtSttusCd;
    
    /**
     * Settle Month
     */
    private String setlMonth;
    
    /**
     * Total Record Conut
     */
    private Integer totCdrCnt;
    
    /**
     * Record Conut Of Processed TAP File
     */
    private Integer cdrCnt;
    
    /**
     * Error Record Count Of Processed TAP File
     */
    private Integer errCnt;
    
    /**
     * Sum Of The Total Success Record Conut Of Processed TAP File
     */
    private Long sumCdrCnt;
    
    /**
     * Sum Of The Total Error Record Count Of Processed TAP File 
     */
    private Long sumErrCnt;
    
    /**
     * Sum Of The Total Record Record Count Of Processed TAP File 
     */
    private Long sumTotCdrCnt;
    
    // buttonSearch
    private String btnSearch;
    
    /**
     * DataTables
     */
    private DataTablesRequest dataTablesRequest;
    

}
