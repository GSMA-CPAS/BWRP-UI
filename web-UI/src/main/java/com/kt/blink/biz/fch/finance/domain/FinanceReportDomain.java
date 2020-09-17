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

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FinanceReportDomain extends BaseDomain {
    
    private static final long serialVersionUID = 4244863491644786820L;
    
    /**
     * search years
     */
    private List<String> periods;
    
    
    /**
     * periods to comma string ('2018', '2019')
     */
    private String period;
    
    
    /**
     * company
     */
    private String companyCode;
    
    
    /**
     * partner plmns
     */
    private List<String> partnerNetworks;
    
    
    /**
     * partner plmn to comma string
     */
    private String partnerNetwork;
    
    
    /**
     * selected call types
     */
    private List<String> callTypes;
    
    
    /**
     * search call type
     */
    private String callType;
    
    
    /**
     * unit
     */
    private String unit;
    
    
    /**
     * contract type (direction)
     */
    private String direction;
    
    
    /**
     * currency
     */
    private String currency;
    
    
    /**
     * result of sales search
     * 
     */
    
    /**
     * year
     */
    private String year;
    
    
    /**
     * Jan(1)
     */
    private Double jan;
    
    
    /**
     * Feb(2)
     * 
     */
    private Double feb;
    
    
    /**
     * Mar(3)
     */
    private Double mar;
    
    
    /**
     * Apr(4)
     */
    private Double apr;
    
    
    /**
     * May(5)
     * 
     */
    private Double may;
    
    
    /**
     * Jun(6)
     */
    private Double jun;
    
    
    /**
     * Jul(7)
     */
    private Double jul;
    
    
    /**
     * Aug(8)
     */
    private Double aug;
    
    
    /**
     * Sept(9)
     */
    private Double sep;
    
    
    /**
     * Oct(10)
     */
    private Double oct;
    
    
    /**
     * Nov(11)
     */
    private Double nov;
    
    
    /**
     * Dec(12)
     */
    private Double dec;
    
    
    /**
     * Year Total
     */
    private Double total;
    
    
    public FinanceReportDomain() {
        super();
    }
    
    public FinanceReportDomain(String year, Double jan, Double feb, Double mar, Double apr, Double may, Double jun, Double jul, Double aug, Double sep,
            Double oct, Double nov, Double dec, Double total) {
        super();
        this.year = year;
        this.jan = jan;
        this.feb = feb;
        this.mar = mar;
        this.apr = apr;
        this.may = may;
        this.jun = jun;
        this.jul = jul;
        this.aug = aug;
        this.sep = sep;
        this.oct = oct;
        this.nov = nov;
        this.dec = dec;
        this.total = total;
    }
    
    
}
