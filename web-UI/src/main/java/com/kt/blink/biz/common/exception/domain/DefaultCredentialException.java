package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * New User Exception Or Rest Password User Exception
 */
public class DefaultCredentialException extends AuthenticationException {
    
    private static final long serialVersionUID = 5792127158879206884L;

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public DefaultCredentialException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public DefaultCredentialException(String msg, Throwable t) {
        super(msg, t);
    }

}
