package com.kt.blink.biz.dashboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.dashboard.domain.MainDomain;
import com.kt.blink.biz.dashboard.domain.MainSalesDomain;
import com.kt.blink.biz.dashboard.mapper.MainboardMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Board Service
 */
@Slf4j
@Service
public class MainboardService {
    
    @Autowired
    private MainboardMapper mainboardMapper;
    
    @Autowired
    private MessageUtil messageUtil;
    
    
    /**
     * inbound revenue
     * @param tap
     * @return
     */
    public List<MainDomain> getMainInfo(MainDomain tap) {
        try {
            return mainboardMapper.getMainInfo(tap);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    public List<MainSalesDomain> getSalesInfo(MainSalesDomain tap) {
        try {
            return mainboardMapper.getSalesInfo(tap);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
}
