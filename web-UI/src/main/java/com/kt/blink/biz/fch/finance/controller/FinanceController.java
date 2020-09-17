/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.finance.controller;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.excel.FinancialListExcelView;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.service.CommonService;
import com.kt.blink.biz.common.utils.CommonUtil;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.fch.finance.domain.FinanceDomain;
import com.kt.blink.biz.fch.finance.service.FinanceService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/fch/finance")
@RestController
public class FinanceController {

    @Autowired
    private CommonService commonService;

    @Autowired
    private CodeInfoService codeInfoService;

    @Autowired
    private FinanceService financeService;

    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    @Autowired
    private ObjectMapper mapper;
    
    @Autowired
    private MessageUtil messageUtil;

    @Autowired
    private CommonUtil commonUtil;
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView invoice(@AuthenticationPrincipal UserContext user) {
        log.info("[GGG]admin=================>{}", user);
        return new ModelAndView("blink/fch/finance/financial");
    }
    

    /**
     * partner plmns list
     * @param 
     * @return
     */
    @PostMapping("/getInitFinance")
    public ResponseEntity<?> getInitFinance() {
        
        Map<String, Object> items = new HashMap<>();
        List<PlmnsDomain> partners = commonService.getPartnerPlmns(null);
                
        items.put("partners", partners);
        items.put("myNetworks", codeInfoService.findCodesByCdGrpId("MyNetwork"));
        items.put("currencys", codeInfoService.findCodesByCdGrpId("Currency"));
        items.put("cntrys", commonService.getCntryList(null));
        
        return ResponseEntity.ok(items);
    }

    /**
     * financial list
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("/retrieveFinanceList")
    public ResponseEntity<?> retrieveFinanceList(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        List<Column> columns = dataTablesRequest.getColumns();
        FinanceDomain finan = new FinanceDomain();

        for (Column col : columns) {
            String colNm = col.getData();
            String val = col.getSearch().getValue();
            if(StringUtils.equals(colNm, "trmPlmnId")) {
                finan.setTrmPlmnId(val);
            }else if(StringUtils.equals(colNm, "rcvPlmnId")) {
                finan.setRcvPlmnId(val);
            }else if(StringUtils.equals(colNm, "stPeriodMon")) {
                finan.setStPeriodMon(val);
            }else if(StringUtils.equals(colNm, "endPeriodMon")) {
                finan.setEndPeriodMon(val);
            }else if(StringUtils.equals(colNm, "mccId")) {
                finan.setMccId(val);
            }else if(StringUtils.equals(colNm, "curCdSel")) {
                finan.setCurCdSel(val);
            }else if(StringUtils.equals(colNm, "filterMyNet")) {
                finan.setFilterMyNet(val);
            }else if(StringUtils.equals(colNm, "filterParterNet")) {
                finan.setFilterParterNet(val);
            }else if(StringUtils.equals(colNm, "filterCntryNm")) {
                finan.setFilterCntryNm(val);
            }else if(StringUtils.equals(colNm, "filterProfitSign")) {
                finan.setFilterProfitSign(val);
            }else if(StringUtils.equals(colNm, "filterOverProfitSign")) {
                finan.setFilterOverProfitSign(val);
            }else {
                col.getSearch().setValue(null);
            }         
        }
        finan.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        
        log.info("[retrieveFinanceList.FinanceDomain]##################################### \n{}", doLog(finan));
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNT", "DecPoint");
        if(cd != null) {
            finan.setDecPoint(cd.getCdVal1());
        }else {
            finan.setDecPoint("2");
        }
        
        DataTablesResponse<?> dataTablesResponse = financeService.retrieveFinanceList(finan);          
        return ResponseEntity.ok(dataTablesResponse);
    }
    
    /**
     * financial excep download
     * @param finan
     * @param request
     * @param response
     */
    @PostMapping("downloadFinancialListExcel")
    public ModelAndView downloadFinancialListExcel(@ModelAttribute final FinanceDomain finan) {

        HashMap<String, String> titles = new HashMap<>();
        titles.put("mynet", messageUtil.getMessage("fnc.list.th.mynet"));
        titles.put("partnet", messageUtil.getMessage("fnc.list.th.partnet"));
        titles.put("cntry", messageUtil.getMessage("fnc.list.th.cntry"));
        
        StringBuilder range = new StringBuilder();
        range.append(StringUtils.substring(finan.getStPeriodMon(),0,4)).append("-").append(StringUtils.substring(finan.getStPeriodMon(),4)).append("~");
        range.append(StringUtils.substring(finan.getEndPeriodMon(),0,4)).append("-").append(StringUtils.substring(finan.getEndPeriodMon(),4));
                     
        titles.put("range", range.toString());
        titles.put("revn", messageUtil.getMessage("fnc.list.th.revn"));
        titles.put("expn", messageUtil.getMessage("fnc.list.th.expn"));
        titles.put("prof", messageUtil.getMessage("fnc.list.th.prof"));
        titles.put("overdue", messageUtil.getMessage("fnc.list.th.overdue"));
        
        
        ModelAndView mav = new ModelAndView(new FinancialListExcelView(titles, finan.getCurCdSel()));
        DataTablesRequest dataTablesRequest = new DataTablesRequest();
        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
        finan.setDataTablesRequest(dataTablesRequest);
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNT", "DecPoint");
        if(cd != null) {
            finan.setDecPoint(cd.getCdVal1());
        }else {
            finan.setDecPoint("2");
        }
        
        DataTablesResponse<?> dataTablesResponse = financeService.retrieveFinanceList(finan);    
        mav.addObject("results", dataTablesResponse.getData());
        mav.addObject("listPrcsn", finan.getDecPoint());
        mav.addObject("filename", messageUtil.getMessage("fnc.list.title"));
        return mav;
    }
    
    /**
     * set null
     */
    public void setNull(Object o) {
        
        try {
            Field[] fields = o.getClass().getDeclaredFields();
            
            for(Field field : fields) {
                String type = field.getType().getTypeName();
                String name = field.getName();
//              log.debug("type : {}, name : {} ", type, name);
                if(StringUtils.equals(type, "java.lang.String")) {
                    PropertyDescriptor pd = new PropertyDescriptor(name, o.getClass());
                    Method getter = pd.getReadMethod();
                    Object f = getter.invoke(o);
                    
                    if(f == null) {
                        Method setter = pd.getWriteMethod();
                        setter.invoke(o, "");
                    }
                }
            }
        }catch(Exception e) {
            log.info("log parsing error ", e);
        }
    }
    /**
     * log
     * @param o
     * @return
     */
    public String doLog(Object o) {
        String logs = "";
        if(o != null ) {
            try {
                logs = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(o);
            }catch(JsonProcessingException e) {
                log.error("log parsing error ", e);
            }
        }
        return logs;
    }
}
