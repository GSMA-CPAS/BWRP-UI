package com.kt.blink.biz.common.utils;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;

/**
 * Date Util
 */
@Component
public class DateUtil {
    
    /**
     * Convert Dete String To Date Object
     * 
     * @param dataformat
     * @param dateString
     * @return
     */
    public Date convertStrToDate(String dataformat, String dateString) {
        try {
            return new SimpleDateFormat(dataformat, Locale.KOREA).parse(dateString);
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert datepicker start date string to Start Date Object
     * 
     * @param dateString
     * @return
     */
    public Date datepickerStartDate(String startDateStr) {
        try {
            return atStartOfDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(startDateStr));
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert datepicker end date string to End Date Object
     * 
     * @return
     */
    public Date datepickerEndDate(String endDateStr) {
        try {
            return atEndOfDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(endDateStr));
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert datepicker start date string to Start Date Object
     * 
     * @param dateString
     * @return
     */
    public LocalDateTime datepickerStartLocalDate(String startDateStr) {
        try {
            return atStartOfLodalDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(startDateStr));
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert datepicker end date string to End Date Object
     * 
     * @return
     */
    public LocalDateTime datepickerEndLocalDate(String endDateStr) {
        try {
            return atEndOfLocalDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(endDateStr));
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert LocalDateTime to Start String
     * BASIC_ISO_DATE (20201222)
     * 
     * @param dateString
     * @return
     */
    public String datepickerStartLocalDateStr(String startDateStr) {
        try {
            return atStartOfLodalDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(startDateStr)).format(DateTimeFormatter.BASIC_ISO_DATE);
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert LocalDateTime to End String
     * BASIC_ISO_DATE (20201223)
     * 
     * @return
     */
    public String datepickerEndLocalDateStr(String endDateStr) {
        try {
            return atEndOfLocalDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(endDateStr)).format(DateTimeFormatter.BASIC_ISO_DATE);
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert LocalDateTime to Start String
     * (20190801070209)
     * 
     * @param dateString
     * @return
     */
    public String datepickerStartLocalDateStr2(String startDateStr) {
        try {
            return atStartOfLodalDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(startDateStr)).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * convert LocalDateTime to End String
     * (20190801070209)
     * 
     * @return
     */
    public String datepickerEndLocalDateStr2(String endDateStr) {
        try {
            return atEndOfLocalDate(new SimpleDateFormat(AppConst.DATEPICKER_FORMAT, Locale.KOREA).parse(endDateStr)).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * set Date object as a start date 
     *
     * @method atStartOfDay
     * @param date
     * @return 
     */
    public Date atStartOfDate(Date date) {
        LocalDateTime localDateTime = dateToLocalDateTime(date);
        LocalDateTime startOfDay = localDateTime.with(LocalTime.MIN);
        return localDateTimeToDate(startOfDay);
    }
    
    
    /**
     *  set Date object as a end date
     *
     * @method atEndOfDay
     * @param date
     * @return 
     */
    public Date atEndOfDate(Date date) {
        LocalDateTime localDateTime = dateToLocalDateTime(date);
        LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
        return localDateTimeToDate(endOfDay);
    }
    
    /**
     * set Date object as a start date
     *
     * @method atStartOfDay
     * @param date
     * @return 
     */
    public LocalDateTime atStartOfLodalDate(Date date) {
        LocalDateTime localDateTime = dateToLocalDateTime(date);
        return localDateTime.with(LocalTime.MIN);
    }
    
    
    /**
     *  set Date object as a end date
     *
     * @method atEndOfDay
     * @param date
     * @return 
     */
    public LocalDateTime atEndOfLocalDate(Date date) {
        LocalDateTime localDateTime = dateToLocalDateTime(date);
        return localDateTime.with(LocalTime.MAX);
    }
    
    
    /**
     * convert LocalDateTime to Date String (yyyyMMdd)
     *
     * @method getStartDateStr
     * @param date
     * @return 
     */
    public String getDateStr(LocalDateTime date) {
        return date.format(DateTimeFormatter.BASIC_ISO_DATE);
    }
    
    
    /**
     * convert LocalDateTime to Date String (yyyyMMddHHmmss)
     *
     * @method getStartDateStr
     * @param date
     * @return 
     */
    public String getDateStr2(LocalDateTime date) {
        return date.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
    
    
    /**
     * convert Date object to LocalDateTime object
     *
     * @method dateToLocalDateTime
     * @param date
     * @return 
     */
    public LocalDateTime dateToLocalDateTime(Date date) {
        return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }

    /**
     * conver LocalDateTime object to Date object
     *
     * @method localDateTimeToDate
     * @param localDateTime
     * @return 
     */
    public Date localDateTimeToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
    
}
