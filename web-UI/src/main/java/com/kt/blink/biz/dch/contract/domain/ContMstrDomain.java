/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.contract.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * roaming agreement or master contract
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class ContMstrDomain extends BaseDomain {
    
    private static final long serialVersionUID = -6500302651033304281L;
    
    // Agreement id
    private String contId;
    
    // Agreement type
    private String contTypeCd;
    
    // contractor
    private String contrId;

    // Agreement memo
    private String contMemo;
    
    // My Network PLMNs
    private List<String> trmPlmnIds;
    
    // Comma Seperate Value Of trmPlmnIds
    private String trmPlmnId;
    
    // Paterner Network PLMNs
    private List<String> rcvPlmnIds;
    
    // Comma Seperate Value Of partnerNetworks
    private String rcvPlmnId;
    
    // Contract Detail Domains
    private List<ContDtlDomain> contDtls;
    
    /**
     * DataTables
     */
    private DataTablesRequest dataTablesRequest;
    
    
}
