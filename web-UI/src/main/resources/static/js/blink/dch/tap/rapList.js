var module = (function(global, $, _, _m, thisPage) {
	
	/**
	 * define local consts or variables
	 */
    var _CTX = thisPage.ctx;
    var _RTN_MSG = thisPage.rtnMsg;
    

	var _msgEnddaycal = thisPage['com.msg.enddaycal'];    
	var _msgStdaycal = thisPage['com.msg.stdaycal'];   
	var _msgDaycal = thisPage['com.msg.daycal'];
//    var _msgAltDay = thisPage['rap.alt.day'];  
        
    var _partners = [];
    var myNetVal = [];
//    var _range = 60;
    var _totCnt = 0;
    
    /**
     * define module functions
     */
    // show return message
    function alertReturnMessage() {
        if (_RTN_MSG) {
            global.alert(_RTN_MSG);
        }
    }
    

	/**
	 * select Pure setting
	 */
	var seletMultiPure = function(target, selOps, val, isMultiple, setId) {
		var sp = new SelectPure("#"+target, {
            options: selOps,
            value: val,
            multiple: isMultiple,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function onChange(value) {

                $('#'+setId).val(value);
                
                if(setId === 'sCurrencySel') {
                	$('#invoiceList').DataTable().draw();
                }
                
            }
        });
		return sp;
	}
	
	/**
	 * invoice init
	 */
	var rapInit = function() {
		
		var url = _CTX + "dch/tap/getInitRap";
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
			var partnersResponse = res.partners;
			var myNetworks = res.myNetworks;
//			_range = res.range;
						
			var partnersOps = [];
			var myNetworksOps = [];
								
			//partners list
			_.each(partnersResponse, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['plmnId'];
				op.value = v['plmnId'];
				
				partnersOps.push(op);
				_partners.push(v['plmnId']);
			});
			//my list
			_.each(myNetworks, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['cdVal1']; 
				op.value = v['cdId'];
				
				myNetworksOps.push(op);
				
				myNetVal.push(v['cdId']);
			});
				
			
			seletMultiPure('sPartnersMulti', partnersOps, [], true, 'sPartnersSel');

			seletMultiPure('sMyNetworkMulti', myNetworksOps, myNetVal, true, 'sMyNetworkSel');
			
			$('#sMyNetworkSel').val(myNetVal.join(","));
						

			$(".select-pure__select").on('click', function () {
				$(".select-pure__select").removeClass("select-pure__select--opened");
				$(this).addClass("select-pure__select--opened");
			});
			
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
					$('.select-pure__options').css('max-height', (height * (lastIx - firstIx))+(height*2) + 'px');
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
			
		});	
	};
    

	/**
	 * rap grid
	 */
		$('#rapList').DataTable( {
			orderCellsTop : false,
            orderMulti: false,
			fixedHeader : true,		
			colReorder: false, 
			serverSide : true,
	 	    paging : true,
	 	    pageLength : 20,
	 	    scrollCollapse : true,
	 	    deferLoading : 0,
	 	    order : [[0, 'desc']],
	 	    dom: 'tp',
	 	    scrollX : true,
	 	    scrollY : 540,
	 	    ajax : {
	 	    	url : _CTX + "dch/tap/retrieveRapList",
	 	    	data: function (data, callback, settings) {

	 	    		var regexp = /[^0-9]/g;
	 	    		
	 	    		for(let col in data.columns) {
	 	    			var column = data.columns[col];
	 	    			 
	 	    			if(column.data === 'stPeriodDay' && $('#stPeriodDay').val()) {
	 	    				column.search.value = $('#stPeriodDay').val().replace(regexp, '');
	 	    			}
	 	    			 
	 	    			if(column.data === 'endPeriodDay' && $('#endPeriodDay').val()) {
	 	    				column.search.value = $('#endPeriodDay').val().replace(regexp, '');
	 	    			}
	 	    			
	 	    			if(column.data === 'trmPlmnId' && $('#sMyNetworkSel').val()) {
	 	    				column.search.value = $('#sMyNetworkSel').val();
	 	    			}else if(column.data === 'trmPlmnId') {
	 	    				column.search.value = myNetVal.join(',');
	 	    			}
	 	    			
	 	    			if(column.data === 'rcvPlmnId' && $('#sPartnersSel').val()) {
	 	    				column.search.value = $('#sPartnersSel').val();
	 	    			}else if(column.data === 'rcvPlmnId') {
	 	    				column.search.value = _partners.join(',');
	 	    			}
	 	    		}
	 	    		
	 	    		data.search.value = _totCnt;
	 	    		
 	    		 	return JSON.stringify(data);
	 	    	},
	 	    	dataSrc: function (data) {
	 	    		return data.data;
	 	    	}
	 	    }       
	        ,columns: [
	        	{ data: "fileNm" },
	        	{ data: "fileCretDtValView" },
	        	{ data: "trmPlmnId" },
	        	{ data: "rcvPlmnId"},
	            { data: "recdNo", sortable: false },
	            { data: "imsiId", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var val = row.imsiId;
	        				
	        				if(!val) {
	        					val = '-';
	        				}
	        				
	        				return val;
	        				
	        			}
	        			return data;
	        		}
	            },
	            { data: "callTypeIdNm", sortable: false},
	            { data: "calldNo", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var val = row.calldNo;
	        				
	        				if(!val) {
	        					val = '-';
	        				}
	        				
	        				return val;
	        				
	        			}
	        			return data;
	        		}
	            },
	            { data: "duration", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.duration)+ '</div>';
	        				return html;
	        				
	        			}
	        			return data;
	        		}
	            },
	            { data: "volume", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.volume)+ '</div>';
	        				return html;
	        				
	        			}
	        			return data;
	        		}
	            },
	            { data: "errCd" , sortable: false },
	            { data: "errCdNm", sortable: false },
	            { data: "callTypeId", visible: false },
	            { data: "stPeriodDay", visible: false },
	            { data: "endPeriodDay", visible: false },
	            
	        ]
 	       ,drawCallback : function() {
 	    	   
 	    	  $('#rapList').DataTable().rows().count();
 	    	  var $tr = $(document).find('#rapList tbody tr:eq(0)');
 	    	  if($tr) {
 	    		 var data = $('#rapList').DataTable().row($tr).data();
 	    		  	    		 
 	    		 if(data && data.totalCount > 0) {
 	    			 _totCnt = data.totalCount;
 	    		 }else {
 	    			_totCnt = 0;
 	    		 }
 	    	  }
		    }	  
        });
		
		/**
	     * currency
	     */
	    function curFmt(amt, precision) {
	    	
	    	if(!amt) {
	    		return "0";
	    	}
	    	
	    	if(!precision) {
	    		precision = "0";
	    	}
	    	
	    	return currency(amt, {separator:',', precision : precision}).format();
	    }
    
    
    /**
     * define event handlers
     */
    var thisModuleEventHandlers = function() {
        
        
        /**
         * Datepicker Search Start Date
         */
        $('#stPeriodDay').datepicker({
        	dateFormat : 'yyyy-mm-dd',
            closeButton: true,
            autoClose: true,
            maxDate: new Date(),
            onSelect: function (formatDate, date, picker) {
            	
            	// Do nothing if selection was cleared
                if (!date) return;
                // Trigger only if date is changed
                var fromDate = _m(formatDate, ["YYYY-MM-DD"]); // date
                var toDate = _m($('#endPeriodDay').val(), ["YYYY-MM-DD"]);
                
                if (!toDate.isValid()) return;
                
                if (toDate.isValid() && fromDate.isAfter(toDate)) {
                    global.alert(_msgStdaycal); 
                    picker.clear();
                }
            }
            
        });
        
        
        /**
         * Datepicker Search End Date
         */     
        $('#endPeriodDay').datepicker({
        	dateFormat : 'yyyy-mm-dd',
            closeButton: true,
            autoClose: true,
            maxDate: new Date(),
            onSelect: function (formatDate, date, picker) {
            	
            	// Do nothing if selection was cleared
                if (!date) return;
                // Trigger only if date is changed
                var toDate = _m(formatDate, ["YYYY-MM-DD"]); // date
                var fromDate = _m($('#stPeriodDay').val(), ["YYYY-MM-DD"]);
                
                if (!fromDate.isValid()) return;
                
                if (fromDate.isValid() && toDate.isBefore(fromDate)) {
                    global.alert(_msgEnddaycal); 
                    picker.clear();
                }
            }
        
        });
        
        
        // start date : minus 5 days from now
        $('#endPeriodDay').data('datepicker').selectDate(new Date());
        
        // end date : now
        $('#stPeriodDay').data('datepicker').selectDate(new Date());
                

		/**
		 * datepicker call
		 */
		$(document).on('click', '.calBtnCla', function() {
			$(this).prev('input').focus();
			
		});
               

		/**
		 * search event
		 */
		$('#nameSearch1').on('click', function (e) {
			
			var stDay = $('#stPeriodDay').val();
			var endDay = $('#endPeriodDay').val();
						
			if(!stDay || !endDay) {
				global.alert(_msgDaycal);
				return;
			}
//			var diff = moment.duration(moment(endDay).diff(moment(stDay))).asDays();
//			if(diff > _range) {
//				global.alert(_msgAltDay);
//				return;
//			}
			
			$('#rapList').DataTable().order([0,'desc']).draw();
		});
        
		/**
		 * excel down
		 */
		$('#rapExcelDown').on('click', function() {

	    	var regexp = /[^0-9]/g;
	    		
			var stPeriodDay = $('#stPeriodDay').val().replace(regexp, '');
 			var endPeriodDay = $('#endPeriodDay').val().replace(regexp, '');
 			var trmPlmnId = $('#sMyNetworkSel').val();
 			var rcvPlmnId = $('#sPartnersSel').val();
 			
 			var url = _CTX + "dch/tap/downRapListExcel";
                    
            
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="stPeriodDay" value="' + stPeriodDay + '" />')
            .append('<input type="hidden" name="endPeriodDay" value="' + endPeriodDay + '" />')
            .append('<input type="hidden" name="trmPlmnId" value="' + trmPlmnId + '" />')
            .append('<input type="hidden" name="rcvPlmnId" value="' + rcvPlmnId + '" />')
            .appendTo('body')
            .submit()
            .remove();
		});
        
    }; // end of event handlers
    
    
    /**
     * define page initial functions
     */
    var thisModuleInitializr = function() {
    	alertReturnMessage();
    	rapInit();
    }; // end of module Initializr
    
    
    /**
     * jQuery DOM Ready
     */
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    }); // end of jquery DOM ready
    
})(window, jQuery, _, moment, thisPage);
