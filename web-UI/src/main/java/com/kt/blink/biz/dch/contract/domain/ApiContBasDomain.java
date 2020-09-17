package com.kt.blink.biz.dch.contract.domain;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ApiContBasDomain implements Serializable {

    private static final long serialVersionUID = -1744643913764312287L;
    
    @JsonProperty("CONT_BAS_TARIF_ID")
    private String contBasTarifId;
    
    @JsonProperty("CONT_DTL_ID")
    private String contDtlId;
    
    @JsonProperty("CONT_SPCL_TARIF_ID")
    private String contSpclTarifId;
    
    @JsonProperty("CALL_TYPE_CD")
    private String callTypeCd;
    
    @JsonProperty("TAX_INCL_YN")
    private String taxAply;
    
    @JsonProperty("STEL_TARIF")
    private String stelTarif;
    
    @JsonProperty("STEL_VLM")
    private String stelVlm;
    
    @JsonProperty("STEL_UNIT")
    private String stelUnit;
    
    @JsonProperty("ADTN_FEE_TYPE_CD")
    private String adtnFeetypeCd;
    
    @JsonProperty("ADTN_FEE_AMT")
    private String adtnFeeAmt;
    
}
