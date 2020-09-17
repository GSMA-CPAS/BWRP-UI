/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.contract.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.collections.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.domain.ApiResponse;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.CommonUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.dch.contract.domain.ApiConfirmContDomain;
import com.kt.blink.biz.dch.contract.domain.ApiContBasDomain;
import com.kt.blink.biz.dch.contract.domain.ApiContDtlDomain;
import com.kt.blink.biz.dch.contract.domain.ApiContMstrDomain;
import com.kt.blink.biz.dch.contract.domain.ApiContPlmnDomain;
import com.kt.blink.biz.dch.contract.domain.ApiContSpclDomain;
import com.kt.blink.biz.dch.contract.domain.ContBasTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContDtlDomain;
import com.kt.blink.biz.dch.contract.domain.ContMstrDomain;
import com.kt.blink.biz.dch.contract.domain.ContSpclBasTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContSpclTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContractBaseTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContractDetailDomain;
import com.kt.blink.biz.dch.contract.domain.ContractMasterDomain;
import com.kt.blink.biz.dch.contract.domain.ContractSpclTarifDomain;
import com.kt.blink.biz.dch.contract.mapper.ContractMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Contract Service
 */
@Slf4j
@Transactional
@Service
public class ContractService {
    
    @Autowired
    private ContractMapper contractMapper;
    
    @Autowired
    private CommonUtil commonUtil;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    @Value("${blink.gateway.url}")
    private String gatewayApiUrl;
    
    @Value("${blink.gateway.contractSend}")
    private String createContractService;
    
    @Value("${blink.gateway.contractAgree}")
    private String confirmContractService;
    
    
    /**
     * find Master Contract between Plmns
     * display Inbound Agreement only
     * 
     * @param userCtx
     * @return
     */
    public DataTablesResponse<?> findMasterContractBetweenPlmns(ContMstrDomain contMstrDomain) {
        try {
            
            List<ContMstrDomain> contMstrDomains = Optional.ofNullable(contractMapper.findMasterContractBetweenPlmns(contMstrDomain))
                    .orElse(Collections.emptyList());
            log.info("contMstrDomainList=================>{}", contMstrDomains);
            
            Long totalCount = contMstrDomains.stream().map(ContMstrDomain::getTotalCount).findFirst().orElse(0L);
            
            return responseUtil.dataTablesResponse(totalCount, contMstrDomain.getDataTablesRequest().getDraw(), contMstrDomains);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * create New Master Contract With Init contract
     * 
     * @param contMstrDomain
     * @return
     */
    public RestResponse createNewMasterContract(ContMstrDomain contMstrDomain) {
            // 1. Generate Uniq Contract Master Id
            List<String> trmPlmnIds = contMstrDomain.getTrmPlmnIds();
            log.info("trmPlmnIds====================>{}", trmPlmnIds);
            List<String> rcvPlmnIds = contMstrDomain.getRcvPlmnIds();
            log.info("trmPlmnIds====================>{}", rcvPlmnIds);
            
            if (trmPlmnIds.isEmpty() || rcvPlmnIds.isEmpty()) {
                throw new CommonException(messageUtil.getMessage("app.new.contract.m053"), ErrorCode.INTERNAL_SERVER_ERROR);
            }
            
            String trmPlmnId = commonUtil.getCommaSeparatedValues(trmPlmnIds);
            String rcvPlmnId = commonUtil.getCommaSeparatedValues(rcvPlmnIds);
            String existMstContId = contractMapper.findMasterContractByPlmn(trmPlmnId, rcvPlmnId);
            log.info("existMstContId=========>{}", existMstContId);
            
            // if parent contract exists => unable to create
            if (!StringUtils.isEmpty(existMstContId)) {
                log.info("app.error.1032==========================================>");
                throw new CommonException(messageUtil.getMessage("app.new.contract.m054"), ErrorCode.INTERNAL_SERVER_ERROR);
            }
            
            try {
                
                String contId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_MASTER_ID);
                log.info("contId=================>{}", contId);
                
                // 2. Save Contract Master
                contMstrDomain.setContId(contId);
                contMstrDomain.setTrmPlmnId(trmPlmnId);
                contMstrDomain.setRcvPlmnId(rcvPlmnId);
                contractMapper.saveContractMaster(contMstrDomain); // save agreement
                
                // 3. Save Contract Details
                List<ContDtlDomain> contDtls = Optional.ofNullable(contMstrDomain.getContDtls())
                        .orElse(Collections.emptyList());
                
                // detail for loop
                contDtls.forEach(contDtl -> {
                    String contDtlId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_DTL_ID);
                    contDtl.setContId(contId);
                    contDtl.setContDtlId(contDtlId);
                    contractMapper.saveContractDetail(contDtl); // save contract
                    
                    // contract base tarif directly dependent on contract detail
                    List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contDtl.getContBasTarifs())
                            .orElse(Collections.emptyList());
                    
                    // 4. Save Base Tarifs Of Contract Detail
                    contDtlBasTarifs.forEach(contDtlBasTarif -> {
                        String contBasTarifId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_BAS_ID);
                        contDtlBasTarif.setContBasTarifId(contBasTarifId);
                        contDtlBasTarif.setContDtlId(contDtlId);
                        contractMapper.saveContDtlBasTarif(contDtlBasTarif);
                    });
                    
                    
                    // 5. Save Special Taris
                    List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contDtl.getContSpclTarifs())
                            .orElse(Collections.emptyList());
                        
                    contSpclTarifs.forEach(contSpclTarif -> {
                        String contSpclTarifId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_SPCL_ID);
                        contSpclTarif.setContSpclTarifId(contSpclTarifId);
                        contSpclTarif.setContDtlId(contDtlId);
                        contractMapper.saveContSpclTarif(contSpclTarif);
                        
                        // contract base tarif directly dependent on contract special tarif
                        List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contSpclTarif.getContSpclBasTarifs())
                                .orElse(Collections.emptyList());
                        
                        // 6. Save Base Tarif Of Special Tarif
                        contSpclBasTarifs.forEach(contSpclBasTarif -> {
                            String contBasTarifId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_BAS_ID);
                            contSpclBasTarif.setContBasTarifId(contBasTarifId);
                            contSpclBasTarif.setContDtlId(contDtlId);
                            contSpclBasTarif.setContSpclTarifId(contSpclTarifId);
                            contractMapper.saveContSpclBasTarif(contSpclBasTarif);
                        });
                        
                    });
                    
                });
                
                return responseUtil.restReponse(contMstrDomain);
                
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * request agreement on new contract(Agreement & Contract at once)
     * 
     * @param contMstrDomain
     * @return
     */
    public RestResponse requestAgreementOnNewContract(ContMstrDomain contMstrDomain) {
        // GW Contract API DTO
        ApiContMstrDomain apiContMstrDomain = null;
        
        // 1. Generate Uniq Contract Master Id
        List<String> trmPlmnIds = contMstrDomain.getTrmPlmnIds();
        List<String> rcvPlmnIds = contMstrDomain.getRcvPlmnIds();
        
        if (trmPlmnIds.isEmpty() || rcvPlmnIds.isEmpty()) {
            throw new CommonException(messageUtil.getMessage("app.new.contract.m053"), ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
        String trmPlmnId = commonUtil.getCommaSeparatedValues(trmPlmnIds);
        String rcvPlmnId = commonUtil.getCommaSeparatedValues(rcvPlmnIds);
        String existMstContId = contractMapper.findMasterContractByPlmn(trmPlmnId, rcvPlmnId);
        log.info("existMstContId=========>{}", existMstContId);
        
        // if parent contract exists => unable to create
        if (!StringUtils.isEmpty(existMstContId)) {
            log.info("app.error.1032==========================================>");
            throw new CommonException(messageUtil.getMessage("app.new.contract.m054"), ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
        try {
            
            // create new parent contract id 
            String contId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_MASTER_ID);
            log.info("contId=================>{}", contId);
            
            // 2. Save Contract Master
            contMstrDomain.setContId(contId);
            contMstrDomain.setTrmPlmnId(trmPlmnId);
            contMstrDomain.setRcvPlmnId(rcvPlmnId);
            contractMapper.saveContractMaster(contMstrDomain); // save agreement
            
            // 3. Save Contract Details
            List<ContDtlDomain> contDtls = Optional.ofNullable(contMstrDomain.getContDtls())
                    .orElse(Collections.emptyList());
            
            // detail for loop
            contDtls.forEach(contDtl -> {
                
                String contDtlId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_DTL_ID);
                contDtl.setContId(contId);
                contDtl.setContDtlId(contDtlId);
                
                // ★ request consent immediately after contract creation[DRAFT]
                contDtl.setContSttusCd(CodeConst.DRAFT);
                contractMapper.saveContractDetail(contDtl); // save contract
                
                // contract base tarif directly dependent on contract detail
                List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contDtl.getContBasTarifs())
                        .orElse(Collections.emptyList());
                
                // 4. Save Base Tarifs Of Contract Detail
                contDtlBasTarifs.forEach(contDtlBasTarif -> {
                    String contBasTarifId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_BAS_ID);
                    contDtlBasTarif.setContBasTarifId(contBasTarifId);
                    contDtlBasTarif.setContDtlId(contDtlId);
                    contractMapper.saveContDtlBasTarif(contDtlBasTarif);
                });
                
                
                // 5. Save Special Taris
                List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contDtl.getContSpclTarifs())
                        .orElse(Collections.emptyList());
                    
                contSpclTarifs.forEach(contSpclTarif -> {
                    String contSpclTarifId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_SPCL_ID);
                    contSpclTarif.setContSpclTarifId(contSpclTarifId);
                    contSpclTarif.setContDtlId(contDtlId);
                    contractMapper.saveContSpclTarif(contSpclTarif);
                    
                    // contract base tarif directly dependent on contract special tarif
                    List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contSpclTarif.getContSpclBasTarifs())
                            .orElse(Collections.emptyList());
                    
                    // 6. Save Base Tarif Of Special Tarif
                    contSpclBasTarifs.forEach(contSpclBasTarif -> {
                        String contBasTarifId = commonUtil.generateContractId(trmPlmnIds, rcvPlmnIds, CodeConst.CONT_BAS_ID);
                        contSpclBasTarif.setContBasTarifId(contBasTarifId);
                        contSpclBasTarif.setContDtlId(contDtlId);
                        contSpclBasTarif.setContSpclTarifId(contSpclTarifId);
                        contractMapper.saveContSpclBasTarif(contSpclBasTarif);
                    });
                    
                });
                
            });
            
            // Collecting Data for Gateway API
            ContDtlDomain contDtlDomain = contMstrDomain.getContDtls().stream().findFirst().orElseGet(ContDtlDomain::new);
            String contDtlId = contDtlDomain.getContDtlId();
            ContractMasterDomain contMstr = contractMapper.retrieveContractMasterInfo(contDtlDomain.getContId());
            apiContMstrDomain = this.createContractDTOforAPI(contMstr, contDtlId);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
        // Check data exists before gateway API
        Optional.ofNullable(apiContMstrDomain.getContDtl())
            .orElseThrow(() -> new CommonException(messageUtil.getMessage("app.new.contract.m051"), ErrorCode.INTERNAL_SERVER_ERROR));
        
        // Call gateway API for creating contract between carriers
        ResponseEntity<ApiResponse> response = this.requestForCreatingContractAPI(apiContMstrDomain);
        log.info("[API]Result.1=================>{}", response.getBody());
        
        return responseUtil.restReponse(response);
        
    }
    
    
    /**
     * inquiry singed contracct between operators
     * 
     * @param contMstrDomain
     * @return
     */
    @SuppressWarnings("unchecked")
    public RestResponse findContractsByPlmns(ContMstrDomain contMstrDomain) {
        
        if (StringUtils.isBlank(contMstrDomain.getTrmPlmnId()) || StringUtils.isBlank(contMstrDomain.getRcvPlmnId())) {
            throw new CommonException(messageUtil.getMessage("app.error.1031"), ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
        String trmPlmnId = contMstrDomain.getTrmPlmnId();
        String rcvPlmnId = contMstrDomain.getRcvPlmnId();
        log.info("[PLMN] trmPlmnId=======================>{}", trmPlmnId);
        log.info("[PLMN] rcvPlmnId=======================>{}", rcvPlmnId);
        
        /**
         * display contract based on MyNetwork
         */
        try {
            
            /**
             * I. Inbound
             */
            ContMstrDomain inboundAgreement = Optional.ofNullable(contractMapper.findAgreementByPlmns(contMstrDomain))
                    .orElseGet(ContMstrDomain::new);
            log.info("[CONT] inboundContract============>{}", inboundAgreement);
            log.info("[CONT] inboundAgreement============>{}", inboundAgreement.getContId());
            
            // inquiry Inbound contract
            List<ContDtlDomain> inboundContracts = Optional.ofNullable(contractMapper.findContractByContId(inboundAgreement.getContId()))
                    .orElse(Collections.emptyList());
            
            inboundContracts.forEach(inboundContract -> inboundContract.setDirection(CodeConst.INBOUND));
            log.info("[CONT] inboundContracts.size============>{}", inboundContracts.size());
            
            /**
             * II. Outboud
             */
            contMstrDomain.setTrmPlmnId(rcvPlmnId);
            contMstrDomain.setRcvPlmnId(trmPlmnId);
            
            ContMstrDomain outboundAgreement = Optional.ofNullable(contractMapper.findAgreementByPlmns(contMstrDomain))
                    .orElseGet(ContMstrDomain::new);
            String tmpTrmPlmnId = outboundAgreement.getTrmPlmnId();
            String tmpRcvPlmnId = outboundAgreement.getRcvPlmnId();
            outboundAgreement.setTrmPlmnId(tmpRcvPlmnId);
            outboundAgreement.setRcvPlmnId(tmpTrmPlmnId);
            log.info("[CONT] outboundAgreement============>{}", outboundAgreement);
            log.info("[CONT] outboundAgreement============>{}", outboundAgreement.getContId());
            
            // inquiry Outbound contract
            List<ContDtlDomain> outboundContracts = Optional.ofNullable(contractMapper.findContractByContId(outboundAgreement.getContId()))
                    .orElse(Collections.emptyList());
            
            outboundContracts.forEach(outboundContract -> outboundContract.setDirection(CodeConst.OUTBOUND));
            log.info("[CONT] outboundContracts.size============>{}", outboundContracts.size());
            log.info("[CONT] outboundContracts.size============>{}", outboundContracts);
            
            /**
             * III. Composite return contract list
             */
            if (inboundAgreement.getContId() == null && outboundAgreement.getContId() != null) {
                outboundAgreement.setContDtls(outboundContracts);
                return responseUtil.restReponse(outboundAgreement);
            } else if (inboundAgreement.getContId() != null && outboundAgreement.getContId() == null) {
                inboundAgreement.setContDtls(inboundContracts);
                return responseUtil.restReponse(inboundAgreement);
            }
            
            // both exists then union contracts
            List<ContDtlDomain> contracts = ListUtils.union(inboundContracts, outboundContracts);
            inboundAgreement.setContDtls(contracts);
            
            return responseUtil.restReponse(inboundAgreement);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * inquiry selected contract details
     * 
     * @param contDtlDomain
     * @return
     */
    public RestResponse findContDtlByContIdAndConDtlId(ContDtlDomain contDtlDomain) {
        try {
            
            // 1. contract
            String contId = contDtlDomain.getContId();
            String contDtlId = contDtlDomain.getContDtlId();
            ContDtlDomain contract = Optional.ofNullable(contractMapper.findContDtlByContIdAndConDtlId(contId, contDtlId))
                    .orElseGet(ContDtlDomain::new);
            
            
            // 2. contract basic tariff
            List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contractMapper.findContBasTarifsByContDtlId(contDtlId))
                    .orElse(Collections.emptyList());
            
            contract.setContBasTarifs(contDtlBasTarifs);
            
            
            // 3. contract special tariff
            List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contractMapper.findContSpclTarifsByContDtlId(contDtlId))
                    .orElse(Collections.emptyList());
            
            contract.setContSpclTarifs(contSpclTarifs);
            
            // 4. contract special tariff details
            contSpclTarifs.forEach(contSpclTarif -> {
                String contSpclTarifId = contSpclTarif.getContSpclTarifId();
                List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contractMapper.findContSpclBasTarifsByContDtlIdAndContSpclTarifId(contDtlId, contSpclTarifId))
                        .orElse(Collections.emptyList());
                
                contSpclTarif.setContSpclBasTarifs(contSpclBasTarifs);
            });
            
            return responseUtil.restReponse(contract);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * save contact temporarily (update contract or create new contract)
     * 
     * @param contMstrDomain
     * @return
     */
    public RestResponse saveTemporaryContract(ContMstrDomain contMstrDomain) {
        
        // contMaster Id
        String contId = contMstrDomain.getContId();
        String result = "";
        
        // Contracts
        List<ContDtlDomain> contDtls = Optional.ofNullable(contMstrDomain.getContDtls())
                .orElse(Collections.emptyList());
        
        ContDtlDomain contDtlDomain = contDtls.get(0);
        String contDtlId = contDtlDomain.getContDtlId();
        log.info("[UPD]contId===============>{}", contId);
        log.info("[UPD]contDtlId============>{}", contDtlId);
        
        // 1. if contract ID exists => Update Contract
        if (!StringUtils.isBlank(contDtlId)) {
            log.info("[UPD]updateTempContract==========>{}/{}", contId, contDtlId);
            result = this.updateTempContract(contDtlDomain);
        }
        
        // 2. if there is not contract ID => Create New Contract
        else {
            log.info("[UPD]createNewContract============>{}/{}",  contId, contDtlId);
            contDtlDomain.setContId(contId);
            result = this.createNewContract(contDtlDomain);
        }
        
        return responseUtil.restReponse(result);
        
    }
    
    
    /**
     * update contract of the agreement in the contract detail page
     * 
     * @param contDtlDomain
     * @return
     */
    public String updateTempContract(ContDtlDomain contDtlDomain) {
        log.info("[updateTempContract]====================>{}", contDtlDomain);
        try {
            // 1. modify existing contract information
            contractMapper.updateContractDetail(contDtlDomain);
            
            // 2. delete basic/special tariff of existing contract
            String contId = contDtlDomain.getContId();
            String contDtlId = contDtlDomain.getContDtlId();
            contractMapper.deleteContDtlBasTarifByContDtlId(contDtlId);
            contractMapper.deleteContSpclTarifByContDtlId(contDtlId);
            
            // 3. create basic/special tariff of existing contract
            // contract base tarif directly dependent on contract detail
            List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contDtlDomain.getContBasTarifs())
                    .orElse(Collections.emptyList());
            
            // 4. Save Base Tarifs Of Contract Detail
            contDtlBasTarifs.forEach(contDtlBasTarif -> {
                String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                contDtlBasTarif.setContBasTarifId(contBasTarifId);
                contDtlBasTarif.setContDtlId(contDtlId);
                contractMapper.saveContDtlBasTarif(contDtlBasTarif);
            });
            
            // 5. Save Special Taris
            List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contDtlDomain.getContSpclTarifs())
                    .orElse(Collections.emptyList());
            
            contSpclTarifs.forEach(contSpclTarif -> {
                String contSpclTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_SPCL_ID);
                contSpclTarif.setContSpclTarifId(contSpclTarifId);
                contSpclTarif.setContDtlId(contDtlId);
                contractMapper.saveContSpclTarif(contSpclTarif);
                
                // contract base tarif directly dependent on contract special tarif
                List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contSpclTarif.getContSpclBasTarifs())
                        .orElse(Collections.emptyList());
                
                // 6. Save Base Tarif Of Special Tarif
                contSpclBasTarifs.forEach(contSpclBasTarif -> {
                    String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                    contSpclBasTarif.setContBasTarifId(contBasTarifId);
                    contSpclBasTarif.setContDtlId(contDtlId);
                    contSpclBasTarif.setContSpclTarifId(contSpclTarifId);
                    contractMapper.saveContSpclBasTarif(contSpclBasTarif);
                });
            });

            return contDtlId;
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * Create Detail Contract
     * 
     * @param contId
     * @param contDtlDomain
     * @return
     */
    public String createNewContract(ContDtlDomain contDtlDomain) {
        log.info("[createNewContract]====================>{}", contDtlDomain);
        try {
            // 1.create new contract of the agreement
            String contId = contDtlDomain.getContId();
            String contDtlId = commonUtil.generateContractId(contId, CodeConst.CONT_DTL_ID);
            contDtlDomain.setContDtlId(contDtlId);
            contractMapper.saveContractDetail(contDtlDomain);
            
            // 2. create basic/special tariff of contract
            // contract base tarif directly dependent on contract detail
            List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contDtlDomain.getContBasTarifs())
                    .orElse(Collections.emptyList());
            
            // 3. Save Base Tarifs Of Contract Detail
            contDtlBasTarifs.forEach(contDtlBasTarif -> {
                String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                contDtlBasTarif.setContBasTarifId(contBasTarifId);
                contDtlBasTarif.setContDtlId(contDtlId);
                contractMapper.saveContDtlBasTarif(contDtlBasTarif);
            });
            
            // 4. Save Special Taris
            List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contDtlDomain.getContSpclTarifs())
                    .orElse(Collections.emptyList());
            
            contSpclTarifs.forEach(contSpclTarif -> {
                String contSpclTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_SPCL_ID);
                contSpclTarif.setContSpclTarifId(contSpclTarifId);
                contSpclTarif.setContDtlId(contDtlId);
                contractMapper.saveContSpclTarif(contSpclTarif);
                
                // contract base tarif directly dependent on contract special tarif
                List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contSpclTarif.getContSpclBasTarifs())
                        .orElse(Collections.emptyList());
                
                // 5. Save Base Tarif Of Special Tarif
                contSpclBasTarifs.forEach(contSpclBasTarif -> {
                    String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                    contSpclBasTarif.setContBasTarifId(contBasTarifId);
                    contSpclBasTarif.setContDtlId(contDtlId);
                    contSpclBasTarif.setContSpclTarifId(contSpclTarifId);
                    contractMapper.saveContSpclBasTarif(contSpclBasTarif);
                });
                
            });
            
            return contDtlId;
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * send request agreement on Inbound Contract
     * (Working[WRK] ==> Draft[DRF])
     * 
     * @param contMstrDomain
     * @return
     */
    public RestResponse requestAgreementForInboudContract(ContMstrDomain contMstrDomain) {
        log.info("@requestAgreementForInboudContract===============>{}", contMstrDomain);
        // Agreement Id
        String contId = contMstrDomain.getContId();
        ResponseEntity<ApiResponse> response = null;
        
        // Contracts
        List<ContDtlDomain> contDtls = Optional.ofNullable(contMstrDomain.getContDtls())
                .orElse(Collections.emptyList());
        
        ContDtlDomain contDtlDomain = contDtls.get(0);
        String contDtlId = contDtlDomain.getContDtlId();
        
        // ★ change the status value after processing the GW consent request(Working[WRK] ==> Draft[DRF])
        contDtlDomain.setContSttusCd(CodeConst.DRAFT);
        log.info("[UPD]contDtlId===============>{}", contDtlId);

        // 1. if contract ID exists => Update Contract
        if (!StringUtils.isBlank(contDtlId)) {
        	response = this.updateTempContractThenRequestAgree(contDtlDomain);
        }
        // 2. if there is not contract ID => Create New Contract Then request agreement
        else {
            contDtlDomain.setContId(contId);
            response = this.createNewContractThenRequestAgree(contDtlDomain);
        }
        
        return responseUtil.restReponse(response);
        
    }
    
    
    /**
     * Request consent immediately upon creation of a new sub-contract from an existing contract
     * 
     * @param contId
     * @param contDtlDomain
     * @return
     */
    public ResponseEntity<ApiResponse> createNewContractThenRequestAgree(ContDtlDomain contDtlDomain) {
        log.info("[createNewContractThenRequestAgreement]====================>{}", contDtlDomain);
        // GW Contract API DTO
        ApiContMstrDomain apiContMstrDomain = null;
        
        try {
            // 1.create new contract of the agreement
            String contId = contDtlDomain.getContId();
            String contDtlId = commonUtil.generateContractId(contId, CodeConst.CONT_DTL_ID);
            contDtlDomain.setContDtlId(contDtlId);
            contractMapper.saveContractDetail(contDtlDomain);
            
            // 2. create basic/special tariff 
            // contract base tarif directly dependent on contract detail
            List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contDtlDomain.getContBasTarifs())
                    .orElse(Collections.emptyList());
            
            // 3. Save Base Tarifs Of Contract Detail
            contDtlBasTarifs.forEach(contDtlBasTarif -> {
                String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                contDtlBasTarif.setContBasTarifId(contBasTarifId);
                contDtlBasTarif.setContDtlId(contDtlId);
                contractMapper.saveContDtlBasTarif(contDtlBasTarif);
            });
            
            // 4. Save Special Taris
            List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contDtlDomain.getContSpclTarifs())
                    .orElse(Collections.emptyList());
            
            contSpclTarifs.forEach(contSpclTarif -> {
                String contSpclTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_SPCL_ID);
                contSpclTarif.setContSpclTarifId(contSpclTarifId);
                contSpclTarif.setContDtlId(contDtlId);
                contractMapper.saveContSpclTarif(contSpclTarif);
                
                // contract base tarif directly dependent on contract special tarif
                List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contSpclTarif.getContSpclBasTarifs())
                        .orElse(Collections.emptyList());
                
                // 5. Save Base Tarif Of Special Tarif
                contSpclBasTarifs.forEach(contSpclBasTarif -> {
                    String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                    contSpclBasTarif.setContBasTarifId(contBasTarifId);
                    contSpclBasTarif.setContDtlId(contDtlId);
                    contSpclBasTarif.setContSpclTarifId(contSpclTarifId);
                    contractMapper.saveContSpclBasTarif(contSpclBasTarif);
                });
                
            });
            
            // Collecting data for creating contract gateway API
            ContractMasterDomain contMstrDomain = contractMapper.retrieveContractMasterInfo(contId);
            apiContMstrDomain = this.createContractDTOforAPI(contMstrDomain, contDtlId);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
        // Check data exists before gateway API
        Optional.ofNullable(apiContMstrDomain.getContDtl())
            .orElseThrow(() -> new CommonException(messageUtil.getMessage("app.new.contract.m051"), ErrorCode.INTERNAL_SERVER_ERROR));
        
        // Call gateway API for creating contract between carriers
        ResponseEntity<ApiResponse> response = this.requestForCreatingContractAPI(apiContMstrDomain);
        log.info("[API]Result.2=================>{}", response.getBody());
        
        return response;
        
    }
    
    
    /**
     * Request for consent at the same time as amendment to the existing temporary contract
     * 
     * @param contDtlDomain
     * @return
     */
    public ResponseEntity<ApiResponse> updateTempContractThenRequestAgree(ContDtlDomain contDtlDomain) {
        // GW Contract API DTO
        ApiContMstrDomain apiContMstrDomain = null;
        
        try {
            // 1. modify basic/special tariff of existing contract
            contractMapper.updateContractDetail(contDtlDomain);
            
            // 2. delete basic/special tariff of existing contract
            String contId = contDtlDomain.getContId();
            String contDtlId = contDtlDomain.getContDtlId();
            contractMapper.deleteContDtlBasTarifByContDtlId(contDtlId);
            contractMapper.deleteContSpclTarifByContDtlId(contDtlId);
            
            // 3. create basic/special tariff of existing contract
            // contract base tarif directly dependent on contract detail
            List<ContBasTarifDomain> contDtlBasTarifs = Optional.ofNullable(contDtlDomain.getContBasTarifs())
                    .orElse(Collections.emptyList());
            
            // 4. Save Base Tarifs Of Contract Detail
            contDtlBasTarifs.forEach(contDtlBasTarif -> {
                String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                contDtlBasTarif.setContBasTarifId(contBasTarifId);
                contDtlBasTarif.setContDtlId(contDtlId);
                contractMapper.saveContDtlBasTarif(contDtlBasTarif);
            });
            
            // 5. Save Special Taris
            List<ContSpclTarifDomain> contSpclTarifs = Optional.ofNullable(contDtlDomain.getContSpclTarifs())
                    .orElse(Collections.emptyList());
            
            contSpclTarifs.forEach(contSpclTarif -> {
                String contSpclTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_SPCL_ID);
                contSpclTarif.setContSpclTarifId(contSpclTarifId);
                contSpclTarif.setContDtlId(contDtlId);
                contractMapper.saveContSpclTarif(contSpclTarif);
                
                // contract base tarif directly dependent on contract special tarif
                List<ContSpclBasTarifDomain> contSpclBasTarifs = Optional.ofNullable(contSpclTarif.getContSpclBasTarifs())
                        .orElse(Collections.emptyList());
                
                // 6. Save Base Tarif Of Special Tarif
                contSpclBasTarifs.forEach(contSpclBasTarif -> {
                    String contBasTarifId = commonUtil.generateContractId(contId, CodeConst.CONT_BAS_ID);
                    contSpclBasTarif.setContBasTarifId(contBasTarifId);
                    contSpclBasTarif.setContDtlId(contDtlId);
                    contSpclBasTarif.setContSpclTarifId(contSpclTarifId);
                    contractMapper.saveContSpclBasTarif(contSpclBasTarif);
                });
                
            });
            
            // Collecting data for creating contract gateway API
            ContractMasterDomain contMstrDomain = contractMapper.retrieveContractMasterInfo(contId);
            apiContMstrDomain = this.createContractDTOforAPI(contMstrDomain, contDtlId);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
        // Check data exists before gateway API
        Optional.ofNullable(apiContMstrDomain.getContDtl())
            .orElseThrow(() -> new CommonException(messageUtil.getMessage("app.contract.details.m063"), ErrorCode.INTERNAL_SERVER_ERROR));
        
        // Call gateway API for creating contract between carries
        ResponseEntity<ApiResponse> response = this.requestForCreatingContractAPI(apiContMstrDomain);
        log.info("[API]Result.3=================>{}", response.getBody());
        
        return response;
        
    }
    
    
    /**
     * consent for Outbound contarct
     * 
     * @param contMstrDomain
     * @return
     */
    public RestResponse agreeOutboundConatract(ContDtlDomain contDtlDomain) {
        // Contract Confirm AIP DTO
        ApiConfirmContDomain apiConfirmContDomain = new ApiConfirmContDomain();
        
        try {
            // change status value(Draft[DRF] ==> Agreed[AGR])
            contDtlDomain.setContSttusCd(CodeConst.AGREED);
            contractMapper.updateOutboundContractStatus(contDtlDomain);
            
            // accept other operator's contract(Agree)
            log.info("[API]Calling Confirm Contract GW Service With AGR...........");
            apiConfirmContDomain.setContSttusCd(CodeConst.AGREED);
            apiConfirmContDomain.setContDtlId(contDtlDomain.getContDtlId());
            apiConfirmContDomain.setBcContId(contDtlDomain.getBcContId());
            log.info("[API]Set param...................{}", apiConfirmContDomain);
            
            // Calling Confirming GW API
            ResponseEntity<ApiResponse> response = this.requestForConfirmingContractAPI(apiConfirmContDomain);
            log.info("[API]Result.4=================>{}", response);
            
            return responseUtil.restReponse(response);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * reject Outbound contract
     * 
     * @param contMstrDomain
     * @return
     */
    public RestResponse disagreeOutboundContract(ContDtlDomain contDtlDomain) {
        // Contract Confirm AIP DTO
        ApiConfirmContDomain apiConfirmContDomain = new ApiConfirmContDomain();
        
        try {
            // change status value(Draft[DRF] ==> Declined[DCL])
            contDtlDomain.setContSttusCd(CodeConst.DISAGREED);
            contractMapper.updateOutboundContractStatus(contDtlDomain);
            
            // reject other operator's conract(Disagree)
            log.info("[API]Calling Confirm Contract GW Service With DCL...........");
            apiConfirmContDomain.setContSttusCd(CodeConst.DISAGREED);
            apiConfirmContDomain.setContDtlId(contDtlDomain.getContDtlId());
            apiConfirmContDomain.setBcContId(contDtlDomain.getBcContId());
            log.info("[API]Set param...................{}", apiConfirmContDomain);
            
            // Calling Confirming GW API
            ResponseEntity<ApiResponse> response = this.requestForConfirmingContractAPI(apiConfirmContDomain);
            log.info("[API]Result.5=================>{}", response);
            
            return responseUtil.restReponse(response);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * Create Contract DTO for API 
     * 
     * @param contDetail
     */
    public ApiContMstrDomain createContractDTOforAPI(ContractMasterDomain contMstr, String contDtlId) {
        log.info("[API]createContractDTOforAPI=================>{}", contDtlId);
        List<ApiContPlmnDomain> hplmnList = new ArrayList<>();
        List<ApiContPlmnDomain> vplmnList = new ArrayList<>();
        
        String trmPlmnId = contMstr.getTrmPlmnId();
        String [] vplmnArray = trmPlmnId.split(",");
        
        String rcvPlmnId = contMstr.getRcvPlmnId();
        String [] hplmnArray = rcvPlmnId.split(",");
        
        List<String> trmPlmnList = new ArrayList<>(Arrays.asList(vplmnArray));
        List<String> rcvPlmnList = new ArrayList<>(Arrays.asList(hplmnArray));
        
        for (String trmPlmn : trmPlmnList) {
            ApiContPlmnDomain vplmn = new ApiContPlmnDomain();
            vplmn.setPlmnId(trmPlmn);
            vplmnList.add(vplmn); // add elements
        }
        
        for (String rcvPlmn : rcvPlmnList) {
            ApiContPlmnDomain hplmn = new ApiContPlmnDomain();
            hplmn.setPlmnId(rcvPlmn);
            hplmnList.add(hplmn); // add elements
        }
        
        log.info("[API]hplmnList=================>{}", hplmnList);
        log.info("[API]vplmnList=================>{}", vplmnList);
        
        /**
         * I. Base Tarif
         */
        List<ContractBaseTarifDomain> baseTarifList= contractMapper.retrieveContractBaseTarif(contDtlId, null, "bas");
        
        List<ApiContBasDomain> reqBaseTarifList = new ArrayList<>();
        
        for (ContractBaseTarifDomain base : baseTarifList) {
            ApiContBasDomain baseTarif = new ApiContBasDomain();
            baseTarif.setAdtnFeeAmt(base.getAdtnFeeAmt());
            baseTarif.setAdtnFeetypeCd(base.getAdtnFeetypeCd());
            baseTarif.setCallTypeCd(base.getCallTypeCd());
            baseTarif.setContBasTarifId(base.getContBasTarifId());
            baseTarif.setContDtlId(contDtlId);
            baseTarif.setContSpclTarifId(base.getContSpclTarifId());
            baseTarif.setStelTarif(base.getStelTarif());
            baseTarif.setStelUnit(base.getStelUnit());
            baseTarif.setStelVlm(base.getStelVlm());
            baseTarif.setTaxAply(base.getTaxAply());
            reqBaseTarifList.add(baseTarif); // add elements
        }
        //Base Tarif -- End
        
        
        /**
         * II. Spcl Tarif
         */
        List<ContractSpclTarifDomain> spclTarifList = Optional.ofNullable(contractMapper.retrieveContractSpclTarif(contDtlId)).orElse(Collections.emptyList());
        
        List<ApiContSpclDomain> reqSpclTarifList = new ArrayList<>();
        
        spclTarifList.forEach(spcl -> {
        	
            String contSpclTarifId = spcl.getContSpclTarifId();
            List<ContractBaseTarifDomain> baseTarifForSpcl = contractMapper.retrieveContractBaseTarif(contDtlId, contSpclTarifId, "spcl");
            List<ApiContBasDomain> reqBaseTarifListForSpcl = new ArrayList<>();
            
            for (ContractBaseTarifDomain base : baseTarifForSpcl) {
                ApiContBasDomain baseTarif = new ApiContBasDomain();
                baseTarif.setAdtnFeeAmt(base.getAdtnFeeAmt());
                baseTarif.setAdtnFeetypeCd(base.getAdtnFeetypeCd());
                baseTarif.setCallTypeCd(base.getCallTypeCd());
                baseTarif.setContBasTarifId(base.getContBasTarifId());
                baseTarif.setContDtlId(contDtlId);
                baseTarif.setContBasTarifId(base.getContBasTarifId());
                baseTarif.setContSpclTarifId(contSpclTarifId);
                baseTarif.setStelTarif(base.getStelTarif());
                baseTarif.setStelUnit(base.getStelUnit());
                baseTarif.setStelVlm(base.getStelVlm());
                baseTarif.setTaxAply(base.getTaxAply());
                reqBaseTarifListForSpcl.add(baseTarif); // add elements
            }
            
            ApiContSpclDomain spclTarif = new ApiContSpclDomain();
            String [] calltypeArray = spcl.getCallTypeCd().split(",");
            List<String> callTypeCdList = new ArrayList<>(Arrays.asList(calltypeArray));
            
            spclTarif.setCallTypeCd(callTypeCdList);
            spclTarif.setContDtlId(contDtlId);
            spclTarif.setContSpclTarifId(contSpclTarifId);
            spclTarif.setFixAmt(spcl.getFixAmt());
            spclTarif.setFixamtCur(spcl.getFixamtCur());
            spclTarif.setFixAmtDate(spcl.getFixAmtDate());
            spclTarif.setModelTypeCd(spcl.getModelTypeCd());
            spclTarif.setSpclMemo(spcl.getSpclMemo());
            spclTarif.setThrsMax(spcl.getThrsMax());
            spclTarif.setThrsMin(spcl.getThrsMin());
            spclTarif.setThrsTypeCd(spcl.getThrsTypeCd());
            spclTarif.setThrsUnit(spcl.getThrsUnit());
            spclTarif.setCalcBas(reqBaseTarifListForSpcl); // add special base tarif
            reqSpclTarifList.add(spclTarif); // add elements
        	
        });
        
        // Spcl Tarif -- End
        
        /**
         * III. Cont Detail
         */
        ContractDetailDomain contDetail = contractMapper.retrieveContractDetailInfo(contDtlId);
        
        ApiContDtlDomain detail = new ApiContDtlDomain();
        detail.setContDtlId(contDtlId);
        detail.setBcContId(contDetail.getBcContId());
        detail.setCmpnAdr(contDetail.getCmpnAdr());
        detail.setCmpnId(contDetail.getCmpnId());
        detail.setCmpnNm(contDetail.getCmpnNm());
        detail.setContAutoUpdYn(contDetail.getContAutoUpdYn());
        detail.setContCurCd(contDetail.getContCurCd());
        detail.setContDtlMemo(contDetail.getContDtlMemo());
        detail.setContExpDate(contDetail.getContExpDate());
        detail.setContExpNotiDate(contDetail.getContExpNotiDate());
        detail.setContId(contDetail.getContId());
        detail.setContStDate(contDetail.getContStDate());
        detail.setContSttusCd(contDetail.getContSttusCd());
        detail.setExceptAplyCall(contDetail.getExceptAplyCall());
        detail.setTaxAplyPecnt(contDetail.getTaxAplyPecnt());
        detail.setTaxAplytypeCd(contDetail.getTaxAplytypeCd());
        detail.setTaxNo(contDetail.getTaxNo());
        detail.setCalcBas(reqBaseTarifList);
        detail.setCalcSpcl(reqSpclTarifList);
        // Detail -- End
        
        // Main -- Start
        ApiContMstrDomain master = new ApiContMstrDomain();
        master.setContId(contDetail.getContId());
        master.setContrId(contDetail.getContrId());
        master.setContMemo(contDetail.getContMemo());
        master.setContTypeCd(contDetail.getContTypeCd());
        master.setHpmn(hplmnList);
        master.setVpmn(vplmnList);
        master.setContDtl(detail);
        // Main -- End
        
//        ObjectMapper objectMapper = new ObjectMapper();
//        try {
//            String json = objectMapper.writeValueAsString(master);
//            log.info("[ZET]json===================>{}", json);
//        } catch (JsonProcessingException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
        
        return master;
        
    }
    
    
    /**
     * Calling Create Contract Gateway API
     * 
     * @param apiContMstrDomain
     * @return
     */
    public ResponseEntity<ApiResponse> requestForCreatingContractAPI(ApiContMstrDomain apiContMstrDomain) {
        try {
            String apiEndpoint = gatewayApiUrl + createContractService;
            log.info("[API]Calling Create Contract apiEndpoint...............{}", apiContMstrDomain);
            log.info("[API]Calling Create Contract apiEndpoint...............{}", apiEndpoint);
            
            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<ApiContMstrDomain> requestBody = new HttpEntity<>(apiContMstrDomain, headers);
            
            ResponseEntity<ApiResponse> response = restTemplate.postForEntity(apiEndpoint, requestBody, ApiResponse.class);
            log.info("[API]Result Create Contract GW Service.................{}", response.getBody().getResCd());
            return response;
            
        } catch (HttpServerErrorException ex) {
            throw new CommonException(messageUtil.getMessage("app.contract.details.m064"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * Calling Confirming Contract Gateway API
     * 
     * @param apiConfirmContDomain
     * @return
     */
    public  ResponseEntity<ApiResponse> requestForConfirmingContractAPI(ApiConfirmContDomain apiConfirmContDomain) {
        try {
            String apiEndpoint = gatewayApiUrl + confirmContractService;
            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);
            headers.setContentType(MediaType.APPLICATION_JSON);
            log.info("[API]Calling Confirm Contract apiEndpoint..............{}", apiEndpoint);
            
            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<ApiConfirmContDomain> requestBody = new HttpEntity<>(apiConfirmContDomain, headers);
            
            ResponseEntity<ApiResponse> response = restTemplate.postForEntity(apiEndpoint, requestBody, ApiResponse.class);
            log.info("[API]Result Confirm Contract GW Service #..............{}", response);
            return response;
            
        } catch (HttpServerErrorException ex) {
            throw new CommonException(messageUtil.getMessage("app.contract.details.m064"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
}
