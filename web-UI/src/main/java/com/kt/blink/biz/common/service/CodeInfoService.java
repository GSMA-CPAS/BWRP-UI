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
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.mapper.CodeInfoMapper;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;

@Service
public class CodeInfoService {

    @Autowired
    private CodeInfoMapper codeInfoMapper;
    
    @Autowired
    private MessageUtil messageUtil;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    
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
     * insert new group code
     * 
     * @param codeInfo
     * @return
     */
    public Integer saveCodeGroup(CodeInfo codeInfo) {
        try {
            return codeInfoMapper.saveCodeGroup(codeInfo);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * insert new code
     * 
     * @param codeInfo
     * @return
     */
    public Integer saveCode(CodeInfo codeInfo) {
        try {
            return codeInfoMapper.saveCode(codeInfo);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * find common codes
     * 
     * @return
     */
    public RestResponse findCommonCodes() {
        
        try {
            
            // 1. find my plmns
            List<CodeInfo> myNetworks = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.MY_NETWORK).stream()
                    .sorted(Comparator.comparing(CodeInfo::getCdId)).collect(Collectors.toList())).orElse(Collections.emptyList());
            
            // 2. find partner plmns
            List<CodeInfo> partnerNetworks = Optional.ofNullable(codeInfoMapper.findPartnerPlmns().stream()
                    .sorted(Comparator.comparing(CodeInfo::getCdId)).collect(Collectors.toList())).orElse(Collections.emptyList());
            
            // 3. find Contract Type Codes
            List<CodeInfo> contTypeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.CONT_TYPE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 4. find Contract Auto Update Yes/No Codes
            List<CodeInfo> contAutoUpdYnCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.CONT_AUTO_UPD_GRPID))
                    .orElse(Collections.emptyList());
            
            // 5. find Currency Codes
            List<CodeInfo> currencyCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.CURRENCY_GRPID))
                    .orElse(Collections.emptyList());
            
            // 6. find Tax Application Codes
            List<CodeInfo> taxAplyTypeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.TAX_APLY_TYPE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 7. find Exclude Call Codes
            List<CodeInfo> excludeCallTypeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.EXCLUDE_CALL_TYPE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 8. find Call Type Codes
            List<CodeInfo> callTypeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.CALL_TYPE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 9. find Unit Codes
            List<CodeInfo> unitCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.UNIT_GRPID))
                    .orElse(Collections.emptyList());
            
            // 10. find Additional Fee Type Codes
            List<CodeInfo> addFeeTypeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.ADD_FEE_TYPE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 11. find Special Mode Codes
            List<CodeInfo> specialModeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.SPECIAL_MODE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 12. find Threshold Type Codes
            List<CodeInfo> thrsTypeCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.THRESHOLD_TYPE_GRPID))
                    .orElse(Collections.emptyList());
            
            // 13. find Tap Direction Codes
            List<CodeInfo> tapDirectionCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.TAP_DIRECTION))
                    .orElse(Collections.emptyList());
            
            // 14. find Tap file search date cond Codes
            List<CodeInfo> tapFileSrchDateCondCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.TAP_FILE_SRCH_DT_COND))
                    .orElse(Collections.emptyList());
            
            // 15. find Tap file processed status Codes
            List<CodeInfo> tapFileTrtSttusCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.TAP_FILE_TRT_STTUS))
                    .orElse(Collections.emptyList());
            
            // 16. Sales Display Unit
            List<CodeInfo> salesUnitCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.SALES_UNIT))
                    .orElse(Collections.emptyList());
            
            // 17. Double Value Decimal Precision For List
            CodeInfo listPrecision = Optional.ofNullable(codeInfoMapper.findCodeByCdIdAndCdGrpId(CodeConst.DCM_PRCSN_LIST, CodeConst.DCM_POINT))
                    .orElseGet(CodeInfo::new);
            
            // 18. Double Value Decimal Precision For Detail
            CodeInfo detailPrecision = Optional.ofNullable(codeInfoMapper.findCodeByCdIdAndCdGrpId(CodeConst.DCM_PRCSN_DTL, CodeConst.DCM_POINT))
                    .orElseGet(CodeInfo::new);
            
            // 19. Tap Search Range Limit Days
            CodeInfo searchRange = Optional.ofNullable(codeInfoMapper.findCodeByCdIdAndCdGrpId(CodeConst.RANGE, CodeConst.SEARCH_RANGE))
                    .orElseGet(CodeInfo::new);
            
            // 20. Allow Past Contract
            CodeInfo allowPastCont = Optional.ofNullable(codeInfoMapper.findCodeByCdIdAndCdGrpId(CodeConst.ALLOW_PAST_CONT, CodeConst.TEST_YN))
                    .orElseGet(CodeInfo::new);
            
            // 21. find Tap detail search date cond Codes
            List<CodeInfo> tapDtlSrchDateCondCodes = Optional.ofNullable(codeInfoMapper.findCodesByCdGrpId(CodeConst.TAP_DETAIL_SRCH_DT_COND))
                    .orElse(Collections.emptyList());
            
            Map<String, Object> mapList = new HashMap<>();
            mapList.put("myNetworks", myNetworks);
            mapList.put("partnerNetworks", partnerNetworks);
            mapList.put("contTypeCodes", contTypeCodes);
            mapList.put("contAutoUpdYnCodes", contAutoUpdYnCodes);
            mapList.put("currencyCodes", currencyCodes);
            mapList.put("taxAplyTypeCodes", taxAplyTypeCodes);
            mapList.put("excludeCallTypeCodes", excludeCallTypeCodes);
            mapList.put("callTypeCodes", callTypeCodes);
            mapList.put("unitCodes", unitCodes);
            mapList.put("addFeeTypeCodes", addFeeTypeCodes);
            mapList.put("specialModeCodes", specialModeCodes);
            mapList.put("thrsTypeCodes", thrsTypeCodes);
            mapList.put("tapDirectionCodes", tapDirectionCodes);
            mapList.put("tapFileSrchDateCondCodes", tapFileSrchDateCondCodes);
            mapList.put("tapFileTrtSttusCodes", tapFileTrtSttusCodes);
            mapList.put("salesUnitCodes", salesUnitCodes);
            mapList.put("listPrecision", listPrecision);
            mapList.put("detailPrecision", detailPrecision);
            mapList.put("searchRange", searchRange);
            mapList.put("allowPastCont", allowPastCont);
            mapList.put("tapDtlSrchDateCondCodes", tapDtlSrchDateCondCodes);
            
            return responseUtil.restReponse(mapList);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
}
