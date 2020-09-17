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

import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.Order;

import lombok.extern.slf4j.Slf4j;

/**
 * Common Util
 */
@Slf4j
@Component
public class DataTablesUtil {

    /**
     * Map jQuery DataTables To PostgreSQL
     * @param dataTablesRequest
     * @return
     */
    public DataTablesRequest mapPostgreSQL(DataTablesRequest dataTablesRequest) {
        String orderSequel = this.generateColumnsOrderSequel(dataTablesRequest);
        dataTablesRequest.setOrderSequel(orderSequel);
        List<Column> columns = this.pojoMembersToDatabaseColumns(dataTablesRequest);
        dataTablesRequest.setColumns(columns);
        dataTablesRequest.getColumns().stream().forEach(c-> log.info("[SQL]==========>{}", c.getName()));
        return dataTablesRequest;
    }
    
    
    /**
     * Create Ordering SQL Fragment From Datatables (SNAKE CASE)
     * @param dataTablesRequest
     * @return
     */
    public String generateColumnsOrderSequel(DataTablesRequest dataTablesRequest) {
        
        List<Order> orders = dataTablesRequest.getOrders();
        if (orders.isEmpty()) {
            return StringUtils.EMPTY;
        }
        
        List<Column> columns = dataTablesRequest.getColumns();
        StringBuilder orderSequel = new StringBuilder();
        
        for (int i = 0; i < orders.size(); i++) {
            
            for (int j = 0; j < columns.size(); j++) {
                
                Integer colIdx = orders.get(i).getColumn();
                String dir = orders.get(i).getDir();
                
                if (j == colIdx) {
                    
                    if (i == orders.size() - 1) {
                        orderSequel.append(this.camelToSnake(columns.get(j).getData()))
                        .append(CharConst.SPACE).append(StringUtils.upperCase(dir));
                    } else {
                        orderSequel.append(this.camelToSnake(columns.get(j).getData()))
                        .append(CharConst.SPACE).append(StringUtils.upperCase(dir))
                        .append(CharConst.COMMA).append(CharConst.SPACE);
                    }
                }
                
            }
            
        }
        
        return orderSequel.toString();
        
    }
    
    
    /**
     * Map jQuery DataTables To PostgreSQL
     * @param dataTablesRequest
     * @return
     */
    public DataTablesRequest mapPostgreSQLCamelCase(DataTablesRequest dataTablesRequest) {
        String orderSequel = this.generateColumnsOrderSequelCamelCase(dataTablesRequest);
        dataTablesRequest.setOrderSequel(orderSequel);
        List<Column> columns = this.pojoMembersToDatabaseColumns(dataTablesRequest);
        dataTablesRequest.setColumns(columns);
        dataTablesRequest.getColumns().stream().forEach(c-> log.info("[SQL]==========>{}", c.getName()));
        return dataTablesRequest;
    }
    
    
    /**
     * Create Ordering SQL Fragment From Datatables (CAMEL CASE)
     * @param dataTablesRequest
     * @return
     */
    public String generateColumnsOrderSequelCamelCase(DataTablesRequest dataTablesRequest) {
        
        List<Order> orders = dataTablesRequest.getOrders();
        if (orders.isEmpty()) {
            return StringUtils.EMPTY;
        }
        
        List<Column> columns = dataTablesRequest.getColumns();
        StringBuilder orderSequel = new StringBuilder();
        
        for (int i = 0; i < orders.size(); i++) {
            
            for (int j = 0; j < columns.size(); j++) {
                
                Integer colIdx = orders.get(i).getColumn();
                String dir = orders.get(i).getDir();
                
                if (j == colIdx) {
                    
                    if (i == orders.size() - 1) {
                        orderSequel.append(columns.get(j).getData())
                        .append(CharConst.SPACE).append(StringUtils.upperCase(dir));
                    } else {
                        orderSequel.append(columns.get(j).getData())
                        .append(CharConst.SPACE).append(StringUtils.upperCase(dir))
                        .append(CharConst.COMMA).append(CharConst.SPACE);
                    }
                }
                
            }
            
        }
        
        return orderSequel.toString();
        
    }
    
    
    /**
     * Convert Pojo Member Fields to Database Columns
     * @param columns
     * @return
     */
    public List<Column> pojoMembersToDatabaseColumns(DataTablesRequest dataTablesRequest) {
        List<Column> columns = dataTablesRequest.getColumns();
        columns.stream().filter(c -> !StringUtils.isEmpty(c.getData()))
        .forEach(c -> c.setName(this.camelToSnake(c.getData())));
        return columns;
    }
    
    
    /**
     * Convert Camel Case String To Underscore Case String
     * @param str
     * @return
     */
    public String camelToSnake(String str) {
        String regex = "([a-z])([A-Z])";
        String replacement = "$1_$2";
        //return str.replaceAll(regex, replacement).toUpperCase();
        return str.replaceAll(regex, replacement).toLowerCase();
    }
    
    
    /**
     * Query Without Pagination
     * @param dataTablesRequest
     * @return
     */
    public DataTablesRequest withoutPagination(DataTablesRequest dataTablesRequest) {
        DataTablesRequest newDataTables = SerializationUtils.clone(dataTablesRequest);
        newDataTables.setStart(AppConst.NO_PAGINATION);
        return newDataTables;
    }
    
    
    /**
     * Query Without Condition
     * @param dataTablesRequest
     * @return
     */
    public DataTablesRequest withoutAnyCondition(DataTablesRequest dataTablesRequest) {
        DataTablesRequest newDataTables = SerializationUtils.clone(dataTablesRequest);
        newDataTables.getColumns().stream().forEach( c-> c.getSearch().setValue(StringUtils.EMPTY));
        newDataTables.setStart(AppConst.NO_PAGINATION);
        newDataTables.setOrderSequel(StringUtils.EMPTY);
        return newDataTables;
    }
    
    
}
