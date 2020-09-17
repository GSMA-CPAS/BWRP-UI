/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.todo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TodoDomain extends BaseDomain {

    /**
     * 
     */
    private static final long serialVersionUID = 5070461300593475895L;
    /**
     * todo id
     */
    private String todoId;
    /**
     * todo type
     */
    private String todoTypeCd;
    /**
     * todo type nm
     */ 
    private String todoTypeCdNm;
    /**
     * title
     */
    private String todoTitleNm;
    /**
     * status
     */
    private String todoStat;
    /**
     * todo 
     */
    private String todoSbst;
    /**
     * creation date
     */
    private String creDate;
    /**
     * row number
     */
    private String rno;
    /**
     * miss name
     */
    private String miss;

    /**
     * miss name
     */
    private String missTrm;

    /**
     * miss name
     */
    private String missRcv;
    
    /**
     * unchecked todo count
     */
    private Integer todoCount;

    /**
     * datatables
     */
    private DataTablesRequest dataTablesRequest;
    
}
