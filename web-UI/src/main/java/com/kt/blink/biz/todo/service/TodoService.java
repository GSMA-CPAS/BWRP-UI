package com.kt.blink.biz.todo.service;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.todo.domain.TodoDomain;
import com.kt.blink.biz.todo.mapper.TodoMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@Service
public class TodoService {

    @Autowired
    private TodoMapper todoMapper;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    /**
     * todo list
     * @param invoc
     * @return
     */
    public DataTablesResponse<TodoDomain> retrieveTodoList(TodoDomain todo) {
        try {
            List<TodoDomain> items = Optional.ofNullable(todoMapper.retrieveTodoList(todo))
                    .orElse(Collections.emptyList());
            Long totalCount = items.stream().map(TodoDomain::getTotalCount).findFirst().orElse(0L);
              
            return responseUtil.dataTablesResponse(totalCount, todo.getDataTablesRequest().getDraw(), items);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    /**
     * todo update
     * @param todo
     * @param errorMessage
     * @return
     */
    public RestResponse updateTodo(TodoDomain todo) {
        try {
            Integer rc = todoMapper.updateTodo(todo);
            log.debug("result count=========>{}", rc);
            return responseUtil.restReponse(rc);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
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
    
    
    /**
     * find My Todo
     * 
     * @return
     */
    public RestResponse findMyTodo() {
        TodoDomain todoDomain = new TodoDomain();
        Integer todoCount = todoMapper.findMyTodo();
        if (todoCount == null) {
            todoCount = NumberUtils.INTEGER_ZERO;
        }
        todoDomain.setTodoCount(todoCount);
        return responseUtil.restReponse(todoDomain);
    }
    
    
}
