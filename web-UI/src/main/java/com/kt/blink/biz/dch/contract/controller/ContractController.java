/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.contract.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.dch.contract.domain.ContDtlDomain;
import com.kt.blink.biz.dch.contract.domain.ContMstrDomain;
import com.kt.blink.biz.dch.contract.service.ContractService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

/**
 * Contract Controller
 */
@Slf4j
@RequestMapping("/dch/contract")
@RestController
public class ContractController {
    
    @Autowired
    private ContractService contractService;
    
    @Autowired
    private CodeInfoService codeInfoService;
    
    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * move to contract list page
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("contractList")
    public ModelAndView contractList() {
        return new ModelAndView("blink/dch/contract/contractList");
    }
    
    
    /**
     * inquiry contract between operators
     * 
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("findMasterContractBetweenPlmns")
    public ResponseEntity<?> findMasterContractBetweenPlmns(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        // Contract Master
        ContMstrDomain contMstrDomain = new ContMstrDomain();
        
        // Colums Info Re-Arrange
        List<Column> columns = dataTablesRequest.getColumns();
        
        columns.forEach( col -> {
            
            if (StringUtils.equals(col.getData(), "trmPlmnId")) {
                contMstrDomain.setTrmPlmnId(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "rcvPlmnId")) {
                contMstrDomain.setRcvPlmnId(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "contrId")) {
                contMstrDomain.setContrId(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "contMemo")) {
                contMstrDomain.setContMemo(col.getSearch().getValue());
            }
            
        });
        
        contMstrDomain.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        
        DataTablesResponse<?> dataTablesResponse = contractService.findMasterContractBetweenPlmns(contMstrDomain);
        return ResponseEntity.ok(dataTablesResponse);
    }
    
    
    /**
     * move to contract creation page
     * 
     * @param userCtx
     * @return
     */
    @GetMapping("createContract")
    public ModelAndView createContract(@AuthenticationPrincipal UserContext userCtx) {
        log.info("@firstNam=================>{}", userCtx.getFirstName());
        log.info("@lastName=================>{}", userCtx.getLastName());
        log.info("@compnay==================>{}", userCtx.getCompany());
        log.info("@roles====================>{}", userCtx.getAuthorities());
        log.info("@username=================>{}", userCtx.getUsername());
        return new ModelAndView("blink/dch/contract/createContract");
    }
    
    
    /**
     * create new contract
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("createNewMasterContract")
    public ResponseEntity<?> createNewMasterContract(@RequestBody final ContMstrDomain contMstrDomain) {
        RestResponse restResponse = contractService.createNewMasterContract(contMstrDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * request agreement on new contaract(Agreement + Contract)
     * save and request api
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("requestAgreementOnNewContract")
    public ResponseEntity<?> requestAgreementOnNewContract(@RequestBody final ContMstrDomain contMstrDomain) {
        RestResponse restResponse = contractService.requestAgreementOnNewContract(contMstrDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
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
     * move to contract detail page
     * 
     * @param myNetwork
     * @param partnerNetwork
     * @param redirectAttributes
     * @return
     */
    @GetMapping("contractDetail")
    public ModelAndView contractDetail(@RequestParam(value="myNetwork", required = false) final String myNetwork, 
            @RequestParam(value="partnerNetwork", required = false) final String partnerNetwork, RedirectAttributes redirectAttributes) {
        
        ModelAndView mav = new ModelAndView("blink/dch/contract/contractDetail");
        
        if (StringUtils.isBlank(myNetwork) || StringUtils.isBlank(partnerNetwork)) {
            log.info("@ibBlank==========================>");
            redirectAttributes.addFlashAttribute(AppConst.RETURN_MESSAGE, messageUtil.getMessage("app.error.1031"));
            mav.setViewName("redirect:/dch/contract/contractList");
        }
        
        mav.addObject("myNetwork", myNetwork);
        mav.addObject("partnerNetwork", partnerNetwork);
        
        return mav;
    }
    
    
    /**
     * inquiry signed contract between operators 
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("findContractsByPlmns")
    public ResponseEntity<?> findContractsByPlmns(@RequestBody final ContMstrDomain contMstrDomain) {
        RestResponse restResponse = contractService.findContractsByPlmns(contMstrDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * inquiry contract details
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("findContractDetailByContIdAndConDtlId")
    public ResponseEntity<?> findContractDetailByContIdAndConDtlId(@RequestBody final ContDtlDomain contDtlDomain) {
        RestResponse restResponse = contractService.findContDtlByContIdAndConDtlId(contDtlDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * save contract temporarily
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("saveTemporaryContract")
    public ResponseEntity<?> saveTemporaryContract(@RequestBody final ContMstrDomain contMstrDomain) {
        RestResponse restResponse = contractService.saveTemporaryContract(contMstrDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * request agreement on Inbound contract
     * save and request api
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("requestAgreementForInboudContract")
    public ResponseEntity<?> requestAgreementForInboudContract(@RequestBody final ContMstrDomain contMstrDomain) {
        RestResponse restResponse = contractService.requestAgreementForInboudContract(contMstrDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * consent for outbound contract
     * save and request api
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("agreeOutboundConatract")
    public ResponseEntity<?> agreeOutboundConatract(@RequestBody final ContDtlDomain contDtlDomain) {
        RestResponse restResponse = contractService.agreeOutboundConatract(contDtlDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * Reject outbound contract
     * save and request api
     * 
     * @param contMstrDomain
     * @return
     */
    @PostMapping("disagreeOutboundContract")
    public ResponseEntity<?> disagreeOutboundContract(@RequestBody final ContDtlDomain contDtlDomain) {
        RestResponse restResponse = contractService.disagreeOutboundContract(contDtlDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
}
