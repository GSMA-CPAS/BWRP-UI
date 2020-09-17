var module = (function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];
	var _saveReq = thisPage['com.save.req']; 
	var _tblSearch = thisPage['com.tbl.search'];
	var _tblSelect = thisPage['com.tbl.select'];	
	var _delReq = thisPage['com.del.req'];		
	var _msgEmail = thisPage['user.msg.email'];  
	var _msgNumdash = thisPage['com.msg.numdash'];  
	var _msgIp = thisPage['user.msg.ip'];  
	var _msgEmaildup = thisPage['user.msg.emaildup']; 
	var _msgEngnumspec = thisPage['com.msg.engnumspec'];   
	
	/**
	 * user init
	 */
	var userInit = function() {
		
		var url = _CTX + "usermgr/initUserMgr";
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
			var comms = res;
			var auths = '';
			
			// auth
//			auths = '<option value=""></option>';
			_.each(comms, function(v, k) {			
				auths += '<option value="'+v['cdId']+'">'+v['cdVal1']+'</option>';
			});
			
			
			$('#userRole').html(auths);
			
			initUserMgr();
			
		});	
	};
	
	/**
	 * init userMgr list
	 */
	function initUserMgr() {
		$('#userMgrList').DataTable( {
 	       colReorder: true, // [default:false]  Bfrtip
 	       lengthChange: false, 
 	       serverSide : true,
 	       filter : false,
 	       info : false,
 	       order : [[0, 'asc']],
 	       dom: "tp",
 	       ajax : {
 	    	   url : _CTX + "usermgr/retrieveUserMgrList",
 	    	  data: function (data) {
 	    		 for(let col in data.columns) {
 	    			 var column = data.columns[col];
 	    			 
 	    			if(column.data === 'userId' && $('#sUserId').val()) {
 	    				column.search.value = $('#sUserId').val();
 	    			}
 	    		}  	    		 
 	    		return JSON.stringify(data);
              },
              dataSrc: function (data) {
                  return data.data;
              }
 	       	}
 	       	,processing : false 	       
	        ,columns: [
	        	{ data: "userId", sortable: true },
	        	{ data: "userRoleNm", sortable: true },
	        	{ data: "firstNm", sortable: false },
	        	{ data: "lastNm", sortable: false},
	            { data: "faxNo", sortable: false },
	            { data: "telNo" , sortable: false},
	            { data: "userIp" , sortable: false},
	            { data: "tapMissConfYn" , sortable: false},
	            { data: "delYn" , sortable: false
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<input type="checkbox" id="ckbox' + meta.row +'" class="hide">';
	        					html += '<label for="ckbox' + meta.row +'"><i class="ico checkbox"><em>선택</em></i></label>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "orgUserId", visible: false},
	            { data: "userRole", visible: false}
	        ]
        });
	};
	
	/**
	 * validation
	 */
	var validation = function() {
		
		if(!$('#userId').val().trim()) {
			
			global.alert('E-Mail is Required.');
			$('#userId').focus();
			return false;
		}
		
		var firstNm = $('#firstNm').val().trim();
		if(!firstNm) {
			
			global.alert('First Name is Required.');
			$('#firstNm').focus();
			return false;
		}
				
		var lastNm =$('#lastNm').val().trim();
		if(!lastNm) {
			
			global.alert('Last Name is Required.');
			$('#lastNm').focus();
			return false;
		}
				
		var telNo = $('#telNo').val().trim();
		
		if(!telNo) {
			
			global.alert('Mobile Number is Required.');
			$('#telNo').focus();
			return false;
		}
		
		var faxNo = $('#faxNo').val().trim();
		
		if(!faxNo) {
			
			global.alert('Fax Number is Required.');
			$('#faxNo').focus();
			return false;
		}
		
		var userIp = $('#userIp').val().trim();
		
		if(!userIp) {
			
			global.alert('User IP is Required.');
			$('#userIp').focus();
			return false;
		}
		
		
		return true;
	}
	
		
	var thisModuleEventHandlers = function() {

		/**
		 * Grid row select
		 */
		$(document).on('click', '#userMgrList tbody tr', function() {
			if ($(this).hasClass('selected')) {
		        $(this).removeClass('selected');
		    } else {
		    	$('#userMgrList').DataTable().$('tr.selected').removeClass('selected');
		        $(this).addClass('selected');
		    }
		});
		
		/**
		 * search event
		 */
		$('#nameSearch1').on('click', function (e) {
//			e.preventDefault();
						
			$('#filterMyNet').val('');
			$('#filterParterNet').val('');
			$('#filterInvKind').val('');
			
			$('#userMgrList').DataTable().draw();
		});
		

		/**
		 * new pop open
		 */
		$('#add').on('click', function (e) {
			e.preventDefault();
						
			$('#userMgtForm')[0].reset();
			
			$('#userStat').val("I");
			$("#userMgrPop").modal("show");		
			
			$('#userMgrPop tbody td').css( {'padding-top':'4px', 'padding-bottom':'4px'});
			
		});
		/**
		 * delete button click
		 */
		$('#deleteId').on('click', function(e) {
			var len = $('#userMgrList tbody input[type="checkbox"]').length;
			if(len == 0) {
				global.alert(_tblSearch);
				return;
			}
			
			var chkedkLen = $('#userMgrList tbody input[type="checkbox"]:checked').length;
			
			if(chkedkLen > 0) {
				var params = {};	
				params.userId = '';
				var x=0;
				$('#userMgrList tbody input[type="checkbox"]').each(function(i) {
					if($(this).is(':checked')) {
						var $tr = $(this).closest('tr');
						var data = $('#userMgrList').DataTable().row($tr).data();
						if(x==0) {
							params.userId = data.userId;
							x++;
						}else {
							params.userId += ','+ data.userId;
						}
					}
				});
				
				if(!global.confirm(params.userId.replace(/,/g,'\n') + ' ' + _delReq)) {
					return;
				}
				
				//delete 
				var url = _CTX + "usermgr/deleteUserMgr";
				$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//		            var result = response['data'];

		            $('#userMgrList').DataTable().draw();
				});
			}else {
				global.alert(_tblSelect); 
				return;
			}
		});
		
		/**
         * email valid
         */
        $(document).on('blur', '#userId', function (e) {
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
        	var regexp = /^[0-9][0-9.-\s]*$/;
            
            var name = $(this).val().trim();
        	
        	if(!name) {
            	return;
            } else {
        		if(!regexp.test(name)) {
        			global.alert(_msgNumdash); 
        			$(this).val('').focus();
        		}
        	}
        });
        /**
         * ip check
         */
        $(document).on('blur', '#userIp', function (e) {
        	var regexp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}$/;
            
            var name = $(this).val().trim();
            
            if(!name) {
            	return;
            } else {
        		if(!regexp.test(name)) {
        			global.alert(_msgIp);
        			$(this).val('').focus();
        		}
        	}
        });   
        
        $(document).on('blur', '#firstNm, #lastNm', function() {
			var regexp = /^[a-zA-Z0-9][a-zA-Z0-9`~!@#$%/,_\^\&*-.\?\[\]\{\}\(\)\n\<\>\=\|:;"'\\\s]*$/;
            
            var name = $(this).val().trim();
        	
        	if(!name) {
        		return;
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgEngnumspec);  
        			$(this).val('').focus();
        		}
        	}
		});

		/**
		 * insert / update event
		 */
		$('#updateSubmit').on('click', function(e) {
			e.preventDefault();

			if(!validation()) {
				return;
			}
			
			var params = {};
			params = $('#userMgtForm').serializeForm();
			
			
			//dup check
			var dupUrl = _CTX + "usermgr/dupCheckUserMgr";
			$.ajaxProxy($.reqPost(dupUrl).setParams(params).build()).done(function(response) {
	            var result = response['data'];
	            
	            if(result.userIdCnt != '0') {
	            	
	            	global.alert(_msgEmaildup); 
	            	
	            	return;
	            }
	            
	            var url = _CTX + "usermgr/insertUserMgr";
		        
		        if($('#userStat').val() === 'U') {
		        	url = _CTX + "usermgr/updateUserMgr";
		        }
		        
		        params.sysSvcId = url;
		        
		        if(!global.confirm(_saveReq)) {
		        	return;
		        }
		        
		        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response358) {

		            if($('#userStat').val() === 'U') {
		            	$('#userMgrList').DataTable().ajax.reload(null, false); // Keep current page after change
		            }else {
		            	$('#userMgrList').DataTable().draw();
		            }
		            
		            $('#userMgrPop').modal('hide');
		        });
	        });
			
		});
		

		/**
		 * modify pop open
		 */
		$("#update").on('click', function(){
			var row = $('#userMgrList').DataTable().row('.selected');

			var data = row.data();
			
			if (!data) {
				global.alert(_tblSelect); 
				return;
			}

			$('#userMgtForm')[0].reset();
			
			$('#userStat').val("U");
			
			var userId = data.userId;
			var firstNm = data.firstNm;
			var lastNm = data.lastNm;
			var faxNo = data.faxNo;
			var telNo = data.telNo;
			var orgUserId = data.orgUserId;
			var userRole = data.userRole;
			var tapMissConfYn = data.tapMissConfYn ||'N';
			var userIp = data.userIp;
									
			$('#userId').val(userId);
			$('#firstNm').val(firstNm);
			$('#lastNm').val(lastNm);
			$('#faxNo').val(faxNo);
			$('#telNo').val(telNo);
			$('#orgUserId').val(orgUserId);
			$('#userRole').val(userRole);
			$('#tapMissConfYn').val(tapMissConfYn);
			$('#userIp').val(userIp);
			
			$("#userMgrPop").modal("show");

			$('#userMgrPop tbody td').css( {'padding-top':'4px', 'padding-bottom':'4px'});
		});

				
	}; // end of event handlers

	var thisModuleInitializr = function() {
		userInit();
	};

	$(function() {
		thisModuleInitializr();
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
