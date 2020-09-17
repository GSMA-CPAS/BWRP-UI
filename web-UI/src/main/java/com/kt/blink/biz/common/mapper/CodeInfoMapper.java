/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.common.domain.CodeInfo;

/**
 * Common Code Query Mapper
 */
@Repository
@Mapper
public interface CodeInfoMapper {

    /**
     * find specific code by code id and code group id
     * 
     * @param cdId (child)
     * @param cdGroupId (parent)
     * @return
     */
    CodeInfo findCodeByCdIdAndCdGrpId(@Param("cdId") String cdId, @Param("cdGroupId") String cdGroupId);
    
    
    /**
     * find code list by code group id
     * 
     * @param cdGroupId
     * @return
     */
    List<CodeInfo> findCodesByCdGrpId(@Param("cdGroupId") String cdGroupId);
    
    
    /**
     * insert new code group
     * 
     * @param codeInfo
     * @return
     */
    Integer saveCodeGroup(CodeInfo codeInfo);
    
    
    /**
     * insert new code
     * 
     * @param codeInfo
     * @return
     */
    Integer saveCode(CodeInfo codeInfo);
    
    
    /**
     * find partner plmns
     * 
     * @return
     */
    List<CodeInfo> findPartnerPlmns();
    

}
