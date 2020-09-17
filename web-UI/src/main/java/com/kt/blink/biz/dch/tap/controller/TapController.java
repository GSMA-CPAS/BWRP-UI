package com.kt.blink.biz.dch.tap.controller;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.RegExUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.excel.TapFileExcelView;
import com.kt.blink.biz.common.excel.TapListExcelView;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.DateUtil;
import com.kt.blink.biz.dch.tap.domain.TapDetailDomain;
import com.kt.blink.biz.dch.tap.domain.TapFileDomain;
import com.kt.blink.biz.dch.tap.domain.TapListDomain;
import com.kt.blink.biz.dch.tap.service.TapService;

/**
 * Tap Controller
 */
@RequestMapping("/dch/tap")
@RestController
public class TapController {

    @Autowired
    private TapService tapService;
    
    @Autowired
    private CodeInfoService codeInfoService;
    
    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    @Autowired
    private DateUtil dateUtil;
    
    
    /**
     * inquiry common codes
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("findCommonCodes")
    public ResponseEntity<?> findContractCommonCodes() {
        RestResponse restResponse = codeInfoService.findCommonCodes();
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * note popup -> tap list move
     * 
     * @param tap
     * @param user
     * @return
     */
    @PostMapping("/noteTapList")
    public ModelAndView tapListToNote(TapListDomain tap) {
        ModelAndView model = new ModelAndView("blink/dch/tap/tapList");
        List<String> myNetworks = codeInfoService.findCodesByCdGrpId(CodeConst.MY_NETWORK)
                .stream().map(CodeInfo::getCdVal1).collect(Collectors.toList()); 
        model.addObject("myNetworks", myNetworks);
        model.addObject("note", tap);
        return model;
    }
    
    
    /**
     * move to TAP List page
     * 
     * @param user
     * @return
     */
    @GetMapping("tapList")
    public ModelAndView tapList() {
        return new ModelAndView("blink/dch/tap/tapList");
    }
    
    
    /**
     * inquiry TAP List
     * 
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("tapList/findTapList")
    public ResponseEntity<?> findTapList(@RequestBody final DataTablesRequest dataTablesRequest) {
        // Tab List Domain
        TapListDomain tapListDomain = new TapListDomain();
        
        // Columns Info Re-Arrange
        List<Column> columns = dataTablesRequest.getColumns();
        
        columns.forEach( col -> {
            
            if (StringUtils.equals(col.getData(), "trmPlmnId")) {
                tapListDomain.setTrmPlmnId(col.getSearch().getValue());
                tapListDomain.setTrmPlmnIds(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "rcvPlmnId")) {
                tapListDomain.setRcvPlmnId(col.getSearch().getValue());
                tapListDomain.setRcvPlmnIds(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "startDate")) {
                tapListDomain.setStartDate(dateUtil.datepickerStartLocalDate(col.getSearch().getValue()));
                tapListDomain.setStartDateStr(dateUtil.datepickerStartLocalDateStr(col.getSearch().getValue()));
            } else if (StringUtils.equals(col.getData(), "endDate")) {
                tapListDomain.setEndDate(dateUtil.datepickerEndLocalDate(col.getSearch().getValue()));
                tapListDomain.setEndDateStr(dateUtil.datepickerEndLocalDateStr(col.getSearch().getValue()));
            } else if (StringUtils.equals(col.getData(), "tapDirection")) {
                tapListDomain.setTapDirection(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "currency")) {
                tapListDomain.setCurrency(col.getSearch().getValue());
            }
            
        });
        
        tapListDomain.setDataTablesRequest(dataTablesUtil.mapPostgreSQLCamelCase(dataTablesRequest));
        DataTablesResponse<?> dataTablesResponse = tapService.findTapList(tapListDomain);
        return ResponseEntity.ok(dataTablesResponse);
        
    }
    
    
    /**
     * Download Tap List Excel
     * 
     * @param tapListDomain
     * @param request
     * @param response
     */
    @PostMapping("tapList/downloadTapListExcel")
    public ModelAndView downloadTapListExcel(@ModelAttribute final TapListDomain tapListDomain) {
        ModelAndView mav = new ModelAndView(new TapListExcelView(tapListDomain.getCurrency()));
        DataTablesRequest dataTablesRequest = new DataTablesRequest();
        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
        tapListDomain.setDataTablesRequest(dataTablesRequest);
        tapListDomain.setTrmPlmnIds(Arrays.asList(tapListDomain.getTrmPlmnId().split(CharConst.COMMA)));
        tapListDomain.setRcvPlmnIds(Arrays.asList(tapListDomain.getRcvPlmnId().split(CharConst.COMMA)));
        tapListDomain.setStartDate(tapListDomain.getStartDate().with(LocalTime.MIN));
        tapListDomain.setStartDateStr(dateUtil.getDateStr(tapListDomain.getStartDate().with(LocalTime.MIN)));
        tapListDomain.setEndDate(tapListDomain.getEndDate().with(LocalTime.MAX));
        tapListDomain.setEndDateStr(dateUtil.getDateStr(tapListDomain.getEndDate().with(LocalTime.MAX)));
        
        DataTablesResponse<?> dataTablesResponse = tapService.findTapList(tapListDomain);
        String listPrcsn = codeInfoService.findCodeByCdIdAndCdGrpId(CodeConst.DCM_PRCSN_LIST, CodeConst.DCM_POINT).getCdVal1();
        
        mav.addObject("results", dataTablesResponse.getData());
        mav.addObject("listPrcsn", listPrcsn);
        mav.addObject("filename", "TAP_List");
        return mav;
        
    }
    
    
    /**
     * TAP Detail page
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("tapDetail")
    public ModelAndView tapDetail() {
        return new ModelAndView("blink/dch/tap/tapDetail");
    }
    
    
    /**
     * inquiry specific TAP Detail in Tap List
     * 
     * @param tapDetailDomain
     * @return
     */
    @PostMapping("tapDetail")
    public ModelAndView tapDetail(@ModelAttribute final TapDetailDomain tapDetailDomain) {
        ModelAndView mav = new ModelAndView("blink/dch/tap/tapDetail");
        List<String> myNetworks = codeInfoService.findCodesByCdGrpId(CodeConst.MY_NETWORK)
                .stream().map(CodeInfo::getCdVal1).collect(Collectors.toList()); 
        mav.addObject("myNetworks", myNetworks);
        mav.addObject("listLinkInfo", tapDetailDomain);
        return mav;
        
    }
    
    
    /**
     * inquiry TAP Detail
     * 
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("tapDetail/findTapDetail")
    public ResponseEntity<?> findTapDetail(@RequestBody final DataTablesRequest dataTablesRequest) {
        // Tab Detail Domain
        TapDetailDomain tapDetailDomain = new TapDetailDomain();
        
        // Columns Info Re-Arrange
        List<Column> columns = dataTablesRequest.getColumns();
        
        columns.forEach( col -> {
            
            if (StringUtils.equals(col.getData(), "trmPlmnId")) {
                tapDetailDomain.setTrmPlmnId(col.getSearch().getValue());
                tapDetailDomain.setTrmPlmnIds(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "rcvPlmnId")) {
                tapDetailDomain.setRcvPlmnId(col.getSearch().getValue());
                tapDetailDomain.setRcvPlmnIds(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "startDate")) {
                tapDetailDomain.setStartDate(dateUtil.datepickerStartLocalDate(col.getSearch().getValue()));
                tapDetailDomain.setStartDateStr(dateUtil.datepickerStartLocalDateStr(col.getSearch().getValue())); // file create date
                tapDetailDomain.setStartDateStr2(dateUtil.datepickerStartLocalDateStr2(col.getSearch().getValue())); // call start time
            } else if (StringUtils.equals(col.getData(), "endDate")) {
                tapDetailDomain.setEndDate(dateUtil.datepickerEndLocalDate(col.getSearch().getValue()));
                tapDetailDomain.setEndDateStr(dateUtil.datepickerEndLocalDateStr(col.getSearch().getValue())); // file create date
                tapDetailDomain.setEndDateStr2(dateUtil.datepickerEndLocalDateStr2(col.getSearch().getValue())); // call start time
            } else if (StringUtils.equals(col.getData(), "tapDirection")) {
                tapDetailDomain.setTapDirection(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "currency")) {
                tapDetailDomain.setCurrency(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "imsiId")) {
                tapDetailDomain.setImsiId(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "roamFileNm")) {
                tapDetailDomain.setRoamFileNm(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "callTypes")) {
                tapDetailDomain.setCallTypes(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "btnSearch")) {
                tapDetailDomain.setBtnSearch((col.getSearch().getValue()));
            } else if (StringUtils.equals(col.getData(), "preTotal")) {
                tapDetailDomain.setPreTotal(Long.valueOf(col.getSearch().getValue()));
            } else if (StringUtils.equals(col.getData(), "dateSearchCond")) {
                tapDetailDomain.setDateSearchCond(col.getSearch().getValue());
            }
            
        });
        
        tapDetailDomain.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        DataTablesResponse<?> dataTablesResponse = tapService.findTapDetail(tapDetailDomain);
        return ResponseEntity.ok(dataTablesResponse);
        
    }
    
    
    /**
     * Download Tap Detail Excel
     * 
     * @param tapDetailDomain
     * @param request
     * @param response
     */
//    @PostMapping("tapDetail/downloadTapDetailExcel")
//    public ModelAndView downloadTapDetailExcel(@ModelAttribute final TapDetailDomain tapDetailDomain) {
//        ModelAndView mav = new ModelAndView(new TapDetailExcelView(tapDetailDomain.getCurrency()));
//        DataTablesRequest dataTablesRequest = new DataTablesRequest();
//        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
//        tapDetailDomain.setDataTablesRequest(dataTablesRequest);
//        tapDetailDomain.setTrmPlmnIds(Arrays.asList(tapDetailDomain.getTrmPlmnId().split(CharConst.COMMA)));
//        tapDetailDomain.setRcvPlmnIds(Arrays.asList(tapDetailDomain.getRcvPlmnId().split(CharConst.COMMA)));
//        tapDetailDomain.setStartDate(tapDetailDomain.getStartDate().with(LocalTime.MIN));
//        tapDetailDomain.setStartDateStr(dateUtil.getDateStr(tapDetailDomain.getStartDate().with(LocalTime.MIN)));
//        log.info("StartDate>>>>{}", dateUtil.getDateStr(tapDetailDomain.getStartDate().with(LocalTime.MIN)));
//        tapDetailDomain.setEndDate(tapDetailDomain.getEndDate().with(LocalTime.MAX));
//        tapDetailDomain.setEndDateStr(dateUtil.getDateStr(tapDetailDomain.getEndDate().with(LocalTime.MAX)));
//        log.info("EndDate>>>>>>{}", dateUtil.getDateStr(tapDetailDomain.getEndDate().with(LocalTime.MAX)));
//        DataTablesResponse<?> dataTablesResponse = tapService.findTapDetail(tapDetailDomain);
//        String listPrcsn = codeInfoService.findCodeByCdIdAndCdGrpId(CodeConst.DCM_PRCSN_LIST, CodeConst.DCM_POINT).getCdVal1();
//        
//        mav.addObject("results", dataTablesResponse.getData());
//        mav.addObject("listPrcsn", listPrcsn);
//        mav.addObject("filename", "TAP_DETAIL");
//        return mav;
//        
//    }
    
    
    /**
     * TAP File
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("tapFile")
    public ModelAndView tapFileList() {
        return new ModelAndView("blink/dch/tap/tapFile");
    }
    
    
    /**
     * inquiry TAP File
     * 
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("tapFile/findTapFile")
    public ResponseEntity<?> findTapFile(@RequestBody final DataTablesRequest dataTablesRequest) {
        // Tab Detail Domain
        TapFileDomain tapFileDomain = new TapFileDomain();
        // Columns Info Re-Arrange
        List<Column> columns = dataTablesRequest.getColumns();
        
        columns.forEach( col -> {
            
            if (StringUtils.equals(col.getData(), "trmPlmnId")) {
                tapFileDomain.setTrmPlmnId(col.getSearch().getValue());
                tapFileDomain.setTrmPlmnIds(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "rcvPlmnId")) {
                tapFileDomain.setRcvPlmnId(col.getSearch().getValue());
                tapFileDomain.setRcvPlmnIds(Arrays.asList(col.getSearch().getValue().split(CharConst.COMMA)));
            } else if (StringUtils.equals(col.getData(), "startDate")) {
                tapFileDomain.setStartDate(dateUtil.datepickerStartLocalDate(col.getSearch().getValue()));
                tapFileDomain.setStartDateStr(dateUtil.datepickerStartLocalDateStr2(col.getSearch().getValue()));
            } else if (StringUtils.equals(col.getData(), "endDate")) {
                tapFileDomain.setEndDate(dateUtil.datepickerEndLocalDate(col.getSearch().getValue()));
                tapFileDomain.setEndDateStr(dateUtil.datepickerEndLocalDateStr2(col.getSearch().getValue()));
            } else if (StringUtils.equals(col.getData(), "dateSearchCond")) {
                tapFileDomain.setDateSearchCond(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "tapDirection")) {
                tapFileDomain.setTapDirection(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "setlMonth")) {
                tapFileDomain.setSetlMonth(RegExUtils.replaceAll(col.getSearch().getValue(), "\\-", StringUtils.EMPTY));
            } else if (StringUtils.equals(col.getData(), "trtSttusCd")) {
                tapFileDomain.setTrtSttusCd(col.getSearch().getValue());
            }
            
        });
        
        tapFileDomain.setDataTablesRequest(dataTablesUtil.mapPostgreSQLCamelCase(dataTablesRequest));
        DataTablesResponse<?> dataTablesResponse = tapService.findTapFile(tapFileDomain);
        return ResponseEntity.ok(dataTablesResponse);
        
    }
    
    
    /**
     * Download Tap File Excel
     * 
     * @param tapDetailDomain
     * @param request
     * @param response
     */
    @PostMapping("tapFile/downloadTapFileExcel")
    public ModelAndView downloadTapFileExcel(@ModelAttribute final TapFileDomain tapFileDomain) {
        ModelAndView mav = new ModelAndView(new TapFileExcelView());
        DataTablesRequest dataTablesRequest = new DataTablesRequest();
        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
        tapFileDomain.setDataTablesRequest(dataTablesRequest);
        tapFileDomain.setTrmPlmnIds(Arrays.asList(tapFileDomain.getTrmPlmnId().split(CharConst.COMMA)));
        tapFileDomain.setRcvPlmnIds(Arrays.asList(tapFileDomain.getRcvPlmnId().split(CharConst.COMMA)));
        tapFileDomain.setSetlMonth(RegExUtils.replaceAll(tapFileDomain.getSetlMonth(), "\\-", StringUtils.EMPTY));
        tapFileDomain.setStartDate(tapFileDomain.getStartDate().with(LocalTime.MIN));
        tapFileDomain.setStartDateStr(dateUtil.getDateStr2(tapFileDomain.getStartDate().with(LocalTime.MIN)));
        tapFileDomain.setEndDate(tapFileDomain.getEndDate().with(LocalTime.MAX));
        tapFileDomain.setEndDateStr(dateUtil.getDateStr2(tapFileDomain.getEndDate().with(LocalTime.MAX)));
        
        DataTablesResponse<?> dataTablesResponse = tapService.findTapFile(tapFileDomain);
        String listPrcsn = codeInfoService.findCodeByCdIdAndCdGrpId(CodeConst.DCM_PRCSN_LIST, CodeConst.DCM_POINT).getCdVal1();
        
        mav.addObject("results", dataTablesResponse.getData());
        mav.addObject("listPrcsn", listPrcsn);
        mav.addObject("filename", "TAP_Processing_Result");
        return mav;
        
    }
    
    
}
