package com.kt.blink.biz.dch.contract.domain;

import lombok.Data;

/**
 * DTO Domain to gather data for sending GW
 */
@Data
public class ContractSpclTarifDomain {
    
    private String contSpclTarifId;
    private String contDtlId;
    private String modelTypeCd;
    private String callTypeCd;
    private String thrsMin;
    private String thrsMax;
    private String thrsUnit;
    private String thrsTypeCd;
    private String fixAmtDate;
    private String fixAmt;
    private String fixamtCur;
    private String spclMemo;
//    private String stepNo;
//    private String spclNotiDate;
    
}
