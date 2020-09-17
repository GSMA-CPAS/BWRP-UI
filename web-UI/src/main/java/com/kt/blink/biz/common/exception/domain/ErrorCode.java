/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.exception.domain;

/**
 * Error Code
 */
public enum ErrorCode {
    
    ////////////////////////////////////////////////////////////////////////
    //////////////////////// DEFAULT HTTP STATUS ///////////////////////////
    ////////////////////////////////////////////////////////////////////////
    
    REQUEST_OK(200),

    BAD_REQUEST(400),
    
    UNAUTHORIZED(401),
    
    FORBIDDEN(403),
    
    NOT_FOUND(404),
    
    METHOD_NOT_ALLOWED(405),
    
    INTERNAL_SERVER_ERROR(500),
    
    
    ////////////////////////////////////////////////////////////////////////
    //////////////////////// CUSTOM HTTP STATUS ///////////////////////////
    ////////////////////////////////////////////////////////////////////////
    
    /** 1001 : Not a general access to menu **/
    CODE_1001(1001);
    
    
    private Integer status;
    

    public Integer getCd() {
        return status;
    }
    
    private ErrorCode(Integer status) {
        this.status = status;
    }




}
