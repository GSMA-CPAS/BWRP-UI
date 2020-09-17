/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.utils;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;


/**
 * Response Util
 */
@Component
public class ResponseUtil {

    
    /**
     * success response for T
     * 
     * @param <T>
     * @param t
     * @return
     */
    public <T> RestResponse restReponse(T t) {
        RestResponse restResponse = new RestResponse();
        restResponse.setData(t);
        restResponse.setOK();
        return restResponse;
    }
    
    
    /**
     * success response for List<T>
     * 
     * @param <T>
     * @param list
     * @return
     */
    public <T> RestResponse restReponse(List<T> list) {
        RestResponse restResponse = new RestResponse();
        restResponse.setData(list);
        restResponse.setOK();
        return restResponse;
    }
    
    
    /**
     * success response for Map
     * 
     * @param mapList
     * @return
     */
    public RestResponse restReponse(Map<String, Object> mapList) {
        RestResponse restResponse = new RestResponse();
        restResponse.setData(mapList);
        restResponse.setOK();
        return restResponse;
    }
    
    
    /**
     * fail response for fail message
     * @param message
     * @return
     */
    public RestResponse restFailReponse(String message) {
        RestResponse restResponse = new RestResponse();
        restResponse.setNG();
        restResponse.setMessage(message);
        return restResponse;
    }
    
    
    /**
     * set datatable result
     * 
     * @param <T>
     * @param totalCount
     * @param draw
     * @param list
     * @return
     */
    public <T> DataTablesResponse<T> dataTablesResponse(Long totalCount, Integer draw, List<T> list) {
        DataTablesResponse<T> dataTablesResponse = new DataTablesResponse<>();
        dataTablesResponse.setDraw(draw);
        dataTablesResponse.setRecordsTotal(totalCount);
        dataTablesResponse.setRecordsFiltered(totalCount);
        dataTablesResponse.setData(list);
        return dataTablesResponse;
    }
    
}
