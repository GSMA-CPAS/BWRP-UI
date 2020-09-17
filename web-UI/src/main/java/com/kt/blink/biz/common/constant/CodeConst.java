package com.kt.blink.biz.common.constant;

/**
 * Common Code Constant Class
 */
public class CodeConst {

    /************************************
     *                                  *
     *    Common Code Group Code        *
     *                                  *
     ************************************/
    
    /** Group Id : RSA **/
    public static final String RSA_GRPID = "RSA";
    
    /** Group Id : ContType : Contract Type **/
    public static final String CONT_TYPE_GRPID = "ContType";
    
    /** Group Id : Currency : Currency Info **/
    public static final String CURRENCY_GRPID = "Currency";
    
    /** Group Id : AutoExtendYn : Contract Auto Extention **/
    public static final String CONT_AUTO_UPD_GRPID = "ContAutoUpdYn";
    
    /** Group Id : TaxAplyTypeCd : Exclude, Include*/
    public static final String TAX_APLY_TYPE_GRPID = "TaxAplyTypeCd";
    
    /** Group Id : ExcludedCall **/
    public static final String EXCLUDE_CALL_TYPE_GRPID = "ExcludeCallType";
    
    /** Group Id : CallType **/
    public static final String CALL_TYPE_GRPID = "CallType";
    
    /** Group Id : Unit : Charging Unit **/
    public static final String UNIT_GRPID = "Unit";
    
    /** Group Id : AdditionalFeeType **/
    public static final String ADD_FEE_TYPE_GRPID = "AdditionalFeeTypeCd";
    
    /** Group Id : SpecialModel **/
    public static final String SPECIAL_MODE_GRPID = "SpecialModel";
    
    /** Group Id : SpecialCondAply **/
    public static final String THRESHOLD_TYPE_GRPID = "ThresholdType";
    
    /** Group Id : MyNetwork : Basic PLMN of User **/
    public static final String MY_NETWORK = "MyNetwork";

    /** Group Id : TapDirection **/
    public static final String TAP_DIRECTION = "TapDirection";
    
    /** Group Id : Decimal Point **/
    public static final String DCM_POINT = "DecPoint";
    
    /** Group Id : TAP File Search Date Condition **/
    public static final String TAP_FILE_SRCH_DT_COND = "TapFileSrchDtCond";
    
    /** Group Id : TAP Detail Search Date Condition **/
    public static final String TAP_DETAIL_SRCH_DT_COND = "TapDetailSrchDtCond";
    
    /** Group Id : TAP File Processed Status **/
    public static final String TAP_FILE_TRT_STTUS = "TapFileTrtSttus";
    
    /** Group Id : Sales Search Disply Unit **/
    public static final String SALES_UNIT = "SalesUnit";
    
    /** Group Id : Tap Search Range **/
    public static final String SEARCH_RANGE = "SearchRange";
    
    /** Group Id : Test YN **/
    public static final String TEST_YN = "testYn";
    
    
    
    /************************************
     *                                  *
     *    Common Code Group Sub Code    *
     *                                  *
     ************************************/
    
    /** Contract Direction : IB **/
    public static final String INBOUND = "IB";
    
    /** Contract Direction : OB **/
    public static final String OUTBOUND = "OB";
    
    /** Contract Status Code : Working [WRK] **/
    public static final String WORKING = "WRK";
    
    /** Contract Status Code : Draft [DRF] **/
    public static final String DRAFT = "DRF";
    
    /** Contract Status Code : Agreed [AGR] **/
    public static final String AGREED = "AGR";
    
    /** Contract Status Code : Disagreed [DCL] **/
    public static final String DISAGREED = "DCL";
    
    /** Contract Master Id middle name : MST **/
    public static final String CONT_MASTER_ID = "MST";
    
    /** Contract Detail Id middle name : DTL **/
    public static final String CONT_DTL_ID = "DTL";
    
    /** Contract basTarif Id middle name : BAS **/
    public static final String CONT_BAS_ID = "BAS";
    
    /** Contract spclTarif Id middle name : SPCL **/
    public static final String CONT_SPCL_ID = "SPCL";
    
    /** Decimal Precision for List **/
    public static final String DCM_PRCSN_LIST = "PNT";
    
    /** Decimal Precision for Detail **/
    public static final String DCM_PRCSN_DTL = "PNTD";
    
    /** General Board **/
    public static final String GENERAL_BOARD = "BOARD";
    
    /** Notice Board **/
    public static final String NOTICE_BOARD = "NOTICE";
    
    /** TAP File Search Condition : search by create date [CRTDT] **/
    public static final String SEARCH_BY_CRTDT = "CRTDT";
    
    /** TAP File Search Condition : search by processed date [TRTDT] **/
    public static final String SEARCH_BY_TRTDT = "TRTDT";
    
    /** TAP File Processed Status cd : Waiting[W] **/
    public static final String TRT_WAITING = "W";
    
    /** TAP File Processed Status cd : Processing Completed[S] **/
    public static final String TRT_SUCCESS = "S";
    
    /** TAP File Processed Status cd : Transfer Completed[C] **/
    public static final String TRT_COMPLETE = "C";
    
    /** TAP File Processed Status cd : Processing Failed[E] **/
    public static final String TRT_ERROR = "E";
    
    /** Sale Display Unit : Amount **/
    public static final String SALES_UNIT_AMOUNT = "Amount";
    
    /** Sale Display Unit : Count **/
    public static final String SALES_UNIT_COUNT = "Count";
    
    /** Sale Display Unit : Volume **/
    public static final String SALES_UNIT_VOLUME = "Volume";
    
    /** Sale Display Unit : MISI **/
    public static final String SALES_UNIT_IMSI = "IMSI";
    
    /** Call Type : ASVC (All Service) **/
    public static final String CALL_TYPE_ASVC = "ASVC";
    
    /** Currency : Default Currency (SDR) **/
    public static final String CURRENCY_SDR = "SDR";
    
    /** Tap Search Range : Range **/
    public static final String RANGE = "Range";
    
    /** TEST YN : Allow Past Contract **/
    public static final String ALLOW_PAST_CONT = "ALLOW_PAST_CONT";
    
    private CodeConst() {
        throw new IllegalStateException("Non-instantiable Constant Class");
    }
    
}
