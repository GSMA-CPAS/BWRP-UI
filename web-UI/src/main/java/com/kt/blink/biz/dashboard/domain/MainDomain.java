package com.kt.blink.biz.dashboard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MainDomain extends BaseDomain {

    /**
     * 
     */
    private static final long serialVersionUID = 9026260090389972793L;
    private String seq; 
    private String plmnord; 
    private String rcvplmnid; 
    //total revenue
    private String revcur; 
    private String revamt; 
    private String revdataamt; 
    private String revvoiceamt; 
    private String revsmsamt;
    private String revminday; 
    private String revmaxday; 
    //processed inbound
    private String revminsetlday; 
    private String revtaphhmm; 
    private String revvoiceqnt;
    private String revdataqnt; 
    private String revsmsqnt; 
    //recivable
    private String receimaxday; 
    private String receicur; 
    private String receiamt; 
    
    private String incommitminday;
    private String incommitmaxday;
    private String incommitcur; 
    private String incommitpercnt; 
    private String incommitamt; 
    private String incommitsumamt;
    //total expense
    private String expcur; 
    private String expamt; 
    private String expdataamt;
    private String expvoiceamt; 
    private String expsmsamt; 
    private String expminday; 
    private String expmaxday; 
    //processed outbound
    private String expminsetlday;
    private String exptaphhmm; 
    private String expvoiceqnt; 
    private String expdataqnt; 
    private String expsmsqnt; 
    //payable
    private String paymaxday; 
    private String paycur;
    private String payamt; 
    
    private String outcommitminday; 
    private String outcommitmaxday; 
    private String outcommitcur; 
    private String outcommitpercnt; 
    private String outcommitamt;
    private String outcommitsumamt;
    
    private String precision;
    
    private String receitoolamt;   
    private String paytoolamt;
    
    private String revtoolamt;
    private String exptoolamt;

    
}
