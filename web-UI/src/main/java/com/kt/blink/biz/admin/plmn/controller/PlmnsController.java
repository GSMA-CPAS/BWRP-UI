/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.plmn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.admin.plmn.service.PlmnsService;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/plmn")
@RestController
public class PlmnsController {
    
    @Autowired
    private PlmnsService plmnsService;
    
    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView plmn(@AuthenticationPrincipal UserContext user) {
        log.info("[GGG]admin=================>{}", user);
        return new ModelAndView("blink/admin/plmn/plmn");
    }
    
    /**
     * plmn list
     * @param dataTablesRequest
     * @param locale
     * @return
     */
    @PostMapping("/retrievePlmnList")
    public ResponseEntity<?> retrievePlmnList(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        log.debug("[retrieveCntryList]##################################### \n{}", dataTablesRequest);
        
      DataTablesResponse<?> dataTablesResponse = plmnsService.retrievePlmnList(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
                
        return ResponseEntity.ok(dataTablesResponse);
    }
    
    /**
     * dup check plmn
     * @param plmn
     * @param user
     * @return
     */
    @PostMapping("/dupCheckPlmn")
    public ResponseEntity<?> dupCheckPlmn(@RequestBody final PlmnsDomain plmn, @AuthenticationPrincipal UserContext user) {
                
        plmn.setSysTrtrId(user.getUsername());
        
        log.debug("#### insertPlmn ####  plmnId : {}", plmn.getPlmnId());

        
        return ResponseEntity.ok(plmnsService.dupCheckPlmn(plmn));

    }
    
    /**
     * insert plmn
     * @param plmn
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/insertPlmn")
    public ResponseEntity<?> insertPlmn(@RequestBody final PlmnsDomain plmn, @AuthenticationPrincipal UserContext user) {
                
        plmn.setSysTrtrId(user.getUsername());
        
        log.debug("#### insertPlmn ####  plmnNm : {}, cntryCd : {}, cmpnId : {}", plmn.getPlmnNm(), plmn.getCntryCd(), plmn.getCmpnId());

        
        return ResponseEntity.ok(plmnsService.insertPlmn(plmn));

    } 
    
    /**
     * update plmn
     * @param plmn
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/updatePlmn")
    public ResponseEntity<?> updatePlmn(@RequestBody final PlmnsDomain plmn, @AuthenticationPrincipal UserContext user) {
        
        plmn.setSysTrtrId(user.getUsername());
        
        return ResponseEntity.ok(plmnsService.updatePlmn(plmn));

    } 
    
    /**
     * delete plmn
     * @param plmn
     * @param locale
     * @return
     */
    @PostMapping("/deletePlmn")
    public ResponseEntity<?> deletePlmn(@RequestBody final PlmnsDomain plmn) {
        RestResponse restResponse = plmnsService.deletePlmn(plmn);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * find plmn info
     * @param plmn
     * @param locale
     * @return
     */
    @PostMapping("/findPlmnInfo")
    public ResponseEntity<?> findPlmnInfo(@RequestBody final PlmnsDomain plmn) {
        
        log.debug("####[findPlmnInfo] : {}", plmn);
        
//        Map<String, Object> items = plmnsService.findPlmnInfo(plmn);
        RestResponse restResponse = plmnsService.findPlmnInfo(plmn);
//        RestResponse restResponse = new RestResponse();
//        restResponse.setData(items);
        return ResponseEntity.ok(restResponse);
    }
    

}
