package com.kt.blink.biz.common.exception.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * InfraServiceException
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class InfraServiceException extends RuntimeException {
    
    private static final long serialVersionUID = 2296009300862493562L;
    
    private ErrorCode errorCode;

    public InfraServiceException() {
        super();
    }

    public InfraServiceException(String message) {
        super(message);
    }

    public InfraServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public InfraServiceException(String message, ErrorCode errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}
