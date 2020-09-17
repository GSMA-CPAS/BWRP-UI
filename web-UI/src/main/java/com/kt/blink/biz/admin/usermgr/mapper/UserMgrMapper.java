/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.usermgr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.admin.usermgr.domain.UserMgrDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

@Mapper
@Repository
public interface UserMgrMapper {

    /**
     * retrieve user list
     * @param dataTablesRequest
     * @return
     */
    List<UserMgrDomain> retrieveUserMgrList(DataTablesRequest dataTablesRequest);
    
    /**
     * dup check user
     * @param user
     * @return
     */
    UserMgrDomain dupCheckUserMgr(@Param("user") UserMgrDomain user);
    
    /**
     * insert user
     * @param user
     * @return
     */
    Integer insertUserMgr(@Param("user") UserMgrDomain user);
    
    /**
     * update user
     * @param user
     * @return
     */
    Integer updateUserMgr(@Param("user") UserMgrDomain user);
    

    /**
     * delete user
     * @param user
     * @return
     */
    Integer deleteUserMgr(@Param("user") UserMgrDomain user);
    
    /**
     * find user detail
     * @param user
     * @return
     */
    UserMgrDomain findUserMgrInfo(@Param("user") UserMgrDomain user);
    
    
}
