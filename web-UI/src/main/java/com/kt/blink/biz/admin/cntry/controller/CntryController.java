/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.cntry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.admin.cntry.domain.CntryDomain;
import com.kt.blink.biz.admin.cntry.service.CntryService;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/cntry")
@RestController
public class CntryController {

    @Autowired
    private CntryService cntryService;

    @Autowired
    private DataTablesUtil dataTablesUtil;

//    @Autowired
//    private MessageUtil messageUtil;
    
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView cntry(@AuthenticationPrincipal UserContext user) {
        log.info("@name=====================>{}", user.getUsername());
        log.info("@roles====================>{}", user.getAuthorities());
        log.info("@username=================>{}", user.getUsername());
        
//        ModelAndView model = new ModelAndView("blink/cntry/cntry");
//        
//        //message
//        Map<String, Object> msg = new HashMap<String, Object>();
//        msg.put("cntryDup", messageUtil.getMessage("cntry.dup"));
//        msg.put("cntryCd", messageUtil.getMessage("cntry.cd"));
//        msg.put("cntryCdAbbr", messageUtil.getMessage("cntry.cd.abbr"));
//        msg.put("cntryCdNumb", messageUtil.getMessage("cntry.cd.numb"));
//        msg.put("cntryNm", messageUtil.getMessage("cntry.nm"));
//        
//        //
//        msg.put("comInsSuccess", messageUtil.getMessage("com.insert.success"));
//        msg.put("comUpdSuccess", messageUtil.getMessage("com.update.success"));
//        msg.put("comDelSuccess", messageUtil.getMessage("com.delete.success"));
//        msg.put("comRowSelect", messageUtil.getMessage("com.row.select"));
//        
//        model.addObject("uMsg", msg);
        
        return new ModelAndView("blink/admin/cntry/cntry");
    }
    
    /**
     * cntry code list
     * @param cntry
     * @param locale
     * @return
     */
    @PostMapping("/getCntryList")
    public ResponseEntity<?> getCntryList(@RequestBody final CntryDomain cntry) {
        
        log.debug("[getCntryList]##################################### \n{}", cntry);
        
        RestResponse restResponse = cntryService.getCntryList(cntry);
                        
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * cntry list
     * @param dataTablesRequest
     * @param locale
     * @return
     */
    @PostMapping("/retrieveCntryList")
      public ResponseEntity<?> retrieveCntryList(@RequestBody final DataTablesRequest dataTablesRequest) {
          
          log.debug("[retrieveCntryList]##################################### \n{}", dataTablesRequest);
          
        DataTablesResponse<?> dataTablesResponse = cntryService.retrieveCntryList(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
          
                  
          return ResponseEntity.ok(dataTablesResponse);
      }
    
    /**
     * dup check cntry
     * @param cntry
     * @param locale
     * @return
     */
    @PostMapping("/dupCheckCntry")
    public ResponseEntity<?> dupCheckCntry(@RequestBody final CntryDomain cntry) {
        RestResponse restResponse = cntryService.dupCheckCntry(cntry);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * insert cntry
     * @param cntry
     * @param locale
     * @return
     */
    @PostMapping("/insertCntry")
    public ResponseEntity<?> insertCntry(@RequestBody final CntryDomain cntry, @AuthenticationPrincipal UserContext user) {
        
        
        log.info("insertCntry@name=====================>{}", user.getUsername());
        
        cntry.setSysTrtrId(user.getUsername());
        
        RestResponse restResponse = cntryService.insertCntry(cntry);
        return ResponseEntity.ok(restResponse);
    }
    

    /**
     * update cntry
     * @param cntry
     * @param locale
     * @return
     */
    @PostMapping("/updateCntry")
    public ResponseEntity<?> updateCntry(@RequestBody final CntryDomain cntry, @AuthenticationPrincipal UserContext user) {

        cntry.setSysTrtrId(user.getUsername());
        
        RestResponse restResponse = cntryService.updateCntry(cntry);
        return ResponseEntity.ok(restResponse);
    }
    
    

    /**
     * delete cntry
     * @param cntry
     * @param locale
     * @return
     */
    @PostMapping("/deleteCntry")
    public ResponseEntity<?> deleteCntry(@RequestBody final CntryDomain cntry) {
        RestResponse restResponse = cntryService.deleteCntry(cntry);
        return ResponseEntity.ok(restResponse);
    }
    
}
