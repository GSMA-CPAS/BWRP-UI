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
 * DataTables Order
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order implements Serializable {
    
    private static final long serialVersionUID = -6651856581513641339L;

    /**
     * Column to which ordering should be applied. This is an index reference to the columns array of information that is also submitted to the server.
     */
    private Integer column;

    /**
     * Ordering direction for this column. It will be <code>asc</code> or <code>desc</code> to indicate ascending ordering or descending ordering,
     * respectively.
     */
    private String dir;
}
