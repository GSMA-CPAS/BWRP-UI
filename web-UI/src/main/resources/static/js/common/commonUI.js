(function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];
	
    $(function() {
        
        // logout control of the application header
        $('#logout').on('click', function(e) {
            location.replace(thisPage.ctx + 'logout')
        });
        
        $(".login input").on('focusin',function() {
            $(this).parent().addClass("on");
        });

        $(".login input").on('focusout',function() {
            $(this).parents(".login").find(".select-box > div").removeClass("on");
        });
        
        $(".menu > ul > li > span,.menu > ul > li > a").on('mouseover keyup',function() {
            $(this).parent().siblings().removeClass("on");
            $(this).parent().addClass("on");
        });

        $(".menu").on('mouseleave',function() {
            $(this).find("> ul > li").removeClass("on");
        });
        
        // close datepicker when page scroll down
        $(window).scroll(function() {
            $(".datepicker").css("left","-100000px");
            $(".datepicker-here").blur();
        });
        
        // Graph dynamic animation
    	var pathes = $('.ct-chart .ct-series').find('path');
        pathes.each(function( i, path ) {
            var total_length = path.getTotalLength();
            path.style.strokeDasharray = total_length + " " + total_length;
            path.style.strokeDashoffset = total_length;
            $(path).animate({
                "strokeDashoffset" : 0
            }, 1500);
        });
        /**
         * user info pop
         */
        $('.user-name').on('click', function() {
        	var modalUrl = _CTX + "dashboard/getUserInfo #myInfoPop";
            $('#myInfoModal').load(modalUrl, function() {
                
                $('#myInfoPop', $(this)).modal({backdrop: 'static', keyboard: false});
            });
            $('.container').addClass('menuOn');
        });
        
        
        var saveReq ='',msgIp='',msgNumdash='', msgEngnumspec='';
        /**
         * get message
         */
        $(document).on('click', "#myInfoEdit", function (e) {
        	
        	var url = _CTX + "dashboard/getUserMsg";
    		var params = {};
    		var commonAjax = $.ajaxProxy($.reqPost(url).setParams(params).build());
    					
    		$.when.apply($, [ commonAjax]).then(function() {
    			var resArr = arguments;
    			var commonResponse = null;
    			
    			$.each(resArr, function(i, res){
    	            if (i === 0){
    	            	commonResponse =  res;
    	            }
    	        });
    					
    			return commonResponse;
    		}).done(function(res) {
    			$('.my-info input[readonly]').removeAttr('readonly');
    			$(".my-info select").removeAttr('disabled');
    			$('.my-info select').removeClass('disabled');
    			
    			saveReq = res.saveReq;
    			msgIp= res.msgIp;
    			msgNumdash= res.msgNumdash;
    			msgEngnumspec = res.msgEngnumspec;
    		});
    	});
        /**
         * save user info
         */
        $(document).on('click', '#myInfoSave', function(e) {
        	
        	if($('#pfirstNm').attr('readonly')) {
        		return;
        	}
        	
        	var nmRegexp = /^[a-zA-Z0-9`~!@#$%/,_\^\&*-.\?\[\]\{\}\(\)\n\<\>\=\|:;"'\\\s]*$/;
    		
    		var firstNm = $('#pfirstNm').val().trim();
    		if(!firstNm) {
    			global.alert('First Name is Required.');
    			$('#pfirstNm').focus();
    			return false;
    		}
            
    		if(!nmRegexp.test(firstNm)) {
    			global.alert(msgEngnumspec);  
    			$('#pfirstNm').val('').focus();
    			return false;
    		}
    		
    		var lastNm =$('#plastNm').val().trim();
    		if(!lastNm) {
    			global.alert('Last Name is Required.');
    			$('#plastNm').focus();
    			return false;
    		}

    		if(!nmRegexp.test(lastNm)) {
    			global.alert(msgEngnumspec);  
    			$('#plastNm').val('').focus();
    			return false;
    		}
    				
    		var telNo = $('#ptelNo').val().trim();
    		
    		if(!telNo) {
    			global.alert('Mobile Number is Required.');
    			$('#ptelNo').focus();
    			return false;
    		}
    		
    		var nuRegexp = /^[0-9+\/.-\s]+$/;
    		
    		if(!nuRegexp.test(telNo)) {
    			global.alert(msgNumdash);
    			$('#ptelNo').val('').focus();
    			return false;
    		}
    		
    		var faxNo = $('#pfaxNo').val().trim();
    		
    		if(!faxNo) {
    			global.alert('Fax Number is Required.');
    			$('#pfaxNo').focus();
    			return false;
    		}

    		if(!nuRegexp.test(faxNo)) {
    			global.alert(msgNumdash);
    			$('#pfaxNo').val('').focus();
    			return false;
    		}
    		
    		var userIp = $('#puserIp').val().trim();
    		
    		if(!userIp) {
    			global.alert('User IP is Required.');
    			$('#puserIp').focus();
    			return false;
    		}
    		
    		var ipRegexp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}$/;
    		
    		if(!ipRegexp.test(userIp)) {
    			global.alert(msgIp);
    			$('#puserIp').val('').focus();
    			return false;
    		}
    		
    		var params = {};
			params = $('#usrPopForm').serializeForm();
			
			var url = _CTX + "dashboard/updateUserMgr";
		        
		    params.sysSvcId = url;
		        
	        if(!global.confirm(saveReq)) {
    			return;
    		}
	        
	        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//	            var result = response['data'];
	            
	            $('#myInfoPop').modal('hide');
	        });
        });
        /**
         * close popup
         */
        $(document).on('click', '#myInfoClose', function(){

            $('.container').removeClass('menuOn');
        });
        
    });
    
})(window, jQuery, thisPage);