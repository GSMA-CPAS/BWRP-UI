package com.kt.blink.biz.dch.contract.domain;

import lombok.Data;

/**
 * DTO Domain to gather data for sending GW
 */
@Data
public class ContractBaseTarifDomain {
    
    private String contBasTarifId;
    private String contDtlId;
    private String contSpclTarifId;
    private String callTypeCd;
    private String taxAply;
    private String stelTarif;
    private String stelVlm;
    private String stelUnit;
    private String adtnFeetypeCd;
    private String adtnFeeAmt;

}
