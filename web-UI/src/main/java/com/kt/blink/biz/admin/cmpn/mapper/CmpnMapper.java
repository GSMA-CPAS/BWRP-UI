/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cmpn.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.admin.cmpn.domain.BankDomain;
import com.kt.blink.biz.admin.cmpn.domain.CmpnDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

@Mapper
@Repository
public interface CmpnMapper {

    /**
     * 
     * @param dataTablesRequest
     * @return
     */
    List<CmpnDomain> retrieveCmpnList(DataTablesRequest dataTablesRequest);

    /**
     * insert cmpn
     * @param cmpn
     * @return
     */
    Integer insertCmpn(CmpnDomain cmpn);
    /**
     * insert Bank infos
     * @param bank
     * @return
     */
    Integer insertBank(@Param("bank") BankDomain bank);
    /**
     * update company info
     * @param cmpn
     * @return
     */
    Integer updateCmpn(@Param("cmpn") CmpnDomain cmpn);    
    /**
     * update bank info
     * @param bank
     * @return
     */
    Integer updateBank(@Param("bank") BankDomain bank);
    /**
     * delete comany
     * @param cmpn
     * @return
     */
    Integer deleteCmpn(@Param("cmpn") CmpnDomain cmpn);
    /**
     * delete bank
     * @param bank
     * @return
     */
    Integer deleteBank(@Param("bank") BankDomain bank);
    /**
     * find company info
     * @param cmpn
     * @return
     */
    CmpnDomain findCmpnInfo(@Param("cmpn") CmpnDomain cmpn);
    /**
     * find bank infos
     * @param cmpn
     * @return
     */
    List<BankDomain> findBankInfo(@Param("cmpn") CmpnDomain cmpn);
    /**
     * get company list
     * @param cmpn
     * @return
     */
    List<CmpnDomain> getCmpnList(@Param("cmpn") CmpnDomain cmpn);
    
}
