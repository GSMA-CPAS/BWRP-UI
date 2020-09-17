package com.kt.blink.biz.dch.contract.domain;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ApiContSpclDomain implements Serializable {

    private static final long serialVersionUID = -5445393721101773103L;
    
    @JsonProperty("CONT_SPCL_TARIF_ID")
    private String contSpclTarifId;
    
    @JsonProperty("CONT_DTL_ID")
    private String contDtlId;
    
    @JsonProperty("MODEL_TYPE_CD")
    private String modelTypeCd;
    
    @JsonProperty("CALL_TYPE_CD")
    private List<String> callTypeCd;
    
    @JsonProperty("THRS_MIN")
    private String thrsMin;
    
    @JsonProperty("THRS_MAX")
    private String thrsMax;
    
    @JsonProperty("THRS_UNIT")
    private String thrsUnit;
    
    @JsonProperty("THRS_TYPE_CD")
    private String thrsTypeCd;
    
    @JsonProperty("FIX_AMT_DATE")
    private String fixAmtDate;
    
    @JsonProperty("FIX_AMT")
    private String fixAmt;
    
    @JsonProperty("FIX_AMT_CUR")
    private String fixamtCur;
    
    @JsonProperty("SPCL_MEMO")
    private String spclMemo;
    
    @JsonProperty("CalcBas")
    private List<ApiContBasDomain> calcBas;
    
    
}
