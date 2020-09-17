var module = (function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];

	var _saveReq = thisPage['com.save.req']; 
//	var _tblSearch = thisPage['com.tbl.search'];	
	var _tblSelect = thisPage['com.tbl.select'];	
	var _delReq = thisPage['com.del.req'];		
	
	var _mgsPlmndup = thisPage['plmn.mgs.plmndup']; 
	var _mgsEngc5 = thisPage['com.msg.engc5']; 
	var _mgsEngnumspec = thisPage['com.msg.engnumspec']; 
	var _mgsNum3 = thisPage['com.msg.num3']; 
	var _mgsNum2 = thisPage['com.msg.num2'];  
    /**
     * plmn list
     */	
	var _TABLE = $('#plmnList').DataTable( {
		orderCellsTop : true,
		fixedHeader : true,
		
		colReorder: false, // [default:false]  Bfrtip
		lengthChange: false, 
		serverSide : true,
		filter : false,
		order : [[0, 'asc']],
		dom: 'tp', 
		ajax : {
			url : _CTX + "plmn/retrievePlmnList",
			data: function (data) {
    		 
    		 	for(let col in data.columns) {
    		 		var column = data.columns[col];
    			     			 
    		 		if(column.data === 'plmnId' && $('#sPlmnId').val()) {
    		 			column.search.value = $('#sPlmnId').val();
    		 		}
    		 		
    		 		if(column.data === 'mccId' && $('#sMccId').val()) {
    		 			column.search.value = $('#sMccId').val();
    		 		}
    		 		
    		 		if(column.data === 'mncId' && $('#sMncId').val()) {
    		 			column.search.value = $('#sMncId').val();
    		 		}
    		 		
    		 		if(column.data === 'cntryCd' && $('#sCntryCd').val()) {
    		 			column.search.value = $('#sCntryCd').val();
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
        	{ data: "plmnId" },
            { data: "plmnNm" },
            { data: "mccId" },
            { data: "mncId" },
            { data: "cntryCd" },
            { data: "cntryNm" },
            { data: "expDt", visible: false }
        ]	    
    });	
		
	/**
	 * plmn form validation
	 */
	var validateRegisterForm = function($plmnForm) {
		var plmnId = $.trim($('#plmnId').val());
		var plmnNm = $.trim($('#plmnNm').val());
		var mncId = $.trim($('#mncId').val());
		var mccId = $.trim($('#mccId').val());
//		var cntryNm = $('.single-select .select-pure__label').text();
		
		if (!plmnId) {
            global.alert("PLMN is required.");
            $('#plmnId').focus();
            return false;
        } else if (!plmnNm) {
            global.alert("Provider Name is required.");
            $('#plmnNm').focus();
            return false;
        } else if (!mccId) {
            global.alert("MCC is required.");
            $('#mccId').focus();
            return false;
        } else if (!mncId) {
            global.alert("MNC is required.");
            $('#mncId').focus();
            return false;
        } 
			
		return true;
	};
	
	/**
	 * insert / update call
	 */
	var insUpPlmn = function(params) {
		var url = _CTX + "plmn/insertPlmn";
        if($('#plmnStat').val() === 'U') {
        	url = _CTX + "plmn/updatePlmn";
        }

        params.sysSvcId = url;

        if(!global.confirm(_saveReq)) {
        	return;
        }        
        
        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//            var result = response['data'];

            if($('#plmnStat').val() === 'U') {
            	_TABLE.ajax.reload(null, false); // Keep current page after change
            }else {
            	_TABLE.draw();
            }
            
            $('#updateRowModal').modal('hide');
        });
	}
		
	var thisModuleEventHandlers = function() {
		/**
		 * Grid row select
		 */
		$(document).on('click', '#plmnList tbody tr', function() {
			if ($(this).hasClass('selected')) {
		        $(this).removeClass('selected');
		    } else {
		        _TABLE.$('tr.selected').removeClass('selected');
		        $(this).addClass('selected');
		    }
		});
		
		/**
		 * search button click
		 */
		$(document).on('click', '#nameSearch1', function (e) {
			//e.preventDefault();
									
			_TABLE.order([0, 'asc']).draw();
		});
		
		/**
		 * new pop open
		 */
		$('#add').on('click', function (e) {
			e.preventDefault();

			//init	
			$('#plmnForm')[0].reset();
			$('#plmnStat').val("I");
            $('#plmnId').focus();

			$("#updateRowModal").modal("show");
		});
		
		/**
		 * update pop open
		 */
		$("#update").on('click', function(e){
			e.preventDefault();
			
			var row = _TABLE.row('.selected');
			var data = row.data();
			
			if (!data) {
				global.alert("Select a table row for updating please.");
				return;
			}
			
			$('#plmnForm')[0].reset();
			$('#plmnStat').val("U");
			$('#plmnId').focus();
			
			//init
			$('.single-select div').remove();
			
			var url = _CTX + "plmn/findPlmnInfo";
			var params = {};
			params.mccId = data.mccId;
			params.mncId = data.mncId;
			params.expDt = data.expDt;
			var plmnAjax = $.ajaxProxy($.reqPost(url).setParams(params).build());
				
			
			$.when.apply($, [plmnAjax]).then(function() {
				var resArr = arguments;
				
				var plmnResponse = null;
				
				$.each(resArr, function(i, res){
	                if (i === 0) {
	                	plmnResponse = res;
	                } 
	            });
				
				return plmnResponse;
			}).done(function(plmnResponse) {
				
				var plmn = plmnResponse.data;
				
				var plmnId = plmn.plmnId;
				var plmnNm = plmn.plmnNm;
				var mncId = plmn.mncId;
				var mccId = plmn.mccId;
//    			var cntryCd = plmn.cntryCd; 
    			var expDt = plmn.expDt; 			
    			
    			
    			$('#plmnId').val(plmnId);
    			$('#plmnNm').val(plmnNm);
    			$('#mncId').val(mncId);
    			$('#mccId').val(mccId);
    			$('#expDt').val(expDt);
    			$('#orgMncId').val(mncId);
    			$('#orgMccId').val(mccId);
    		    			
    			$("#updateRowModal").modal("show");
			    
			});
			
		});
		
		/**
		 * insert / update event
		 */
		$('#plmnSubmit').on('click', function(e) {
            e.preventDefault();
            
            if (!validateRegisterForm($('#plmnForm'))) return;
            
            var url = _CTX + "plmn/dupCheckPlmn";
            var params = {};
            params.plmnId = $('#plmnId').val().trim();
			params.plmnNm = $('#plmnNm').val().trim();
			params.mncId = $('#mncId').val().trim();
			params.mccId = $('#mccId').val().trim();
			params.plmnStat = $('#plmnStat').val().trim();
			params.expDt = $('#expDt').val().trim();
			params.orgMccId = $('#orgMccId').val().trim();
			params.orgMncId = $('#orgMncId').val().trim();
			
			$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
	            var result = response['data'];
	            
	            if(result.plmnIdCnt === '0' ) { //&& result.mncIdCnt === '0'
	            	insUpPlmn(params);
	            }else {
	            	global.alert(_mgsPlmndup) 
	            }
	        });
            
        }); //
		

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
			params.mncId = data.mncId;
			params.mccId = data.mccId;
			params.expDt = data.expDt;	
									
	        var url = _CTX + "plmn/deletePlmn";

			if(!global.confirm( _delReq)) {
				return;
			}
			
	        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//	            var result = response['data'];

	            _TABLE.draw();
	        });
		});	
		
		/**
		 * plmn id validation
		 */
		$(document).on('blur', '#plmnId', function (e) {
        	var regexp = /^[A-Z0-9]{5}$/;
            
            var name = $(this).val();
        	
        	if(!name) { 
        		return 
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_mgsEngc5);  
        			$(this).val('').focus();
        		}
        	}
        });
		
		/**
		 * provider name validation
		 */
		$(document).on('blur', '#plmnNm', function (e) {
        	var regexp = /^[a-zA-Z0-9`~!@#$%/,_\^\&*-.\?\[\]\{\}\(\) ]*$/;
            
            var name = $(this).val();
        	
        	if(!name) { 
        		return 
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_mgsEngnumspec);  
        			$(this).val('').focus();
        		}
        	}
        });
		
		/**
		 * mnc validation
		 */
		$(document).on('blur', '#mccId', function (e) {
        	var regexp = /^[0-9]{3}$/;
            
            var name = $(this).val();
        	
        	if(!name) { 
        		return 
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_mgsNum3);  
        			$(this).val('').focus();
        		}
        	}
        });
		/**
		 * mnc validation
		 */
		$(document).on('blur', '#mncId', function (e) {
        	var regexp = /^[0-9]{2}$/;
            
            var name = $(this).val();
        	
        	if(!name) { 
        		return 
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_mgsNum2);  
        			$(this).val('').focus();
        		}
        	}
        });
		
	}; // end of event handlers
	

	$(function() {
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
