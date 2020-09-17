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
public class TapFileSumDomain extends BaseDomain {

    
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
     * file creation date
     */
    private String fileCretDateVal;
    /**
     * file seq number
     */
    private String fileSeqNo;
    /**
     * settlement month
     */
    private String setlMonth;
    /**
     * type
     */
    private String type;
    /**
     * blockchain data type id
     */
    private String bcDataTypeId;
    /**
     * file UTC offset
     */
    private String fileUtcOffset;
    /**
     * count of mocvo record
     */
    private String mocVoRecdCnt;
    /**
     * usage mount of mocvo
     */
    private String mocVoUseQnt;

    /**
     * charge amount of mocvo
     */
    private String mocVoCalcAmt;

    /**
     * count of mtcvo record
     */
    private String mtcVoRecdCnt;
    /**
     * usage mount of mtcvo
     */
    private String mtcVoUseQnt;

    /**
     * charge amount of mtcvo
     */
    private String mtcVoCalcAmt;
    /**
     * count of sms record
     */
    private String smsRecdCnt;

    /**
     * charge amount of sms
     */
    private String smsCalcAmt;

    /**
     * count of data record
     */
    private String dataRecdCnt;
    /**
     * usage of DATA
     */
    private String dataUseQnt;

    /**
     * charge amount of DATA
     */
    private String dataCalcAmt;
    /**
     * TAX included or not
     */
    private String taxInclYn;
    /**
     * TAX apply percent
     */
    private String taxAplyPecnt ;
    /**
     * TAX application type code
     */
    private String taxAplyTypeCd;
    /**
     * TAX amount
     */
    private String taxAmt;
    /**
     * invoice id
     */
    private String invocId;
    /**
     * currency code
     */
    private String curCd;
    /**
     * issuing month
     */
    private String issueMonth;
    
    /**
     * kind code
     */
    private String kindCd;
    /**
     * kind name
     */
    private String kindCdNm;
    /**
     * invoice direction
     */
    private String invocDirectCd;
    /**
     * invoice direction name
     */
    private String invocDirectCdNm;
    /**
     * doc name
     */
    private String docuNm;
    
    /**
     * status code
     */
    private String statusCd;
    /**
     * status code name
     */
    private String statusCdNm;
    /**
     * revenue
     */
    private String revenue;
    /**
     * total revenue
     */
    private String revenueSum;
    /**
     * expense
     */
    private String expense;
    /**
     * total expense
     */
    private String expenseSum;
    /**
     * total profit
     */
    private String profitSum;
    /**
     * note 
     */
    private String noteYn;
    
    /**
     * start month
     */
    private String stPeriodMon;
    /**
     * end month
     */
    private String endPeriodMon;
    
    /**
     * checkbox
     */
    private String ckbox;
    
    /**
     * settlement month
     */
    private String setlMonthView;

    /**
     * filter my network
     */
    private String filterMyNet;
    /**
     * filter partner network
     */
    private String filterParterNet;
    
    /**
     * selected currency code
     */
    private String curCdSel;
    /**
     * contract currency code
     */
    private String contCurCd;
    /**
     * count of total sum record
     */
    private String totSumRecdCnt;
    /**
     * count of total sum 
     */
    private String totSumAmt;
    /**
     * record seq
     */
    private String recdSeq;
    /**
     * tap seq
     */
    private String tapSeq;
    /**
     * decimal 
     */
    private String decPoint;
    
    //////////////sum
    /**
     * count of mocvo records
     */
    private String mocTotVoRecdCnt;
    /**
     * usage amount of mocvo
     */
    private String mocTotVoUseQnt;

    /**
     * charge amount of mocvo
     */
    private String mocTotVoCalcAmt;

    /**
     * count of mtcvo records
     */
    private String mtcTotVoRecdCnt;
    /**
     * usage amount of mtcvo
     */
    private String mtcTotVoUseQnt;

    /**
     * charge amount of mtcvo
     */
    private String mtcTotVoCalcAmt;
    /**
     * count of sms records
     */
    private String smsTotRecdCnt;

    /**
     * charge amount of sms
     */
    private String smsTotCalcAmt;

    /**
     * count of data records
     */
    private String dataTotRecdCnt;
    /**
     * usage amount of data
     */
    private String dataTotUseQnt;

    /**
     * charge amount of data
     */
    private String dataTotCalcAmt;
    
    /**
     * total record count
     */
    private String totSumTotRecdCnt;
    /**
     * total amount
     */
    private String totSumTotAmt;

    /**
     * ref. number
     */
    private String noteRefNum;

    /**
     * date gbn
     */
    private String dateGbn;
}
