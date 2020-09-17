package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * Bad Login Exception
 */
public class BadLoginException extends AuthenticationException {


    private static final long serialVersionUID = 5247904755190154321L;

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public BadLoginException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public BadLoginException(String msg, Throwable t) {
        super(msg, t);
    }

}
