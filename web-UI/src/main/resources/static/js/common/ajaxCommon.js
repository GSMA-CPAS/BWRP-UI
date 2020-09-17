/****************************************************************************************************
*    @Description: Ajax Common Utilites                                                             
*    @Class: ajaxCommon.js                                                                          
*****************************************************************************************************/
(function(global, $, _, _m, _c, thisPage){
    /**
     * Spring Security CSRF
     */
//    var token = $("meta[name='_csrf']").attr("content");
//    var header = $("meta[name='_csrf_header']").attr("content");
    var pageUrl = thisPage.pageUrl;
    
    /** context root **/
    var _CTX = thisPage['ctx'];
    
    /** ajax start status flag **/
    var AJAX_START = false;
    
    /** disabled loading indcator url **/ 
    var _NO_INDICATOR_URLS = [_CTX + "login"];
    
    /** error_no_reload url **/ 
    var _ERROR_RELOAD_URLS = [_CTX + "dch/contract/createContract", _CTX + "dch/contract/contractDetail"];
    
    /**
     * refresh captcha
     */
    var refreshCaptcha = function() {
        var rand = Math.random();
        $("#captchaImage").attr("src", _CTX + 'captcha?rand=' + rand);
    }; 
    
    /**
     * ajax indicator start
     */
    var indicatorStart = function() {
        var ajaxIndicator = '<div id="indicator" style="display:none;"><span class="radius"></span></div>';
        $('body').append(ajaxIndicator);
        $.blockUI.defaults.css = {};
        $.blockUI({ 
            message : $('#indicator'),
            border : '3px solid #aaa',
            overlayCSS : {
                backgroundColor : '#000',
                opacity : 0.2,
                cursor : 'default'
            }
        }); 
    };
    
    
    /**
     * ajax indicator stop
     */
    var indicatorStop = function(){
        $.unblockUI();
        $(document).find('#indicator').remove();
    };
    
    
    /**
     * jQuery ajaxSend
     * handle each ajax request
     * control loading indcator : start
     */
    $(document).ajaxSend(function(event, jqhr, settings) {
        if (AJAX_START) {
            return;
        }
        if (_.includes(_NO_INDICATOR_URLS, settings.url)) {
            return;
        }
        AJAX_START = true;
        indicatorStart();
    });
    
    
    /**
     * jQuery ajaxStop
     * handl entire ajax request
     * control loading indcator : stop
     */
    $(document).ajaxStop(function() {
        indicatorStop();
        AJAX_START = false;
    });
    
    
    /**
     * Ajax Error Handler
     */
    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        console.error("e:", jqxhr);
        var status = jqxhr.status;
        var statusText = jqxhr.statusText;
        // abnormal disconnect
        if (status == 0 || statusText === "parsererror") {
            global.alert("This server has been disconnected.");
            global.location.replace(_CTX + "login");
            return;
        }
    });
    
    
    /**
     * jQuery.extend methods
     */    
    $.extend({
        
        /**
         * I. Ajax Proxy(Request by JSON)
         */
        ajaxProxy : function(request) {
            
            var options = {
                url : request.url,
                type : request.method,
                data : request.params && JSON.stringify(request.params),
                dataType : 'json',
                contentType : 'application/json;charset=utf-8',
                cache : false,
                timeout: 30000 // 30 seconds
            };
            
            //return $.ajax(options).then(this.AppExceptionHandler).always(function() {});
            return $.ajax(options).then(this.AppExceptionHandler);
        },
        
        
        /**
         * II. Ajax File Upload With Data
         */
        ajaxUpload : function(request) {
            
            var options = {
                enctype : 'multipart/form-data',
                url : request.url,
                type: "POST",
                data : request.params,
                dataType : 'json',
                processData : false, //prevent jQuery from automatically transforming the data into a query string
                contentType : false,
                cache : false,
                timeout : 30000
            };
            
            //return $.ajax(options).then(this.AppExceptionHandler).always(function() {});
            return $.ajax(options).then(this.AppExceptionHandler);
        },
        
        
        /**
         * App Exception Handler
         */
        AppExceptionHandler : function(response) {
            
            if (response.rtnCode === 'NG' && !response.throwType) {
                
                global.alert(response.message);
                
                if (_.includes(_ERROR_RELOAD_URLS, pageUrl)) {
                    global.location.reload();
                }
                
                return Promise.reject("App Error");
                
            } else if (response.rtnCode === 'NG' && response.throwType) {
                
                refreshCaptcha();
                //global.alert(response.message);
                
                if (response.throwType === 'badCredential') {
                    global.alert(thisPage.badCredential)
                    $('#username').focus();
                    $('#captcha').val('');
                } else if (response.throwType === 'badLogin') {
                    global.alert(thisPage.badLogin + ' ' + response.message + ' ' + thisPage.badLogin2)
                    $('#username').focus();
                    $('#captcha').val('');
                } else if (response.throwType === 'resetCredential') {
                    global.alert(thisPage.resetCredential)
                    $('#pwdChgModal').on('shown.bs.modal', function(e) {
                        $('#changePassword').focus();
                    });
                    $('#pwdChgModal').modal("show");
                } else if (response.throwType === 'newUserAlarm') {
                    global.alert(thisPage.newUserAlarm)
                    $('#pwdChgModal').on('shown.bs.modal', function(e) {
                        $('#changePassword').focus();
                    });
                    $('#pwdChgModal').modal("show");
                } else if (response.throwType === 'badCaptcha') {
                    global.alert(thisPage.badCaptcha)
                    $('#captcha').focus();
                } else if (response.throwType === 'captchaCreateError') {
                    global.alert(thisPage.captchaCreateError)
                    $('#captcha').focus();
                }
                
                return Promise.reject("App Error");
            }
            
            return response; // continue promise chain
        },
        
        
        /**
         * Ajax Post option builder 
         * $.reqPost('/url/abc').setParams({city: "A", town: "B"}).build();
         */
        reqPost : function(reqUrl) {
            var url = reqUrl;
            var method = 'POST';
            var params = {};
            return {
                setParams : function(reqParams) {
                    params = reqParams;
                    return this;
                },
                build : function() {
                    return {
                        url : url,
                        method : method,
                        params : params
                    };
                }
            };
        },
        
        
        /**
         * Ajax Get option builder 
         * $.reqGet('/url/abc')).build();
         */
        reqGet : function(reqUrl) {
            var url = reqUrl;
            var method = 'GET';
            return {
                build : function() {
                    return {
                        url : url,
                        method : method
                    };
                }
            };
        },
        
        
        /**
         * convert number to currency format(#,###)
         */
        formatNumber : function(num) {
            return num && num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") || 0;
        },
        
        
        /**
         * input focus and select
         */
        inputFocus: function($input) {
            $input.focus();
        },
        
        
        /**
         * convert java localDate to js date format string
         */
        localDateFormat : function(date, type) {
            
            if (!date) {
                return 'Invalid date';
            } else if (type === 'H') { // hours
                return  _m(date, ["YYYY-MM-DD HH:mm:ss"]).format('YYYY-MM-DD HH');
            } else if (type === 'M') { // minutes
                return  _m(date, ["YYYY-MM-DD HH:mm:ss"]).format('YYYY-MM-DD HH:mm');
            } else if (type === "S") { // seconds
                return  _m(date, ["YYYY-MM-DD HH:mm:ss"]).format('YYYY-MM-DD HH:mm:ss');
            } else { // days
                return  _m(date, ["YYYY-MM-DD HH:mm:ss"]).format('YYYY-MM-DD');
            }
        },
        
        
        /**
         * convert java date to js date format string
         */
        dateFormat : function(date, type) {
            
            if (type === 'H') { // hours
                return  _m(date).format('YYYY-MM-DD HH');
            } else if (type === 'M') { // minutes
                return  _m(date).format('YYYY-MM-DD HH:mm');
            } else if (type === "S") { // seconds
                return  _m(date).format('YYYY-MM-DD HH:mm:ss');
            } else { // days
                return  _m(date).format('YYYY-MM-DD');
            }
        },
        
        
        /**
         * abbreviate string length by number(ABC...)
         */
        abbreviate : function(string, length) {
            if (!length) {
                length = 30;
            }
            return ($.trim(string).length > length) ? $.trim(string).substring(0, length) + "..." : $.trim(string);
        },
        
        
        /**
         * currency format : decimal (default precison 2)
         */
        decimalFormat : function(number, precision) {
            if (!precision) {
                precision = 2;
            }
            return number && _c(number, {separator: ',', precision: parseInt(precision, 10)}).format() || 0;
        },
        
        
        /**
         * currency format : non precision
         */
        numberFormat : function(number) {
            return number && _c(number, {separator: ',', precision: 0}).format() || 0;
        },
        
        
        /**
         * get username from email address
         */
        getUsernameFromEmail : function(email) {
            return email.includes('@') && email.match(/^([^@]*)@/)[1] || email || '';
        } 
        
    
    }); //eof
    

    typeof _m !== 'undefined' && _m.locale('ko');
    

    $.fn.serializeForm = function() {
        var obj = null;
        try {
            if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
                var arr = this.serializeArray();
                if (arr) {
                    obj = {};
                    jQuery.each(arr, function() {
                        obj[this.name] = this.value;
                    });
                }
            }
        } catch (e) {
            console.error(e.message);
        }
        
        return obj;
    };
    
    
    /**
     * Polyfills for Old Browser
     */
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(search, pos) {
          return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
      };
    }
    
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(search, pos) {
            var subjectStr = this.toString();
            if (typeof pos !== 'number' || !isFinite(pos) || Math.floor(pos) !== pos || pos > subjectStr.length) {
                pos = subjectStr.length;
            }
            pos -= search.length;
            var lastIndex = subjectStr.indexOf(search, pos);
            return lastIndex !== -1 && lastIndex === pos;
        };
    }
    
    if (!String.prototype.trim) {
       String.prototype.trim = function () {
         return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      };
    }
    
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }
            
            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
            
        };
    }


})(window, jQuery, _, moment, currency, thisPage);
