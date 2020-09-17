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
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.dashboard.domain.MainDomain;
import com.kt.blink.biz.dashboard.domain.MainSalesDomain;

/**
 * Dashboard Query Mapper
 */
@Mapper
@Repository
public interface MainboardMapper {
    
    /**
     * inbound revenue
     * @param tap
     * @return
     */
    List<MainDomain> getMainInfo(MainDomain tap);

    List<MainSalesDomain> getSalesInfo(MainSalesDomain tap);
}
