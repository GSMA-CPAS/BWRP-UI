var module = (function(global, $, _, _m, thisPage) {
	var _CTX = thisPage['ctx'];
    var _RtnMsg = thisPage.rtnMsg;
//    var _btnRole = thisPage.rtnMsg;

	var _msgEndmoncal = thisPage['com.msg.endmoncal']; 
	var _msgStmoncal = thisPage['com.msg.stmoncal'];   
	var _msgMoncal = thisPage['com.msg.moncal']; 
	
	var _TABLE;

    // show return message
    function alertReturnMessage() {
        if (_RtnMsg) {
            global.alert(_RtnMsg);
        }
    }
    
	/**
	 * select Pure setting
	 */
	var seletMultiPure = function(target, selOps, val, isMultiple, setId) {
		var sel = new SelectPure("#"+target, {
            options: selOps,
            value: val,
            multiple: isMultiple,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function onChange(value) {

                $('#'+setId).val(value);
                
                if(setId === 'sCurrencySel') {
                	$('#financeList').DataTable().draw();
                }
                
            }
        });
		return sel;
	}
	
	/**
	 * invoice init
	 */
	var financeInit = function() {
		
		var url = _CTX + "fch/finance/getInitFinance";
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
			var currencys = res.currencys;
						
			var partnersOps = [];
			var myNetworksOps = [];
			var curcyOps = [];
			var defCur = 'SDR';
			var myNetVal = [];
								
			//partners list
			_.each(partnersResponse, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['plmnId'];
				op.value = v['plmnId'];
				
				partnersOps.push(op);
			});
			//my list
			_.each(myNetworks, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['cdVal1']; 
				op.value = v['cdId'];
				
				myNetworksOps.push(op);

				myNetVal.push(v['cdId']);
			});

			//currency list
			_.each(currencys, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['cdVal1']; 
				op.value = v['cdId'];
				
				curcyOps.push(op);
			});	
			
			seletMultiPure('sPartnersMulti', partnersOps, [], true, 'sPartnersSel');

			seletMultiPure('sMyNetworkMulti', myNetworksOps, myNetVal, true, 'sMyNetworkSel');

			seletMultiPure('sCurrencyMulti', curcyOps, defCur, false, 'sCurrencySel');
			
			$('#sCurrencySel').val(defCur);

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
	 * financial grid
	 */
	_TABLE = $('#financeList').DataTable( {
		orderCellsTop : true,
		fixedHeader : true,		
       	serverSide : true,
 	    scrollY : '50vh',
 	    deferRender : true,
 	    scrollCollapse : true,
// 	    scroller : true,
 	    scroller: {
	    	displayBuffer: 20
	    }, 
 	    deferLoading : 0,
 	    order : [[0, 'desc']],
 	    dom: 'ts',
 	    ajax : {
 	    	url : _CTX + "fch/finance/retrieveFinanceList",
 	    	data: function (data, callback, settings) {
 	    		var regexp = /[^0-9]/g;
 	    		
 	    		for(let col in data.columns) {
 	    			var column = data.columns[col];
 	    			  	    			 
 	    			if(column.data === 'stPeriodMon' && $('#stPeriodMon').val()) {
 	    				column.search.value = $('#stPeriodMon').val().replace(regexp, '');
 	    			}
 	    			 
 	    			if(column.data === 'endPeriodMon' && $('#endPeriodMon').val()) {
 	    				column.search.value = $('#endPeriodMon').val().replace(regexp, '');
 	    			}
 	    			
 	    			if(column.data === 'trmPlmnId' && $('#sMyNetworkSel').val()) {
 	    				column.search.value = $('#sMyNetworkSel').val();
 	    			}
 	    			
 	    			if(column.data === 'rcvPlmnId' && $('#sPartnersSel').val()) {
 	    				column.search.value = $('#sPartnersSel').val();
 	    			}
	    				
    				if(column.data === 'curCdSel' && $('#sCurrencySel').val()) {
    					column.search.value = $('#sCurrencySel').val();
    				} 	
 	    			
 	    			var sProfit = $('#sProfit').val();
// 	    			var sSign = $('#sSign').val();
 	    			
 	    			if(sProfit) {
 	    				if(column.data === 'filterOverProfitSign' && sProfit === 'o+' ) {
 	    					column.search.value = "+"; 
 	    				}else if(column.data === 'filterOverProfitSign' && sProfit === 'o-' ) {
 	    					column.search.value = "-"; 
 	    				}
 	    				
 	    				if(column.data === 'filterProfitSign' && sProfit === 'p+') {
 	    					column.search.value = "+";
 	    				}else if(column.data === 'filterProfitSign' && sProfit === 'p-') {
 	    					column.search.value = "-";
 	    				}  				
 	    			}
 	    		}
 	    		
// 	    		data.length = 25;
 	    		
    		 	return JSON.stringify(data);
 	    	},
 	    	dataSrc: function (data) {
 	    		return data.data;
 	    	}
 	    }       
        ,columns: [
        	{ data: "trmPlmnId" 
        		,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<a href="#" class="firstCellCla">' + row.trmPlmnId +'</a>';
        				return html;
        			}
        			return data;
        		}
        	},
        	{ data: "rcvPlmnId"},
        	{ data: "cntryNm"},
            { data: "revenue" 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<div class="right ellipsis" title="'+curFmt(row.revenue, row.decPoint)+'">' + curFmt(row.revenue, row.decPoint)+'</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "expense" 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<div class="right ellipsis" title="'+curFmt(row.expense, row.decPoint)+'">' +curFmt(row.expense, row.decPoint)+'</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "profit" 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<div class="right ellipsis" title="'+curFmt(row.profit, row.decPoint)+'">' + curFmt(row.profit, row.decPoint)+'</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "overRevenue" 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<div class="right ellipsis" title="'+curFmt(row.overRevenue, row.decPoint)+'">' + curFmt(row.overRevenue, row.decPoint)+'</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "overExpense" 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<div class="right ellipsis" title="'+curFmt(row.overExpense, row.decPoint)+'">' + curFmt(row.overExpense, row.decPoint)+'</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "overProfit" 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<div class="right ellipsis" title="'+curFmt(row.overProfit, row.decPoint)+'">' + curFmt(row.overProfit, row.decPoint)+'</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "stPeriodMon", visible: false },
            { data: "endPeriodMon", visible: false },
            { data: "mccId", visible: false },
            { data: "curCdSel", visible: false },
            { data: "filterProfitSign", visible: false },
            { data: "filterOverProfitSign", visible: false }
        ]
        ,footerCallback : function (row, data, start, end, display ) {
     	  var api = this.api();
 
 	   		if(!_.isEmpty(data)) {
 	   			$('td:eq(1)', api.table().footer()).html(curFmt(data[0].revenueSum, data[0].decPoint)).prop('title', curFmt(data[0].revenueSum, data[0].decPoint));
 	   			$('td:eq(2)', api.table().footer()).html(curFmt(data[0].expenseSum, data[0].decPoint)).prop('title', curFmt(data[0].expenseSum, data[0].decPoint));
 	   			$('td:eq(3)', api.table().footer()).html(curFmt(data[0].profitSum, data[0].decPoint)).prop('title', curFmt(data[0].profitSum, data[0].decPoint));
 	   			$('td:eq(4)', api.table().footer()).html(curFmt(data[0].overRevenueSum, data[0].decPoint)).prop('title', curFmt(data[0].overRevenueSum, data[0].decPoint));
 	   			$('td:eq(5)', api.table().footer()).html(curFmt(data[0].overExpenseSum, data[0].decPoint)).prop('title', curFmt(data[0].overExpenseSum, data[0].decPoint));
 	   			$('td:eq(6)', api.table().footer()).html(curFmt(data[0].overProfitSum, data[0].decPoint)).prop('title', curFmt(data[0].overProfitSum, data[0].decPoint));
 	   			
 	   		}else {
 	   			$('td:eq(1)', api.table().footer()).html('0');
 	   			$('td:eq(2)', api.table().footer()).html('0');
 	   			$('td:eq(3)', api.table().footer()).html('0');
 	   			$('td:eq(4)', api.table().footer()).html('0');
 	   			$('td:eq(5)', api.table().footer()).html('0');
 	   			$('td:eq(6)', api.table().footer()).html('0');
 	   		}
 	    }
        ,drawCallback : function(settings) {
        	var $tr = $(document).find('#financeList tbody tr:eq(0)');
        	
        	var data = $('#financeList').DataTable().row($tr).data();
	   		if(data) { 
	   			$('#overdayTit').html($('#overdueDayTit').val() + ' (~' + data.overDay + ')' );
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
     * orderSequel
     */
//    function generateColumnsOrderSequel(orders) {
//        let orderSequel = '';
//        orders.forEach((o, i, arr) => {
//            if (i === arr.length - 1) {
//                orderSequel += (o[0]+2) + ' '  + o[1];
//            } else {
//                orderSequel += (o[0]+2) + ' '  + o[1] + ', ';
//            }
//        });
//        return orderSequel.toString();
//        
//    }
		
	var thisModuleEventHandlers = function() {
	

		/**
		 * search event
		 */
		$('#nameSearch1').on('click', function (e) {
//			e.preventDefault();
			var stMon = $('#stPeriodMon').val();
			var endMon = $('#endPeriodMon').val();
						
			if(!stMon || !endMon) {
				global.alert(_msgMoncal);
				return;
			}
			
			$('#searchRangeId').text( $('#stPeriodMon').val() + ' ~ ' + $('#endPeriodMon').val());
			
			$('#financeList').DataTable().order([0,'desc']).draw();
		});
		
		
		/**
         * Datepicker Search Start Date
         */
        $('#stPeriodMon').datepicker({
        	dateFormat : 'yyyy-mm',
            closeButton: true,
            autoClose: true,
            maxDate: new Date(),
            onSelect: function (formatDate, date, picker) {
            	
            	// Do nothing if selection was cleared
                if (!date) return;
                // Trigger only if date is changed
                var fromDate = _m(formatDate, ["YYYY-MM"]); // date
                var toDate = _m($('#endPeriodMon').val(), ["YYYY-MM"]);
                                
                if (!toDate.isValid()) return;
                
                if (toDate.isValid() && fromDate.isAfter(toDate)) {
                    global.alert(_msgStmoncal); 
//                    picker.clear();
                }
            }
        });
        
        // start date : 
        $('#stPeriodMon').data('datepicker').selectDate(new Date());
        
        /**
         * Datepicker Search End Date
         */     
        $('#endPeriodMon').datepicker({
        	dateFormat : 'yyyy-mm',
            closeButton: true,
            autoClose: true,
            maxDate: new Date(),
            onSelect: function (formatDate, date, picker) {
            	
            	// Do nothing if selection was cleared
                if (!date) return;
                // Trigger only if date is changed
                var toDate = _m(formatDate, ["YYYY-MM"]); // date
                var fromDate = _m($('#stPeriodMon').val(), ["YYYY-MM"]);
                
                if (!fromDate.isValid()) return;
                
                if (fromDate.isValid() && toDate.isBefore(fromDate)) {
                    global.alert(_msgEndmoncal); 
//                    picker.clear();
                }
            }
        
        });
        
        // end date : now
        $('#endPeriodMon').data('datepicker').selectDate(new Date());
        
        /**
		 * datepicker call
		 */
		$(document).on('click', '.calBtnCla', function() {
			$(this).next('input').focus();
			
		});
		/**
		 * profit checkbox
		 */
		$(document).on('click', '#filterProfitSign', function() {
			if($(this).is(':checked')) {
				$('#filterOverProfitSign').prop('checked', false);
			}
		});
		/**
		 * over profit checkbox
		 */
		$(document).on('click', '#filterOverProfitSign', function() {
			if($(this).is(':checked')) {
				$('#filterProfitSign').prop('checked', false);
			}
		});

		/**
		 * first cell click event => invoice detail move
		 */
		$(document).on('click', '.firstCellCla', function(i) {
			
			var $tr = $(this).closest('tr');
			var data = _TABLE.row($tr).data();

			if(data) {
				var trmPlmnId = data.trmPlmnId;
				var rcvPlmnId = data.rcvPlmnId;
				var stPeriodMon = data.stPeriodMon;
				var endPeriodMon = data.endPeriodMon;
								
				var url = _CTX + "fch/invoice/invMove/"+trmPlmnId +"/"+ rcvPlmnId +"/"+ stPeriodMon + "/"+endPeriodMon;
				
				document.location.href = url;
				
			}
		});
		
	    
        /**
         * finalcial List Excel Down
         */
        $('#finExcelDown').on('click', function(e) {
            e.preventDefault();
            
            var url = _CTX + "fch/finance/downloadFinancialListExcel";
            
            var regexp = /[^0-9]/g;
                        
            var stPeriodMon = $('#stPeriodMon').val().replace(regexp, '');
 			var endPeriodMon = $('#endPeriodMon').val().replace(regexp, '');
 			var trmPlmnId = $('#sMyNetworkSel').val();
 			var rcvPlmnId = $('#sPartnersSel').val();
 			
 			var mccId = $('#sCntrySel').val();
 			
 			
 			var sSign = $('#sSign').val();
 			var filterOverProfitSign = '';
 			var filterProfitSign = '';
 			if($('#filterOverProfitSign').is(':checked') ) {
 				filterOverProfitSign = sSign; 
 			}
 			
 			if($('#filterProfitSign').is(':checked')) {
 				filterProfitSign = sSign; 
 			}
 			
 			var curCdSel = $('#sCurrencySel').val();           
 			
// 			var order = _TABLE.order();
// 	        var orderSequel = generateColumnsOrderSequel(order);
            
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="stPeriodMon" value="' + stPeriodMon + '" />')
            .append('<input type="hidden" name="endPeriodMon" value="' + endPeriodMon + '" />')
            .append('<input type="hidden" name="trmPlmnId" value="' + trmPlmnId + '" />')
            .append('<input type="hidden" name="rcvPlmnId" value="' + rcvPlmnId + '" />')
            .append('<input type="hidden" name="mccId" value="' + mccId + '" />')
            .append('<input type="hidden" name="filterOverProfitSign" value="' + filterOverProfitSign + '" />')
            .append('<input type="hidden" name="filterProfitSign" value="' + filterProfitSign + '" />')
            .append('<input type="hidden" name="curCdSel" value="' + curCdSel + '" />')
//            .append('<input type="hidden" name="orderSequel" value="' + orderSequel + '" />')
            .appendTo('body')
            .submit()
            .remove();
        });
				
		
				
	}; // end of event handlers

	var thisModuleInitializr = function() {
        alertReturnMessage();
        $('#stPeriodMon').val('');
        $('#endPeriodMon').val('');
		financeInit();
	};

	$(function() {
		thisModuleInitializr();
		thisModuleEventHandlers();
	});
	
})(window, jQuery, _, moment, thisPage);
