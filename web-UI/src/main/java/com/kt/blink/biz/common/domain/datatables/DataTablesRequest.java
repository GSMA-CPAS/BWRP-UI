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
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * DataTables DataTablesRequest
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataTablesRequest implements Serializable {
    
    private static final long serialVersionUID = 4262329657124504431L;

    /**
     * Draw counter. This is used by DataTables to ensure that the Ajax returns from server-side processing requests are drawn in sequence by DataTables
     * (Ajax requests are asynchronous and thus can return out of sequence). This is used as part of the draw return parameter (see below).
     */
    private Integer draw;

    /**
     * Paging first record indicator. This is the start point in the current data set (0 index based - i.e. 0 is the first record).
     */
    private Integer start;

    /**
     * Number of records that the table can display in the current draw. It is expected that the number of records returned will be equal to this number, unless
     * the server has fewer records to return. Note that this can be -1 to indicate that all records should be returned (although that negates any benefits of
     * server-side processing!)
     */
    private Integer length;

    /**
     * @see Search
     */
    private Search search;

    /**
     * @see Order
     */
    @JsonProperty("order")
    private List<Order> orders;

    /**
     * @see Column
     */
    private List<Column> columns;
    
    /**
     * Generated Order Sequal By columns and orders
     */
    private String orderSequel;
    
}
