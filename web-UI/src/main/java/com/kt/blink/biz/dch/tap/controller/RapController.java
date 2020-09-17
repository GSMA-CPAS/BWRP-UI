package com.kt.blink.biz.dch.tap.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.excel.RapListExcelView;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.service.CommonService;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.dch.tap.service.RapService;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/dch/tap")
@RestController
public class RapController {

    @Autowired
    private CommonService commonService;
    
    @Autowired
    private CodeInfoService codeInfoService;

    @Autowired
    private RapService rapService;
    

    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    @Autowired
    private ObjectMapper mapper;
    
    @Autowired
    private MessageUtil messageUtil;
    
    @GetMapping("rapList")
    public ModelAndView rapList(@AuthenticationPrincipal UserContext user) {
      log.info("@firstNam=================>{}", user.getFirstName());
      log.info("@lastName=================>{}", user.getLastName());
      log.info("@compnay==================>{}", user.getCompany());
      log.info("@roles====================>{}", user.getAuthorities());
      log.info("@username=================>{}", user.getUsername());
      return new ModelAndView("blink/dch/tap/rapList");
    }
  
    /**
     * partner list
     * @param 
     * @return
     */
    @PostMapping("getInitRap")
    public ResponseEntity<?> getInitRap() {
      
        Map<String, Object> items = new HashMap<>();
        List<PlmnsDomain> partners = commonService.getPartnerPlmns(null);
                  
        items.put("partners", partners);
        items.put("myNetworks", codeInfoService.findCodesByCdGrpId("MyNetwork"));
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("Range", "SearchRange");
        
        String range = "60";
        if(cd != null) {
            range = cd.getCdVal1();
        }
        items.put("range", range);
          
        return ResponseEntity.ok(items);
    }
    

    /**
     * rap list
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("/retrieveRapList")
    public ResponseEntity<?> retrieveRapList(@RequestBody final DataTablesRequest dataTablesRequest) {

        log.info("[retrieveRapList.dataTablesRequest]##################################### \n{}", doLog(dataTablesRequest));
        
        List<Column> columns = dataTablesRequest.getColumns();
        InvoiceDomain inv = new InvoiceDomain();

        for (Column col : columns) {
            String colNm = col.getData();
            String val = col.getSearch().getValue();
            if(StringUtils.equals(colNm, "trmPlmnId")) {
                if(StringUtils.isNotBlank(val)) {
                    inv.setTrmPlmnIds(StringUtils.split(val, ","));
                }
                inv.setTrmPlmnId(val);
            }else if(StringUtils.equals(colNm, "rcvPlmnId")) {
                if(StringUtils.isNotBlank(val)) {
                    inv.setRcvPlmnIds(StringUtils.split(val, ","));
                }
                inv.setRcvPlmnId(val);
            }else if(StringUtils.equals(colNm, "stPeriodDay")) {
                inv.setStPeriodDay(val);
            }else if(StringUtils.equals(colNm, "endPeriodDay")) {
                inv.setEndPeriodDay(val);
            }else {
                col.getSearch().setValue(null);
            }         
        }
        
        if(dataTablesRequest.getStart()>0 && StringUtils.isNumeric(dataTablesRequest.getSearch().getValue())) {
            long tcnt = Long.parseLong(dataTablesRequest.getSearch().getValue());
            inv.setTotalCount(tcnt);
        }else {
            inv.setTotalCount(0L);
        }
        
        inv.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        
        log.info("[retrieveRapList.InvoiceDomain]##################################### \n{}", doLog(inv));
         
        
      DataTablesResponse<?> dataTablesResponse = rapService.retrieveRapList(inv);    
//        DataTablesResponse<?> dataTablesResponse = rapService.retrieRapList(inv);    
        return ResponseEntity.ok(dataTablesResponse);
    }
    /**
     * excel down
     * @param inv
     * @return
     */
    @PostMapping("downRapListExcel")
    public ModelAndView downRapListExcel(@ModelAttribute final InvoiceDomain inv) {
                
        List<String> titles = new ArrayList<>();
        titles.add(messageUtil.getMessage("rap.list.th.filenm"));
        titles.add(messageUtil.getMessage("rap.list.th.time"));
        titles.add(messageUtil.getMessage("rap.list.th.hpmn"));
        titles.add(messageUtil.getMessage("rap.list.th.vpmn"));
        titles.add(messageUtil.getMessage("rap.list.th.recno"));
//        titles.add(messageUtil.getMessage("rap.list.th.imsi"));
        titles.add(messageUtil.getMessage("rap.list.th.calltype"));
        titles.add(messageUtil.getMessage("rap.list.th.caNum"));
        titles.add(messageUtil.getMessage("rap.list.th.dur"));
        titles.add(messageUtil.getMessage("rap.list.th.vol"));
        titles.add(messageUtil.getMessage("rap.list.th.ecd"));
        titles.add(messageUtil.getMessage("rap.list.th.emsg"));
        
        ModelAndView mav = new ModelAndView(new RapListExcelView(titles, inv.getCurCdSel()));
        DataTablesRequest dataTablesRequest = new DataTablesRequest();
        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
        inv.setDataTablesRequest(dataTablesRequest);     
        inv.setTotalCount(1L);
        

        if(StringUtils.isNotBlank(inv.getTrmPlmnId())) {
            inv.setTrmPlmnIds(StringUtils.split(inv.getTrmPlmnId(), ","));
        }
        
        if(StringUtils.isNotBlank(inv.getTrmPlmnId())) {
            inv.setRcvPlmnIds(StringUtils.split(inv.getRcvPlmnId(), ","));
        }
                
        DataTablesResponse<?> dataTablesResponse = rapService.retrieveRapList(inv);   
//        DataTablesResponse<?> dataTablesResponse = rapService.retrieRapList(inv);    
        
        mav.addObject("results", dataTablesResponse.getData());
        mav.addObject("filename", "RapList");
        return mav;

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
