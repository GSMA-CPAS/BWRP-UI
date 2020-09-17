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
 * DataTables Column
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Column implements Serializable {
    
    private static final long serialVersionUID = -7664254082840681118L;

    /**
     * Column's data source, as defined by columns.data.
     */
    private String data;

    /**
     * Column's name, as defined by columns.name.
     */
    private String name;

    /**
     * Flag to indicate if this column is searchable (true) or not (false). This is controlled by columns.searchable.
     */
    private Boolean searchable;


    /**
     * Flag to indicate if this column is orderable (true) or not (false). This is controlled by columns.orderable.
     */
    private Boolean orderable;

    /**
     * Search value to apply to this specific column.
     */
    private Search search;

    /**
     * Flag to indicate if the search term for this column should be treated as regular expression (true) or not (false). As with global search, normally
     * server-side processing scripts will not perform regular expression searching for performance reasons on large data sets, but it is technically possible
     * and at the discretion of your script.
     */
    private Boolean regex;
}
