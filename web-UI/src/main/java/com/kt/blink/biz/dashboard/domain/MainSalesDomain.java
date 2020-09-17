package com.kt.blink.biz.dashboard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MainSalesDomain extends BaseDomain{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String seq; 
    private String rcvplmnid; 
    private String years; 
    private String jan; 
    private String feb; 
    private String mar; 
    private String apr; 
    private String may; 
    private String jun; 
    private String jul; 
    private String aug; 
    private String sep;
    private String oct; 
    private String nov; 
    private String dece;
    private String outin;
}
