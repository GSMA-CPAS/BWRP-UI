var module = (function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];
    var _RtnMsg = thisPage.rtnMsg;
    
	var _invocId = thisPage['invocId'];
	var _invocDirectCd = thisPage['invocDirectCd'];

	var _invMsg004 = thisPage['inv.msg.004'];  	
	var _invMsg005 = thisPage['inv.msg.005'];	
	var _invMsg007 = thisPage['inv.msg.007'];	
	var _invMsg008 = thisPage['inv.msg.008'];	

    // show return message
    function alertReturnMessage() {
        if (_RtnMsg) {
            global.alert(_RtnMsg);
        }
    }

	/**
	 * invoice init
	 */
	var invoiceInit = function() {
		
		var url = _CTX + "fch/invoice/getInitInvocDetail";
		var params = {};
		var commonAjax = $.ajaxProxy($.reqPost(url).setParams(params).build());
		
		var invocUrl = _CTX + "fch/invoice/getInvocInfo";
		var invParams = {};
		invParams.invocId = _invocId;
		invParams.invocDirectCd = _invocDirectCd;
		var invocAjax = $.ajaxProxy($.reqPost(invocUrl).setParams(invParams).build());
		
		var commitUrl = _CTX + "fch/invoice/getComitPie";
		var commitParams = {};
		commitParams.invocId = _invocId;
		commitParams.invocDirectCd = _invocDirectCd;
		var commitAjax = $.ajaxProxy($.reqPost(commitUrl).setParams(commitParams).build());
		
		var sp1;
					
		$.when.apply($, [ commonAjax, invocAjax, commitAjax]).then(function() {
			var resArr = arguments;
			var response = {};
			
			$.each(resArr, function(i, res){
	            if (i === 0){
	            	response.currencys = res.currencys;
	            }else if (i === 1){
	            	response.invoc = res;
	            }else {
	            	response.commit = res;
	            }
	        });
					
			return response;
		}).done(function(res) {
			var currencys = res.currencys;
			var _invoc = res.invoc;
			var _commit = res.commit;
						
			var curcyOps = [];
			var defCur = 'SDR';
			
			//currency list
			_.each(currencys, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['cdVal1'];
				op.value = v['cdId'];
				
				curcyOps.push(op);
			});

			sp1 = new SelectPure("#sCurrencyMulti", {
	            options: curcyOps,
	            value: defCur,
	            multiple: false,
	            autocomplete: true,
	            icon: "fa fa-times",
	            onChange: function onChange(value) {

	                $('#sCurrencySel').val(value);
	                
	                $('#tapList').DataTable().draw();
	                
	            }
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
			
			
			$('#sCurrencySel').val(defCur);
			
			$('#statusNm').text(_invoc.statusCdNm);
			//
			gridTapList();
			
			if(_invoc.commitTotalRate > 0) {
				$('#leftCommitPercnt').html( _invoc.commitPeriodRate + '<span>%</span>');
				
				PieChart('pie-area1', _invoc.commitPeriodRate);
				
				$('#rightCommitPercnt').html( _invoc.commitTotalRate + '<span>%</span>');
				
				PieChart('pie-area2', _invoc.commitTotalRate);
			}else if(_commit) {
				$('#leftCommitPercnt').html( _commit.pie.rangePercnt + '<span>%</span>');
				
				PieChart('pie-area1', _commit.pie.rangePercnt);
				
				$('#rightCommitPercnt').html( _commit.pie.lastPercnt + '<span>%</span>');
				
				PieChart('pie-area2', _commit.pie.lastPercnt);
			}
		});	
		
		return sp1;
	};
	
	/**
	 * commit chart
	 */
	function PieChart(chartId, percnt) {
		
		var p1 = percnt;
		var p2 = 100 - Number(percnt);
		
		var series = [];
    	series.push({name : 'amt', data: p1});
    	
		if(Number(p1) < 100) {
			series.push({name :'all', data: p2});
		}
		
		var container = document.getElementById(chartId);
		var data = {
			categories: ['Commitment'],
			series: series
		};
		var options = {
			chart: {
				width: 282,
				height: 164,
				format: function (value, chartType, areaType, valuetype, legendName) {
					if (areaType === 'makingSeriesLabel') {
						value = value + '%';
					}
					return value;
				}
			},
			legend: {
				visible: false,
				align: 'left'
			},
			series: {
				radiusRange: ['70%', '100%'],// 20190906
				showLabel: false
			},
			tooltip: {
				suffix: ''
			}
		};
		var theme = {
			series: {
				colors: [
					'#0fc8cd', '#b7b7b7'
				],
				column: {
					colors: ['red', 'orange', 'yellow', 'green', 'blue']
				}
			},
			label: {
				color: '#333',
				fontFamily: 'NotoSans-Regular',
				align: 'center'
			},
			chart: {
				fontFamily: 'NotoSans-Regular',
				background: {
					opacity: 1
				}
			},
			title: {
				align: 'bottom',
				fontSize: 14,
				fontFamily: 'NotoSans-Regular',
				fontWeight: 'bold',
				color: '#222'
			}
		};
		tui.chart.registerTheme('myTheme', theme);
		options.theme = 'myTheme';
		tui.chart.pieChart(container, data, options);
	}
		
	/**
	 * payment status setting
	 */
	var callPayment = function( statusCd, gbn) {
				
		var url = _CTX + "fch/invoice/updateInvoiceStat";
		
		var params = {};
		params.invocIds = [_invocId];
		params.statusCd = statusCd;
		params.sysSvcId = url;
		
		$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {

			reloadDetail(gbn);
		});
	};
	/**
	 * invoice info
	 */
	var setInvoiceInfo = function(gbn, stuCd) {
		var url = _CTX + "fch/invoice/getInvocInfo";
		
		var params = {};
		params.invocId = _invocId;
		params.invocDirectCd = _invocDirectCd||'';
		$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {

			var result = response;
			if(result) {
				if(gbn === 'pay') {
					if(result.invocStatusCd === '10' || result.invocStatusCd === '20') {
						
						if(!global.confirm(_invMsg004)) {
							return;
						}
						
						callPayment('30', gbn);
						
					}else {
						global.alert(_invMsg007); 
					}
					
				}else {
					if(result.invocStatusCd === '40') {
						if(!global.confirm(_invMsg005)) {
							return;
						}
						callPayment('50', gbn);
					}else {
						global.alert(_invMsg008); 
					}
				}
			}
		});
	};
	/**
	 * reload UI
	 */
	function reloadDetail(gbn) {
		var url = _CTX + "fch/invoice/getInvocInfo";
		
		var params = {};
		params.invocId = _invocId;
		params.invocDirectCd = _invocDirectCd||'';
		$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
			$('#statusNm').text(response.statusCdNm);
			if(gbn === 'pay') {
				$('#payouId').remove();
			}else {
				$('#confId').remove();
			}
			
		});
	}
	

	/**
	 * tap grid
	 */
	function gridTapList() {
		$('#tapList').DataTable( {
			orderCellsTop : true,	
 	       	serverSide : true,
	 	    info : true,
 	       	searching : false,
	 	    paging : true,
	 	    order : [[0, 'ASC']],
	 	    dom: 't',
	 	    scrollCollapse : true,
	 	    scrollX : true,
	 	    scrollY : '240px',
	 	    ajax : {
	 	    	url : _CTX + "fch/invoice/retrieveDayTapList",
	 	    	data: function (data, callback, settings) {
	 	    		
	 	    		for(let col in data.columns) {
	 	    			var column = data.columns[col];
	 	    			 	 	    			 
	 	    			if(column.data === 'invocId') {
	 	    				column.search.value = _invocId;
	 	    			}
	 	    			
	 	    			if(column.data === 'invocDirectCd') {
	 	    				column.search.value = _invocDirectCd;
	 	    			}
	 	    			
	 	    			if(column.data === 'curCdSel' && $('#sCurrencySel').val()) {
	 	    				column.search.value = $('#sCurrencySel').val();
	 	    			}
	 	    		}
	 	    		
 	    		 	return JSON.stringify(data);
	 	    	},
	 	    	dataSrc: function (data) {
	 	    		return data.data;
	 	    	}
	 	    }
 	       	,processing : true 	       
	        ,columns: [
	        	{ data: "fileCretDateVal" },
	        	{ data: "trmPlmnId", sortable: false},
	        	{ data: "rcvPlmnId", sortable: false},
	        	{ data: "invocDirectCdNm", sortable: false},
	            { data: "tapSeq", sortable: false},	            
	            { data: "totSumRecdCnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' + curFmt(row.totSumRecdCnt)+'</div>';
	        				//[[${#numbers.formatDecimal(item.taxAmt, 1,'COMMA', 2, 'POINT')}]]
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "totSumAmt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right ellipsis" title="'+curFmt(row.totSumAmt, row.decPoint)+'">' +curFmt(row.totSumAmt, row.decPoint)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },	            
	            { data: "mocVoRecdCnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.mocVoRecdCnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "mocVoUseQnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.mocVoUseQnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "mocVoCalcAmt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right ellipsis" title="'+curFmt(row.mocVoCalcAmt, row.decPoint)+'">' +curFmt(row.mocVoCalcAmt, row.decPoint)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "mtcVoRecdCnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.mtcVoRecdCnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "mtcVoUseQnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.mtcVoUseQnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "mtcVoCalcAmt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right ellipsis" title="'+curFmt(row.mtcVoCalcAmt, row.decPoint)+'">' +curFmt(row.mtcVoCalcAmt, row.decPoint)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },	            
	            { data: "dataRecdCnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.dataRecdCnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "dataUseQnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.dataUseQnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "dataCalcAmt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right ellipsis" title="'+curFmt(row.dataCalcAmt, row.decPoint)+'">' +curFmt(row.dataCalcAmt, row.decPoint)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },	            
	            { data: "smsRecdCnt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right">' +curFmt(row.smsRecdCnt)+'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	            { data: "smsCalcAmt", sortable: false 
	            	,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '<div class="right ellipsis" title="'+curFmt(row.smsCalcAmt, row.decPoint)+'">' +curFmt(row.smsCalcAmt, row.decPoint) +'</div>';
	        				return html;
	        			}
	        			return data;
	        		}
	            },	            
	            { data: "invocId", visible: false },
	            { data: "invocDirectCd", visible: false },
	            { data: "curCdSel", visible: false }
	            
	        ]
 	       ,drawCallback : function() {
 	    	   
 	    	   	var api = this.api();
 	    	   	
 	    	   	
	 	    	 var $tr = $(document).find('#tapList tbody tr:eq(0)');
	 	    	 if($tr) {
	 	    		 var data = $('#tapList').DataTable().row($tr).data();
	 	    		 	 	    		 
	 	    		 if(data) {
	 	    			 $('tr:eq(0) td:eq(1)', api.table().footer()).html(curFmt(data.totSumTotRecdCnt));
	 	    			 $('tr:eq(0) td:eq(2)', api.table().footer()).html(curFmt(data.totSumTotAmt, data.decPoint)).prop('title', curFmt(data.totSumTotAmt, data.decPoint));
	 	    			 
	 	    			 $('tr:eq(0) td:eq(3)', api.table().footer()).html(curFmt(data.mocTotVoRecdCnt));
	 	    			 $('tr:eq(0) td:eq(4)', api.table().footer()).html(curFmt(data.mocTotVoUseQnt));
	 	    			 $('tr:eq(0) td:eq(5)', api.table().footer()).html(curFmt(data.mocTotVoCalcAmt, data.decPoint)).prop('title', curFmt(data.mocTotVoCalcAmt, data.decPoint));
	 	    			 
	 	    			 $('tr:eq(0) td:eq(6)', api.table().footer()).html(curFmt(data.mtcTotVoRecdCnt));
	 	    			 $('tr:eq(0) td:eq(7)', api.table().footer()).html(curFmt(data.mtcTotVoUseQnt));
	 	    			 $('tr:eq(0) td:eq(8)', api.table().footer()).html(curFmt(data.mtcTotVoCalcAmt, data.decPoint)).prop('title', curFmt(data.mtcTotVoCalcAmt, data.decPoint));
	 	    			 
	 	    			 $('tr:eq(0) td:eq(9)', api.table().footer()).html(curFmt(data.dataTotRecdCnt));
	 	    			 $('tr:eq(0) td:eq(10)', api.table().footer()).html(curFmt(data.dataTotUseQnt));
	 	    			 $('tr:eq(0) td:eq(11)', api.table().footer()).html(curFmt(data.dataTotCalcAmt, data.decPoint)).prop('title', curFmt(data.dataTotCalcAmt, data.decPoint));
	 	    			 
	 	    			 $('tr:eq(0) td:eq(12)', api.table().footer()).html(curFmt(data.smsTotRecdCnt));
	 	    			 $('tr:eq(0) td:eq(13)', api.table().footer()).html(curFmt(data.smsTotCalcAmt, data.decPoint)).prop('title', curFmt(data.smsTotCalcAmt, data.decPoint));
	 	    			 
	 	    			 
	 	    			$(".table-box.dataColor thead tr th:nth-child(6)").addClass('total');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(1)").addClass('total');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(2)").addClass('total');
	 	    			$(".table-box.dataColor tbody td:nth-child(6)").addClass('total');
	 	    			$(".table-box.dataColor tbody td:nth-child(7)").addClass('total');

	 	    			$(".table-box.dataColor thead tr th:nth-child(7)").addClass('moc');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(3)").addClass('moc');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(4)").addClass('moc');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(5)").addClass('moc');
	 	    			$(".table-box.dataColor tbody td:nth-child(8)").addClass('moc');
	 	    			$(".table-box.dataColor tbody td:nth-child(9)").addClass('moc');
	 	    			$(".table-box.dataColor tbody td:nth-child(10)").addClass('moc');

	 	    			$(".table-box.dataColor thead tr th:nth-child(8)").addClass('mtc');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(6)").addClass('mtc');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(7)").addClass('mtc');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(8)").addClass('mtc');
	 	    			$(".table-box.dataColor tbody td:nth-child(11)").addClass('mtc');
	 	    			$(".table-box.dataColor tbody td:nth-child(12)").addClass('mtc');
	 	    			$(".table-box.dataColor tbody td:nth-child(13)").addClass('mtc');

	 	    			$(".table-box.dataColor thead tr th:nth-child(9)").addClass('data');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(9)").addClass('data');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(10)").addClass('data');
	 	    			$(".table-box.dataColor thead tr:nth-child(2) th:nth-child(11)").addClass('data');
	 	    			$(".table-box.dataColor tbody td:nth-child(14)").addClass('data');
	 	    			$(".table-box.dataColor tbody td:nth-child(15)").addClass('data');
	 	    			$(".table-box.dataColor tbody td:nth-child(16)").addClass('data');
	 	    			 
	 	    		 }
	 	    		 
	 	    	 }
	    	   	
		    }	  
        });
	}

	/**
     * currency
     */
    function curFmt(amt, precision) {
    	if(!precision) {
    		precision = "0";
    	}
    	
    	if(!amt) {
    		return "0";
    	}else {
    		return amt;
    	}
    	
    	
//    	return currency(amt, {separator:',', precision : precision}).format();
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
//
//        return orderSequel.toString();
//        
//    }
		
	var thisModuleEventHandlers = function() {
		
		/**
		 * 지급
		 */
		$('#payouId').on('click', function (e) {
			e.preventDefault();
			
			setInvoiceInfo('pay', '30');
			
		});
		
		/**
		 * confirm payment
		 */
		$('#confId').on('click', function (e) {
			e.preventDefault();
			
			setInvoiceInfo('conf', '50');
						
		});
		
		/**
		 * go list
		 */
		$(document).on('click', '#toListId', function(e){
			e.preventDefault();
						
			var url = _CTX + "fch/invoice";
			
			$('<form action="' + url + '" method="GET"></form>')
			.appendTo('body')
			.submit()
			.remove();
		});
		
	      
        /**
         * tap daily List Excel Down
         */
        $('#excelTapDown').on('click', function(e) {
            e.preventDefault();
            
            var url = _CTX + "fch/invoice/downloadTapDailyListExcel";
            
            var invocId = _invocId;
 			var invocDirectCd = _invocDirectCd;
 			var curCdSel = $('#sCurrencySel').val();       
 			

// 			var order = $('#tapList').DataTable().order();
//
// 	        var orderSequel = generateColumnsOrderSequel(order);
            
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="invocId" value="' + invocId + '" />')
            .append('<input type="hidden" name="invocDirectCd" value="' + invocDirectCd + '" />')
            .append('<input type="hidden" name="curCdSel" value="' + curCdSel + '" />')
//            .append('<input type="hidden" name="orderSequel" value="' + orderSequel + '" />')
            .appendTo('body')
            .submit()
            .remove();
        });
	}; // end of event handlers

	var thisModuleInitializr = function() {
        alertReturnMessage();
        
		invoiceInit();
	};

	$(function() {
		thisModuleInitializr();
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
