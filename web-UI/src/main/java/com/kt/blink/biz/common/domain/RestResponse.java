/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.domain;

import java.io.Serializable;

import lombok.EqualsAndHashCode;
import lombok.ToString;


/**
 * RestResponse
 */
@ToString @EqualsAndHashCode
public class RestResponse implements Serializable {

    private static final long serialVersionUID = -4569796669456757759L;

  /**
    * Request Success
    */
    public static final String OK = "OK";

   /**
    * Request Failure
    */
    public static final String NG = "NG";
    
    private String rtnCode = "OK"; // default value is OK

    private String message;
    
    private Object data;
    
    private String throwType;

    public void setOK() {
        this.setRtnCode(OK);
    }

    public void setNG() {
        this.setRtnCode(NG);
    }
    
    public String getRtnCode() {
        return rtnCode;
    }

    private void setRtnCode(String rtnCode) {
        this.rtnCode = rtnCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getThrowType() {
        return throwType;
    }

    public void setThrowType(String throwType) {
        this.throwType = throwType;
    }

 
}
