package com.kt.blink.biz.fch.finance.service;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.fch.finance.domain.FinanceDomain;
import com.kt.blink.biz.fch.finance.mapper.FinanceMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FinanceService {

    @Autowired
    private FinanceMapper financeMapper;
            
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    /**
     * invoice/ note list
     * @param inv
     * @return
     */
    public DataTablesResponse<FinanceDomain> retrieveFinanceList(FinanceDomain finan) {
        try {
            List<FinanceDomain> items = Optional.ofNullable(financeMapper.retrieveFinanceList(finan)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(FinanceDomain::getTotalCount).findFirst().orElse(0L);
                        
            return responseUtil.dataTablesResponse(totalCount, finan.getDataTablesRequest().getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * set null
     */
    public void setNull(Object o) {
        
        try {
            Field[] fields = o.getClass().getDeclaredFields();
            
            for(Field field : fields) {
                String type = field.getType().getTypeName();
                String name = field.getName();
//              log.debug("type : {}, name : {} ", type, name);
                if(StringUtils.equals(type, "java.lang.String")) {
                    PropertyDescriptor pd = new PropertyDescriptor(name, o.getClass());
                    Method getter = pd.getReadMethod();
                    Object f = getter.invoke(o);
                    
                    if(f == null) {
                        Method setter = pd.getWriteMethod();
                        setter.invoke(o, "");
                    }
                }
            }
        }catch(Exception e) {
            log.info("log parsing error ", e);
        }
    }
}
