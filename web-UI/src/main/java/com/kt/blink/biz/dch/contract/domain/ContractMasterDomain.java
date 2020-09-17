package com.kt.blink.biz.dch.contract.domain;

import lombok.Data;

/**
 * DTO Domain to gather data for sending GW
 */
@Data
public class ContractMasterDomain {
    
    private String contId;
    private String trmPlmnId;
    private String rcvPlmnId;
    private String contrId;
    private String contMemo;
    private String contTypeCd;

}
