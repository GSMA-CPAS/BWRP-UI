/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.erate.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.admin.erate.domain.ErateDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

@Mapper
@Repository
public interface ErateMapper {

    /**
     * 
     * @param dataTablesRequest
     * @return
     */
    List<ErateDomain> retrieveErateList(DataTablesRequest dataTablesRequest);

    /**
     * get Period M, M+1
     * @return
     */
    List<ErateDomain> getTgtMons();
    
    /**
     * periods list
     * @return
     */
    List<ErateDomain> getPeriods();
    
    /**
     * insert erate
     * @param erate
     * @return
     */
    Integer insertErate(@Param("erate") ErateDomain erate);
    /**
     * update etate
     * @param erate
     * @return
     */
    Integer updateErate(@Param("erate") ErateDomain erate);
    /**
     * delete erate
     * @param erate
     * @return
     */
    Integer deleteErate(@Param("erate") ErateDomain erate);
    /**
     * hst insert
     * @param erate
     * @return
     */
    Integer insertErateHst(@Param("erate") ErateDomain erate);
    /**
     * erate detail
     * @param erate
     * @return
     */
    ErateDomain findErateInfo(@Param("erate") ErateDomain erate);
    /**
     * dup check erate
     * @param erate
     * @return
     */
    ErateDomain dupCheckErate(@Param("erate") ErateDomain erate);
}
