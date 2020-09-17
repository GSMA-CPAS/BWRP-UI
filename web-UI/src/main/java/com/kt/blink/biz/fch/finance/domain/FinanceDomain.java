/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.finance.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FinanceDomain extends BaseDomain {
    
    
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
     * start month
     */
    private String stPeriodMon;
    /**
     * end month
     */
    private String endPeriodMon;
    

    /**
     * revenue
     */
    private String revenue;
    /**
     * expense
     */
    private String expense;
    /**
     * profit
     */
    private String profit;
    /**
     * over revenue
     */
    private String overRevenue;
    /**
     * over expense
     */
    private String overExpense;
    /**
     * over profit
     */
    private String overProfit;
    
    /**
     * revenue sum
     */
    private String revenueSum;
    /**
     * expense sum
     */
    private String expenseSum;
    /**
     * profit sum
     */
    private String profitSum;
    /**
     * over revenue sum
     */
    private String overRevenueSum;
    /**
     * over expense sum
     */
    private String overExpenseSum;
    /**
     * over profit sum
     */
    private String overProfitSum;
    /**
     * cntry nm
     */
    private String cntryNm;
    /**
     * mcc id
     */
    private String mccId;
    /**
     * currency
     */
    private String curCdSel;

    /**
     * filter my network
     */
    private String filterMyNet;
    /**
     * filter partner network
     */
    private String filterParterNet;
    /**
     * filter cntry nm
     */
    private String filterCntryNm;
    /**
     * filter profit sign
     */
    private String filterProfitSign;
    /**
     * filter over profit sign
     */
    private String filterOverProfitSign;
    /**
     * decimal 
     */
    private String decPoint;

    /**
     * datatables
     */
    private DataTablesRequest dataTablesRequest;
    /**
     * over day
     */
    private String overDay;
    
    
}
