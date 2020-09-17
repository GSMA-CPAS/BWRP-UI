/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.todo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.todo.domain.TodoDomain;

@Mapper
@Repository
public interface TodoMapper {
 

    
    /**
     * update todo status
     * @param note
     * @return
     */
    Integer updateTodo(@Param("todo") TodoDomain todo);
    
    /**
     * todo list
     * @param todo
     * @return
     */
    List<TodoDomain> retrieveTodoList(TodoDomain todo);
    
    
    /**
     * find My Todo
     * 
     * @return
     */
    Integer findMyTodo();
    
    
}
