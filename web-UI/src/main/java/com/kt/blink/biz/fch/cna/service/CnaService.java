package com.kt.blink.biz.fch.cna.service;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
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
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.mapper.CodeInfoMapper;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.fch.cna.domain.NoteAmtListDomain;
import com.kt.blink.biz.fch.cna.domain.NoteDomain;
import com.kt.blink.biz.fch.cna.mapper.CnaMapper;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@Service
public class CnaService {

    @Autowired
    private CnaMapper cnaMapper;
            
    @Autowired
    private CodeInfoMapper codeMapper;
    
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;

    @Autowired
    RestTemplate restTemplate;   

    @Autowired
    private ObjectMapper mapper;
    
    @Value("${blink.gateway.url}")
    private String gwUrl;
    
    @Value("${blink.gateway.notecreate}")
    private String noteUrl;
    
    /**
     * note reg info
     * @param invoc
     * @return
     */
    public NoteDomain getInvCnaInfo(InvoiceDomain invoc) {
        try {
            return Optional.ofNullable(cnaMapper.getInvCnaInfo(invoc)).orElseGet(NoteDomain::new);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    /**
     * insert note
     * @param note
     * @return
     */
    public RestResponse insertNote(NoteDomain note) {
        try {
            
            CodeInfo cd = codeMapper.findCodeByCdIdAndCdGrpId("NCAL", "DecPoint");
            if(cd != null) {
                note.setDecPoint(cd.getCdVal1());
            }else {
                note.setDecPoint("6");
            }
            
            Integer rc = cnaMapper.insertNote(note);
                                
            if(StringUtils.isNotBlank(note.getOrgNoteRefNum())) {
                //CNA closed
                rc += cnaMapper.updateNote(note);          

                log.debug("call CNA STATUS CHANGE I/F  {} ", note.getOrgNoteRefNum());
            }
            
            setNull(note);
            
            HashMap<String, Object> body = new HashMap<>();
            body.put("TRM_PLMN_ID", note.getTrmPlmnId());
            body.put("RCV_PLMN_ID", note.getRcvPlmnId());
            body.put("CRE_DATE_VAL", note.getCreDateVal());  //
            body.put("NOTE_REF_NUM", note.getNoteRefNum());
            body.put("INVOC_ID", note.getInvocId());
            body.put("INVOC_NM", note.getInvocNm());
            body.put("TRAFFIC_PEROID", note.getTrafcDay()); //
            body.put("NOTE_AMT", note.getNoteAmt());
            body.put("CONT_CUR_CD", note.getContCurCd());
            body.put("REQ_REASON", note.getReqReason());
            body.put("CONT_DTL_ID", note.getContDtlId());
            body.put("NOTE_STATUS_CD", note.getNoteStatusCd());
            body.put("NOTE_KIND_CD", note.getNoteKindCd());
            body.put("TRM_CMPN_NM", note.getTrmCmpnNm());
            body.put("TRM_CMPN_ADR", note.getTrmCmpnAdr());
            body.put("RCV_CMPN_NM", note.getRcvCmpnNm());
            body.put("RCV_CMPN_ADR", note.getRcvCmpnAdr());
            body.put("TAX_INCL_YN", note.getTaxInclYn());
            body.put("TAX_APLY_PECNT", note.getTaxAplyPecnt());
            body.put("TAX_AMT", note.getTaxAmt()); //
            body.put("TAX_NO", note.getTaxNo());  //
            body.put("CONT_NM", note.getContNm());
            body.put("CONT_TEL_NO", note.getContTelNo());
            body.put("CONT_FAX_NO", note.getContFaxNo());
            body.put("CONT_EMAIL", note.getContEmail());
            
            if(StringUtils.isNotBlank(note.getOrgNoteRefNum())) {
                body.put("CNA_REF_NUM", note.getOrgNoteRefNum());
            }else {
                body.put("CNA_REF_NUM", "");
            }
            
            //insert amt list
            rc += cnaMapper.insertNoteAmt(note);    
            
            List<NoteAmtListDomain> amtList = cnaMapper.getNoteAmtList(note);
            
            List<HashMap<String, Object>> noteAmtList = new ArrayList<>();
            
            if(amtList != null && !amtList.isEmpty()) {
                for(NoteAmtListDomain item : amtList) {
                    HashMap<String, Object> amt = new HashMap<>();
                    
                    amt.put("NOTE_REF_NUM", item.getNoteRefNum());
                    amt.put("NOTE_CUR", item.getNoteCur());
                    amt.put("NOTE_AMT", item.getNoteAmt());
                    amt.put("TAX_AMT", item.getTaxAmt());
                    amt.put("TOT_AMT", item.getTotAmt());
                    
                    noteAmtList.add(amt);
                }
            }

            body.put("noteAmtList", noteAmtList);
            
            log.info("call CNA/CN/DN I/F  {} ", doLog(body));
            //call GateWay
            if(!StringUtils.equals(callGateWay(body, noteUrl, HttpMethod.POST), "OK")) {
                throw new CommonException(messageUtil.getMessage("inv.msg.gw02"), ErrorCode.INTERNAL_SERVER_ERROR);
            }            
            
            return responseUtil.restReponse(rc);
        } catch (CommonException ce) {
            throw new CommonException(ce.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR, ce);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    /**
     * note info pop
     * @param note
     * @return
     */
    public NoteDomain getNoteInfo(NoteDomain note) {
        try {
            
            return Optional.ofNullable(cnaMapper.getNoteInfo(note)).orElseGet(NoteDomain::new);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * note info check dup
     * @param note
     * @return
     */
    public RestResponse checkNoteNumDup(NoteDomain note) {
        try {
            
            return responseUtil.restReponse(Optional.ofNullable(cnaMapper.checkNoteNumDup(note)).orElseGet(NoteDomain::new));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }

    /**
     * note amt list
     * @param invoc
     * @return
     */
    public List<NoteAmtListDomain> getNoteAmtList(NoteDomain note) {
        try {
            //detail decimal precision
            CodeInfo cd = codeMapper.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");
            if(cd != null) {
                note.setDecPoint(cd.getCdVal1());
            }else {
                note.setDecPoint("4");
            }
            
            return cnaMapper.getNoteAmtList(note);
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
            throw new CommonException(messageUtil.getMessage("inv.msg.gw02"), ErrorCode.INTERNAL_SERVER_ERROR, e);
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
