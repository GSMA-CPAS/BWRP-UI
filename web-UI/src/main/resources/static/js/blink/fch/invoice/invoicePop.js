(function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];

	var _invocPopId = thisPage['invocId'];
	

	/**
	 * pdf make
	 */
	var createInvoicePdf = function(result) {
		
		var invoc = result.invoc;
		var amtList = result.amtList;
		var erateList = result.erateList;
		var tapList = result.tapList;
		var tapSum = result.tapSum;
		
		var _precision = 4;
		if(invoc.decPoint) {
			_precision = invoc.decPoint;
		}
		
		//Invoiced Amount
		var curList = [];
		var curWidths = []; //Amount width [100,'*','*','*'] 
		
		var curTitleRow = [];
		curTitleRow.push({text : 'Invoied Amount', bold : true, alignment : 'center', fillColor : '#cccccc'});
		curWidths.push(100);
		for(let i in amtList) {
			curTitleRow.push({text : 'Value in ' + amtList[i].invocCur, bold : true, alignment : 'center'});
			curWidths.push('*');
		}		
		curList.push (curTitleRow);
		
		var curPreRow = [];
		curPreRow.push({text : 'Pre-Tax Amount', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curPreRow.push({text : amtList[i].invocAmt, alignment : 'right'});
		}
		curList.push (curPreRow);
		
		//send or pay
		curPreRow = [];
		for(let i in amtList) {
			if(i == 0 && amtList[i].sendOrPay > 0) {
				curPreRow.push({text : 'Send or Pay', bold : true, alignment : 'center', fillColor : '#cccccc'});
				curPreRow.push({text : currency(amtList[i].sendOrPay, {separator:'', precision : _precision}).format(), alignment : 'right'});
			}else if(amtList[i].sendOrPay > 0) {
				curPreRow.push({text : currency(amtList[i].sendOrPay, {separator:'', precision : _precision}).format(), alignment : 'right'});
			}
		}
		if(!_.isEmpty(curPreRow)) {
			curList.push (curPreRow);
		}
		
		curPreRow = [];
		curPreRow.push({text : 'Tax', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curPreRow.push({text : amtList[i].taxAmt, alignment : 'right'});
		}
		curList.push (curPreRow);
		
		curPreRow = [];
		curPreRow.push({text : 'Post-Tax Amount', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curPreRow.push({text : amtList[i].postInvocAmt, alignment : 'right'});
		}
		curList.push (curPreRow);
		
		curPreRow = [];
		curPreRow.push({text : 'Discount', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curPreRow.push({text : amtList[i].dcAmt, alignment : 'right'});
		}
		curList.push (curPreRow);
		
		curPreRow = [];
		curPreRow.push({text : 'Invoice Total', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curPreRow.push({text : amtList[i].totAmt, alignment : 'right'});
		}
		curList.push (curPreRow);
		

		//erateList
		var invCur =[];
		var invBaseDay =[];
		var invErate =[];
		for(let i in erateList) {
			invCur.push({text : erateList[i].invocBasCur + '-' + erateList[i].invocChangeCur + '\n'});
			invBaseDay.push({text : erateList[i].erateBaseDay + '\n'});
			invErate.push({text : erateList[i].erateVal + '\n'});
		}
		
		//month tap list
		var monthsList = [];
		
		for(let i=0;i < tapList.length;i++) {				
			
			var row = new Array();
			//first
			if(i==0) {
				var trow = [
					{text : '\nDate', bold : true, alignment : 'center', fillColor : '#cccccc'}
					,{text : 'Sequence\nNumber', bold : true, alignment : 'center', fillColor : '#cccccc'}
					,{text : 'Pre-Tax Value in\nSDR', bold : true, alignment : 'center', fillColor : '#cccccc'}
					,{text : 'Tax Value in\nSDR', bold : true, alignment : 'center', fillColor : '#cccccc'}
					,{text : 'Post-Tax Value in\nSDR', bold : true, alignment : 'center', fillColor : '#cccccc'}
				];
				
				monthsList.push (trow);
			}
			
			var cell1 = {text : tapList[i].fileCretDateVal, alignment : 'center'};
			row.push(cell1);
			var cell2 = {text : tapList[i].stTapSeq + '~' + tapList[i].endTapSeq, alignment : 'center'};
			row.push(cell2);
			var cell3 = {text : tapList[i].sdrSumAmt, alignment : 'right'};
			row.push(cell3);
			var cell4 = {text : tapList[i].sdrTaxAmt, alignment : 'right'};
			row.push(cell4);
			var cell5 = {text : tapList[i].sdrResltAmt, alignment : 'right'};
			row.push(cell5);			
			monthsList.push (row);
			
			//last
			if(tapList.length == (i+1)) {
				var srow = [
					{text : ''}
					,{text : 'Total', bold : true, alignment : 'center', fillColor : '#cccccc'}
					,{text : tapSum.sdrTotSumAmt, bold : true, alignment : 'right'}
					,{text : tapSum.sdrTotTaxAmt, bold : true, alignment : 'right'}
					,{text : tapSum.sdrTotResltAmt, bold : true, alignment : 'right'}
					];
				monthsList.push (srow);
			}
		}
				
		var tapDetail = {
				text : '* Details', bold : true, fontSize : 10
				,pageBreak : 'before'
			};
		
		var tapInfo = {
				table : {
					widths : [100, 150, 100, '*']
					,body : [
						[
							{text : 'Invoice From', bold : true, alignment : 'center', fillColor : '#cccccc'}
							,{text : invoc.trmPlmnId, alignment : 'left'}
							,{text : 'Invoice To', bold : true, alignment : 'center', fillColor : '#cccccc'}
							,{text : invoc.rcvPlmnId, alignment : 'left'}
						]
						,[
							{text : 'Invoice Number', bold : true, alignment : 'center', fillColor : '#cccccc'}
							,{text : invoc.invocNm, alignment : 'left'}
							,{text : 'Invoice Date', bold : true, alignment : 'center', fillColor : '#cccccc'}
							,{text : invoc.invocPblsDt, alignment : 'left'}
						]
						,[
							{text : 'Sequence Number', bold : true, alignment : 'center', fillColor : '#cccccc'}
							,{text : invoc.minTapSeq + ' ~ ' + invoc.maxTapSeq, alignment : 'left'}
							,{text : 'Traffic Period', bold : true, alignment : 'center', fillColor : '#cccccc'}
							,{text : invoc.trafcStDay + ' ~ ' + invoc.trafcEndDay, alignment : 'left'}
						]
					]
				}
			};
		
		var tapsList = {
				table : {
					widths : ['*', 90, 90, 90, 90]
					,body : monthsList
				}
			};
		
		if(_.isEmpty(monthsList)) {
			tapDetail = '';
			tapInfo = '';
			tapsList = '';
		}
		
		var taxNo = '';
		if(invoc.taxNo) {
			taxNo = 'Tax Registration Number : ' + invoc.taxNo
		}
		
//		
		var docDefinition = {
				pageSize: 'A4',
				pageOrientation: 'portrait',  //portrait  landscape
				content : [
					{
						table : {
							widths : ['*'],
							body : [
								[
									{text : 'GSM INVOICE FOR ROAMING TRAFFIC FROM \n' + invoc.trmCmpnNm, bold : true, 
										alignment : 'center', border:[false, false, false, true]}
								]
							]
						},
						style : "header"
					}
					,'\n'					
					,{
						text : '* Address', bold : true, fontSize : 10
					}
					,{
						table : {
							widths : [100, '*']
							,body : [
								[
									{text : '\nTo. ' + invoc.rcvPlmnId +'\n', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : invoc.rcvCmpnNm +'\n' + invoc.rcvCmpnAdr , alignment : 'left'}
								],
								[
									{text : '\nFrom. ' + invoc.trmPlmnId +'\n', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : invoc.trmCmpnNm +'\n' + invoc.trmCmpnAdr , alignment : 'left'}
								]
							]
						}
					}
					,'\n'
					,{
						columns : [
							{
								width : 80,
								text : '* Contents', bold : true, fontSize : 10
							},
							{
								width : '*',
								text : taxNo, color : 'red'
							}
						]
					}
					,{
						table : {
							widths : [100, '*']
							,body : [
								[
									{text : 'Invoice Number', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : invoc.invocNm , alignment : 'left'}
								],
								[
									{text : 'Invoice Date', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : invoc.invocPblsDt , alignment : 'left'}
								],
								[
									{text : 'Sequence Number', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : invoc.minTapSeq + ' ~ ' + invoc.maxTapSeq , alignment : 'left'}
								],
								[
									{text : 'Traffic Period', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : invoc.trafcStDay + ' ~ ' + invoc.trafcEndDay , alignment : 'left'}
								]
							]
						}
					}
					,'\n'
					,{
						table : {
							widths : curWidths //[100, '*', '*', '*']
							,body : curList
						}
					}
					,'\n'
					,{
						table : {
							widths : [250, '*']
							,body : [
								[
									{text : 'Exchange Rate Infomation', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : 'Settlement Infomation', bold : true, alignment : 'center', fillColor : '#cccccc'}
								],
								[
									{
										columns : [
											{
												width : 60,
												text : invCur
											},
											{
												width : 60,
												text : invBaseDay
											},
											{
												width : '*',
												text : invErate
											}
										]
									},

									{
										columns : [
											{
												width : 120,
												text : [
													'Type of Settlement : ',
													'\nPayment Currency : ',
													'\nPayment Due In Days : ',
													'\nPayment Due Date : '
												]
											},
											{
												width : '*',
												text : [
													invoc.setlDrectCdNm,
													'\n' + invoc.payotCurCd,
													'\n' + invoc.payotDueDay,
													'\n' + invoc.payotDueDate
												]
											}
										]
									}
								]
							]
						}
					}
					,'\n'
					,{
						text : 'Payment Infomation', bold : true, fontSize : 10
					}
					,{
						columns : [
							{
								width : 120,
								text : [
									'Bank Name : \n'
									, 'SWIFT Code : \n'
									, 'Account Name : \n'
									, 'Account No : \n'
									,'IBAN No: \n'
									, 'Correspondent Bank : \n'
									, 'SWIFT Code :'
								]
							},
							{
								width : '*',
								text : [
									invoc.bankNm + '\n'
									, invoc.swiftCd + '\n'
									, invoc.accNm + '\n'
									, invoc.accNo + '\n'
									, invoc.ibanNo + '\n'
									, invoc.correspBankNm + '\n'
									, invoc.correspSwiftCd
								]
							}
						]
					}
					,'\n'
					,{
						text : 'Primary Contact for Enquiries', bold : true, fontSize : 10
					}
					,{
						columns : [
							{
								width : 120,
								text : [
									'Contact US : ',
									'\nE-mail :',
									'\nTel Number : ',
									'\nFax Number : '
								]
							},
							{
								width : '*',
								text : [
									invoc.contNm,
									'\n' + invoc.contEmail,
									'\n' + invoc.contTelNo,
									'\n' + invoc.contFaxNo
								]
							}
						]
					}
					,tapDetail
					,tapInfo
					,'\n'
					,tapsList
				]
			, styles : {
				header : {
					fontSize : 15
					,bold : true
					,margin :[0,0,0,10]
				}
			}
			,defaultStyle : {
				columGap : 20
				,fontSize : 10
			}
		};

		var pdf = window.pdfMake.createPdf( docDefinition );
//		pdf.open();

		pdf.download( invoc.invocNm +'.pdf' );
		
	}
	/**
	 * invoice pop open
	 */
	var openInvoicePop = function(invocId) {
		var modalUrl = _CTX + "fch/invoice/invoicePop/"+invocId+" #invoicePop";
        $('#invoicePopDiv').load(modalUrl, function() {
            
            $('#invoicePop', $(this)).modal({backdrop: 'static', keyboard: false});
        });
	}
	/**
	 * pdf info call
	 */
	var callInvPdfInfo = function(inv) {
		var params = {};
		params.invocId = inv;		
		
		var url = _CTX + "fch/invoice/downPdfInvocInfo";
		$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
			var result = response;
			
			createInvoicePdf(result);
			
		});
	}
		
	var thisModuleEventHandlers = function() {
		
		/**
		 * invoice detail => preview button event
		 */
		$(document).on('click', '.invocPopCla', function() {
			openInvoicePop(_invocPopId);
		});
		/**
		 * invoice list => invoice pdf down event
		 */
		$(document).on('click', '.pdfInvoListCla', function() {
			var $tr = $(this).closest('tr');
			var data = $('#invoiceList').DataTable().row($tr).data();
						
			var invocId = data.invocId;
			var kindCd = data.kindCd;
			if(data && data.invocId) {
				
				
				var params = {};
				params.invocId = invocId;		
				
				if(kindCd === 'INV') {
					
					callInvPdfInfo(invocId);
					
				}
			}
		});
		/**
		 * invoice pop pdf download click 
		 */
		$(document).on('click', '#invPdfDownId', function(e) {
			
			callInvPdfInfo(_invocPopId);

		});
		

		/**
		 * invoice list =>  document invoice cell event
		 */
		$(document).on('click', '.invListDocuCla', function(i) {
			
			var $tr = $(this).closest('tr');
			var data = $('#invoiceList').DataTable().row($tr).data();
						
			if(data && data.invocId) {
				
				var invocId = data.invocId;
				var kindCd = data.kindCd;
								
				if(kindCd === 'INV') {
					_invocPopId = invocId;
					
					openInvoicePop(invocId);
				}				
			}
		});
				
	}; // end of event handlers

	$(function() {
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
