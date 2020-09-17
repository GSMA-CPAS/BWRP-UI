/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.dashboard.domain.DashDomain;

/**
 * Dashboard Query Mapper
 */
@Mapper
@Repository
public interface DashboardMapper {
    
    /**
     * find code list by code group id
     * 
     * @param cdGroupId
     * @return
     */
    List<CodeInfo> findCompList();
    
    /**
     * inbound revenue
     * @param tap
     * @return
     */
    DashDomain getInOutboundAmt(DashDomain tap);
    /**
     * comp amt 
     * @param tap
     * @return
     */
    DashDomain getInOutboundCompAmt(DashDomain tap);
    
    /**
     * getInOutProcessed 
     * @param tap
     * @return
     */
    DashDomain getInOutProcessed(DashDomain tap);
    
    /**
     * inbound receivable
     * @param tap
     * @return
     */
    DashDomain getRecvOrPay(DashDomain tap);
    /**
     * comp amt 
     * @param tap
     * @return
     */
    DashDomain getCompRecvOrPay(DashDomain tap);
    /**
     * inbound commitment
     * @param tap
     * @return
     */
    DashDomain getInOutCommit(DashDomain tap);
    /**
     * inbound commitment revenue
     * @param tap
     * @return
     */
    DashDomain getInOutCommitAmt(DashDomain tap);
    
}
