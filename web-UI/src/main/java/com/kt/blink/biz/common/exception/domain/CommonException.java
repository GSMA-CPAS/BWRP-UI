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

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CommonException
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CommonException extends RuntimeException {

    private static final long serialVersionUID = 5705310011954527168L;
    private ErrorCode errorCode;

    public CommonException() {
        super();
    }

    public CommonException(String message) {
        super(message);
    }
    
    public CommonException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public CommonException(String message, Throwable cause) {
        super(message, cause);
    }

    public CommonException(String message, ErrorCode errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

}