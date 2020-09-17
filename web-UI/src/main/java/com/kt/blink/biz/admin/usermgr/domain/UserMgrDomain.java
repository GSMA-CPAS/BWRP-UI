/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.usermgr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class UserMgrDomain extends BaseDomain {

	private static final long serialVersionUID = -7819494999045956801L;

	/**
     * userId or email
     */
    private String userId;

    /**
     * userId or email
     */
    private String userIdCnt;

    /**
     * password
     */
    private String userPwd;
    
    /**
     * user role : 0 -> USER, 1 -> ADMIN
     */
    private String userRole;
    
    /**
     * role nm
     */
    private String userRoleNm;
    
    /**
     * First name
     */
    private String firstNm;
    
    /**
     * Last name
     */
    private String lastNm;    
    
    /**
     * fax no
     */
    private String faxNo;
    /**
     * tel no
     */
    private String telNo;

    /**
     * userId or email
     */
    private String userStat;
    /**
     * userId or email
     */
    private String orgUserId;
    /**
     * 회사 id
     */
    private String cmpnId;
    /**
     * delete yn
     */
    private String delYn;
    /**
     * tap miss yn
     */
    private String tapMissConfYn;
    /**
     * ip
     */
    private String userIp;
    
    

}
