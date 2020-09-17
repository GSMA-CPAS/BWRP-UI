/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.cna.controller;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.service.CommonService;
import com.kt.blink.biz.fch.cna.domain.NoteAmtListDomain;
import com.kt.blink.biz.fch.cna.domain.NoteDomain;
import com.kt.blink.biz.fch.cna.service.CnaService;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceErateListDomain;
import com.kt.blink.biz.fch.invoice.service.InvoiceService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/fch/invoice")
@RestController
public class CnaController {

    @Autowired
    private CommonService commonService;
    
    @Autowired
    private CnaService cnaService;

    @Autowired
    private InvoiceService invoiceService;
    
    @Autowired
    private ObjectMapper mapper;
    
    /**
     * invoice detail move
     * @param user
     * @return
     */
    @GetMapping("/invNoteRegPop/{invocId}/{invocDirectCd}")
    public ModelAndView getCnaInfo(@PathVariable final String invocId, @PathVariable final String invocDirectCd, 
            @RequestParam(value = "noteRefNum", required = false) final String noteRefNum, @AuthenticationPrincipal UserContext user) {
        ModelAndView model = new ModelAndView("blink/fch/invoice/invNoteRegPop");
        
        InvoiceDomain invoc = new InvoiceDomain();
        invoc.setInvocId(invocId);
        invoc.setInvocDirectCd(invocDirectCd);
        invoc.setNoteRefNum(noteRefNum);
        invoc.setUserId(user.getUsername());
        
        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ getCnaInfo invoc_id : {}", invoc.getInvocId());
                
        NoteDomain noteDet = cnaService.getInvCnaInfo(invoc);
        setNull(noteDet);
        model.addObject("invoc", noteDet);        

        //invoice exchage list
        List<InvoiceErateListDomain> erateList = invoiceService.getInvocErateList(invoc);
        model.addObject("erateList", erateList);
        
        model.addObject("taxList", commonService.findCodesByCdGrpId("taxYn"));
        
        return model;
    }
    
    /**
     * insert note
     * @param note
     * @param user
     * @return
     */
    @PostMapping("/insertNote")
    public ResponseEntity<?> insertNote(@RequestBody final NoteDomain note, @AuthenticationPrincipal UserContext user) {
        
        
        log.info("insertCntry@name=====================>{}", user.getUsername());
        
        note.setSysTrtrId(user.getUsername());

        RestResponse restResponse = cnaService.insertNote(note);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * dup check note number
     * @param note
     * @param user
     * @return
     */
    @PostMapping("/checkNoteNumDup")
    public ResponseEntity<?> checkNoteNumDup(@RequestBody final NoteDomain note) {
        
        RestResponse restResponse = cnaService.checkNoteNumDup(note);
        return ResponseEntity.ok(restResponse);
    }
    
    /**
     * note info pop
     * @param invocId
     * @return
     */
    @GetMapping("/getNoteInfo/{noteRefNum}")
    public ModelAndView getNoteInfo(@PathVariable final String noteRefNum) {
        
        ModelAndView model = new ModelAndView("blink/fch/invoice/invNotePop");
        
        NoteDomain note = new NoteDomain();
        note.setNoteRefNum(noteRefNum);
        
        NoteDomain noteDet = cnaService.getNoteInfo(note);
        setNull(noteDet);        
        model.addObject("note", noteDet);     
        
        InvoiceDomain invoc = new InvoiceDomain();
        invoc.setInvocId(noteDet.getInvocId());
        //invoice exchage list
        List<InvoiceErateListDomain> erateList = invoiceService.getInvocErateList(invoc);
        model.addObject("erateList", erateList);
        
        //note amt list
        List<NoteAmtListDomain> amtList = cnaService.getNoteAmtList(note);
        model.addObject("amtList", amtList);
        
        return model;
    }
    
    /**
     * download pdf note
     * @param inv
     * @return
     */
    @PostMapping("/downPdfNoteInfo")
    public ResponseEntity<?> downPdfNoteInfo(@RequestBody final NoteDomain note) {
        
        Map<String, Object> res = new HashMap<>();
        NoteDomain noteDet = cnaService.getNoteInfo(note);
        setNull(noteDet);
        res.put("note", noteDet);     
        
        InvoiceDomain invoc = new InvoiceDomain();
        invoc.setInvocId(noteDet.getInvocId());
        //invoice exchage list
        List<InvoiceErateListDomain> erateList = invoiceService.getInvocErateList(invoc);
        res.put("erateList", erateList);        

        //note amt list
        List<NoteAmtListDomain> amtList = cnaService.getNoteAmtList(note);
        res.put("amtList", amtList);
        
        return ResponseEntity.ok(res);
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
