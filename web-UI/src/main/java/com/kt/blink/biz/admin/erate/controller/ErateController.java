/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.erate.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.admin.erate.domain.ErateDomain;
import com.kt.blink.biz.admin.erate.service.ErateService;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/erate")
@RestController
public class ErateController {

    @Autowired
    private ErateService erateService;
    
    @Autowired
    private CodeInfoService codeInfoService;
        
    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView erate(@AuthenticationPrincipal UserContext user) {
        log.info("@name=====================>{}", user.getUsername());
        log.info("@roles====================>{}", user.getAuthorities());
        log.info("@username=================>{}", user.getUsername());

        return new ModelAndView("blink/admin/erate/erate");
    }
    
    /**
     * 
     * @param dataTablesRequest
     * @param locale
     * @return
     */
    @PostMapping("/retrieveErateList")
    public ResponseEntity<?> retrieveErateList(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        log.debug("[retrieveCntryList]##################################### \n{}", dataTablesRequest);
        
      DataTablesResponse<?> dataTablesResponse = erateService.retrieveErateList(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
                
        return ResponseEntity.ok(dataTablesResponse);
    }
    
    /**
     * get Period M, M+1
     * @param erate
     * @return
     */
    @PostMapping("/getTgtMons")
    public ResponseEntity<?> getTgtMons(@RequestBody final ErateDomain erate) {
        
        Map<String, Object> items = new HashMap<>();
        
        items.put("periods", erateService.getTgtMons());
        items.put("currencys", codeInfoService.findCodesByCdGrpId("Currency"));
        return ResponseEntity.ok(items);
    }
    
    /**
     * periods list
     * @param erate
     * @return
     */
    @PostMapping("/getPeriods")
    public ResponseEntity<?> getPeriods(@RequestBody final ErateDomain erate) {
        return ResponseEntity.ok(erateService.getPeriods());
    }
    
    /**
     * dupl check
     * @param erate
     * @param user
     * @return
     */
    @PostMapping("/dupCheckErate")
    public ErateDomain dupCheckErate(@RequestBody final ErateDomain erate, @AuthenticationPrincipal UserContext user) {
                
        erate.setSysTrtrId(user.getUsername());
        
        return erateService.dupCheckErate(erate);
    }
    /**
     * dulp check multi
     * @param erates
     * @param user
     * @return
     */
    @PostMapping("/dupCheckMultiErate")
    public ResponseEntity<?> dupCheckMultiErate(@RequestBody final List<ErateDomain> erates) {
                
        log.debug("#### erates : {}", erates);
        int res = 0;
        if(erates != null && !erates.isEmpty()) {
            for(ErateDomain data : erates) {
                ErateDomain dup = erateService.dupCheckErate(data);
                
                if(dup.getErateCnt() > 0) {
                    res++;
                    break;
                }
            }
        }
        
        return ResponseEntity.ok(res);

    } 
    
    /**
     * insert erate
     * @param erate
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/insertErate")
    public ResponseEntity<?> insertErate(@RequestBody final List<ErateDomain> erates, @AuthenticationPrincipal UserContext user) {
                
        log.debug("#### erates : {}", erates);
        int res = 0;
        if(erates != null && !erates.isEmpty()) {
            for(ErateDomain data : erates) {
                data.setSysTrtrId(user.getUsername());
                erateService.insertErate(data);
            }
        }
        
        return ResponseEntity.ok(res);

    } 
    
    /**
     * update erate
     * @param erate
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/updateErate")
    public ResponseEntity<?> updateErate(@RequestBody final List<ErateDomain>  erates, @AuthenticationPrincipal UserContext user) {
        
        int res=0;
        if(erates != null && !erates.isEmpty()) {
            for(ErateDomain data : erates) {
                data.setSysTrtrId(user.getUsername());
                erateService.updateErate(data);
            }
        }
        
        return ResponseEntity.ok(res);
    } 
    
    /**
     * delete erate
     * @param erate
     * @param locale
     * @return
     */
    @PostMapping("/deleteErate")
    public ResponseEntity<?> deleteErate(@RequestBody final ErateDomain erate) {
        RestResponse restResponse = erateService.deleteErate(erate);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * find erate info
     * @param erate
     * @param locale
     * @return
     */
    @PostMapping("/findErateInfo")
    public ResponseEntity<?> findErateInfo(@RequestBody final ErateDomain erate) {
        
        log.debug("####[findErateInfo] : {}", erate);
        
//        Map<String, Object> items = erateService.findErateInfo(erate);
        RestResponse restResponse = erateService.findErateInfo(erate);
//        RestResponse restResponse = new RestResponse();
//        restResponse.setData(items);
        return ResponseEntity.ok(restResponse);
    }
}
