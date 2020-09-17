package com.kt.blink.biz.dashboard.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.dashboard.domain.DashDomain;
import com.kt.blink.biz.dashboard.mapper.DashboardMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Board Service
 */
@Slf4j
@Service
public class DashboardService {
    
    @Autowired
    private DashboardMapper dashboardMapper;
    
    @Autowired
    private MessageUtil messageUtil;
    
    /**
     * find code list by code group id
     * 
     * @param cdGroupId
     * @return
     */
    public List<CodeInfo> findCompList() {
        try {
            return Optional.ofNullable(dashboardMapper.findCompList()).orElse(Collections.emptyList());
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * inbound revenue
     * @param tap
     * @return
     */
    public DashDomain getInOutboundAmt(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getInOutboundAmt(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * comp recv pay
     * @param tap
     * @return
     */
    public DashDomain getInOutboundCompAmt(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getInOutboundCompAmt(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     *  getInOutProcessed
     * @param tap
     * @return
     */
    public DashDomain getInOutProcessed(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getInOutProcessed(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * inbound receivable
     * @param tap
     * @return
     */
    public DashDomain getRecvOrPay(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getRecvOrPay(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * comp recv pay
     * @param tap
     * @return
     */
    public DashDomain getCompRecvOrPay(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getCompRecvOrPay(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * inbound commitment
     * @param tap
     * @return
     */
    public DashDomain getInOutCommit(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getInOutCommit(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * inbound commitment revenue
     * @param tap
     * @return
     */
    public DashDomain getInOutCommitAmt(DashDomain tap) {
        try {
            return Optional.ofNullable(dashboardMapper.getInOutCommitAmt(tap)).orElseGet(DashDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
}
