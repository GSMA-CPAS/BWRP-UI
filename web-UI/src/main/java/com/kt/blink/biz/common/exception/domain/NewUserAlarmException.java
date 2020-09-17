package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * New User Alaram Exception
 */
public class NewUserAlarmException extends AuthenticationException {
    
    private static final long serialVersionUID = 8947554499125781757L;

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public NewUserAlarmException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public NewUserAlarmException(String msg, Throwable t) {
        super(msg, t);
    }

}
