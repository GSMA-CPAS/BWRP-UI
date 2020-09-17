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

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class InvoiceDomain extends BaseDomain {
    
    /**
     * 
     */
    private static final long serialVersionUID = -7346357435547631310L;
    /**
     * invoice id
     */
    private String invocId;
    /**
     * invoice name
     */
    private String invocNm;
    /**
     * invoice issuing date
     */
    private String invocPblsDt;
    /**
     * settlement direction
     */
    private String setlDrectCd;
    /**
     * settlement direction name
     */
    private String setlDrectCdNm;
    /**
     * payment currncy code
     */
    private String payotCurCd;
    /**
     * payment due day
     */
    private String payotDueDay;
    /**
     * payment due date
     */
    private String payotDueDate;
    /**
     * bank name
     */
    private String bankNm;
    /**
     * swift code
     */
    private String swiftCd;
    /**
     * account name
     */
    private String accNm;
    /**
     * account number
     */
    private String accNo;
    /**
     * IBAN NO
     */
    private String ibanNo;
    /**
     * correspondent bank name 
     */
    private String correspBankNm;
    /**
     * correspondent bank swift code
     */
    private String correspSwiftCd;
    /**
     * contract id
     */
    private String contDtlId;
    /**
     * deposit confirmation date
     */
    private String dpsConfDate;
    /**
     * payment date
     */
    private String prvdDate;
    /**
     * invoice status
     */
    private String invocStatusCd;
    /**
     * invoice usage month
     */
    private String invocUseMonth;
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
    
    //search condition
    /**
     * start month
     */
    private String stPeriodMon;
    /**
     * end month
     */
    private String endPeriodMon;
    /**
     * status code
     */
    private String statusCd;
    /**
     * status code name
     */
    private String statusCdNm;
    /**
     * invoice direction
     */
    private String invocDirectCd;
    
    /**
     * sernder plmn id
     */
    private String trmPlmnId;
    /**
     * receiver plmn id
     */
    private String rcvPlmnId;
    /**
     * kind code
     */
    private String kindCd;
    /**
     * filter my network
     */
    private String filterMyNet;
    /**
     * filter partner network
     */
    private String filterParterNet;
    /**
     * currency code
     */
    private String curCdSel;
    /**
     * invoice id list
     */
    private List<String> invocIds;
    /**
     * start month
     */
    private String stPeriodDay;
    /**
     * end month
     */
    private String endPeriodDay;
    
    /**
     * revenue
     */
    private String revenue;
    /**
     * expense
     */
    private String expense;
    /**
     * settlement month
     */
    private String setlMonth;

    /**
     * traficFrom
     */
    private String trafcStDay;
    /**
     * traficTo
     */
    private String trafcEndDay;
    /**
     * min tap seq
     */
    private String minTapSeq;
    /**
     * max TAP seq
     */
    private String maxTapSeq;

    /**
     * ref. number
     */
    private String noteRefNum;
    /**
     * user id
     */
    private String userId;
    /**
     * contact name
     */
    private String contNm;
    /**
     * contact telephone number
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
     * tax number
     */
    private String taxNo;
    /**
     * decimal 
     */
    private String decPoint;
    /**
     * invoice amt
     */
    private String invocAmt;
    /**
     * %
     */
    private String commitTotalRate;
    /**
     * %
     */
    private String commitPeriodRate;
    /**
     * datatables
     */
    private DataTablesRequest dataTablesRequest;
    
    /**
     * sender plmn id 
     */
    private String[] trmPlmnIds;
    /**
     * receiver plmn id
     */
    private String[] rcvPlmnIds;
    /**
     * date gbn
     */
    private String dateGbn;
    
}
