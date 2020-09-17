(function(global, $, thisPage) {
	var _CTX = thisPage['ctx'];

	var _invocId = thisPage['invocId'];		//invoice detail
    var _invocDirectCd  = thisPage['invocDirectCd']; //invoice detail
    var _invMsg009  = thisPage['inv.msg.009']; 
    var _invMsg010  = thisPage['inv.msg.010']; 
    var _invMsg011  = thisPage['inv.msg.011']; 
    var _invMsg012  = thisPage['inv.msg.012']; 
	var _btnIssue = thisPage['inv.btn.issue']; 
	
	var _msgEngnumspec = thisPage['com.msg.engnumspec'];    
	var _msgDecimal = thisPage['com.msg.decimal'];   
	var _msgNum1100 = thisPage['com.msg.num1100'];    
//	var _msgNum = thisPage['com.msg.num'];    
    var _noteGbn = '';

    var _maxTextLen = 1000;
	/**
	 * note reg pop open
	 */
	var openInvCnaPop = function(invocId, invocDirectCd, noteRefNum, gbn) {
				
		if(!noteRefNum) {
			noteRefNum = '';
		}
		
		_noteGbn = gbn;
				
		var modalUrl = _CTX + "fch/invoice/invNoteRegPop/"+invocId+"/"+invocDirectCd+"?noteRefNum="+noteRefNum+" #invNoteRegPop";
        $('#invNoteRegPopDiv').load(modalUrl, function() {
            
            $('#invNoteRegPop', $(this)).modal({backdrop: 'static', keyboard: false});
        });
	}
	
	
	/**
	 * note pop open
	 */
	var openNotePop = function(noteRefNum) {
		var modalUrl = _CTX + "fch/invoice/getNoteInfo/"+noteRefNum+" #notePop";
        $('#notePopDiv').load(modalUrl, function() {
            
            $('#notePop', $(this)).modal({backdrop: 'static', keyboard: false});
        });
	};
	
	
	/**
	 * form validation
	 */
	var validNote = function() {
		
		var noteAmt = $('#noteAmt').val().trim();
		
		if(!noteAmt) {
			global.alert('Amount is Required.');
			$('#noteAmt').focus();
			return false;
		}
		
		var taxInclYn = $('#taxInclYn').val();
		var taxAplyPecnt = $('#taxAplyPecnt').val();
		if(taxInclYn == 'Y') {
			if(!taxAplyPecnt) {
				global.alert('Tax Amount is Required.');
				$('#taxAplyPecnt').focus();
				return false;
				
			}
		}
		
		var reqReason = $('#reqReason').val();
		
		if(!reqReason) {
			global.alert('Reason for Request is Required.');
			$('#reqReason').focus();
			return false;
		}
		
		if(reqReason.length > _maxTextLen) {
			global.alert(_invMsg012); 
			$('#reqReason').focus();
			return false;			
		}
		
		var contNm = $('#contNm').val().trim();
		if(!contNm) {
			global.alert('Contact US is Required. ');
			$('#contNm').focus();
			return false;
		}

		var contTelNo = $('#contTelNo').val().trim();
		if(!contTelNo) {
			global.alert('Tel Number is Required.');
			$('#contTelNo').focus();
			return false;
		}

		var contEmail = $('#contEmail').val().trim();
		if(!contEmail) {
			global.alert('contEmail is Required.');
			$('#contEmail').focus();
			return false;
		}


		var contFaxNo = $('#contFaxNo').val().trim();
		if(!contFaxNo) {
			global.alert('Fax is Required.');
			$('#contFaxNo').focus();
			return false;
		}
		
		return true;
	}
	
	/**
	 * note pdf download
	 */
	var createNotePdf = function(result) {
		
		var note = result.note;
		var erateList = result.erateList;
		var amtList = result.amtList;
		
		var curList = [];
		var curWidths = []; //Amount width [100,'*','*','*'] 
		
		var curTitleRow = [];
		curTitleRow.push({text : 'Amount', bold : true, alignment : 'center', fillColor : '#cccccc'});
		curWidths.push(100);
		for(let i in amtList) {
			curTitleRow.push({text : 'Value in ' + amtList[i].noteCur, bold : true, alignment : 'center', fillColor : '#cccccc'});
			curWidths.push('*');
		}		
		curList.push (curTitleRow);
		
		var curPreRow = [];
		curPreRow.push({text : 'Pre-Tax', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curPreRow.push({text : amtList[i].noteAmt, alignment : 'right'});
		}
		curList.push (curPreRow);
		
		var curTaxRow = [];
		curTaxRow.push({text : 'Tax', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curTaxRow.push({text : amtList[i].taxAmt, alignment : 'right'});
		}
		curList.push (curTaxRow);
		
		var curTotRow = [];
		curTotRow.push({text : 'Total', bold : true, alignment : 'center', fillColor : '#cccccc'});
		for(let i in amtList) {
			curTotRow.push({text : amtList[i].totAmt, alignment : 'right'});
		}
		curList.push (curTotRow);
		
		//erateList		
		var invErate = [];
		for(let i in erateList) {			
			var row = [];
			row.push({text : erateList[i].invocBasCur + '-' + erateList[i].invocChangeCur, alignment : 'left',border:[false, false, false, false], margin:[0,0,0,0]});
			row.push({text : erateList[i].erateBaseDay, alignment : 'left',border:[false, false, false, false]});
			row.push({text : erateList[i].erateVal, alignment : 'right',border:[false, false, false, false]});
			
			invErate.push(row);
		}
		
		if(_.isEmpty(erateList)) {
			let row = [];
			row.push({text : '', alignment : 'left',border:[false, false, false, false], margin:[0,0,0,0]});
			row.push({text : '', alignment : 'left',border:[false, false, false, false]});
			row.push({text : '', alignment : 'right',border:[false, false, false, false]});
			invErate.push(row);
		}	
		
		var taxNo = '';
		if(note.taxNo) {
			taxNo = 'Tax Registration Number :' + note.taxNo;
		}
		
		var docDefinition = {
				pageSize: 'A4',
				pageOrientation: 'portrait',  //portrait  landscape

				content : [
					{
						table : {
							widths : ['*'],
							body : [
								[
									{text : 'GSM '+ note.noteKindCdNm +' FOR ROAMING TRAFFIC FROM \n' + note.trmCmpnNm, bold : true, 
										alignment : 'center', border:[false, false, false, true]}
								]
							]
						},
						style : "header"
					}
					,'\n'					
					,{
						text : '* Address', bold : false, fontSize : 11
					}
					,{
						table : {
							widths : [100, '*']
							,body : [
								[
									{text : '\nTo. ' + note.rcvPlmnId +'\n', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : note.rcvCmpnNm +'\n' + note.rcvCmpnAdr , alignment : 'left'}
								],
								[
									{text : '\nFrom. ' + note.trmPlmnId +'\n', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : note.trmCmpnNm +'\n' + note.trmCmpnAdr , alignment : 'left'}
								]
							]
						}
					}
					,'\n'
					,{
						columns : [
							{
								width : 80,
								text : '* Details', bold : false, fontSize : 11
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
									{text : note.noteKindCdNm +'\nNumber', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : note.noteRefNum , alignment : 'left'}
								],
								[
									{text : 'Issue Date', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : note.creDateVal , alignment : 'left'}
								],
								[
									{text : 'Invoice Number', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : note.invocNm , alignment : 'left'}
								],
								[
									{text : 'Traffic Period', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : note.trafcDay , alignment : 'left'}
								]
							]
						}
					}
					,'\n'
					,{
						table : {
							widths : [100, '*']
							,body : [
								[
									{text : 'Reason for Request', bold : true, alignment : 'center', fillColor : '#cccccc'}
									,{text : _.unescape(note.reqReason), alignment : 'left'}
								]
							]
						}
					}
					,'\n'
					,{
						table : {
							widths : curWidths //['*', 100, 100, 100]
							,body : curList
						}
					}
					,'\n'
					,{
						text : 'Exchange Rate Infomation', bold : false, fontSize : 11
					}
					,{
						table : {
							widths : [60, 60, 65]
							,body : invErate
						}
					}
					,'\n'
					,{
						text : 'Contact for Inquiries', bold : false, fontSize : 11
					}
					,{
						table : {
							widths : [100, '*']
							,body : [
								[
									{text : 'Contact US :', alignment : 'left',border:[false, false, false, false]}
									,{text : note.contNm, alignment : 'left',border:[false, false, false, false]}
								]
								,[
									{text : 'E-Mail :', alignment : 'left',border:[false, false, false, false]}
									,{text : note.contEmail, alignment : 'left',border:[false, false, false, false]}
								]
								,[
									{text : 'Fax Number :', alignment : 'left',border:[false, false, false, false]}
									,{text : note.contFaxNo, alignment : 'left',border:[false, false, false, false]}
								]
								,[
									{text : 'Tel Number :', alignment : 'left',border:[false, false, false, false]}
									,{text : note.contTelNo, alignment : 'left',border:[false, false, false, false]}
								]
							]
						}
					}
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

		pdf.download( note.noteRefNum + '.pdf' );
	}
			
	var thisModuleEventHandlers = function() {

		/**
		 * invoice list -> note button event
		 */
		$(document).on('click', '.noteCla', function() {
			var $tr = $(this).closest('tr');
			var data = $('#invoiceList').DataTable().row($tr).data();
			
			_invocId = data.invocId;
			_invocDirectCd = data.invocDirectCd;
			var noteRefNum = data.noteRefNum;
			
			openInvCnaPop(_invocId, _invocDirectCd, noteRefNum, 'list');
		});
		/**
		 * note popup => tab click event
		 */
		$(document).on('click', '.tabCla', function(i) {
			$('.tabCla').each(function(){
				$(this).removeClass('on');
			})
			
			$(this).addClass('on');
						
			$('.noteRefNumCla').hide();
			
			$('#'+$(this).data('id')).show();
			$('#noteRefNum').val($('#'+$(this).data('id')).text());
			$('#noteKindCd').val($(this).data('text'));
			$('#cnaSaveId').text($(this).data('text')+' ' + _btnIssue);
		});
		/**
		 * note popup => save event
		 */
		$(document).on('click', '#cnaSaveId', function(e){
			if(!validNote()) {
				return;
			}
			
			var durl = _CTX + "fch/invoice/checkNoteNumDup";
			var dparams = {};
			dparams = $('#invCnaRegForm').serializeForm();
			
			$.ajaxProxy($.reqPost(durl).setParams(dparams).build()).done(function(response) {

	            var renote = response.data;
				
				if(renote.noteRefNum) {
					$('#noteRefNum').val(renote.noteRefNum);
				}
				
				var kindCd = $('#noteKindCd').val();
				
				var url = _CTX + "fch/invoice/insertNote";
							
				var msg = _invMsg009;
				if(kindCd === 'CN') {
					msg = _invMsg010;
				}else if(kindCd === 'DN') {
					msg = _invMsg011;
				}
				
				if(!global.confirm(msg)) {
					return;
				}
				
				var taxInclYn = $('#taxInclYn').val();
				if(taxInclYn == 'N') {
					$('#taxAplyPecnt').val("0");
				}
				
				var params = {};
				params = $('#invCnaRegForm').serializeForm();
				params.sysSvcId = url;
				
				$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response410) {
					
					$('#invNoteRegPop').modal('hide');
					
					if(_noteGbn === 'list') {
						$('#invoiceList').DataTable().draw();
					}else {
						$('#rejectId').remove();
					}
				});
				
			});
		});
		
		/**
		 *  note popup tax application
		 */
		$(document).on('change', '#taxInclYn', function() {
			if($(this).val() == 'Y') {
				$('#taxAplyPecnt').prop("readonly", false);
				$('#taxAplyPecnt').focus();
			}else {
				$('#taxAplyPecnt').val('').prop("readonly", true);
			}
		});
		/**
		 * note popup Amount
		 */
		$(document).on('blur', '#noteAmt', function() {
			var regexp = /^([0-9]){1,10}(\.[0-9]{1,6}){0,1}$/;
            
            var name = $(this).val();
        	
        	if(!name) {
        		return;
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgDecimal);  
        			$(this).val('').focus();
        		}
        	}
		});
		
		/**
		 * note popup tax amount
		 */
		$(document).on('blur', '#taxAplyPecnt', function() {
			var regexp = /^[1-9][0-9]?$/;
            
            var name = $(this).val();
        	
        	if(!name) {
        		return;
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgNum1100);
        			$(this).val('').focus();
        		}
        	}
        	
        	if(name > 100) {
    			global.alert(_msgNum1100);  
    			$(this).val('');        		
        	}
		});
		
		$(document).on('blur', '#reqReason, #contNm, #contTelNo, #contEmail, #contFaxNo', function() {
			var regexp = /^[a-zA-Z0-9`~!@#$%/,_\^\&*-.\?\[\]\{\}\(\)\n\<\>\=\|:;"'\\ ]*$/;
            
            var name = $(this).val();
        	
        	if(!name) {
        		return;
        	}else {
        		if(!regexp.test(name)) {
        			global.alert(_msgEngnumspec);  
        			$(this).val('').focus();
        		}
        	}
		});
		
		$(document).on('keypress', '#reqReason', function(e) {
            
            var name = $(this).val();
        	
        	if(!name) {
        		return;
        	}else {
        		if(name.length > _maxTextLen) {
        			global.alert(_invMsg012); 
        			e.preventDefault();
        			return;
        		}
        	}
		});

		/**
		 * invoice list =>  document note cell event
		 */
		$(document).on('click', '.noteListDocuCla', function(i) {
			
			var $tr = $(this).closest('tr');
			var data = $('#invoiceList').DataTable().row($tr).data();
						
			if(data && data.invocId) {
				
				var kindCd = data.kindCd;
				var noteRefNum = data.noteRefNum;
								
				if(kindCd !== 'INV') {
					openNotePop(noteRefNum);
				}
				
			}
		});
		
		/**
		 * invoice list => note pdf down event
		 */
		$(document).on('click', '.pdfNoteListCla', function() {
			var $tr = $(this).closest('tr');
			var data = $('#invoiceList').DataTable().row($tr).data();
						
			var invocId = data.invocId;
			var kindCd = data.kindCd;
			var noteRefNum = data.noteRefNum;
			
			if(data && data.invocId) {
								
				var params = {};
				params.invocId = invocId;	
				params.noteRefNum = noteRefNum;		
				
				if(kindCd !== 'INV') {
					
					var url = _CTX + "fch/invoice/downPdfNoteInfo";
					$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
						var result = response;
						
						createNotePdf(result);
						
					});
				}
			}
		});
		/**
		 * note pop => pdf download button event
		 */
		$(document).on('click', '#pdfPopDownId', function() {
			var params = {};
			params.noteRefNum = $('#pdfNoteRefNum').val();		
			
			var url = _CTX + "fch/invoice/downPdfNoteInfo";
			$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
				var result = response;
				
				createNotePdf(result);
				
			});
		})
		
		
		/**
		 * invoice detail => reject button click
		 */
		$(document).on('click', '#rejectId', function(e) {
			openInvCnaPop(_invocId, _invocDirectCd, '', 'detail');
		});
		/**
		 * tap in/out move
		 */
		$(document).on('click', '#tabInOutId', function(){
			
			var startDate = moment($('#trafcDay').val()).format('YYYY-MM-DD HH:mm:ss');
			var endDate = moment($('#trafcDay').val()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
			var trmPlmnId = $('#trmPlmnId').val();
			var rcvPlmnId = $('#rcvPlmnId').val();
			
			var tapDirection = 'TAP-In';
			if(_invocDirectCd === 'OUT') {
				tapDirection = 'TAP-Out';
			}
			// 

			var url = _CTX + "fch/invoice/noteTapList";
			
			$('<form action="' + url + '" method="GET"></form>')
			.append('<input type="hidden" name="trmPlmnId" value="' + trmPlmnId + '" />')
			.append('<input type="hidden" name="rcvPlmnId" value="' + rcvPlmnId + '" />')
			.append('<input type="hidden" name="startDate" value="' + startDate + '" />')
			.append('<input type="hidden" name="endDate" value="' + endDate + '" />')
			.append('<input type="hidden" name="tapDirection" value="' + tapDirection + '" />')
			.appendTo('body')
			.submit()
			.remove();
		})
				
	}; // end of event handlers

	$(function() {
		thisModuleEventHandlers();
	});
	
})(window, jQuery, thisPage);
