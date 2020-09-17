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

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.common.collect.Lists;

import lombok.Data;

/**
 * DataTables DataTablesResponse
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataTablesResponse<T> {
    
    /**
     * The draw counter that this object is a response to - from the draw parameter sent as part of the data request. Note that it is strongly recommended for
     * security reasons that you cast this parameter to an integer, rather than simply echoing back to the client what it sent in the draw parameter, in order
     * to prevent Cross Site Scripting (XSS) attacks.
     */
    private Integer draw;

    /**
     * Total records, before filtering (i.e. the total number of records in the database)
     * <p/>
     * (NB: I changed this to Long)
     */
    private Long recordsTotal;

    /**
     * Total records, after filtering (i.e. the total number of records after filtering has been applied - not just the number of records being returned for this
     * page of data).
     * <p/>
     * (NB: I changed this to Long)
     */
    private Long recordsFiltered;

    /**
     * Optional: If an error occurs during the running of the server-side processing script, you can inform the user of this error by passing back the error message
     * to be displayed using this parameter. Do not include if there is no error.
     */
    private String error;

    /**
     * The data to be displayed in the table. This is an array of data source objects, one for each row, which will be used by DataTables. Note that this parameter's
     * name can be changed using the ajax option's dataSrc property.
     */
    //private List<T> data = Lists.newArrayList();
    private List<T> data = null;
    
}
