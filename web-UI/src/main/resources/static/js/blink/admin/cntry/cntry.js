var module = (function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];

	var _cntryDup = thisPage['cntryDup'];
	var _cntryCd = thisPage['cntryCd'];
	var _cntryCdAbbr = thisPage['cntryCdAbbr'];
	var _mccId = thisPage['mccId'];
	var _cntryNm = thisPage['cntryNm'];
//	
	var _saveReq = thisPage['com.save.req']; 
//	var _tblSearch = thisPage['com.tbl.search'];	
	var _tblSelect = thisPage['com.tbl.select'];	
	var _delReq = thisPage['com.del.req'];		

	var _msgEngnum = thisPage['com.msg.engnumspec']; 
	var _msgNum13 = thisPage['com.msg.num13']; 
	var _msgNum3 = thisPage['com.msg.num3']; 
	var _msgEngc2 = thisPage['com.msg.engc2']; 
       			
		var _TABLE = $('#cntryList').DataTable( {
 	       colReorder: true, // [default:false]  Bfrtip
 	       lengthChange: false, 
 	       serverSide : true,
 	       filter : false,
 	       info : false,
 	       order : [[0, 'asc']],
 	       dom: "tp",
 	       ajax : {
 	    	   url : _CTX + "cntry/retrieveCntryList",
 	    	  data: function (data) {
 	    		 
 	    		 for(let col in data.columns) {
 	    			 var column = data.columns[col];
 	    			  	    			 
 	    			 if(column.data === 'cntryNm' && $('#sCntryNm').val()) {
 	    				 column.search.value = $('#sCntryNm').val();
 	    			 }
 	    		 }
 	    		 
                  return JSON.stringify(data);
              },
              dataSrc: function (data) {
                  return data.data;
              }
 	       }
	        ,columns: [
	        	{ data: "cntryNm" },
	        	{ data: "cntryCd" },
	        	{ data: "isoCntryDgt2"},
	            { data: "mccId" }
	        ]
        });
		

	/**
	 * validation
	 */
	var validation = function() {
		
		if(!$('#cntryNm').val().trim()) {
			
			global.alert('Country Name is Required.');
			$('#cntryNm').focus();
			return false;
		}
		
		var cntryCd = $('#cntryCd').val().trim();
		if(!cntryCd) {
			
			global.alert('Country Code is Required.');
			$('#cntryCd').focus();
			return false;
		}
		
		
		
		var isoCntryDgt2 = $('#isoCntryDgt2').val().trim();
		if(!isoCntryDgt2) {
			
			global.alert('Country Code Abbreviation is Required.');
			$('#isoCntryDgt2').focus();
			return false;
		}
		
		
		var mccId = $('#mccId').val().trim();
		
		if(!mccId) {
			
			global.alert('MCC is Required.');
			$('#mccId').focus();
			return false;
		}
		
		
		
		return true;
	}
	
	var thisModuleEventHandlers = function() {
		
		
		/**
		 * Grid row select
		 */
		$(document).on('click', '#cntryList tbody tr', function() {
			if ($(this).hasClass('selected')) {
		        $(this).removeClass('selected');
		    } else {
		        _TABLE.$('tr.selected').removeClass('selected');
		        $(this).addClass('selected');
		    }
		});
		
		/**
		 * search event
		 */
		$('#nameSearch1').on('click', function (e) {
			e.preventDefault();
						
			_TABLE.draw();
		});
		
		/**
		 * pop focus
		 */
		$("#updateRowModal").on('shown.bs.modal', function(){
	        $('#cntryNm').focus();
		});
		
		/**
		 * new pop open
		 */
		$('#add').on('click', function (e) {
			e.preventDefault();
			
			$('#mccId').prop('readOnly', false);
			
			$('#cntryForm')[0].reset();
			
			$('#cntryStat').val("I");
			$("#updateRowModal").modal("show");		
			
		});
		

		/**
         * alpha
         */
        $(document).on('blur', '#cntryCd', function (e) {
        	var regexp = /^[0-9]{1,3}$/;
            
            var name = $(this).val();
        	
        	if(!name) {
        		return;
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgNum13);  
        			$(this).val('').focus();
        		}
        	}
        });
        
        /**
         * dgt 2 validation
         */
        $(document).on('blur', '#isoCntryDgt2', function (e) {
        	var regexp = /^[A-Z]{2}$/;
            
            var name = $(this).val();
        	
        	if(!name) {
        		return;
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgEngc2);    
        			$(this).val('').focus();  
        		}
        	}
        });
        
        /**
         * name validation
         */
        $(document).on('blur', '#cntryNm', function (e) {
        	var regexp = /^[a-zA-Z0-9`~!@#$%/,_\^\&*-.\?\[\]\{\}\(\)\s]*$/;
            
            var name = $(this).val();

        	if(!name) {
        		return
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgEngnum);  
        			$(this).val('').focus();
        		}
        	}
        });
		
		/**
         * numeric
         */
        $(document).on('blur', '#mccId', function (e) {
        	var regexp = /^[0-9]{3}$/;
            
            var name = $(this).val();
            
        	if(!name) {
        		return
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgNum3); 
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
			params.mccId = $('#mccId').val().trim();
			params.isoCntryDgt2 = $('#isoCntryDgt2').val().trim();
			params.cntryNm = $('#cntryNm').val().trim();
			params.cntryCd = $('#cntryCd').val().trim();
			params.cntryStat = $('#cntryStat').val();
			params.orgMccId = $('#orgMccId').val();
						
			//dup check
			var dupUrl = _CTX + "cntry/dupCheckCntry";
			$.ajaxProxy($.reqPost(dupUrl).setParams(params).build()).done(function(response) {
	            var result = response['data'];

	            var msg = '';
	            if(result.mccIdCnt != '0') {
	            	msg = _mccId;
	            }
	            else if(result.isoCntryDgt2Cnt != '0') {
	            	msg = _cntryCdAbbr;
	            }
	            else if(result.cntryNmCnt != '0') {
	            	msg = _cntryNm;
	            }
	            else if(result.cntryCdCnt != '0') {
	            	msg =  _cntryCd;
	            }
	            
	            if(msg) {
	            	global.alert(msg + ' ' + _cntryDup);
	            	return;
	            }
	            
	            var url = _CTX + "cntry/insertCntry";
		        
		        if($('#cntryStat').val() === 'U') {
		        	url = _CTX + "cntry/updateCntry";
		        }
		        
		        params.sysSvcId = url;
		        
		        if(!global.confirm(_saveReq)) {
		        	return;
		        }
		        
		        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response284) {
		            
		            if($('#cntryStat').val() === 'U') {
		            	_TABLE.ajax.reload(null, false); // Keep current page after change
		            }else {
		            	_TABLE.draw();
		            }
		            
		            $('#updateRowModal').modal('hide');
		        });
	        });
			
		});
		
		/**
		 * modify pop open
		 */
		$("#update").on('click', function(){
						
			var row = _TABLE.row('.selected');

			var data = row.data();

			if (!data) {
				global.alert(_tblSelect); 
				return;
			}

			$('#cntryForm')[0].reset();
			
			$('#cntryStat').val("U");
			
			var cntryCd = data.cntryCd;
			var mccId = data.mccId;
			var isoCntryDgt2 = data.isoCntryDgt2;
			var cntryNm = data.cntryNm;
			
//			$('#mccId').prop('readOnly', true);
			
			$('#cntryCd').val(cntryCd);
			$('#mccId').val(mccId);
			$('#orgMccId').val(mccId);
			$('#isoCntryDgt2').val(isoCntryDgt2);
			$('#cntryNm').val(cntryNm);
			
			$("#updateRowModal").modal("show");
		});

		/**
		 * delete
		 */
		$('#delete').click(function() {
			var row = _TABLE.row('.selected');

			var data = row.data();

			if (!data) {
				global.alert(_tblSelect); 
				return;
			}
						
			var params = {};
			params.mccId = data.mccId;
			
			if(!global.confirm( _delReq)) {
				return;
			}
						
	        var url = _CTX + "cntry/deleteCntry";
	        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//	            var result = response['data'];
	            
	            _TABLE.ajax.reload(null, false); // Keep current page after change
	        });
		});	
		
		
	}; // end of event handlers


	$(function() {
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
