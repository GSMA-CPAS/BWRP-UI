package com.kt.blink.biz.dch.contract.domain;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ApiContDtlDomain implements Serializable {
    
    private static final long serialVersionUID = 942590905213963553L;
    
    @JsonProperty("CONT_DTL_ID")
    private String contDtlId;
    
    @JsonProperty("CONT_ID")
    private String contId;
    
    @JsonProperty("CONT_ST_DATE")
    private String contStDate;
    
    @JsonProperty("CONT_EXP_DATE")
    private String contExpDate;
    
    @JsonProperty("CONT_EXP_NOTI_DATE")
    private String contExpNotiDate;
    
    @JsonProperty("CONT_AUTO_UPD_YN")
    private String contAutoUpdYn;
    
    @JsonProperty("CONT_DTL_MEMO")
    private String contDtlMemo;
    
    @JsonProperty("CONT_CUR_CD")
    private String contCurCd;
    
    @JsonProperty("CONT_STTUS_CD")
    private String contSttusCd;
    
    @JsonProperty("EXCEPT_APLY_CALL")
    private String exceptAplyCall;
    
    @JsonProperty("BC_CONT_ID")
    private String bcContId;
    
    @JsonProperty("TAX_NO")
    private String taxNo;
    
    @JsonProperty("TAX_APLY_PECNT")
    private String taxAplyPecnt;
    
    @JsonProperty("TAX_APLY_TYPE_CD")
    private String taxAplytypeCd;
    
    @JsonProperty("CMPN_ID")
    private String cmpnId;
    
    @JsonProperty("CMPN_NM")
    private String cmpnNm;
    
    @JsonProperty("CMPN_ADR")
    private String cmpnAdr;
    
    @JsonProperty("CalcBas")
    private List<ApiContBasDomain> calcBas;
    
    @JsonProperty("CalcSpcl")
    private List<ApiContSpclDomain> calcSpcl;

}
