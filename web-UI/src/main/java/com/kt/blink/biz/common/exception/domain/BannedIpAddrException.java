package com.kt.blink.biz.common.exception.domain;

import org.springframework.security.core.AuthenticationException;

/**
 * restricted Ip Addr Exception
 */
public class BannedIpAddrException extends AuthenticationException {

    private static final long serialVersionUID = -4624103959094485536L;

    /**
     * Constructs a <code>BannedIpAddrException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public BannedIpAddrException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>BannedIpAddrException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t root cause
     */
    public BannedIpAddrException(String msg, Throwable t) {
        super(msg, t);
    }

}
