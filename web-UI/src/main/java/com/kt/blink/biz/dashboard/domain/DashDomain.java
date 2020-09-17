package com.kt.blink.biz.dashboard.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kt.blink.biz.common.domain.BaseDomain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DashDomain extends BaseDomain {

    /**
     * 
     */
    private static final long serialVersionUID = 9026260090389972793L;
    /**
     * sender plmn id
     */
    private String trmPlmnId;
    /**
     * receiver plmn id
     */
    private String rcvPlmnId;
    
    /**
     * max settlement month
     */
    private String maxSetlDay;
    /**
     * min settlement month
     */
    private String minSetlDay;
    /**
     * current date
     */
    private String curDay;
    
    /**
     * tap last update
     */
    private String lastTapHhmm;

    /**
     * sales
     */
    private String dataAmt;

    /**
     * sales
     */
    private String voiceAmt;
    /**
     * sales
     */
    private String smsAmt;

    /**
     * currency code
     */
    private String curCd;


    /**
     * DATA usage
     */
    private String dataQnt;
        
    /**
     * Voice usage
     */
    private String voiceQnt;

    /**
     * SMS usage
     */
    private String smsQnt;
    /**
     * expense amount
     */
    private String exepnseAmt;
    /**
     * revenue amount
     */
    private String revenueAmt;
    /**
     * commitment amt
     */
    private String commitAmt;
    /**
     * 
     */
    private String sumAmt;
    /**
     * percent
     */
    private String lastPercnt;
    /**
     * balance
     */
    private String lastCommitAmt;
    /**
     * %
     */
    private String rangePercnt;
    /**
     * amt per period
     */
    private String rangeCommitAmt;
    
    /**
     * my mentworks
     */
    private List<String> myNets;
    /**
     * percent
     */
    private String percnt;

    /**
     * invoice direction
     */
    private String invocDirectCd;
    /**
     * sum commit amt
     */
    private String curCommitAmt;
    /**
     * cont dtl id
     */
    private String contDtlId;
    /**
     * test
     */
    private String testYn;
    /**
     * title
     */
    private String dataTitle;
    /**
     * decimal
     */
    private String precision;
    /**
     * data percnt
     */
    private String dataPercnt;
    /**
     * voice percnt
     */
    private String voicePercnt;
    /**
     * sms percnt
     */
    private String smsPercnt;
    /**
     * comp amt
     */
    private String compAmt;
    /**
     * partner nets
     */
    private List<String> partNets;
    
}
