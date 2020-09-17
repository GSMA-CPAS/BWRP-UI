package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * BadCaptcha Exception
 */
public class BadCaptchaException extends AuthenticationException {

    private static final long serialVersionUID = -6771235559377899131L;

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public BadCaptchaException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public BadCaptchaException(String msg, Throwable t) {
        super(msg, t);
    }

}
