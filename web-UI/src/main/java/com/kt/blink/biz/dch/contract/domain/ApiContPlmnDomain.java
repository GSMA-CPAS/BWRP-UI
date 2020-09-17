package com.kt.blink.biz.dch.contract.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ApiContPlmnDomain {

    @JsonProperty("PLMN_ID")
    private String plmnId;

}
