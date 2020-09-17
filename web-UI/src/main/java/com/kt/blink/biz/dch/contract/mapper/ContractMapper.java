/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.dch.contract.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.dch.contract.domain.ContBasTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContDtlDomain;
import com.kt.blink.biz.dch.contract.domain.ContMstrDomain;
import com.kt.blink.biz.dch.contract.domain.ContSpclBasTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContSpclTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContractBaseTarifDomain;
import com.kt.blink.biz.dch.contract.domain.ContractDetailDomain;
import com.kt.blink.biz.dch.contract.domain.ContractMasterDomain;
import com.kt.blink.biz.dch.contract.domain.ContractSpclTarifDomain;

/**
 * Contract Query Mapper
 */
@Mapper
@Repository
public interface ContractMapper {

    /**
     * save contract master (Agreement)
     * 
     * @param contMstrDomain
     * @return
     */
    Integer saveContractMaster(ContMstrDomain contMstrDomain);
    
    
    /**
     * save contract Detail
     * 
     * @param contDtlDomain (Contract)
     * @return
     */
    Integer saveContractDetail(ContDtlDomain contDtlDomain);
    
    
    /**
     * save contract base tarif dependent on contract detail
     * 
     * @param contDtlBasTarif
     * @return
     */
    Integer saveContDtlBasTarif(ContBasTarifDomain contDtlBasTarif);
    
    
    /**
     * save contract special tarif
     * 
     * @param ContSpclTarif
     * @return
     */
    Integer saveContSpclTarif(ContSpclTarifDomain contSpclTarif);
    
    
    /**
     * save contract base tarif dependent on contract special tarif
     * 
     * @param contSpclBasTarif
     * @return
     */
    Integer saveContSpclBasTarif(ContSpclBasTarifDomain contSpclBasTarif);
    
    
    /**
     * find carriers agreement by plmns
     * 
     * @param trmPlmnId
     * @param rcvPlmnId
     */
    String findMasterContractByPlmn(@Param("trmPlmnId") String trmPlmnId, @Param("rcvPlmnId") String rcvPlmnId);
    
    
    /**
     * inquiry agreement between operators
     * 
     * @param dataTablesRequest
     * @return
     */
     List<ContMstrDomain> findMasterContractBetweenPlmns(ContMstrDomain contMstrDomain);
     
     
     /**
      * inquiry signed contract between operators 
      * 
      * @param contMstrDomain
      * @return
      */
     ContMstrDomain findAgreementByPlmns(ContMstrDomain contMstrDomain);

     /**
      * inquiry signed contract between operators  [My ==>> Partner]
      * Same Agreement Id with different contType direction
      * 
      * @param contMstrDomain
      * @return
      */
     ContMstrDomain findInboundAgreementByPlmns(ContMstrDomain contMstrDomain);
     
     
     /**
      * inquiry signed contract between operators [My <<== Partner]
      * Same Agreement Id with different contType direction
      * 
      * @param contMstrDomain
      * @return
      */
     ContMstrDomain findOutboundAgreementByPlmns(ContMstrDomain contMstrDomain);
    
    
     /**
      * inquiry all contracts under a specific agreement
      * 
      * @param contId
      * @return
      */
    List<ContDtlDomain> findContractByContId(@Param("contId") String contId);
    
    
    /**
     * inquiry contract details
     * 
     * @param contId
     * @param contDtlId
     * @return
     */
    ContDtlDomain findContDtlByContIdAndConDtlId(@Param("contId") String contId, @Param("contDtlId") String contDtlId);
    
    
    /**
     * inquiry basic tariff of selected contract
     * 
     * @param contDtlId
     * @return
     */
    List<ContBasTarifDomain> findContBasTarifsByContDtlId(@Param("contDtlId") String contDtlId);
    
    
    /**
     * inquiry special tariff of selected contract
     * 
     * @param contDtlId
     * @return
     */
    List<ContSpclTarifDomain> findContSpclTarifsByContDtlId(@Param("contDtlId") String contDtlId);
    
    
    /**
     * inquiry basic tariff details of selected contract 
     * 
     * @param contId
     * @param contSpclTarifId
     * @return
     */
    List<ContSpclBasTarifDomain> findContSpclBasTarifsByContDtlIdAndContSpclTarifId(@Param("contDtlId") String contDtlId, @Param("contSpclTarifId") String contSpclTarifId);
    
    
    /**
     * modify contract information
     * 
     * @param contDtlDomain
     */
    Integer updateContractDetail(ContDtlDomain contDtlDomain);


    /**
     * delete basic tariff of contract
     * 
     * @param contDtlId
     */
    Integer deleteContDtlBasTarifByContDtlId(@Param("contDtlId") String contDtlId);


    /**
     * delete special tariff of contract
     * 
     * @param contDtlId
     */
    Integer deleteContSpclTarifByContDtlId(@Param("contDtlId") String contDtlId);
    
    
    /**
     * change the status of outbound contract to Accept (Agreed [AGR]) or Reject (Declined [DCL])
     * 
     * @param contDtlDomain
     * @return
     */
    Integer updateOutboundContractStatus(ContDtlDomain contDtlDomain);
    
    
    /**
     * find contract detail id by contract id
     * 
     * @param contId
     * @return
     */
    String findContractDtlIdById(@Param("contId") String contId);
    
    
    /**
     * find Contract Master Info
     * 
     * @param contId
     * @return
     */
    ContractMasterDomain retrieveContractMasterInfo(@Param("contId") String contId);
    
    
    /**
     * find Contract detail info for Api
     * 
     * @return
     */
    ContractDetailDomain retrieveContractDetailInfo(@Param("contDtlId") String contDtlId);
    
    
    /**
     * find Contract detail base tarif info for Api
     * 
     * @param queryCondition
     * @return
     */
    List<ContractBaseTarifDomain> retrieveContractBaseTarif(@Param("contDtlId") String contDtlId, @Param("contSpclTarifId") String contSpclTarifId, @Param("tarifType") String tarifType);
    
    
    /**
     * find Contract detail spcl tarif info for Api
     * 
     * @param queryCondition
     * @return
     */
    List<ContractSpclTarifDomain> retrieveContractSpclTarif(@Param("contDtlId") String contDtlId);
    
    
}
