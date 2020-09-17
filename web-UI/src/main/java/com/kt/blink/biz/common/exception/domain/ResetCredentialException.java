package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * Reset Captcha Exception
 */
public class ResetCredentialException extends AuthenticationException {

    private static final long serialVersionUID = -1575512925913639868L;

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public ResetCredentialException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BadCaptchaException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public ResetCredentialException(String msg, Throwable t) {
        super(msg, t);
    }

}
