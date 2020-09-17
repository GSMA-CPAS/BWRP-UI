/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.plmn.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

@Mapper
@Repository
public interface PlmnsMapper {

    /**
     * 
     * @param dataTablesRequest
     * @return
     */
    List<PlmnsDomain> retrievePlmnList(DataTablesRequest dataTablesRequest);

    /**
     * insert plmn
     * @param plmn
     * @return
     */
    Integer insertPlmn(@Param("plmn") PlmnsDomain plmn);
    /**
     * update Plmn
     * @param plmn
     * @return
     */
    Integer updatePlmn(@Param("plmn") PlmnsDomain plmn);
    /**
     * delete plmn
     * @param plmn
     * @return
     */
    Integer deletePlmn(@Param("plmn") PlmnsDomain plmn);
    /**
     * find plmn detail
     * @param plmn
     * @return
     */
    PlmnsDomain findPlmnInfo(@Param("plmn") PlmnsDomain plmn);
    /**
     * dup check plmn
     * @param plmn
     * @return
     */
    PlmnsDomain dupCheckPlmn(@Param("plmn") PlmnsDomain plmn);
    
    /**
     * partner plmns
     * @return
     */
    List<PlmnsDomain> getPartnerPlmns(@Param("plmn") PlmnsDomain plmn);
}
