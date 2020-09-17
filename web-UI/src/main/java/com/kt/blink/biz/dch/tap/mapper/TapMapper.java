/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.tap.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.dch.tap.domain.TapDetailDomain;
import com.kt.blink.biz.dch.tap.domain.TapFileDomain;
import com.kt.blink.biz.dch.tap.domain.TapListDomain;

/**
 * Tap Query Mapper
 * 
 * @author Lee Yu Pyeong
 */
@Mapper
@Repository
public interface TapMapper {
    
    /**
     * inquiry TAP List
     * 
     * @param tapListDomain
     * @return
     */
    List<TapListDomain> findTapList(TapListDomain tapListDomain);
    
    
    /**
     * set work_mem 1GB
     */
    void setWorkMemTapDetail();
    
    
    /**
     * reset work_mem
     */
    void resetWorkMemTapDetail();
    
    
    /**
     * inquiry TAP Detail
     * 
     * @param tapDetailDomain
     * @return
     */
    List<TapDetailDomain> findTapDetail(TapDetailDomain tapDetailDomain);
    
    
    /**
     * inquiry TAP Detail Total
     * 
     * @param tapDetailDomain
     * @return
     */
    Long findTapDetailTotal(TapDetailDomain tapDetailDomain);
    
    
    /**
     * inquiry TAP Detail Charge Sum 
     * 
     * @param tapDetailDomain
     * @return
     */
    TapDetailDomain findTapDetailChargeSum(TapDetailDomain tapDetailDomain);
    
    
    /**
     * inquiry TAP File 
     * 
     * @param tapFileDomain
     * @return
     */
    List<TapFileDomain> findTapFile(TapFileDomain tapFileDomain);

    /**
     * inquiry Tap File Status Total 
     * 
     * @param tapFileDomain
     * @return
     */
    TapFileDomain findTapFileStatusTotal(TapFileDomain tapFileDomain);
    
    

}
