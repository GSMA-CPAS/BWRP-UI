/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.admin.cntry.domain.CntryDomain;
import com.kt.blink.biz.admin.cntry.mapper.CntryMapper;
import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.admin.plmn.mapper.PlmnsMapper;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.mapper.CodeInfoMapper;
import com.kt.blink.biz.common.utils.MessageUtil;

@Service
public class CommonService {

    @Autowired
    private PlmnsMapper plmnsMapper;

    @Autowired
    private CntryMapper cntryMapper;

    @Autowired
    private CodeInfoMapper codeInfoMapper;

    @Autowired
    private MessageUtil messageUtil;

    /**
     * partner plmns list
     * @return
     */
    public List<PlmnsDomain> getPartnerPlmns(PlmnsDomain plmn) {
        try {
            if(plmn == null) {
                PlmnsDomain plmns = new PlmnsDomain();
                return plmnsMapper.getPartnerPlmns(plmns);
            }else {
                return plmnsMapper.getPartnerPlmns(plmn);
            }
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }        
    }
    
    /**
     * cntry code list
     * @param cntry
     * @param errorMessage
     * @return
     */
    public List<CntryDomain> getCntryList(CntryDomain cntry) {
        try {
            if(cntry == null) {
                CntryDomain cnry = new CntryDomain();
                return cntryMapper.getCntryList(cnry);
            }else {
                return cntryMapper.getCntryList(cntry);
            }
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }

    /**
     * find code list by code group id
     * 
     * @param cdGroupId
     * @return
     */
    public List<CodeInfo> findCodesByCdGrpId(String cdGroupId) {
        try {
            return Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(cdGroupId)).orElse(Collections.emptyList());
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    

    /**
     * find specific code by code id and code group id
     * 
     * @param cdId
     * @param cdGroupId
     * @return
     */
    public CodeInfo findCodeByCdIdAndCdGrpId(String cdId, String cdGroupId) {
        try {
            return Optional.ofNullable(codeInfoMapper.findCodeByCdIdAndCdGrpId(cdId, cdGroupId)).orElseGet(CodeInfo::new);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
}
