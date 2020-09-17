/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.finance.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sales Data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinanceSalesDomain {
    
    /**
     * year
     */
    private String name;
    
    
    /**
     * month sales
     */
    private Double[] data;
    
    

}
