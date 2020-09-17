/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.user.domain;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * User
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class User extends BaseDomain {

	private static final long serialVersionUID = -7819494999045956801L;

	/**
     * userId or email
     */
    private String username;

    /**
     * password
     */
    private String password;
    
    /**
     * user role : 0 -> USER, 1 -> ADMIN
     */
    private Integer role;
    
    /**
     * button role
     * 0 : ADMIN
     * 1 : VIEW
     * 2 : DCH
     * 3 : FCH
     * 4 : DCH+FCH
     */
    private Integer btnRole;
    
    /**
     * First name
     */
    private String firstname;
    
    /**
     * Last name
     */
    private String lastname;
    
    /**
     * Full Name
     */
    private String fullname;
    
    /**
     * User Prefer Currency
     */
    private String userPreferCur;
    
    /**
     * company name
     */
    private String company;
    
    /**
     * PLMNS
     */
    private List<String> plmns;
    
    /**
     * credential reset
     */
    private Boolean tempPwdIssYn;
    
    /**
     * login trial count
     */
    private Integer loginFailTmscnt;
    
    /**
     * User Photo
     */
    private MultipartFile imgFile;
    
    /**
     * User Image Byte[]
     */
    private byte[] userImg;
    
    /**
     * cmpn id
     */
    private String cmpnId;
    

}
