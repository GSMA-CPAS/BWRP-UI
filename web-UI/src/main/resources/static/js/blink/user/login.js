(function(global, $, thisPage) {
    
    /**
     * Define let or let
     */
    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    const _RSAModulus = thisPage.publickeymodulus;
    const _RSAExponent = thisPage.publickeyexponent;
    const _defaultLocale = 'en';
    
    /**
     * Define Module Functions
     */
    
    function pageInitializr() {
        if (isIEBrowser()) {
            global.alert(thisPage.appMsg004);
        }
    }
    
    // show return message
    function alertReturnMessage() {
        if (_RTN_MSG) {
            if (_RTN_MSG === 'passwordChanged') {
                global.alert(thisPage.passwordChanged);
            } else if (_RTN_MSG === 'passwordChangeFailed') {
                global.alert(thisPage.passwordChangeFailed);
            }  else {
                global.alert(_RTN_MSG);
            }
        }
    }
    
    
    // locale initializr
    function localeInitializr() {
        let currentLocale = Cookies.get('lang');
        if (!currentLocale) {
            $('#selectedLocale').text(getLocaleLanguage(_defaultLocale));
        } else {
            $('#selectedLocale').text(getLocaleLanguage(currentLocale));
        }
    }
    
    
    // locale code converter
    function getLocaleLanguage(locale) {
        return {
            ko: '한글',
            en: 'English'
            //zh: '中文'
         }[locale];
    }
    
    
    /**
     * generate captcha
     */
    function refreshCaptcha() {
        let rand = Math.random();
        $("#captchaImage").attr("src", _CTX + 'captcha?rand=' + rand);
    } 
    
    
    /**
     * check RSA Validation
     */
    function validateRSAKeyValues() {
        if (!(_RSAModulus && _RSAExponent)) {
            return false;
        }
        return true;
    }
    
    
    /**
     * RSA encrypt password
     */
    function passwordEncrypt(plainText) {
        try {
            if (!validateRSAKeyValues()) {
                throw "rsaException";
            }
            let rsa = new RSAKey();
            rsa.setPublic(_RSAModulus, _RSAExponent);
            return rsa.encrypt(plainText);
        } catch (e) {
            console.error(e);
            global.alert(thisPage.appMsg030);
        }
    }
    
    
    /**
     * user login form submit validation
     */
    function validatUserLoginFormSubmit() {
        let username = $.trim($('#username').val());
        let password = $.trim($('#password').val());
        let captcha = $.trim($('#captcha').val());
        
        if (!username) {
            global.alert(thisPage.appMsg027);
            $('#username').focus();
            return false;
        } else if (!password) {
            global.alert(thisPage.appMsg028);
            $('#password').focus();
            return false;
        } else if (!captcha) {
            global.alert(thisPage.appMsg029);
            $('#captcha').focus();
            return false;
        }
        
        return true;
        
    }
    
    
    /**
     * check IE Browser
     */
    function isIEBrowser() {
        let ua = window.navigator.userAgent;
        let isIE = /MSIE|Trident/.test(ua);
        return isIE;
    }
    
    
    /**
     * request log in
     */
    function submitBlinkAppLogin() {
        
        if (!validatUserLoginFormSubmit()) {
            return;
        }
        
        if (!validateRSAKeyValues()) {
            return;
        }
        
        if (isIEBrowser()) {
            global.alert(thisPage.appMsg004 + '.\n' + thisPage.appMsg031);
        }
        
        let url = _CTX + "login";
        let params = {};
        params['username'] = $.trim($('#username').val());
        let password = $.trim($('#password').val());
        params['password'] = passwordEncrypt(password);
        params['captcha'] = $.trim($('#captcha').val());
        
        $.ajaxProxy($.reqPost(url).setParams(params).build()).then(function(res) {
            res.data && global.location.replace(res.data.targetUrl);
        });
        
    }
    
    
    /**
     * change credential submit validation
     */
    function validateChangeForm() {
        let password = $.trim($('#changePassword').val());
        let passwordConfirm = $.trim($('#changePasswordConfirm').val());
        
        if (!password) {
            global.alert(thisPage.appMsg017);
            $('#changePassword').focus();
            return false;
        } else if (!passwordConfirm) {
            global.alert(thisPage.appMsg018);
            $('#changePasswordConfirm').focus();
            return false;
        } else if (password !== passwordConfirm) {
            global.alert(thisPage.appMsg019);
            $('#changePasswordConfirm').focus();
            return false;
        }
        
        return true;
    }
    
    
    // KT password regulation rule check
    function checkNewValidPassword(id, pwd) {
        let regexpCredential    = /[\;\s]/;
        let regexpCredential1   = /[^a-zA-Z0-9\s]/;
        let regexpCredential2   = /[><)(\'\"]/;
        let alpaSmall           = 'abcdefghijklmnopqrstuvwxyz';
        let alpaBig             = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let num                 = '1234567890';
        let numcheck            = 0;
        let alphaSmailcheck     = 0;
        let alphaBigcheck       = 0;
        let spcecialcharcheck   = 0;
        let validCredential     = true;
        
        if (!pwd) {
            return thisPage.appMsg019;
        }
        
        if (id && pwd === id) {
            return thisPage.appMsg020;
        }
        
        if (id.length > 2) {
            for (let i = 0; i < id.length-3; i++){
                for(let j = 0;j < pwd.length-3; j++){
                    if(id.substring(i,i+4) == pwd.substring(j,j+4) ) {
                        return thisPage.appMsg021;
                    }
                }
            }
        }
        
        if (regexpCredential2.test(pwd)) {
            return thisPage.appMsg022;
        }
        
        if (pwd.length < 8 || pwd.length > 16) {
            return thisPage.appMsg023;
        } 
        
        if (!regexpCredential.test(pwd) && regexpCredential1.test(pwd)) {
            spcecialcharcheck = 1;
        } else {
            return thisPage.appMsg023;
        }
        
        for (let i = 0; i < pwd.length; i++ ) {
            
            if ( num.indexOf(pwd.substring(i,i+1)) >= 0) {
                numcheck = 1;
            }
            
            if ( alpaSmall.indexOf(pwd.substring(i,i+1)) >= 0) {
                alphaSmailcheck = 1;
            }
            
            if ( alpaBig.indexOf(pwd.substring(i,i+1)) >= 0) {
                alphaBigcheck = 1;
            }
        }
        
        if ((pwd.length == 8 || pwd.length == 9) && (numcheck + alphaSmailcheck + alphaBigcheck + spcecialcharcheck) < 3) {
            return thisPage.appMsg023;
        }    
        if (pwd.length >= 10 && (numcheck + alphaSmailcheck + alphaBigcheck + spcecialcharcheck) < 2) {
            return thisPage.appMsg023;
        }
        
        if (/(\w|\W)\1\1\1/.test(pwd)) {
            return thisPage.appMsg024;
        }
        
        if (!isContiuneChar(pwd, 4)) {
            return thisPage.appMsg025;
        }
        
        return validCredential;
        
    }
    
    
    // is password continuting same chars
    function isContiuneChar(str, limit) {
        let oldChar, differ, pr, no = 0;
        let l = limit || 4;
        
        for (let i = 0; i < str.length; i++) {
            
            let chCode = str.charCodeAt(i);
            
            if (i > 0) {
                
                let diffChar = oldChar - chCode;
                
                if (diffChar == -1) {
                    
                    pr = diffChar;
                    
                    if (pr == differ) {
                        no = no + 1;
                    } else {
                        no = 0;
                    }
                    
                    if (no > l - 3) {
                        return false;
                    }
                    
                }
                
            }
            
//            if (i > 0 && (pr = oldChar - chCode) == -1 && (no = pr == differ ? no + 1 : 0) > l - 3) {
//                return false;
//            }
            
            differ = pr;
            oldChar = chCode;
        }
        return true;
    }
    
    
    /**
     * Event Handlers
     */
    const thisModuleEventHandlers = function() {
        
        /*******************************
         *                             *
         *        Login Submit         *
         *                             *
         *******************************/
        
        // regenerate captcha
        $("#captchaReload").on("click", function(event) {
            let rand = Math.random();
            $("#captchaImage").attr("src", _CTX + 'captcha?rand=' + rand);
        });
        
        
        // try to log in
        $('#loginSubmit').on('click', function(e) {
            e.preventDefault();
            submitBlinkAppLogin();
        });
        
        
        // select locale
        $('#localeList li').on('click', function(e) {
            let locale = $(this).data('locale');
            window.location.replace(_CTX + "?lang=" + locale);
        });
        
        
        // Enter-key Login submit event
        $('#captcha').on('keypress', function(e) {
            if (e.which == 13 || e.keyCode == 13) {
                $('#loginSubmit').trigger('click');
                return false;
            }
            return true;
        });
        
        
        // select box
        $(document).on('click','.select-box > div > ul > li',function() {
            $(this).parents(".select-box").toggleClass("on");
        });
        
        
        /*******************************
         *                             *
         *    Change Reset Password    *
         *                             *
         *******************************/
        $('#changePwd').on('click', function(e) {
            e.preventDefault();
            if (!validateChangeForm()) {
                return false;
            }
            
            let username = $.trim($('#username').val());
            let password = $.trim($('#changePassword').val());
            let credentialValidateMsg = checkNewValidPassword(username, password);
            
            if (!credentialValidateMsg) {
                global.alert(credentialValidateMsg);
                return false;
            }
            
            let url = _CTX + "changeCredential";
            let sysTrtrId = (username && username.length > 16) && username.substr(0, 15) || username;
            let sysSvcId = url;
            
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="username" value="' + username + '" />')
            .append('<input type="hidden" name="password" value="' + password + '" />')
            .append('<input type="hidden" name="sysTrtrId" value="' + sysTrtrId + '" />')
            .append('<input type="hidden" name="sysSvcId" value="' + sysSvcId + '" />')
            .appendTo('body')
            .submit()
            .remove();
            
        });
        
        
        // Enter-key password change submit event
        $('#changePasswordConfirm').on('keypress', function(e) {
            if (e.which == 13 || e.keyCode == 13) {
                $('#changePwd').trigger('click');
                return false;
            }
            return true;
        });
        
    }; // end of evnet handlers
    
    
    /**
     * Initializr Functions
     */
    const thisModuleInitializr = function() {
        alertReturnMessage();
        localeInitializr();
        refreshCaptcha();
        pageInitializr();
    };
    
    
    /**
     * DOM Ready
     */
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    });
    
    
})(window, jQuery, thisPage);
