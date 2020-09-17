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

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.fch.finance.domain.FinanceReportDomain;
import com.kt.blink.biz.fch.finance.service.FinanceReportService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/fch")
@RestController
public class FinancelReportcontroller {
    
    @Autowired
    private FinanceReportService financeReportService;
    
    @Autowired
    private CodeInfoService codeInfoService;
    
    
    /**
     * inquiry common code
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("findCommonCodes")
    public ResponseEntity<?> findCommonCodes() {
        RestResponse restResponse = codeInfoService.findCommonCodes();
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * Financial Report
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("financeReport")
    public ModelAndView financeReport(@AuthenticationPrincipal UserContext userCtx) {
        log.info("[financialReport]=================>{}", userCtx);
        return new ModelAndView("blink/fch/finance/financeReport");
    }
    
    
    /**
     * find sales info
     * 
     * @param financeReportDomain
     * @return
     */
    @PostMapping("findSalesInfo")
    public ResponseEntity<?> findSalesInfo(@RequestBody final FinanceReportDomain financeReportDomain) {
        RestResponse restResponse = financeReportService.findSalesInfo(financeReportDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * find sales info for dashboard
     * 
     * @param financeReportDomain
     * @return
     */
    @PostMapping("dashboardSalesInfo")
    public ResponseEntity<?> dashboardSalesInfo(@RequestBody final FinanceReportDomain financeReportDomain) {
        financeReportDomain.setCallTypes(Arrays.asList(CodeConst.CALL_TYPE_ASVC));
        financeReportDomain.setCurrency(CodeConst.CURRENCY_SDR);
        financeReportDomain.setUnit(CodeConst.SALES_UNIT_AMOUNT);
        RestResponse restResponse = financeReportService.findSalesInfo(financeReportDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
}
