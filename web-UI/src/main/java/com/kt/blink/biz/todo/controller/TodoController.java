/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.todo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.todo.domain.TodoDomain;
import com.kt.blink.biz.todo.service.TodoService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/todo")
@RestController
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private DataTablesUtil dataTablesUtil;

    @Autowired
    private MessageUtil messageUtil;
    
    /**
     * 
     * @param user
     * @return
     */
    @GetMapping
    public ModelAndView todo(@AuthenticationPrincipal UserContext user) {
        log.info("@name=====================>{}", user.getUsername());
        log.info("@roles====================>{}", user.getAuthorities());
        log.info("@username=================>{}", user.getUsername());
        
        return new ModelAndView("blink/todo/todo");
    }

    
    /**
     * retrieveTodoList
     * @param dataTablesRequest
     * @param user
     * @return
     */
    @PostMapping("/retrieveTodoList")
      public ResponseEntity<?> retrieveTodoList(@RequestBody final DataTablesRequest dataTablesRequest, @AuthenticationPrincipal UserContext user) {
          
        log.debug("[retrieveTodoList]##################################### \n{}", dataTablesRequest);
        
        TodoDomain todo = new TodoDomain();
        todo.setSysTrtrId(user.getUsername());
        todo.setMiss(messageUtil.getMessage("todo.miss"));
        todo.setMissTrm(messageUtil.getMessage("todo.miss.trm"));
        todo.setMissRcv(messageUtil.getMessage("todo.miss.rcv"));
        todo.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        DataTablesResponse<?> dataTablesResponse = todoService.retrieveTodoList(todo);
                  
        return ResponseEntity.ok(dataTablesResponse);
      }
 

    /**
     * update todo
     * @param todo
     * @param user
     * @return
     */
    @PostMapping("/updateTodo")
    public ResponseEntity<?> updateTodo(@RequestBody final TodoDomain todo, @AuthenticationPrincipal UserContext user) {

        todo.setSysTrtrId(user.getUsername());
        
        RestResponse restResponse = todoService.updateTodo(todo);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /**
     * find MyTodo
     * 
     * @param user
     * @return
     */
    @GetMapping("/findMyTodo")
    public ResponseEntity<?> findMyTodo() {
        return ResponseEntity.ok(todoService.findMyTodo());
    }
    
    
}
