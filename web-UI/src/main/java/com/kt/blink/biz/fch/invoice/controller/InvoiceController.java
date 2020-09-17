/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.invoice.controller;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.excel.InvoiceDetExcelView;
import com.kt.blink.biz.common.excel.InvoiceListExcelView;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.service.CommonService;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.dch.tap.domain.TapListDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceAmtListDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;
import com.kt.blink.biz.fch.invoice.service.InvoiceService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/fch/invoice")
@RestController
public class InvoiceController {

    @Autowired
    private CommonService commonService;

    @Autowired
    private CodeInfoService codeInfoService;
    
    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private DataTablesUtil dataTablesUtil;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private MessageUtil messageUtil;

    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView invoice(@AuthenticationPrincipal UserContext user) {
        log.info("[GGG]admin=================>{}", user);
        
        return new ModelAndView("blink/fch/invoice/invoice", "btnRole", user.getBtnRole());
    }
    
    /**
     * financial list => invoice list
     * @param user
     * @return
     */
    @GetMapping("/invMove/{trmPlmnId}/{rcvPlmnId}/{stPeriodMon}/{endPeriodMon}") 
    public ModelAndView invMove(
            @PathVariable final String trmPlmnId,
            @PathVariable final String rcvPlmnId,  
            @PathVariable final String stPeriodMon,
            @PathVariable final String endPeriodMon,                       
            @AuthenticationPrincipal UserContext user) {
        log.info("[GGG]admin=================>{}", user);
        
        InvoiceDomain invoc = new InvoiceDomain();
        invoc.setTrmPlmnId(trmPlmnId);
        invoc.setRcvPlmnId(rcvPlmnId);
        invoc.setStPeriodMon(stPeriodMon);
        invoc.setEndPeriodMon(endPeriodMon);
        
        ModelAndView model = new ModelAndView("blink/fch/invoice/invoice");
        model.addObject("paramInv", invoc);
        model.addObject("btnRole", user.getBtnRole());
        
        return model;
    }
    
    /**
     * partner plmns list
     * @param 
     * @return
     */
    @PostMapping("/getInitInvoice")
    public ResponseEntity<?> getInitInvoice() {
        
        Map<String, Object> items = new HashMap<>();
        List<PlmnsDomain> partners = commonService.getPartnerPlmns(null);
                
        items.put("partners", partners);
        items.put("myNetworks", codeInfoService.findCodesByCdGrpId("MyNetwork"));
        items.put("currencys", codeInfoService.findCodesByCdGrpId("Currency"));
        items.put("invoiceStats", codeInfoService.findCodesByCdGrpId("InvoiceStat"));
        items.put("invKinds", codeInfoService.findCodesByCdGrpId("InvKind"));
        items.put("invDirects", codeInfoService.findCodesByCdGrpId("InvDirect"));
        
        return ResponseEntity.ok(items);
    }
    
    /**
     * invoice list
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("/retrieveInvoiceList")
    public ResponseEntity<?> retrieveInvoiceList(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        List<Column> columns = dataTablesRequest.getColumns();
        InvoiceDomain inv = new InvoiceDomain();

        for (Column col : columns) {
            String colNm = col.getData();
            String val = col.getSearch().getValue();
            if(StringUtils.equals(colNm, "trmPlmnId")) {
                inv.setTrmPlmnId(val);
            }else if(StringUtils.equals(colNm, "rcvPlmnId")) {
                inv.setRcvPlmnId(val);
            }else if(StringUtils.equals(colNm, "kindCd")) {
                inv.setKindCd(val);
            }else if(StringUtils.equals(colNm, "invocDirectCd")) {
                inv.setInvocDirectCd(val);
            }else if(StringUtils.equals(colNm, "statusCd")) {
                inv.setStatusCd(val);
            }else if(StringUtils.equals(colNm, "stPeriodMon")) {
                inv.setStPeriodMon(val);
            }else if(StringUtils.equals(colNm, "endPeriodMon")) {
                inv.setEndPeriodMon(val);
            }else if(StringUtils.equals(colNm, "filterMyNet")) {
                inv.setFilterMyNet(val);
            }else if(StringUtils.equals(colNm, "filterParterNet")) {
                inv.setFilterParterNet(val);
            }else if(StringUtils.equals(colNm, "curCdSel")) {
                inv.setCurCdSel(val);
            }else if(StringUtils.equals(colNm, "dateGbn")) {
                inv.setDateGbn(val);
            }else {
                col.getSearch().setValue(null);
            }         
        }
        inv.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        
        log.info("[retrieveCntryList.InvoiceDomain]##################################### \n{}", doLog(inv));
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNT", "DecPoint");
        
        if(cd != null) {
            inv.setDecPoint(cd.getCdVal1());
        }else {
            inv.setDecPoint("2");
        }
        
        DataTablesResponse<?> dataTablesResponse = invoiceService.retrieveInvoiceList(inv);          
        return ResponseEntity.ok(dataTablesResponse);
    }
    
    /**
     * update invoc stat
     * @param inv
     * @param user
     * @return
     */
    @PostMapping("/updateInvoiceStat")
    public ResponseEntity<?> updateInvoiceStat(@RequestBody final InvoiceDomain inv, @AuthenticationPrincipal UserContext user) {

        inv.setSysTrtrId(user.getUsername());
        
        RestResponse restResponse = invoiceService.updateInvoiceStat(inv);
        return ResponseEntity.ok(restResponse);
    }
    /**
     * invoice detail move
     * @param user
     * @return
     */
    @GetMapping("/invoiceDetail/{invocId}/{invocDirectCd}")
    public ModelAndView invoiceDetail(@PathVariable final String invocId,
                @PathVariable final String invocDirectCd, @AuthenticationPrincipal UserContext user
            ) {
        ModelAndView model = new ModelAndView("blink/fch/invoice/invoiceDetail");
        
        InvoiceDomain invoc = new InvoiceDomain();
        invoc.setInvocId(invocId);
        invoc.setInvocDirectCd(invocDirectCd);
        model.addObject("paramInv", invoc);
        
        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ invoiceDetail invoc_id : {}", invoc.getInvocId());
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");
        if(cd != null) {
            invoc.setDecPoint(cd.getCdVal1());
        }else {
            invoc.setDecPoint("4");
        }
        
        InvoiceDomain invDet = invoiceService.getInvocInfo(invoc);
        invDet.setInvocDirectCd(invoc.getInvocDirectCd());
        setNull(invDet);
        model.addObject("invoc", invDet);
        
        invoc.setTrafcStDay(invDet.getTrafcStDay());
        invoc.setTrafcEndDay(invDet.getTrafcEndDay());
        invoc.setTrmPlmnId(invDet.getTrmPlmnId());
        invoc.setRcvPlmnId(invDet.getRcvPlmnId());
        List<InvoiceAmtListDomain> amtList = invoiceService.getInvocAmtList(invoc);
        model.addObject("amtList", amtList);
        
        log.info("invoice invoiceDetail {} ", doLog(invDet));
        
        model.addObject("btnRole", user.getBtnRole());
        
        return model;
    }
    
    /**
     * partner plmns list
     * @param 
     * @return
     */
    @PostMapping("/getInitInvocDetail")
    public ResponseEntity<?> getInitInvocDetail() {
        
        Map<String, Object> items = new HashMap<>();                
        items.put("currencys", codeInfoService.findCodesByCdGrpId("Currency"));
        
        return ResponseEntity.ok(items);
    }
    
    /**
     * invoice info
     * @param inv
     * @return
     */
    @PostMapping("/getInvocInfo")
    public ResponseEntity<?> getInvocInfo(@RequestBody final InvoiceDomain inv) {
        
        return ResponseEntity.ok(invoiceService.getInvocInfo(inv));
    }
    /**
     * invoice popup call
     * @param user
     * @return
     */
    @GetMapping("invoicePop/{invocId}")
    public ModelAndView invoicePop(@PathVariable final String invocId) {
        log.info("[GGG]invocId=================>{}", invocId);
        
        ModelAndView model = new ModelAndView("blink/fch/invoice/invoicePop");
        InvoiceDomain invoc = new InvoiceDomain();
        invoc.setInvocId(invocId);
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");
        if(cd != null) {
            invoc.setDecPoint(cd.getCdVal1());
        }else {
            invoc.setDecPoint("4");
        }
        
        Map<String, Object> result = invoiceService.getInvocPop(invoc);
        
        model.addObject("amtList", result.getOrDefault("amtList", Collections.emptyList()));
        model.addObject("erateList", result.getOrDefault("erateList", Collections.emptyList()));
        model.addObject("tapList", result.getOrDefault("tapList", Collections.emptyList()));
        model.addObject("tapSum", result.get("tapSum")); 
        model.addObject("invoc", result.get("invoc")); 
        
        return model;
    }
    /**
     * invoice detail UI : daily tap list
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("retrieveDayTapList")
    public ResponseEntity<?> retrieveDayTapList(@RequestBody final DataTablesRequest dataTablesRequest) {
        
        List<Column> columns = dataTablesRequest.getColumns();
        InvoiceDomain inv = new InvoiceDomain();

        for (Column col : columns) {
            String colNm = col.getData();
            String val = col.getSearch().getValue();
            if(StringUtils.equals(colNm, "invocDirectCd")) {
                inv.setInvocDirectCd(val);
            }else if(StringUtils.equals(colNm, "invocId")) {
                inv.setInvocId(val);
            }else if(StringUtils.equals(colNm, "curCdSel")) {
                inv.setCurCdSel(val);
            }else {
                col.getSearch().setValue(null);
            }         
        }
        inv.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        
        log.info("[retrieveDayTapList.InvoiceDomain]##################################### \n{}", doLog(inv));
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");
        if(cd != null) {
            inv.setDecPoint(cd.getCdVal1());
        }else {
            inv.setDecPoint("4");
        }
        
        DataTablesResponse<?> dataTablesResponse = invoiceService.retrieveDayTapList(inv);          
        return ResponseEntity.ok(dataTablesResponse);
    }
    

    /**
     * note popup -> tap list move
     * 
     * @param tap
     * @param user
     * @return
     */
    @GetMapping("/noteTapList")
    public ModelAndView tapListToNote(TapListDomain tap,
            @AuthenticationPrincipal UserContext user) {
                
        ModelAndView model = new ModelAndView("blink/dch/tap/tapList");
        List<String> myNetworks = codeInfoService.findCodesByCdGrpId(CodeConst.MY_NETWORK)
                .stream().map(CodeInfo::getCdVal1).collect(Collectors.toList()); 
        model.addObject("myNetworks", myNetworks);
        model.addObject("note", tap);
        return model;
    }
    
    /**
     * Invoice List UI, Invoice Detail UI -> preview button click > download pdf invoice
     * @param inv
     * @return
     */
    @PostMapping("/downPdfInvocInfo")
    public ResponseEntity<?> downPdfInvocInfo(@RequestBody final InvoiceDomain invoc) {

        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");
        if(cd != null) {
            invoc.setDecPoint(cd.getCdVal1());
        }else {
            invoc.setDecPoint("4");
        }
        
        return ResponseEntity.ok(invoiceService.getInvocPop(invoc));
    }
    /**
     * Invoice List UI > downloadInvoiceListExcel
     * @param tapListDomain
     * @param request
     * @param response
     */
    @PostMapping("downInvListExcel")
    public ModelAndView downloadInvoiceListExcel(@ModelAttribute final InvoiceDomain inv) {
                
        List<String> titles = new ArrayList<>();
        titles.add(messageUtil.getMessage("inv.list.th.usemon"));
        titles.add(messageUtil.getMessage("inv.list.th.issuemon"));
        titles.add(messageUtil.getMessage("inv.list.th.mynet"));
        titles.add(messageUtil.getMessage("inv.list.th.partnet"));
        titles.add(messageUtil.getMessage("inv.list.th.kind"));
        titles.add(messageUtil.getMessage("inv.list.th.direc"));
        titles.add(messageUtil.getMessage("inv.list.th.doc"));
        titles.add(messageUtil.getMessage("inv.list.th.stat"));
        titles.add(messageUtil.getMessage("inv.list.th.reve"));
        titles.add(messageUtil.getMessage("inv.list.th.exp"));
        
        ModelAndView mav = new ModelAndView(new InvoiceListExcelView(titles, inv.getCurCdSel()));
        DataTablesRequest dataTablesRequest = new DataTablesRequest();
        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
        dataTablesRequest.setOrderSequel(null);
        inv.setDataTablesRequest(dataTablesRequest);        
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNT", "DecPoint");        
        if(cd != null) {
            inv.setDecPoint(cd.getCdVal1());
        }else {
            inv.setDecPoint("2");
        }
        
        DataTablesResponse<?> dataTablesResponse = invoiceService.retrieveInvoiceList(inv);  
        
        mav.addObject("results", dataTablesResponse.getData());
        mav.addObject("listPrcsn", inv.getDecPoint());
        mav.addObject("filename", "InvoiceList");
        return mav;

    }
    /**
     * invoice detail UI -> tap list excep download
     * @param inv
     * @param request
     * @param response
     */
    @PostMapping("downloadTapDailyListExcel")
    public ModelAndView downloadTapDailyListExcel(@ModelAttribute final InvoiceDomain inv) {
        HashMap<String, String> titles = new HashMap<>();
        titles.put("date", messageUtil.getMessage("invd.list.th.issuemon"));
        titles.put("mynet", messageUtil.getMessage("fnc.list.th.mynet"));
        titles.put("partnet", messageUtil.getMessage("fnc.list.th.partnet"));
        titles.put("direct", messageUtil.getMessage("invd.list.th.direct"));
        titles.put("seq", messageUtil.getMessage("invd.list.th.seq"));
        titles.put("tot", messageUtil.getMessage("invd.list.th.tot"));
        titles.put("moc", messageUtil.getMessage("invd.list.th.moc"));
        titles.put("mtc", messageUtil.getMessage("invd.list.th.mtc"));
        titles.put("data", messageUtil.getMessage("invd.list.th.data"));
        titles.put("sms", messageUtil.getMessage("invd.list.th.sms"));
        titles.put("rcd", messageUtil.getMessage("invd.list.th.rcd"));
        titles.put("grs", messageUtil.getMessage("invd.list.th.grs"));
        titles.put("dur", messageUtil.getMessage("invd.list.th.dur"));
        titles.put("vol", messageUtil.getMessage("invd.list.th.vol"));
        
        ModelAndView mav = new ModelAndView(new InvoiceDetExcelView(titles, inv.getCurCdSel()));
        DataTablesRequest dataTablesRequest = new DataTablesRequest();
        dataTablesRequest.setStart(AppConst.NO_PAGINATION);
        inv.setDataTablesRequest(dataTablesRequest);     
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("PNTD", "DecPoint");        
        if(cd != null) {
            inv.setDecPoint(cd.getCdVal1());
        }else {
            inv.setDecPoint("4");
        }
        
        DataTablesResponse<?> dataTablesResponse = invoiceService.retrieveDayTapList(inv);    
        mav.addObject("results", dataTablesResponse.getData());
        mav.addObject("listPrcsn", inv.getDecPoint());
        mav.addObject("filename", "TapList");
        return mav;
    }
    

    /**
     * invoice info
     * @param inv
     * @return
     */
    @PostMapping("/getComitPie")
    public ResponseEntity<?> getComitPie(@RequestBody final InvoiceDomain inv) {
        
        return ResponseEntity.ok(invoiceService.getInOutCommitInfo(inv));
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
