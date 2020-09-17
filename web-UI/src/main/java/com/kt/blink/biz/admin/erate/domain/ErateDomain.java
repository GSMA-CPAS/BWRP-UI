/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.erate.domain;

import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class ErateDomain extends BaseDomain {
    /**
     * 
     */
    private static final long serialVersionUID = -1529384646943066877L;
    private String baseIsocuCd;
    private String tgtIsocuCd;
    private String tgtMon;
    private String tgtViewMon;
    private String baseDay;
    private String baseViewDay;
    private String erateVal;
    private String erateOldVal;
    private String edit;
    private String stat;
    private String tgtIsocuCdView;
    
    private Long erateCnt;
}
