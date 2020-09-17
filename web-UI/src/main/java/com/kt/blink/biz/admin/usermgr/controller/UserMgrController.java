/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.admin.usermgr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.admin.usermgr.domain.UserMgrDomain;
import com.kt.blink.biz.admin.usermgr.service.UserMgrService;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.service.CommonService;
import com.kt.blink.biz.common.service.LoginUserDetailsService;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/usermgr")
@RestController
public class UserMgrController {

    @Autowired
    private UserMgrService userMgrService;

    @Autowired
    private LoginUserDetailsService userDetailsService;

    @Autowired
    private DataTablesUtil dataTablesUtil;

    @Autowired
    private CommonService commonService;
    
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView userMgr(@AuthenticationPrincipal UserContext user) {
        log.info("@name=====================>{}", user.getUsername());
        log.info("@roles====================>{}", user.getAuthorities());
        log.info("@username=================>{}", user.getUsername());
        
        return new ModelAndView("blink/admin/usermgr/userMgr");
    }
    /**
     * init user
     * @param usermgr
     * @return
     */
    @PostMapping("/initUserMgr")
    public ResponseEntity<?> initUserMgr(@RequestBody final UserMgrDomain usermgr) {
        return ResponseEntity.ok(commonService.findCodesByCdGrpId("AUTH"));
    }
    
    
    
    /**
     * user list
     * @param dataTablesRequest
     * @param locale
     * @return
     */
    @PostMapping("/retrieveUserMgrList")
      public ResponseEntity<?> retrieveUserMgrList(@RequestBody final DataTablesRequest dataTablesRequest) {
          
          log.debug("[retrieveUserMgrList]##################################### \n{}", dataTablesRequest);
          
        DataTablesResponse<?> dataTablesResponse = userMgrService.retrieveUserMgrList(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
          
                  
          return ResponseEntity.ok(dataTablesResponse);
      }
    
    /**
     * dup check user
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/dupCheckUserMgr")
    public ResponseEntity<?> dupCheckUserMgr(@RequestBody final UserMgrDomain usermgr) {
        RestResponse restResponse = userMgrService.dupCheckUserMgr(usermgr);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * insert user
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("insertUserMgr")
    public ResponseEntity<?> insertUserMgr(@RequestBody final UserMgrDomain usermgr, @AuthenticationPrincipal UserContext user) {
        
        
        log.info("insertUserMgr@name=====================>{}", user.getUsername());
        
        usermgr.setSysTrtrId(user.getUsername());
        usermgr.setCmpnId(user.getCmpnId());
        
        RestResponse restResponse = userMgrService.insertUserMgr(usermgr);

        //password init
        userDetailsService.resetUserCredentialToDefault(usermgr.getUserId(), AppConst.DEFAULT_CREDENTIAL);
        
        return ResponseEntity.ok(restResponse);
    }    

    /**
     * update user
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("updateUserMgr")
    public ResponseEntity<?> updateUserMgr(@RequestBody final UserMgrDomain usermgr, @AuthenticationPrincipal UserContext user) {

        usermgr.setSysTrtrId(user.getUsername());
        
        RestResponse restResponse = userMgrService.updateUserMgr(usermgr);
        return ResponseEntity.ok(restResponse);
    }   

    /**
     * delete user
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/deleteUserMgr")
    public ResponseEntity<?> deleteUserMgr(@RequestBody final UserMgrDomain usermgr) {
        RestResponse restResponse = userMgrService.deleteUserMgr(usermgr);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * find usermgr info
     * @param usermgr
     * @param locale
     * @return
     */
    @PostMapping("/findUserMgrInfo")
    public ResponseEntity<?> findUserMgrInfo(@RequestBody final UserMgrDomain usermgr) {
        
        log.debug("####[findUserMgrInfo] : {}", usermgr);
        
        RestResponse restResponse = userMgrService.findUserMgrInfo(usermgr);
        return ResponseEntity.ok(restResponse);
    }
    
}
