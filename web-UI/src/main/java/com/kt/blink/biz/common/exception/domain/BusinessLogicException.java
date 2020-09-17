package com.kt.blink.biz.common.exception.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * BusinessLogicException
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BusinessLogicException extends RuntimeException {

    private static final long serialVersionUID = 879843829401410251L;
    private ErrorCode errorCode;

    public BusinessLogicException() {
        super();
    }

    public BusinessLogicException(String message) {
        super(message);
    }
    
    public BusinessLogicException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessLogicException(String message, ErrorCode errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}
