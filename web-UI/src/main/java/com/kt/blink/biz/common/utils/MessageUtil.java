package com.kt.blink.biz.common.utils;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

/**
 * Message Util
 */
@Component
public class MessageUtil {

    @Autowired
    private MessageSource messageSource;
    
    public String getMessage(String message) {
        return messageSource.getMessage(message, null, Locale.getDefault());
    }
    
    public String getMessage(String message, Object[] objs) {
        return messageSource.getMessage(message, objs, Locale.getDefault());
    }
    
    public String getMessage(String message, Locale locale) {
        return messageSource.getMessage(message, null, locale);
    }
    
    public String getMessage(String message, Object[] objs, Locale locale) {
        return messageSource.getMessage(message, objs, locale);
    }

}
