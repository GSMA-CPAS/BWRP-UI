/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cmpn.domain;

import java.util.List;

import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class CmpnDomain extends BaseDomain {

    /**
     * 
     */
    private static final long serialVersionUID = -2314853370197850478L;
    /**
     * id serial
     */
    private String cmpnId;
    /**
     * name
     */
    private String cmpnNm;
    /**
     * address
     */
    private String cmpnAdr;

    /**
     * my company yn
     */
    private String myCmpnYn;
    /**
     * user id
     */
    private String userId;
    /**
     * tax no
     */
    private String taxNo;
    /**
     * bank type
     */
    private List<String> bankType;
    /**
     * name
     */
    private List<String> bankNm;
    /**
     * swift code
     */
    private List<String> swiftCd;
    /**
     * account name
     */
    private List<String> accNm;
    /**
     * account numbere
     */
    private List<String> accNo;
    /**
     * iban no
     */
    private List<String> ibanNo;
    /**
     * name
     */
    private List<String> correspBankNm;
    /**
     * swift code
     */
    private List<String> correspSwiftCd;
    /**
     * bank stat
     */
    private List<String> isBankStat;
    
    private List<BankDomain> banks;
    

    /**
     * fax no
     */
    private String faxNo;
    /**
     * tel no
     */
    private String telNo;
    /**
     * email
     */
    private String emailId;

}
