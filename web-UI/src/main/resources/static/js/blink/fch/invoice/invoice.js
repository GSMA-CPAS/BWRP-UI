var module = (function(global, $, _, _m, thisPage) {
	var _CTX = thisPage['ctx'];
    var _RtnMsg = thisPage.rtnMsg;
    var _btnRole = thisPage.btnRole;
    
	var _invMsg001 = thisPage['inv.msg.001'];	
	var _invMsg002 = thisPage['inv.msg.002'];	
	var _invMsg003 = thisPage['inv.msg.003'];	
	var _invMsg004 = thisPage['inv.msg.004'];  
	var _invMsg005 = thisPage['inv.msg.005'];	
	var _comTblSearch = thisPage['com.tbl.search'];	
	var _btnIssue = thisPage['inv.btn.issue']; 
	
	var _msgEndmoncal = thisPage['com.msg.endmoncal'];    
	var _msgStmoncal = thisPage['com.msg.stmoncal'];    
	var _msgMoncal = thisPage['com.msg.moncal'];
	
	var _paramInv = thisPage['paramInv'];
	
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
	var invoiceInit = function() {
		
		var url = _CTX + "fch/invoice/getInitInvoice";
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
			var invoiceStats = res.invoiceStats;
			var invoiceKinds = res.invKinds;
			var invoiceDirects = res.invDirects;
						
			var partnersOps = [];
			var myNetworksOps = [];
			var curcyOps = [];
			var defCur = 'SDR';
			var invStatOps = '';
			var invKindOps = '';
			var invDirects = '';
			
			var myNetVal = [];
			var partNetVal = [];
											
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
				op.label = v['cdVal1']; // + '(' + v['cdDesc'] + ')';
				op.value = v['cdId'];
				
				myNetworksOps.push(op);

				myNetVal.push(v['cdId']);
			});
			
			//currency list
			_.each(currencys, function(v, k) { 
				var op = {label:'', value:''};
				op.label = v['cdVal1']; // + '(' + v['cdDesc'] + ')';
				op.value = v['cdId'];
				
				curcyOps.push(op);
			});
			// invoice status
			invStatOps = '<option value=""></option>';
			_.each(invoiceStats, function(v, k) {			
				invStatOps += '<option value="'+v['cdId']+'">'+v['cdVal1'] +'(' + v['cdVal2']+')</option>';
			});
			// invoice kind
			invKindOps = '<option value=""></option>';
			_.each(invoiceKinds, function(v, k) {			
				invKindOps += '<option value="'+v['cdId']+'">'+v['cdVal1']+'</option>';
			});
			// invoice direction
			invDirects = '<option value=""></option>';
			_.each(invoiceDirects, function(v, k) {			
				invDirects += '<option value="'+v['cdId']+'">'+v['cdVal1']+'</option>';
			});
			
			if(_paramInv) {
				myNetVal = [];
				myNetVal.push(_paramInv.trmPlmnId);
				partNetVal.push(_paramInv.rcvPlmnId);
				
				// start date : minus 5 days from now stPeriodMon
		        $('#stPeriodMon').data('datepicker').selectDate(new Date(_m(_paramInv.stPeriodMon, ["YYYYMM"]).toDate()));
		        
		        // end date : now endPeriodMon
		        $('#endPeriodMon').data('datepicker').selectDate(new Date(_m(_paramInv.endPeriodMon, ["YYYYMM"]).toDate()));
			}
			
			
			seletMultiPure('sMyNetworkMulti', myNetworksOps, myNetVal, true, 'sMyNetworkSel');

			seletMultiPure('sPartnersMulti', partnersOps, partNetVal, true, 'sPartnersSel');

			seletMultiPure('sCurrencyMulti', curcyOps, defCur, false, 'sCurrencySel');
			
			$('#sCurrencySel').val(defCur);
			
			$('#sInvStat').html(invStatOps);
			
			$('#sInvDirect').html(invDirects);
			
			$('#sInvKind').html(invKindOps);
			
			$('#sMyNetworkSel').val(myNetVal.join(","));
			
			$('#sPartnersSel').val(partNetVal.join(","));
						
			if(_paramInv) {
				$('#invoiceList').DataTable().draw();
			}			

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
	 * invoice grid
	 */
	_TABLE = $('#invoiceList').DataTable( {
		orderCellsTop : true,
        orderMulti: false,
		fixedHeader : true,		
       	serverSide : true,
       	deferRender : true,
        info: false,
        deferLoading : 0,
 	    scrollY : '50vh',
        scrollX: true,
 	    scrollCollapse : true,
 	    scroller: {
 	    	displayBuffer: 20
 	    }, 
 	    dom: 'ts',
 	    order : [[2, 'desc'],[1, 'desc']],
 	    ajax : {
 	    	url : _CTX + "fch/invoice/retrieveInvoiceList",
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
 	    			
 	    			if(column.data === 'invocDirectCd' && $('#sInvDirect').val()) {
 	    				column.search.value = $('#sInvDirect').val();
 	    			}
 	    			
 	    			if(column.data === 'kindCd' && $('#sInvKind').val()) {
 	    				column.search.value = $('#sInvKind').val();
 	    			}
 	    			
 	    			if(column.data === 'statusCd' && $('#sInvStat').val()) {
 	    				column.search.value = $('#sInvStat').val();
 	    			}
 	    		    			
 	    			if(column.data === 'curCdSel' && $('#sCurrencySel').val()) {
 	    				column.search.value = $('#sCurrencySel').val();
 	    			}
 	    			
 	    			if(column.data === 'dateGbn' && $('#sDateGbn').val()) {
 	    				column.search.value = $('#sDateGbn').val();
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
        	{ data: "ckbox", sortable: false
        		,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				var html = '<input type="checkbox" id="ckbox' + meta.row +'" class="hide">';
        					html += '<label for="ckbox' + meta.row +'"><i class="ico checkbox"><em>선택</em></i></label>';
        				return html;
        			}
        			return data;
        		}
        	},
            { data: "setlMonthView"
        		,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				
        				var html = '<a href="#" class="firstCellCla">' + row.setlMonthView +'</a>';
        				if(row.kindCd !== 'INV') {
        					html = row.setlMonthView;
        				}
        				return html;
        			}
        			return data;
        		}
            },
        	{ data: "issueMonth" },
        	{ data: "trmPlmnId" },
        	{ data: "rcvPlmnId"},
            { data: "kindCdNm", sortable: false 
        		,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				var html = '<div class="ellipsis" title="'+row.kindCdNm+'">' + row.kindCdNm + '</div>';
        				return html;
        			}
        			return data;
        		}
            },
            { data: "invocDirectCdNm", sortable: false },
            { data: "docuNm", sortable: false 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				if(row.docuNm) {     					
        					
        					var docuCla = 'invListDocuCla';
        					var cla = 'pdfInvoListCla';
        					if(row.kindCd !== 'INV') {
        						docuCla = 'noteListDocuCla';
        						cla = 'pdfNoteListCla';
        					}
        					
	        				var html = '<div class="pdf-group"><span class="'+docuCla+'" title="'+row.docuNm+'" style="cursor:pointer;">' + row.docuNm + '</span>';
	        				
	        				
	        				html += '<span><button type="button" class="btn pdf '+ cla +'">pdf</button></span></div>';
	        				
	        				return html;
        				}else {
        					return '';
        				}
        			}
        			return data;
        		}
            },
            { data: "statusCdNm", sortable: false 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				if(row.statusCd === '20') {
	        				var html = '<div class="color-red ellipsis" title="'+row.statusCdNm+'">' + row.statusCdNm +'</div>';
	        				return html;
        				}else {
        					return '<div class="ellipsis" title="'+row.statusCdNm+'">' + row.statusCdNm +'</div>';
        				}
        			}
        			return data;
        		}
            },
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
            { data: "noteYn", sortable: false 
            	,render : function(data, type, row, meta ) {
        			if(type === 'display') {
        				if( (row.kindCd === 'INV' && row.statusCd !== '00' && row.invocDirectCd === 'OUT') || 
        					(row.kindCd === 'INV' && (row.statusCd === '10' || row.statusCd === '20') && row.invocDirectCd === 'IN') || 	
        					(row.kindCd === 'CNA' && row.invocDirectCd === 'IN' && row.statusCd != '50') ) {
        					var html = '';
        					if(_btnRole == 1 || _btnRole == 3 || _btnRole == 4) { 
        						html = '<button type="button" class="btn pdf noteCla">' + _btnIssue +'</button>';
        					}
	        				return html;
        				}else {
        					return '';
        				}
        			}
        			return data;
        		}
            },
            { data: "kindCd", visible: false },
            { data: "invocDirectCd", visible: false },
            { data: "statusCd", visible: false },
            { data: "stPeriodMon", visible: false },
            { data: "endPeriodMon", visible: false },
            { data: "setlMonth", visible: false },
            { data: "curCdSel", visible: false },
            { data: "invocId", visible: false },
            { data: "noteRefNum", visible: false },
            { data: "dateGbn", visible: false }
        ]
       ,drawCallback : function(settings) {
    	       	   
    	   $('.dataTable.no-footer thead th:eq(0)').removeClass('sorting_desc');
    	   
    	   var trLen = $(document).find('#invoiceList tbody tr').length;
    	   
    	   if(trLen>0 && trLen<10) {
    		   var px = $('#invoiceList')[0].clientHeight;
    		   
			   var height = px + 2;
			   $(".dataTables_scrollBody").css('min-height',height +'px');
			   $('.dataTables_scrollHeadInner').css({'width':'100%', 'padding-right':'1px'});
			   $('.dataTable.no-footer').css({'width':'100%'});
    	   }
    	   
    	   var clss = 'classify';
    	   var preM = '';
    	   var nextM = '';
    	   var setClssYn = 'N';
    	   	$(document).find('#invoiceList tbody tr').each(function(i){
    	   		var data = $('#invoiceList').DataTable().row($(this)).data();
    	   		if(data) {    
    	   			
    	   			if(i==0) {
    	   				$('#revenueSum').text(curFmt(data.revenueSum||0, data.decPoint));
    	   				$('#expenseSum').text(curFmt(data.expenseSum||0, data.decPoint));
    	   				$('#profitSum').text(curFmt(data.profitSum||0, data.decPoint));
    	   				
    	   				preM = data.setlMonthView;
    	   				nextM = data.setlMonthView;
    	   			}else {
    	   			
    	   					nextM = data.setlMonthView;
    	   					
    	   					if(preM != nextM) {
    	   						preM = nextM;
    	   						
    	   						if(setClssYn == 'N') {
    	   							setClssYn = 'Y';
    	   						}else {
    	   							setClssYn = 'N';
    	   						}
    	   					}
    	   					
    	   					if(setClssYn == 'Y'){
    	   						$(this).addClass(clss);
    	   					}
    	   			}
    	   		}else {
    	   			if(i==0) {
    	   				$('#revenueSum').text('0');
    	   				$('#expenseSum').text('0');
    	   				$('#profitSum').text('0');
    	   			}
    	   		}
    	   	});
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
	 * payment status setting
	 */
	var callPayment = function(invocIds, statusCd) {
		
		if(!invocIds) {
			return;
		}
		
		var url = _CTX + "fch/invoice/updateInvoiceStat";
		
		var params = {};
		params.invocIds = invocIds;
		params.statusCd = statusCd;
		params.sysSvcId = url;
		
		var msg = _invMsg004;
		if('50' === statusCd) {
			msg = _invMsg005;
		}
		
		if(!global.confirm(msg)) {
			return;
		}
		
		$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
			$('#invoiceList').DataTable().draw();
		});
	}
	/**
	 * validation payment / confirmation of payment
	 */
	var invocPayConfValid = function(direct) {
		var eLen = 0;
		$('#invoiceList tbody input[type="checkbox"]:checked').each(function(i) {
			var $tr = $(this).closest('tr');
			var data = _TABLE.row($tr).data();
			
			if(!validtRowData(data, direct)) {
				eLen++;
				return false;
			}
			
		});
		
		if(eLen>0) {
			if(direct === 'IN') {
				global.alert(_invMsg001); 
			}else {
				global.alert(_invMsg002); 
			}		
			
			return false;
		}
		return true;
	}
	/**
	 * valid row data
	 */
	var validtRowData = function(data, direct) {
		if(data) {

			var sCd = data.statusCd;
			var sKind = data.kindCd;
			var inDirec = data.invocDirectCd;
			
			if(sKind !== 'INV') {
				return false;
			}
			
			if(direct === 'IN') {
				if(inDirec !== 'IN') {
					return false;
				}
				
				if(sCd === '10' || sCd === '20') {
					return true;
				}
				return false;
			}else if(direct === 'OUT'){
				if(inDirec !== 'OUT') {
					return false;
				}
				
				if(sCd === '40') {
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}
	
    
    /**
     * orderSequel
     */
//    function generateColumnsOrderSequel(orders) {
//        let orderSequel = '';
//        orders.forEach((o, i, arr) => {
//            if (i === arr.length - 1) {
//                orderSequel += (o[0]+1) + ' '  + o[1];
//            } else {
//                orderSequel += (o[0]+1) + ' '  + o[1] + ', ';
//            }
//        });
//        return orderSequel.toString();
//        
//    }
		
	var thisModuleEventHandlers = function() {
		
		
		
		
		
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
                    picker.clear();
                }
            }
        
        });
        
        
        // start date : minus 5 days from now
        $('#stPeriodMon').data('datepicker').selectDate(new Date());
        
        // end date : now
        $('#endPeriodMon').data('datepicker').selectDate(new Date());
        
        /**
		 * datepicker call
		 */
		$(document).on('click', '.calBtnCla', function() {
			$(this).next('input').focus();
			
		});
		
		
//		$(window).resize(function() {
//			$('#invoiceList').DataTable().draw();
//		});

		/**
		 * Grid row select
		 */
		$(document).on('click', '#invoiceList tbody tr', function() {

			if ($(this).hasClass('selected')) {
		        $(this).removeClass('selected');
		        
		        if($(this).hasClass('classifySel')) {
		        	$(this).addClass('classify');
		        	$(this).removeClass('classifySel');
		        }
		    } else {
		        _TABLE.$('tr.selected').removeClass('selected');
		        
		        _TABLE.$('tr.classifySel').addClass('classify');
		        _TABLE.$('tr.classifySel').removeClass('classifySel');
		        
		        $(this).addClass('selected');
		        if($(this).hasClass('classify')) {
		        	$(this).addClass('classifySel');
		        	$(this).removeClass('classify');
		        }
		    }
		});

		/**
		 * grid all checkbox
		 */
		$(document).on('click', '#chkAll', function(e) {
			if($(this).is(':checked')) {
				$('#invoiceList tbody input[type="checkbox"]').prop('checked', true);
			}else {
				$('#invoiceList tbody input[type="checkbox"]').prop('checked', false);
			}			
		});
		/**
		 * grid checkbox
		 */
		$(document).on('click', '#invoiceList tbody input[type="checkbox"]', function(e) {
			
			var chkedkLen = $('#invoiceList tbody input[type="checkbox"]:checked').length;
			var chkLen = $('#invoiceList tbody input[type="checkbox"]').length;
			
			if($(this).is(':checked')) {
				if(chkedkLen === chkLen) {
					$('#chkAll').prop('checked', true);
				}
			}else {
				$('#chkAll').prop('checked', false);
			}			
		});
		
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
			
			$('#chkAll').prop('checked', false);
			
			var dateGbn = $('#sDateGbn').val();
			
			if(dateGbn == 'sett') {
				$('#invoiceList').DataTable().order([[1, 'desc'],[2, 'desc']]).draw();
			}else {
				$('#invoiceList').DataTable().order([[2, 'desc'],[1, 'desc']]).draw();
			}
		});
		
		/**
		 * filter keyup
		 */
		$(document).on('keyup', '#filterMyNet, #filterParterNet', function() {
			$('#invoiceList').DataTable().draw();
		});
		/**
		 * filter change
		 */
		$(document).on('change', '#filterInvKind', function() {
			$('#invoiceList').DataTable().draw();
		});
		
	
		$('#payouId').on('click', function (e) {
			e.preventDefault();

			var len = $('#invoiceList tbody input[type="checkbox"]').length;
			if(len == 0) {
				global.alert(_comTblSearch); 
				return;
			}
			
			var chkedLen = $('#invoiceList tbody input[type="checkbox"]:checked').length;

			var invocIds = [];
			if(chkedLen>0) {
				
				if(!invocPayConfValid('IN')) {
					return;
				}
				$('#invoiceList tbody input[type="checkbox"]:checked').each(function(i) {
					var $tr = $(this).closest('tr');
					var data = _TABLE.row($tr).data();
					
					invocIds.push(data.invocId);
				});
				callPayment(invocIds, '30');
				
			}else {
				var row = _TABLE.row('.selected');

				var data = row.data();
				
				if (!data) {
					global.alert(_invMsg003); //"Select a table row for updating please.");
					return;
				}
				
				if(!validtRowData(data, 'IN')) {
					global.alert(_invMsg001); 
					return;
				}
				
				invocIds.push(data.invocId);
				callPayment(invocIds, '30');
			}			
		});
		
		/**
		 * confirm payment
		 */
		$('#confId').on('click', function (e) {
			e.preventDefault();

			var len = $('#invoiceList tbody input[type="checkbox"]').length;
			if(len == 0) {
				global.alert(_comTblSearch); 
				return;
			}
			
			var chkedkLen = $('#invoiceList tbody input[type="checkbox"]:checked').length;
			
			var invocIds = [];
			if(chkedkLen>0) {
				if(!invocPayConfValid('OUT')) {
					return;
				}
				$('#invoiceList tbody input[type="checkbox"]:checked').each(function(i) {
					var $tr = $(this).closest('tr');
					var data = _TABLE.row($tr).data();
					
					invocIds.push(data.invocId);
				});

				callPayment(invocIds, '50');
			}else {
				var row = _TABLE.row('.selected');

				var data = row.data();
				
				if (!data) {
					global.alert(_invMsg003); //"Select a table row for updating please.");
					return;
				}
				
				if(!validtRowData(data, 'OUT')) {
					global.alert(_invMsg002); 
					return;
				}
				
				invocIds.push(data.invocId);
				callPayment(invocIds, '50');
			}
						
		});
	
		
		/**
		 * first cell click event => invoice detail move
		 */
		$(document).on('click', '.firstCellCla', function(i) {
			
			var $tr = $(this).closest('tr');
			var data = _TABLE.row($tr).data();

			if(data) {
				
				var invocId = data.invocId;
				var kindCd = data.kindCd;
				var trmPlmnId = data.trmPlmnId;
				var rcvPlmnId = data.rcvPlmnId;
				var statusCd = data.statusCd;
				var invocDirectCd = data.invocDirectCd;
//				var invocDirectCdNm = data.invocDirectCdNm;
				var setlMonthView = data.setlMonthView;
								
				if(kindCd == 'INV') {
					if(statusCd != '00' && data.invocId) {
						var url = _CTX + "fch/invoice/invoiceDetail/"+ invocId+"/"+invocDirectCd;
						
						document.location.href = url;
					}else {
						var startDate = moment(setlMonthView).format('YYYY-MM-DD HH:mm:ss');
						var endDate = moment(setlMonthView).endOf('month').format('YYYY-MM-DD HH:mm:ss');
												
						var tapDirection = 'TAP-In';
						if(invocDirectCd === 'OUT') {
							tapDirection = 'TAP-Out';
						}

						let url909 = _CTX + "fch/invoice/noteTapList";
						
						$('<form action="' + url909 + '" method="GET"></form>')
						.append('<input type="hidden" name="trmPlmnId" value="' + trmPlmnId + '" />')
						.append('<input type="hidden" name="rcvPlmnId" value="' + rcvPlmnId + '" />')
						.append('<input type="hidden" name="startDate" value="' + startDate + '" />')
						.append('<input type="hidden" name="endDate" value="' + endDate + '" />')
						.append('<input type="hidden" name="tapDirection" value="' + tapDirection + '" />')
						.appendTo('body')
						.submit()
						.remove();
					}
				}
			}
		});
		        
        /**
         * Invoice List Excel Down
         */
        $('#excelDown').on('click', function(e) {
            e.preventDefault();
                        
            var url = _CTX + "fch/invoice/downInvListExcel";
            
            var regexp = /[^0-9]/g;
            
            var stPeriodMon = $('#stPeriodMon').val().replace(regexp, '');
 			var endPeriodMon = $('#endPeriodMon').val().replace(regexp, '');
 			var trmPlmnId = $('#sMyNetworkSel').val();
 			var rcvPlmnId = $('#sPartnersSel').val();
 			var invocDirectCd = $('#sInvDirect').val();
 			var kindCd = $('#sInvKind').val();
 			var statusCd = $('#sInvStat').val();
 			var curCdSel = $('#sCurrencySel').val();    
 			var dateGbn = $('#sDateGbn').val();
 			
// 			var order = _TABLE.order();

// 	        var orderSequel = generateColumnsOrderSequel(order);
            
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="stPeriodMon" value="' + stPeriodMon + '" />')
            .append('<input type="hidden" name="endPeriodMon" value="' + endPeriodMon + '" />')
            .append('<input type="hidden" name="trmPlmnId" value="' + trmPlmnId + '" />')
            .append('<input type="hidden" name="rcvPlmnId" value="' + rcvPlmnId + '" />')
            .append('<input type="hidden" name="invocDirectCd" value="' + invocDirectCd + '" />')
            .append('<input type="hidden" name="kindCd" value="' + kindCd + '" />')
            .append('<input type="hidden" name="statusCd" value="' + statusCd + '" />')
            .append('<input type="hidden" name="curCdSel" value="' + curCdSel + '" />')
            .append('<input type="hidden" name="dateGbn" value="' + dateGbn + '" />')
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
		invoiceInit();
	};

	$(function() {
		thisModuleInitializr();
		thisModuleEventHandlers();
	});
	
})(window, jQuery, _, moment, thisPage);
