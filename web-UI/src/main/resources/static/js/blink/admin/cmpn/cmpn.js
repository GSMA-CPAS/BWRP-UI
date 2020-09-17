var module = (function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];
	
	var _saveReq = thisPage['com.save.req'];
	var _msgTax = thisPage['com.msg.engnumspec']; 
	var _msgEmail = thisPage['user.msg.email'];  
	var _msgNumdash = thisPage['com.msg.numdash'];  
	
		
	/**
	 * input validation 
	 */	
	var validateRegisterForm = function($cmpnForm) {

        var cmpnNm = $.trim($('#cmpnNm').val());
        var cmpnAdr = $.trim($('#cmpnAdr').val());
        var taxNo = $.trim($('#taxNo').val());
        
        var emailId = $.trim($('#emailId').val());
        var telNo = $.trim($('#telNo').val());
        var faxNo = $.trim($('#faxNo').val());
        
        //in bank info
        var bankNmIn = $.trim($('#bankNmIn').val());
        var swiftCdIn = $.trim($('#swiftCdIn').val());
//        var accNmIn = $.trim($('#accNmIn').val());
        var accNoIn = $.trim($('#accNoIn').val());
//        var ibanNoIn = $.trim($('#ibanNoIn').val());
//        var correspBankNmIn = $.trim($('#correspBankNmIn').val());
//        var correspSwiftCdIn = $.trim($('#correspSwiftCdIn').val());
        
        //out bank info
//        var bankNmOut = $.trim($('#bankNmOut').val());
//        var swiftCdOut = $.trim($('#swiftCdOut').val());
//        var accNmOut = $.trim($('#accNmOut').val());
//        var accNoOut = $.trim($('#accNoOut').val());
//        var ibanNoOut = $.trim($('#ibanNoOut').val());
//        var correspBankNmOut = $.trim($('#correspBankNmOut').val());
//        var correspSwiftCdOut = $.trim($('#correspSwiftCdOut').val());
        
        if (!cmpnNm) {
            global.alert("Company Name is required.");
            $('#cmpnNm').focus();
            return false;
        } else if (!cmpnAdr) {
            global.alert("Address is required.");
            $('#cmpnAdr').focus();
            return false;
        } else if (!taxNo) {
            global.alert("Tax Registration Number is required.");
            $('#taxNo').focus();
            return false;
        } else if (!emailId) {
            global.alert("E-Mail is required.");
            $('#emailId').focus();
            return false;
        } else if (!telNo) {
            global.alert("Mobile Number is required.");
            $('#telNo').focus();
            return false;
        } else if (!faxNo) {
            global.alert("Fax Number is required.");
            $('#faxNo').focus();
            return false;
        }
        
        if (!bankNmIn) {
        	tabChange('1');
            global.alert("Bank Name is required.");
            $('#bankNmIn').focus();
            return false;
        } else if (!swiftCdIn) {
        	tabChange('1');
            global.alert("SWIFT Code is required.");
            $('#swiftCdIn').focus();
            return false;
        } 
//        else if (!accNmIn) {
//        	tabChange('1');
//            global.alert("Accout Name is required.");
//            $('#accNmIn').focus();
//            return false;
//        } 
        else if (!accNoIn) {
        	tabChange('1');
            global.alert("Account Number is required.");
            $('#accNoIn').focus();
            return false;
        } 
//        else if (!ibanNoIn) {
//        	tabChange('1');
//            global.alert("IBAN No is required.");
//            $('#ibanNoIn').focus();
//            return false;
//        } 
//        else if (!correspBankNmIn) {
//        	tabChange('1');
//            global.alert("Bank Name is required.");
//            $('#correspBankNmIn').focus();
//            return false;
//        } 
//        else if (!correspSwiftCdIn) {
//        	tabChange('1');
//            global.alert("Swift Code is required.");
//            $('#correspSwiftCdIn').focus();
//            return false;
//        } 
        
        return true;
        
    }	
	/**
	 * tab on
	 */
	function tabChange(gb) {
		if(gb === '1' ) {
			$('.tab2Cla').removeClass('on');
			$('.tab2SubCla').removeClass('on');
			$('.tab1Cla').addClass('on');
			$('.tab1SubCla').addClass('on');
		}else {
			$('.tab1Cla').removeClass('on');
			$('.tab1SubCla').removeClass('on');
			$('.tab2Cla').addClass('on');
			$('.tab2SubCla').addClass('on');
		}
	}
		

	/**
	 * loading UI
	 */
	var loading = function() {
		var url = _CTX + "cmpn/findCmpnInfo";
		var params = {};
		if($('#cmpnId').val()) {
			params.cmpnId = $('#cmpnId').val();
		}else {
			params.myCmpnYn = 'Y';
		}
		var cmpnAjax = $.ajaxProxy($.reqPost(url).setParams(params).build());
		
		$.when.apply($, [ cmpnAjax]).then(function() {
			var resArr = arguments;
			
			var cmpnResponse = null;
			
			$.each(resArr, function(i, res){
	            if (i === 0){
	            	cmpnResponse =  res;
	            }
	        });
			
			return cmpnResponse;
		}).done(function(cmpnResponse) {
			
			var result = cmpnResponse.data;

			if(result) {
				$('#cmpnId').val(result.cmpnId);
				$('#cmpnNm').val(result.cmpnNm);
				$('#cmpnAdr').val(result.cmpnAdr);
				$('#taxNo').val(result.taxNo);
				
				$('#emailId').val(result.emailId);
				$('#faxNo').val(result.faxNo);
				$('#telNo').val(result.telNo);
				      
				var banks = result.banks;

				if(banks) {
					_.each(banks, function(v,k) {
						var bankType = v['bankType'];
						if(bankType) {
							
							var postFix = "Out";
							if(bankType === 'I') {
								postFix = "In";
							}
							
							$('#isBankStat' + postFix).val('U');
							$('#bankNm' + postFix).val(v['bankNm']);
							$('#swiftCd' + postFix).val(v['swiftCd']);
							$('#accNm' + postFix).val(v['accNm']);
							$('#accNo' + postFix).val(v['accNo']);
							$('#ibanNo' + postFix).val(v['ibanNo']);
							$('#correspBankNm' + postFix).val(v['correspBankNm']);
							$('#correspSwiftCd' + postFix).val(v['correspSwiftCd']);
						}
						
					})
					
				}
			}

		});
	}
		
		
	var thisModuleEventHandlers = function() {

		/**
		 * save cmpn
		 */
		$('#cmpnSubmit').on('click', function(e) {
            e.preventDefault();
            
            if (!validateRegisterForm($('#cmpnForm'))) return;
            
            var url = _CTX + "cmpn/insertCmpn";
            if($('#cmpnId').val()) {
	        	url = _CTX + "cmpn/updateCmpn";
	        }
            
            var params = {};
            params.myCmpnYn = $('#myCmpnYn').val();
            params.cmpnNm = $('#cmpnNm').val();
            params.cmpnAdr = $('#cmpnAdr').val();
            params.taxNo = $('#taxNo').val();
            params.cmpnId = $('#cmpnId').val();
            
            params.emailId = $('#emailId').val();
            params.telNo = $('#telNo').val();
            params.faxNo = $('#faxNo').val();
            
            params.bankType = [ $('#bankTypeIn').val(), $('#bankTypeOut').val()];
            params.bankNm = [ $('#bankNmIn').val(), $('#bankNmOut').val()];
            params.swiftCd = [ $('#swiftCdIn').val(), $('#swiftCdOut').val()];
            params.accNm = [ $('#accNmIn').val(), $('#accNmOut').val()];
            params.accNo = [ $('#accNoIn').val(), $('#accNoOut').val()];
            params.ibanNo = [ $('#ibanNoIn').val(), $('#ibanNoOut').val()];
            params.correspBankNm = [ $('#correspBankNmIn').val(), $('#correspBankNmOut').val()];
            params.correspSwiftCd = [ $('#correspSwiftCdIn').val(), $('#correspSwiftCdOut').val()];
            params.isBankStat = [ $('#isBankStatIn').val(), $('#isBankStatOut').val()];
            
			params.sysSvcId = url;
			            
            if(!global.confirm(_saveReq)) {
            	return;
            }
            
            $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//                var result = response['data'];

                //re-search
                loading();                
            });            
        });
		
        
        /**
         * tab change
         */
        $(".tab-group .tab-btn button").on('click',function() {
    		var index = $(this).index();

    		$(this).siblings().removeClass("on");
    		$(this).addClass("on");
    		$(this).parents(".tab-group").find(".tab-box:not(:eq(" + index + "))").removeClass("on");
    		$(this).parents(".tab-group").find(".tab-box:eq(" + index + ")").addClass("on");
    	});
		
        /**
         * validation 
         */
		$(document).on('blur', '#cmpnNm, #cmpnAdr, #taxNo, .bankNmCla, .swiftCdCla, .accNmCla, .accNoCla, .ibanNoCla, .correspBankNmCla, .correspSwiftCdCla', function (e) {
        	var regexp = /^[a-zA-Z0-9`~!@#$%/,_\^\&*-.\?\[\]\{\}\s]*$/;
            
            var name = $(this).val();
        	
        	if(!name) {
            	return;
            } else{
        		if(!regexp.test(name)) {
        			global.alert(_msgTax);
        			$(this).val('').focus();
        		}
        	}
        });

		/**
         * email valid
         */
        $(document).on('blur', '#emailId', function (e) {
        	var regexp = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]/;
            
            var name = $(this).val();
            
            if(!name) {
            	return;
            } else {
        		if(!regexp.test(name)) {
        			global.alert(_msgEmail);
        			$(this).val('').focus();
        		}
        	}
        });
        /**
         * tel, fax valid
         */
        $(document).on('blur', '#telNo, #faxNo', function (e) {
        	var regexp = /^[0-9+\/.-\s]+$/;
            
            var name = $(this).val();
        	
        	if(!name) {
            	return;
            } else {
        		if(!regexp.test(name)) {
        			global.alert(_msgNumdash); 
        			$(this).val('').focus();
        		}
        	}
        });
		
	}; // end of event handlers

	var thisModuleInitializr = function() {
		loading();
	};

	$(function() {
		thisModuleInitializr();
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
