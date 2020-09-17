package com.kt.blink.biz.dch.contract.domain;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * WEB/GW inter-connection DTO(Data Transfer Object) for confirm contract
 */
@Data
public class ApiConfirmContDomain implements Serializable {
    
    private static final long serialVersionUID = 7931393631918833925L;

    /**
     * approval or rejection code for the other operator's contrac(AGR/DCL)
     */
    @JsonProperty("CONT_STTUS_CD")
    private String contSttusCd;
    
    
    /**
     * ID issued by GW when creating a contract
     */
    @JsonProperty("BC_CONT_ID")
    private String bcContId;
    
    
    /**
     * contract ID
     */
    @JsonProperty("CONT_DTL_ID")
    private String contDtlId;
    
    
    public ApiConfirmContDomain() {
        super();
    }

    public ApiConfirmContDomain(String contSttusCd, String bcContId, String contDtlId) {
        super();
        this.contSttusCd = contSttusCd;
        this.bcContId = bcContId;
        this.contDtlId = contDtlId;
    }
    
    
    
}
