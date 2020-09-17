package com.kt.blink.biz.common.scheduler;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.CommonUtil;
import com.kt.blink.biz.todo.domain.TodoDomain;
import com.kt.blink.biz.todo.service.TodoService;

/**
 * My Todo Push Scheduler
 */
@Component
public class MessagingScheduler {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private TodoService toDoService;
    
    public MessagingScheduler(SimpMessagingTemplate simpMessagingTemplate, TodoService toDoService) {
        super();
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.toDoService = toDoService;
    }
    
    
    @PostConstruct
    public void onStartup() {
        todoNotification();
    }
    
    
    @Async
    @Scheduled(cron = "${blink.scheduler.findTodoCron}") // every N min
    public void onSchedule() {
        todoNotification();
    }
    
    
    public void todoNotification() {
        try {
            RestResponse todoNotification = toDoService.findMyTodo();
            TodoDomain todoDomain = (TodoDomain) todoNotification.getData();
            String todoCount = String.valueOf(todoDomain.getTodoCount());
            simpMessagingTemplate.setMessageConverter(new StringMessageConverter());
            simpMessagingTemplate.convertAndSend("/subscribe/todo", todoCount);
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
}
