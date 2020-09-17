var module = (function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];
	
	var _saveReq = thisPage['com.save.req']; 
	var _upReq = thisPage['com.up.req']; 
	var _msgDecimal = thisPage['erate.msg.decimal']; 
	var _msgDup = thisPage['erate.msg.dup']; 
	var _msgBaseday = thisPage['erate.msg.baseday']; 
	var _tblNo = thisPage['com.tbl.no']; 
				
	var _TABLE = $('#erateList').DataTable( {
		orderCellsTop : true,
		fixedHeader : true,
		
		colReorder: true, // [default:false]  Bfrtip
		lengthChange: false, 
		serverSide : true,
		filter : false,
		info : false,
		order : [[0, 'desc']],
		dom: 'tp', 
		ajax : {
			url : _CTX + "erate/retrieveErateList",
			data: function (data) {
    		 	for(let col in data.columns) {
    		 		var column = data.columns[col];
    			 
    		 		if(column.data === 'tgtMon' && $('#sPeriod').val()) {
    		 			var regexp = /[^0-9]/g;
    					
    		 			column.search.value = $('#sPeriod').val().replace(regexp, '');
    		 		}
    		 		
    		 		if(column.data === 'tgtIsocuCd' && $('#sCurSel').val()) {
    		 			column.search.value = $('#sCurSel').val();
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
        	{ data: "tgtViewMon" },
            { data: "baseViewDay", sortable: false 
        		,render : function(data, type, row, meta) {
            		if(type === 'display') {
            			if(row.edit === '1') {
            				var html = '<div class="select-box in-date-type">';
            					html += '<div>';
            					html += '<input type="text" value="'+ row.baseViewDay +'" class="datepicker-list baseDayCla"  readOnly="readOnly" id="datepickerId_' +meta.row+ '"><i class="ico calendar calBtnCla"></i>'
            					html += '</div></div>';
            				
            				return html;
            			}
            			else {
            				return '<div class="text left">' + row.baseViewDay +'</div>';
            			}
            		}
            		return data;
            	}
            },
            { data: "tgtIsocuCdView", sortable: false },
            { data: "erateVal", sortable: false
            	,render : function(data, type, row, meta) {
            		if(type === 'display') {
            			if(row.edit === '1') {
            				var html = '<div class="select-box">';
        					html += '<div>';
        					html += '<input type="text" value="'+ row.erateVal +'" class="right upErateValCla">'
        					html += '</div></div>';
        					
            				return html;
            			}
            			else {
            				return '<div class="text right">' + row.erateVal +'</div>';
            			}
            		}
            		return data;
            	}
            },
            { data: "sysRecdChgDt", sortable: false 
            	,render : function(data, type, row, meta) {
            		if(type === 'display') {
            			return moment(row.sysRecdChgDt).format("YYYY-MM-DD");
            		}
            		return data;
            	}
            },
        	{ data: "tgtMon", visible: false },
            { data: "baseDay", visible: false },
            { data: "baseIsocuCd", visible: false },
            { data: "erateOldVal", visible: false },
            { data: "stat", visible: false },
            { data: "edit", visible: false },
            { data: "tgtIsocuCd", visible: false }
        ]
	    ,drawCallback : function() {
  	   	
    	   	$(document).find('.datepicker-list').each(function(i){

    	   		$('#' + $(this).prop('id')).datepicker(
    	   			{
    	   				dateFormat : 'yyyy-mm-dd',
    	   				closeButton: true,
    	   	            autoClose: true
    	   			});
    	   		
    	   		$('#' + $(this).prop('id')).data('datepicker').selectDate(new Date($(this).val())); 
    	   	});
	    }	    	   		
    });	
		
	var periodOps = '';
//	var selPeriodOps = '';
	var currencyOps = [];
	var curcyPopOps = [];
	var multiIdx=0;
	
	let url1 = _CTX + "erate/getTgtMons";
	var params = {};
	var erateAjax = $.ajaxProxy($.reqPost(url1).setParams(params).build());
	
	$.when.apply($, [ erateAjax]).then(function() {	
		var resArr = arguments;
		
		var erateResponse = null;
		
		$.each(resArr, function(i, res){
            if (i === 0){
            	erateResponse =  res;
            }
        });
		
		var res = {};
		
		res.erateResponse = erateResponse;
		
		return res;
	}).done(function(res) {

		var erateResponse = res.erateResponse;
		
		periodOps = '';
		
		periodOps += '<option value=""></option>';
		_.each(erateResponse.periods, function(v, k) {			
			periodOps += '<option value="'+v['tgtMon']+'">'+v['tgtViewMon']+'</option>';
		});
				
		curcyPopOps.push({label:'-', value:'0'});
		_.each(erateResponse.currencys, function(v, k) { 
			var op = {label:'', value:''};
			op.label = v['cdVal1']; 
			op.value = v['cdId'];
			
			currencyOps.push(op);
			curcyPopOps.push(op);
		});
						
		var sp = new SelectPure(".multi-select", {
            options: currencyOps,
            value: [],
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function onChange(value) {
                $('#sCurSel').val(value);
                
            }
        });
		
		$('.multi-select2 > span + div, .search-group .multi-select > span + div').css('width','50%');
		
		$(".select-pure__select").on('click', function () {
			$(".select-pure__select").removeClass("select-pure__select--opened");
			$(this).addClass("select-pure__select--opened");
		});
		
		multiSelArrow();
		
		return sp;
	});
	/**
	 * arrow
	 */
	function multiSelArrow() {
		//arrow key event
		$('.select-pure__autocomplete').on('keyup', function(e) {				
			var key = e.keyCode;
			var $this = $(this);
			
			if(!$this.val()){
				$this.siblings().css('background-color','');
				$('.select-pure__options').css('max-height', '161px');
				return;
			}
			
			var ix = $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').index();
			var firstIx = $(this).siblings('div:not(".select-pure__option--hidden"):first').index();
			var lastIx = $(this).siblings('div:not(".select-pure__option--hidden"):last').index();
			
			var height = $(this).siblings('div:not(".select-pure__option--hidden"):first').outerHeight(true);

			if(lastIx - firstIx >= 3) {
				$('.select-pure__options').css('max-height', (height * (lastIx - firstIx))+(height*3) + 'px');
			}else {
				$('.select-pure__options').css('max-height', '161px');
			}
			
			
			if(key == 38) { //up
				$(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').prev().css('background-color','#f5f9f9');
				$(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').next().css('background-color','');
			}else if(key == 40)	{ //down	
				if(ix == -1) {
					$(this).siblings('div:not(".select-pure__option--hidden"):first').css('background-color','#f5f9f9');
				}else {
					$(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').next().css('background-color','#f5f9f9');
					$(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').prev().css('background-color','');
				}
			}else if(key == 13) { //enter
				$(this).siblings('div[style*="background-color: rgb(245, 249, 249)"]').click();
				$(this).siblings('div').css('background-color','');
			}
		});//arrow key event end
	}

	/**
	 * row add
	 */
	var addRow = function() {
		
		multiIdx++;
		
		var html = '';
		
		html += '<tr><td>';
		
		html += '<div class="select-box"><select class="periodSelCla">';
		html += periodOps;
		html += '</select>';
		html += '</i></div></td>';
		
		html += '<td><div class="select-box in-date-type"><div>';
		html += '<input type="text" class="datepicker-pop baseDayPopCla" readOnly="readOnly">'; // 
		html += '<i class="ico calendar calBtnCla"></i>';
		html += '</div>';
		html += '</td>';
		
		html += '<td>';
		
		html += '<div class="single-select" id="currencyPop'+ multiIdx +'">';
		html += '</div>';
		html += '<input type="hidden" class="currencySelCla" id="currencyPopId'+ multiIdx +'"/></td>';
		
		html += '<td><div class="select-box"><div>';
		html += '<input type="text" class="right erateValCla" maxlength="17">'; //
		html += '</div></div>';
		
		html += '<button type="button" class="add-type-button add plusCla"><i class="ico add-gray"><em>추가하기</em></i></button>';
		html += '<button type="button" class="add-type-button remove minusCla"><i class="ico remove"><em>삭제하기</em></i></button>';
		html += '</td></tr>';
				
		return html;
	}
	
	/**
	 * dup check
	 */
	var dupChkErate = function(period, currency) {
		
		if(period && currency ) {
			let url275 = _CTX + "erate/dupCheckErate";
			var params276 = {};
			params.tgtMon = period;
			params.tgtIsocuCd = currency;
			params.baseIsocuCd = 'SDR';  //SDR
			
			$.ajaxProxy($.reqPost(url275).setParams(params276).build()).done(function(response) {
				var result = response; //response['data'];
				
				if(result.erateCnt === 0) {
					return true;
				}else {
					global.alert(_msgDup); 
					return false;
				}
			});
			
		}
		
	}
	
	/**
	 * currency check
	 */
	var currencyCheck = function(val) {
		
		if(!val) {
			return false;
		}
		
		var regexp = /^([0-9]){1,10}(\.[0-9]{1,6}){0,1}$/;
		
		if(!regexp.test(val)) {
			global.alert(_msgDecimal); 
			return false;
		}
		return true;
	}
	
	/**
	 * validation form
	 */
	var validateRegisterForm = function() {
		
		var tgtMonValid = 0, baseDayValid=0, currValid=0, erateValid=0, isErr=0;

    	var regexp = /[^0-9]/g;
    	
		var elist = [];
		$('#erateTbody tr').each(function() {
			var tgtMon = $(this).find('.periodSelCla').val().trim();
			var tgtIsocuCd = $(this).find('.currencySelCla').val().trim();
			
			var item = {'tgtMon' : tgtMon, 'tgtIsocuCd' : tgtIsocuCd};
			elist.push(item);
		});
		
		
		$('#erateTbody tr').each(function() {
			var tgtMon = $(this).find('.periodSelCla').val().trim();
        	var baseDay = $(this).find('.baseDayPopCla').val().trim();
        	var tgtIsocuCd = $(this).find('.currencySelCla').val().trim();
        	var erateVal = $(this).find('.erateValCla').val().trim();
        	
			
        	if(!tgtMon) {
        		tgtMonValid++;
        		return false;
        	}else if(!baseDay) {
        		baseDayValid++;
        		return false;
        	}else if(!tgtIsocuCd) {
        		currValid++;
        		return false;
        	}else if(!erateVal) {
        		erateValid++;
        		return false;
        	}
        				
			var day = baseDay.replace(regexp, '');
			
			var preM = moment(moment(tgtMon, 'YYYYMM')).subtract(1, 'months').format('YYYYMM');
			
			if(preM !== day.substring(0,6)) {
				global.alert(_msgBaseday); 
				isErr++;
				return false;
			}
			
			if(!currencyCheck(erateVal)) {
				isErr++;
				return false;
			}
			
			var list = _.filter(elist, function(m) {
					return m.tgtMon === tgtMon && m.tgtIsocuCd === tgtIsocuCd;
				});
			
			if(!_.isEmpty(list) && list.length > 1) {
				global.alert(_msgDup); 
				isErr++;
				return false;
			}
			
		});
		
		if(tgtMonValid>0) {
			global.alert('Period is Required.');
			return false;
		}else if(baseDayValid>0) {
			global.alert('Base Date is Required.');
			return false;
		}else if(currValid>0) {
			global.alert('Currency is Required.');
			return false;
		}else if(erateValid>0) {
			global.alert('Currency Rate Per SDR is Required.');
			return false;
		}else if(isErr>0) {
			return false;
		}
		
		return true;
	}
	
	/**
	 * grid validation
	 */
	var validateListForm = function() {
		
		var isErr=0;

		$('#erateList tbody tr').each(function() {

			var regexp = /[^0-9]/g;
			
			var data = _TABLE.row($(this)).data();
			var edit = data.edit;
			var tgtMon = data.tgtMon;
			
			if(edit !== '1') {
				return true;
			}
			
			var baseDay = $(this).find('.baseDayCla').val().trim().replace(regexp, '');
			var day = baseDay.replace(regexp, '');
			
			var preM = moment(moment(tgtMon, 'YYYYMM')).subtract(1, 'months').format('YYYYMM');
						
			if(preM !== day.substring(0,6)) {
				global.alert(_msgBaseday); 
				isErr++;
				return false;
			}
			
			var oriVal = data.baseDay;
						
			if(day !== oriVal) {
				data.stat = 'U';
			}
		});
		
		if(isErr>0) {
			return false;
		}
		
		return true;
	}
	/**
	 * set currency options
	 */
	var setCurrencySelOpt = function() { //multiIdx) {
		var sp1 = new SelectPure("#currencyPop"+ multiIdx, {
            options: curcyPopOps,
            value: '0',
            multiple: false,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function onChange(value) {
                $('#currencyPopId'+multiIdx).val(value);
                
            }
        });
		
		$('.table-box .select-pure__select').css({'width':'99%', 'border':'1px solid #b4b4b4'});
		

		$(".select-pure__select").on('click', function () {
			$(".select-pure__select").removeClass("select-pure__select--opened");
			$(this).addClass("select-pure__select--opened");
		});

//		multiSelArrow();
		return sp1;
	}
	
	/**
	 * event handlers
	 */
	var thisModuleEventHandlers = function() {


        /**
         * Datepicker Search End Date
         */     
        $('#sPeriod').datepicker({
        	dateFormat : 'yyyy-mm',
            closeButton: true,
            autoClose: true        
        });
        
        $('#sPeriod').on('click', function() {
        	$(this).val('');
        });                
		
		/**
		 * search button click event
		 */
		$('#Search').on('click', function (e) {
			e.preventDefault();
						
			_TABLE.draw();
		});

		/**
		 * new popup open
		 */
		$('#add').on('click', function (e) {
			e.preventDefault();

			//초기화	
			$('#erateTbody tr').remove();
			
			$('#erateTbody').append(addRow());
			$(document).find('.datepicker-pop').datepicker(
					{
    	   				dateFormat : 'yyyy-mm-dd',
    	   				closeButton: true,
    	   	            autoClose: true
    	   			}		
			);  

			setCurrencySelOpt();

			$("#updateRowModal").modal("show");
		});
		
		$("#updateRowModal").on('shown.bs.modal', function(){
//			$('body').css('overflow', 'auto');
		});
		
		$("#updateRowModal").on('hidden.bs.modal', function(){
			//초기화	
			$('#erateTbody tr').remove();
		});
		
		/**
		 * datepicker call
		 */
		$(document).on('click', '.calBtnCla', function() {
			$(this).prev('input').focus();
			
		});
		
		/**
		 * add row
		 */
		$(document).on('click', '.plusCla', function(){
			
			if(!validateRegisterForm()) {
				return;
			}
			var $this = $(this);
			var $tr = $(this).closest('tr');
			
			var currency = $tr.find('.currencySelCla').val();
			var period = $tr.find('.periodSelCla').val();
        	
			var url552 = _CTX + "erate/dupCheckErate";
			var params553 = {};
			params.tgtMon = period;
			params.tgtIsocuCd = currency;
			params.baseIsocuCd = 'SDR';  //SDR
			
			$.ajaxProxy($.reqPost(url552).setParams(params553).build()).done(function(response) {
				var result = response;
				
				if(result.erateCnt === 0) {
//					$this.parents(".table-box.exchange").find("tbody").append(addRow());
					$this.parents(".table-box.exchange").find("tbody").prepend(addRow());
					$this.parents(".table-box.exchange").find("tbody > tr:not(:first-child) .add-type-button.add").hide();
//					$this.parents(".table-box.exchange").find("tbody > tr:not(:last-child) .add-type-button.add").hide();
					
					$(document).find('.datepicker-pop').datepicker(
							{
								dateFormat : 'yyyy-mm-dd',
								closeButton: true,
								autoClose: true
							}		
					);  
					
					setCurrencySelOpt();
					
					var len = $(document).find('#erateTbody .single-select').length;

					$(document).find('#erateTbody .single-select').each(function(i){
						$(this).css('z-index', len-i);
					});	
				}else {
					global.alert(_msgDup); 
				}
			});
			
		});
		
		/**
		 * delete row
		 */
		$(document).on('click', '.minusCla', function(){
			if($(this).hasClass("remove")) {				
				var idx = $(this).closest('tr').index();
				
				if(idx != 0) {
					$(this).closest('tr').remove();
				}
				
				var len = $(document).find('#erateTbody .single-select').length;

				$(document).find('#erateTbody .single-select').each(function(i){					
					$(this).css('z-index', len-i);
				});	
			}			
		});
		
		
		/**
		 * rate insert event
		 */
		$('#updateSubmit').on('click', function(e) {
            e.preventDefault();
            
            if (!validateRegisterForm()) return;
            
            var regexp = /[^0-9]/g;

            var erates = [];
            $('#erateTbody tr').each(function(i){
            	var ErateDomain = {};
            	ErateDomain.tgtMon = $(this).find('.periodSelCla').val().trim();
            	ErateDomain.baseDay = $(this).find('.baseDayPopCla').val().trim().replace(regexp, '');
            	ErateDomain.tgtIsocuCd = $(this).find('.currencySelCla').val().trim();
            	ErateDomain.erateVal = $(this).find('.erateValCla').val().trim();
            	ErateDomain.baseIsocuCd = 'SDR';  //SDR
				            	            	
            	if(ErateDomain.tgtMon && ErateDomain.baseDay && ErateDomain.tgtIsocuCd && ErateDomain.erateVal) {
            		erates.push(ErateDomain);
            	}
            });
			
            if(_.isEmpty(erates)) {
            	global.alert(_tblNo); 
            	return;
            }
            
            var durl = _CTX + "erate/dupCheckMultiErate";
            $.ajaxProxy($.reqPost(durl).setParams(erates).build()).done(function(response) {
	            var result = response;
	            
	            if(result == 0) {
	            	var url = _CTX + "erate/insertErate";
	            	
	            	if(!global.confirm(_saveReq)) {
	            		return;
	            	}    
	            	
	            	$.ajaxProxy($.reqPost(url).setParams(erates).build()).done(function(response649) {
	            		
	            		_TABLE.draw();
	            		
	            		$('#updateRowModal').modal('hide');
	            		
	            	});
					
				}else {
					global.alert(_msgDup); 
					return false;
				}

	        });
            
        });
		
		/**
		 * pop currency setting
		 */
		$(document).on('blur', '.erateValCla', function(e) {
            e.preventDefault();
			
			var val = $(this).val();
			
			if(!val) {
				return;
			}else if(!currencyCheck(val)) {
				$(this).val('').focus();
				return;
			}
		});
		
		/**
		 * list currency change setting
		 */
		$(document).on('change', '.upErateValCla', function(e) {
			
			var val = $(this).val();
			
			var tr = $(this).closest('tr');
			
			var data = _TABLE.row(tr).data();
			
			if(!currencyCheck(val)) {
				$(this).val(data.erateOldVal).focus();
				return;
			}
        	
			
			var oldErate = data.erateOldVal;
			
			if(val !== oldErate) {
				data.stat = 'U';
			}
		});
				
		/**
		 * update 
		 */
		$("#update").on('click', function(){			
			
			if(!validateListForm()) return;
			
			var url = _CTX + "erate/updateErate";
            var erates = [];
			$('#erateList tbody tr').each(function(i){
				
				var data = _TABLE.row($(this)).data();
				
				var stat = data.stat;

	            var regexp = /[^0-9]/g;
				
				if(stat === 'U') {
					var ErateDomain = {};
					
					ErateDomain.tgtMon = data.tgtMon;
	            	ErateDomain.baseDay = $(this).find('.baseDayCla').val().trim().replace(regexp, '');
					ErateDomain.tgtIsocuCd = data.tgtIsocuCd;
					ErateDomain.erateVal = $(this).find('.upErateValCla').val().trim();
					ErateDomain.baseIsocuCd = 'SDR';  //SDR
										
					erates.push(ErateDomain);
				}
            });
			
			if(_.isEmpty(erates)) {
				global.alert(_tblNo); 
				return;
			}
			
			if(!global.confirm(_upReq)) {
            	return;
            }
			
			$.ajaxProxy($.reqPost(url).setParams(erates).build()).done(function(response) {
//	            var result = response['data'];

            	_TABLE.ajax.reload(null, false); // Keep current page after change

	        });
		});
		
		/**
		 * dup check event popup
		 */
		$(document).on('change', '.periodSelCla', function() {
			
			var period = $(this).val();
			var currency = $(this).closest('tr').find('.currencySelCla').val();
				
			dupChkErate(period, currency);
		});
		
		/**
		 * dup check event popup
		 */
		$(document).on('change', '.currencySelCla', function() {
			var currency = $(this).val();
			var period = $(this).closest('tr').find('.periodSelCla').val();
			
			dupChkErate(period, currency);
		});

		
	}; // end of event handlers


	$(function() {
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
