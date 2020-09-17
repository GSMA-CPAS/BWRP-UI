/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.finance.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.fch.finance.domain.FinanceReportDomain;

/**
 * finance report mapper
 */
@Mapper
@Repository
public interface FinanceReportMapper {
    
    /**
     * find sales info by Amount
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findSalesInfoByAmount(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find sales info by Count
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findSalesInfoByCount(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find sales info by Volume
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findSalesInfoByVolume(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find sales info by IMSI
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findSalesInfoByIMSI(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find regression info By Amount
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findRegressionInfoByAmount(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find regression info By Count
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findRegressionInfoByCount(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find regression info By Volume
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findRegressionInfoByVolume(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find regression info By IMSI
     * 
     * @param financeReportDomain
     * @return
     */
    List<FinanceReportDomain> findRegressionInfoByIMSI(FinanceReportDomain financeReportDomain);
    
    
    /**
     * find Company Plmns
     * 
     * @param companyCode
     * @return
     */
    List<String> findPartnerNetworksFromCompanyCode(@Param("companyCode") String companyCode);
    
    
}
