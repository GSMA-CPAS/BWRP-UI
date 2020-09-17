/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.constant;

/**
 * Application Constant Class
 */
public class AppConst {
    
    /** Login Default Password **/
    public static final String DEFAULT_CREDENTIAL = "new1234!";

    /** Exception Logger Prefix : APP_ERROR */
    public static final String APP_ERROR = "APP_ERROR";
    
    /** Login Fail Message : error **/
    public static final String LOGIN_ERROR_MESSAGE = "error";
    
    /** Logout Message : logout **/
    public static final String LOGOUT = "logout";
    
    /** Session Timeout Message : logout **/
    public static final String EXPIRED = "expired";
    
    /** User Login Max Attempts **/
    public static final Integer MAX_ATTEMPTS = 5;
    
    /** Login Session Attribute name: loginSession **/
    public static final String LOGIN_SESSION = "username";
    
    /** Redirect Return Message Key **/
    public static final String RETURN_MESSAGE = "rtnMsg";
    
    /** Captcha : matched **/
    public static final String CAPTCHA_OK = "matched";
    
    /** Captcha : mismatched **/
    public static final String CAPTCHA_NG = "mismatched";
    
    /** Captcha : captcha_error **/
    public static final String CAPTCHA_ERROR = "captchaError";
    
    /** LOGIN_SESSION_INTERVAL : 1 hour (60 * 60) **/
    public static final Integer SESSION_TIMEOUT_AFTER_ONE_HOUR = 3600;
    
    /** LOGIN_SESSION_INTERVAL : 30 minutes (60 * 30) **/
    public static final Integer SESSION_TIMEOUT_AFTER_HALF_HOUR = 1800;
    
    /** NO_PAGINATION : -1 **/
    public static final Integer NO_PAGINATION = -1;
    
    /** Email Pattern **/
    public static final String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
    
    /** GateWay Rest Api Url **/
    public static final String GATEWAY_REST_URL = "http://localhost:3000/blink/api";
    
    /** Datepicker date format **/
    public static final String DATEPICKER_FORMAT = "yyyy-MM-dd";
    
    /** Log Date Format [yyyyMMddHHmmss] **/
    public static final String LOG_DATE_FORMAT = "yyyyMMddHHmmss";
    
    /** ExcelView Number Format : #,##0 **/
    public static final String NUMBER_FORMAT = "#,##0";
    
    /** ExcelView Decimal Format : #,##0.00 **/
    public static final String DECIMAL_FORMAT2 = "#,##0.00";
    
    /** ExcelView Decimal Format :#,##0.0000 **/
    public static final String DECIMAL_FORMAT4 = "#,##0.0000";
    
    /** Board Type Cd : Board **/
    public static final String BBS_TYPE_BOARD = "BOARD";
    
    /** Board Type Cd : Notice **/
    public static final String BBS_TYPE_NOTICE = "NOTICE";
    
    /** Board Detail **/
    public static final String BBS_DETAIL_MODE = "detailMode";
    
    /** Board Detail Type : write **/
    public static final String BBS_DETAIL_WRITE = "Write";
    
    /** Board Detail Type : view/update **/
    public static final String BBS_DETAIL_UPDATE = "Update";
    
    /** Board Detail Type : view **/
    public static final String BBS_DETAIL_VIEW = "View";
    
    /** Spring Security : ROLE_USER **/
    public static final String ROLE_USER = "ROLE_USER";
    
    /** Spring Security : ROLE_ADMIN **/
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    
    /** TAP Search Type : Button Search [BTN] **/
    public static final String TAP_BTN_SEARCH = "BTN";
    
    /** TAP Search Type : Button Search [LINK] **/
    public static final String TAP_LINK_SEARCH = "LINK";
    
    private AppConst() {
        throw new IllegalStateException("Non-instantiable Constant Class");
    }
}
