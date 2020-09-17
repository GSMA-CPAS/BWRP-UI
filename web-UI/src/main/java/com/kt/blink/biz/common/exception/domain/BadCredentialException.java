package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * Bad Credential Exception
 */
public class BadCredentialException extends AuthenticationException {

    private static final long serialVersionUID = -6619114177769744748L;

	/**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public BadCredentialException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public BadCredentialException(String msg, Throwable t) {
        super(msg, t);
    }

}
