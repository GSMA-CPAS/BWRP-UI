package com.kt.blink.biz.fch.invoice.service;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.mapper.CodeInfoMapper;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.dashboard.domain.DashDomain;
import com.kt.blink.biz.fch.invoice.domain.InvUser;
import com.kt.blink.biz.fch.invoice.domain.InvoiceAmtListDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceErateListDomain;
import com.kt.blink.biz.fch.invoice.domain.TapDaySumDomain;
import com.kt.blink.biz.fch.invoice.domain.TapFileSumDomain;
import com.kt.blink.biz.fch.invoice.mapper.InvoiceMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@Service
public class InvoiceService {

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Autowired
    private CodeInfoMapper codeMapper;
                
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    RestTemplate restTemplate;   
    
    @Value("${blink.gateway.url}")
    private String gwUrl;
    
//
    @Value("${blink.gateway.invostat}")
    private String invoStatUrl;
    
    /**
     * invoice/ note list
     * @param inv
     * @return
     */
    public DataTablesResponse<TapFileSumDomain> retrieveInvoiceList(InvoiceDomain inv) {
        try {
            List<TapFileSumDomain> items = Optional.ofNullable(invoiceMapper.retrieveInvoiceList(inv)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(TapFileSumDomain::getTotalCount).findFirst().orElse(0L);
            
             if(!items.isEmpty()) { 
                 String revSum = StringUtils.defaultIfBlank(items.get(0).getRevenueSum(), "0");
                 String expSum = StringUtils.defaultIfBlank(items.get(0).getExpenseSum(), "0");
                 BigDecimal revenueSum = new BigDecimal(revSum); 
                 BigDecimal expenseSum = new BigDecimal(expSum); 
                 BigDecimal profitSum = null;
                  
                 profitSum = revenueSum.subtract(expenseSum);
                  
                 items.get(0).setProfitSum(profitSum.toString()); 
              }
            
            return responseUtil.dataTablesResponse(totalCount, inv.getDataTablesRequest().getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    /**
     * update inv stat
     * @param inv
     * @return
     */
    public RestResponse updateInvoiceStat(InvoiceDomain inv) {
        try {
            Integer rc = invoiceMapper.updateInvoiceStat(inv);
            log.debug("result count=========>{}", rc);
            
            if(inv.getInvocIds() != null && !inv.getInvocIds().isEmpty()) {
                for(String invId : inv.getInvocIds()) {
                    
                    InvoiceDomain data = new InvoiceDomain();
                    data.setInvocId(invId);
                    
                    //invoice status g/w call
                    InvoiceDomain item = invoiceMapper.getInvocInfo(data);
                    
                    setNull(item);
                    
                    Map<String, Object> invoc = new HashMap<>();
                    invoc.put("VPMN", item.getTrmPlmnId());
                    invoc.put("HPMN", item.getRcvPlmnId());
                    invoc.put("INVOC_ID", item.getInvocId());
                    invoc.put("INVOC_STTUS_CD", inv.getStatusCd());
                    invoc.put("INVOC_PBLS_DT", StringUtils.replace(item.getInvocPblsDt(),"-",""));
                                        
                    log.info("call INVOICE STATUS CHANGE I/F  {} ", doLog(invoc));
                    
                    if(!StringUtils.equals(callGateWay(invoc, invoStatUrl, HttpMethod.POST), "OK")) {
                        throw new CommonException(messageUtil.getMessage("inv.msg.gw01"), ErrorCode.INTERNAL_SERVER_ERROR);
                    }
                }
            }
                        
            return responseUtil.restReponse(rc);
        } catch (CommonException ce) {
            throw new CommonException(ce.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR, ce);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * invoice amt list
     * @param invoc
     * @return
     */
    public List<InvoiceAmtListDomain> getInvocAmtList(InvoiceDomain invoc) {
        try {
            return invoiceMapper.getInvocAmtList(invoc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * invoice erate list
     * @param invoc
     * @return
     */
    public List<InvoiceErateListDomain> getInvocErateList(InvoiceDomain invoc) {
        try {
            return invoiceMapper.getInvocErateList(invoc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * invoice info
     * @param invoc
     * @return
     */
    public InvoiceDomain getInvocInfo(InvoiceDomain invoc) {
        try {
            return Optional.ofNullable(invoiceMapper.getInvocInfo(invoc)).orElseGet(InvoiceDomain::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * retrieve daily tap list
     * @param inv
     * @return
     */
    public DataTablesResponse<TapFileSumDomain> retrieveDayTapList(InvoiceDomain inv) {
        try {
            List<TapFileSumDomain> items = Optional.ofNullable(invoiceMapper.retrieveDayTapList(inv)).orElse(Collections.emptyList());
            Long totalCount = items.stream().map(TapFileSumDomain::getTotalCount).findFirst().orElse(0L);
            
            
            if(!items.isEmpty()) {
                
                TapFileSumDomain item = Optional.ofNullable(invoiceMapper.retrieveDayTapListSum(inv)).orElseGet(TapFileSumDomain::new);
                                
                items.get(0).setTotSumTotAmt(item.getTotSumAmt());   
                items.get(0).setTotSumTotRecdCnt(item.getTotSumRecdCnt()); 
                items.get(0).setMocTotVoRecdCnt(item.getMocVoRecdCnt());   
                items.get(0).setMocTotVoUseQnt(item.getMocVoUseQnt());
                items.get(0).setMocTotVoCalcAmt(item.getMocVoCalcAmt());  
                items.get(0).setMtcTotVoRecdCnt(item.getMtcVoRecdCnt());   
                items.get(0).setMtcTotVoUseQnt(item.getMtcVoUseQnt());
                items.get(0).setMtcTotVoCalcAmt(item.getMtcVoCalcAmt());
                items.get(0).setDataTotRecdCnt(item.getDataRecdCnt());   
                items.get(0).setDataTotUseQnt(item.getDataUseQnt());
                items.get(0).setDataTotCalcAmt(item.getDataCalcAmt());
                items.get(0).setSmsTotRecdCnt(item.getSmsRecdCnt());
                items.get(0).setSmsTotCalcAmt(item.getSmsCalcAmt());
                
                
            }
            
            
            return responseUtil.dataTablesResponse(totalCount, inv.getDataTablesRequest().getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    /**
     * invoice daily list
     * @param inv
     * @return
     */
    public List<TapDaySumDomain> retrieveInvDayList(InvoiceDomain inv) {
        try {  

            CodeInfo cd = codeMapper.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");
            if(cd != null) {
                inv.setDecPoint(cd.getCdVal1());
            }else {
                inv.setDecPoint("4");
            }
            return invoiceMapper.retrieveInvDayList(inv);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }        
    }
    
    /**
     * invoice contact info
     * @param invoc
     * @return
     */
    public InvUser getInvContactInfo(InvoiceDomain invoc) {
        try {
            return Optional.ofNullable(invoiceMapper.getInvContactInfo(invoc)).orElseGet(InvUser::new) ;
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * invoice pop, pdf
     * @param invoc
     * @return
     */
    public Map<String, Object> getInvocPop(InvoiceDomain invoc) {
        try {  
            Map<String, Object> res = new HashMap<>();
            
            //invoice detail
            InvoiceDomain invDet = getInvocInfo(invoc);
            setNull(invDet);
            invDet.setDecPoint(invoc.getDecPoint());
            res.put("invoc", invDet);
            
            invoc.setTrafcStDay(invDet.getTrafcStDay());
            invoc.setTrafcEndDay(invDet.getTrafcEndDay());
            invoc.setTrmPlmnId(invDet.getTrmPlmnId());
            invoc.setRcvPlmnId(invDet.getRcvPlmnId());
            
            //currency amt
            List<InvoiceAmtListDomain> amtList = getInvocAmtList(invoc);
            res.put("amtList", amtList);
            //invoice exchage list
            List<InvoiceErateListDomain> erateList = getInvocErateList(invoc);
            res.put("erateList", erateList);
            //tap daily list
            List<TapDaySumDomain> tapList = retrieveInvDayList(invoc);
            res.put("tapList", tapList);
            //sum
            TapDaySumDomain tapSum = new TapDaySumDomain();
            if(!tapList.isEmpty()) {
                TapDaySumDomain item = invoiceMapper.retrieveInvDayListSum(invoc);
                
                tapSum.setSdrTotSumAmt(item.getSdrSumAmt());   
                tapSum.setSdrTotTaxAmt(item.getSdrTaxAmt()); 
                tapSum.setSdrTotResltAmt(item.getSdrResltAmt());  
                
            }
            res.put("tapSum", tapSum);  
            
            return res;        
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }        
    }
    
    /**
     * invoice pie commitment
     * @param invoc
     * @return
     */
    public Map<String, Object> getInOutCommitInfo(InvoiceDomain invoc) {
        try {  
            Map<String, Object> res = new HashMap<>();
            
            //invoice detail
            InvoiceDomain invDet = getInvocInfo(invoc);
            setNull(invDet);
            
            DashDomain tap = new DashDomain();
            tap.setInvocDirectCd(invoc.getInvocDirectCd());
            tap.setMinSetlDay(invDet.getTrafcStDay());
            tap.setMaxSetlDay(invDet.getTrafcEndDay());
            
//            if(StringUtils.equals(invoc.getInvocDirectCd(), "OUT")) {
                tap.setRcvPlmnId(invDet.getRcvPlmnId());
                tap.setTrmPlmnId(invDet.getTrmPlmnId());
//            }else {
//                tap.setRcvPlmnId(invDet.getTrmPlmnId());
//                tap.setTrmPlmnId(invDet.getRcvPlmnId());
//            }
            
            DashDomain commit = Optional.ofNullable(invoiceMapper.getInvInOutCommitInfo(tap)).orElseGet(DashDomain::new);
            commit.setMaxSetlDay(invDet.getTrafcEndDay()); // invoice last day
//            if(StringUtils.equals(invoc.getInvocDirectCd(), "OUT")) {
                commit.setRcvPlmnId(invDet.getRcvPlmnId());
                commit.setTrmPlmnId(invDet.getTrmPlmnId());
//            }else {
//                commit.setRcvPlmnId(invDet.getTrmPlmnId());
//                commit.setTrmPlmnId(invDet.getRcvPlmnId());
//            }
            DashDomain pie = Optional.ofNullable(invoiceMapper.getInvInOutCommitAmt(commit)).orElseGet(DashDomain::new);
            setNull(pie);
            res.put("commit", commit);
            res.put("pie", pie);
            return res;           
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }        
    }
    
    
    /**
     * GW call
     * @param body
     * @param url
     * @return
     */
    public String callGateWay(Map<String, Object> body, String url, HttpMethod method) {
        String rslt = "OK";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);
            headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
            
            HttpEntity<Map<String, Object>> requestBody = new HttpEntity<>(body, headers);
            
            log.info("call GateWay URL : {}{}", gwUrl, url);
              
            ResponseEntity<String> response = restTemplate.exchange(gwUrl + url, method, requestBody, String.class);
        
            log.info("response.getStatusCode() : {}", response.getStatusCode());
            log.info("response.getStatusCodeValue() : {}", response.getStatusCodeValue());
            log.info("response.getBody() : [{}]", doLog(response.getBody()));
            log.info("responseData2 : [{}]", response);
            
            int statusCode = response.getStatusCodeValue();
            
            String result = response.getBody();
            
            boolean resultCd = false;
            if(result != null ) {
                resultCd = StringUtils.contains(result, "200");
            }
            
            log.info("statusCode : {}, resultCd : {} ", statusCode, resultCd);
            
            if(statusCode == 200 && resultCd) {
                rslt = "OK";
            }else {
                log.error("response.getStatusCode() : {}", response.getStatusCode());
                log.error("response.getStatusCodeValue() : {}", response.getStatusCodeValue());
                log.error("response.getBody() : [{}]", doLog(response.getBody()));
                
                rslt = "ERROR";
            }
        }catch(Exception e) {
            throw new CommonException(messageUtil.getMessage("inv.msg.gw01"), ErrorCode.INTERNAL_SERVER_ERROR, e);
        }
        
        return rslt;
        
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
    

    /**
     * log
     * @param o
     * @return
     */
    public String doLog(Object o) {
        String logs = "";
        if(o != null ) {
            try {
                logs = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(o);
            }catch(JsonProcessingException e) {
                log.error("log parsing error ", e);
            }
        }
        return logs;
    }
}
