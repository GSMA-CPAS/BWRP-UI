package com.kt.blink.biz.board.domain;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Board Domain
 */
@Data
@JsonIgnoreProperties(ignoreUnknown=true)
@EqualsAndHashCode(callSuper=false)
public class BoardDomain extends BaseDomain {
    
    private static final long serialVersionUID = -3403644915639047410L;
    
    /**
     * seq
     */
    private Integer bbsId;
    
    /**
     * bbs type code [BOARD,NOTICE]
     */
    private String bbsTypeCd;
    
    /**
     * bbs title
     */
    private String bbsTitle;
    
    /**
     * bbs content 
     */
    private String bbsContent;
    
    /**
     * bbs author
     */
    private String bbsAuthor;
    
    /**
     * bbs hit
     */
    private Integer bbsHit;
    
    /**
     * original filename
     */
    private String originFileNm;

    /**
     * attache filename
     */
    private String storeFileNm;
    
    /**
     * attach file
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private MultipartFile attachFile;
    
    /**
     * Search Type [All, Title, Content]
     */
    private String searchType;
    
    /**
     * Search Keyword
     */
    private String searchKeyword;
    
    /**
     * DataTables
     */
    private DataTablesRequest dataTablesRequest;
    
}
