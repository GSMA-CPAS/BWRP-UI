package com.kt.blink.biz.common.domain;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ApiResponse implements Serializable {

    private static final long serialVersionUID = 1706296752729051835L;

    private String resCd;
    
    private String resMsg;
    
}
