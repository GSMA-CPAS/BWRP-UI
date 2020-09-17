/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cmpn.controller;

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
import com.kt.blink.biz.admin.cmpn.domain.CmpnDomain;
import com.kt.blink.biz.admin.cmpn.service.CmpnService;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/cmpn")
@RestController
public class CmpnController {
    
    @Autowired
    private CmpnService cmpnService;
    
    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    @Autowired
    private ObjectMapper mapper;
    
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView cmpn(@AuthenticationPrincipal UserContext user) {
        log.info("[GGG]admin=================>{}", user);
        return new ModelAndView("blink/admin/cmpn/cmpn");
    }
    
    /**
     * 
     * @param dataTablesRequest
     * @param locale
     * @return
     */
    @PostMapping("/retrieveCmpnList")
    public ResponseEntity<?> retrieveCmpnList(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        log.debug("[retrieveCntryList]##################################### \n{}", dataTablesRequest);
        
        DataTablesResponse<?> dataTablesResponse = cmpnService.retrieveCmpnList(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
                
        return ResponseEntity.ok(dataTablesResponse);
    }
    
    /**
     * insert cmpn
     * @param cmpn
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/insertCmpn") //, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> insertCmpn(@ModelAttribute final CmpnDomain cmpn, @AuthenticationPrincipal UserContext user) {
        
        log.info("[@@@@@@@@@@@@@@@@@@@@@@]===========> \n{}", cmpn);
                
        cmpn.setSysTrtrId(user.getUsername());
        
        return ResponseEntity.ok(cmpnService.insertCmpn(cmpn));

    } 
    
    /**
     * update cmpn
     * @param cmpn
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/updateCmpn") //, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCmpn(@RequestBody final CmpnDomain cmpn, @AuthenticationPrincipal UserContext user) {  //@ModelAttribute final 
        
        log.debug("####[updateCmpn] : {}", doLog(cmpn));

        cmpn.setSysTrtrId(user.getUsername());
        
        return ResponseEntity.ok(cmpnService.updateCmpn(cmpn));

    } 
    
    /**
     * delete cmpn
     * @param cmpn
     * @param locale
     * @return
     */
    @PostMapping("/deleteCmpn")
    public ResponseEntity<?> deleteCmpn(@RequestBody final CmpnDomain cmpn) {
        RestResponse restResponse = cmpnService.deleteCmpn(cmpn);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * find cmpn info
     * @param cmpn
     * @param locale
     * @return
     */
    @PostMapping("/findCmpnInfo")
    public ResponseEntity<?> findCmpnInfo(@RequestBody final CmpnDomain cmpn, @AuthenticationPrincipal UserContext user) {
        
        log.debug("####[findCmpnInfo] : {}", cmpn);
        cmpn.setUserId(user.getUsername());
        
        RestResponse restResponse = cmpnService.findCmpnInfo(cmpn);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * search cmpnNm
     * @param cmpn
     * @param locale
     * @return
     */
    @PostMapping("/getCmpnList")
    public ResponseEntity<?> getCmpnList(@RequestBody final CmpnDomain cmpn) {
        
        log.debug("####[getCmpnInfo] : {}", cmpn);
        
        RestResponse restResponse = cmpnService.getCmpnList(cmpn);
        return ResponseEntity.ok(restResponse);
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
