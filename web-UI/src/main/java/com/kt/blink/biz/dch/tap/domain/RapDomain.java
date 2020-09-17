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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RapDomain extends BaseDomain {

    
    /**
     * 
     */
    private static final long serialVersionUID = 5098781898492781733L;
    
    /**
     * sender plmn id
     */
    private String trmPlmnId;
    /**
     * receiver plmn id
     */
    private String rcvPlmnId;
    /**
     * file name
     */
    private String fileNm;
    
    /**
     * file creation date
     */
    private String fileCretDtVal;

    /**
     * file creation date
     */
    private String fileCretDtValView;
    /**
     * record seq number
     */
    private String recdNo;
    /**
     * TAP seq number
     */
    private String tapSeq;
    /**
     * fie seq number
     */
    private String fileSeqNo;
    /**
     * CALL TYPE
     */
    private String callTypeId;
    /**
     * call type name
     */
    private String callTypeIdNm;
    /**
     * imsi
     */
    private String imsiId;
    /**
     * called No
     */
    private String calldNo;
    /**
     * processing status code
     */
    private String trtSttusCd;
    /**
     * processing status name
     */
    private String trtSttusCdNm;
    /**
     * error code
     */
    private String errCd;
    /**
     * error code name
     */
    private String errCdNm;
    /**
     * duration
     */
    private String duration;
    /**
     * volume
     */
    private String volume;
    /**
     * start date
     */
    private String stPeriodDay;
    /**
     * end date
     */
    private String endPeriodDay;

    /**
     * datatables
     */
    private DataTablesRequest dataTablesRequest;
    
    
}
