package com.kt.blink.biz.dch.contract.domain;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ApiContMstrDomain implements Serializable {

    private static final long serialVersionUID = -3140332815061801196L;

	@JsonProperty("CONT_ID")
    private String contId;
    
    @JsonProperty("CONT_TYPE_CD")
    private String contTypeCd;
    
    @JsonProperty("CONT_MEMO")
    private String contMemo;
    
    @JsonProperty("CONTR_ID")
    private String contrId;
    
    @JsonProperty("HPMN")
    private List<ApiContPlmnDomain> hpmn;
    
    @JsonProperty("VPMN")
    private List<ApiContPlmnDomain> vpmn;
    
    @JsonProperty("ContDtl")
    private ApiContDtlDomain contDtl;
    
}
