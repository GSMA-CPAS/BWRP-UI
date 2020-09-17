package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * Captcha Create Exception
 */
public class CaptchaCreateException extends AuthenticationException {

    private static final long serialVersionUID = -7437369964118923694L;

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public CaptchaCreateException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public CaptchaCreateException(String msg, Throwable t) {
        super(msg, t);
    }

}
