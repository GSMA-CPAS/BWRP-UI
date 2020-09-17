package com.kt.blink.biz.dch.tap.domain;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * inquiry TAP list details
 * 
 * @author Lee Yu Pyeong
 */
@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TapDetailDomain extends BaseDomain {

    private static final long serialVersionUID = -1233549838581851018L;
    
    /**
     * Search Start Date
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    private String startDateStr;
    private String startDateStr2;
    
    /**
     * Search End Date
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
    private String endDateStr;
    private String endDateStr2;
    
    /** applied currency **/
    private String currency;

    // TAP file name(roam_file_nm)
    private String roamFileNm;

    // call start time(local_time)
    private String localTime;
    
    // MyNetwork
    private String trmPlmnId;
    private List<String> trmPlmnIds;
    
    // PartnerNetwork
    private String rcvPlmnId;
    private List<String> rcvPlmnIds;
    
    /**
     * Date Range Search Conditon [CRTDT / CSTDT]
     */
    private String dateSearchCond;
    
    // HPMN
    private String hpmn;
    
    // VPMN
    private String vpmn;
    
    // tap direction
    private String tapDirection;

    // file order number
    private String recdNo;

    private String imsiId;

    private String callType;
    private List<String> callTypes;

    // called Number
    private String calledNo;

    private Integer volumn;

    private String unit;
    
    private String fileCretDtVal;

    // Charge(straight)
    private Double charge;

    // Sett Charge(commitment)
    private Double setlCharge;
    
    // Sum of Charge
    private Double sumCharge;
    
    // Sum of SetlCharge
    private Double sumSetlCharge;
    
    // buttonSearch
    private String btnSearch;
    
    // totalCount
    private Long preTotal;
    
    /**
     * DataTables
     */
    private DataTablesRequest dataTablesRequest;
    
}
