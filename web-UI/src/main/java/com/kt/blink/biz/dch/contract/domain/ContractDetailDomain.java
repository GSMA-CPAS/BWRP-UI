package com.kt.blink.biz.dch.contract.domain;

import lombok.Data;

/**
 * DTO Domain to gather data for sending GW
 */
@Data
public class ContractDetailDomain {
    
    // contract master
    private String contId;
    //private String contNm;
    private String contTypeCd;
    private String contMemo;
    private String trmPlmnId;
    private String rcvPlmnId;
    private String contrId;
    
    // contract detail
    private String contDtlId;
    //private String contId;
    //private String contDtlNm;  
    private String contStDate;
    private String contExpDate;
    private String contExpNotiDate;
    private String contAutoUpdYn;
    private String contDtlMemo;
    private String contCurCd;
    private String contSttusCd;
    private String exceptAplyCall;
    private String bcContId;
    private String taxNo;
    private String taxAplyPecnt;
    private String taxAplytypeCd;
    private String cmpnId;
    private String cmpnNm;
    private String cmpnAdr;
    
}
