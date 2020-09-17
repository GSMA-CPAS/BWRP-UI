/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cntry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.admin.cntry.domain.CntryDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

@Mapper
@Repository
public interface CntryMapper {
    
    /**
     * get cntrys
     * @param cntry
     * @return
     */
    List<CntryDomain> getCntryList(@Param("cntry") CntryDomain cntry);
    
    /**
     * retrieve cntry list
     * @param dataTablesRequest
     * @return
     */
    List<CntryDomain> retrieveCntryList(DataTablesRequest dataTablesRequest);
    
    /**
     * dup check cntry
     * @param cntry
     * @return
     */
    CntryDomain dupCheckCntry(@Param("cntry") CntryDomain cntry);
    
    /**
     * insert cntry
     * @param cntry
     * @return
     */
    Integer insertCntry(@Param("cntry") CntryDomain cntry);
    
    /**
     * update cntry
     * @param cntry
     * @return
     */
    Integer updateCntry(@Param("cntry") CntryDomain cntry);
    

    /**
     * delete cntry
     * @param cntry
     * @return
     */
    Integer deleteCntry(@Param("cntry") CntryDomain cntry);
    
}
