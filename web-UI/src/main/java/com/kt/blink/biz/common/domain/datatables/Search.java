/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.domain.datatables;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

/**
 * DataTables Search
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Search implements Serializable {
    
    private static final long serialVersionUID = -1907100259556480909L;

    /**
     * Global search value. To be applied to all columns which have searchable as true.
     */
    private String value;

    /**
     * <code>true</code> if the global filter should be treated as a regular expression for advanced searching, false otherwise. Note that normally server-side
     * processing scripts will not perform regular expression searching for performance reasons on large data sets, but it is technically possible and at the
     * discretion of your script.
     */
    private Boolean regex;
}
