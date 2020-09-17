/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.invoice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown=true)
public class InvUser extends BaseDomain {

	private static final long serialVersionUID = -7819494999045956801L;
	
	/**
	 * fax no
	 */
	private String faxNo;
	/**
	 * tel no
	 */
	private String TelNo;
	/**
	 * user id
	 */
	private String userId;
	/**
	 * first name
	 */
	private String firstNm;
	/**
	 * last name
	 */
	private String lastNm;
    

}
