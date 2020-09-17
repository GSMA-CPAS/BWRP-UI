(function(global, $, thisPage, notiModule) {

    var _CTX = thisPage.ctx;
//    var _USERNAME = thisPage.username;
    var _RTN_MSG = thisPage.rtnMsg;
    var _testYn = thisPage.testYn;

    var _predict = thisPage.prediction;

    var _precision = 0;
    var _astrikLen = 3;


    // show return message
    function alertReturnMessage() {
        if (_RTN_MSG) {
            global.alert(_RTN_MSG);
        }
    }
    var partnersOps = [];

    var setTimer;
    var setSec = 20000;
    var plmnord = ['BPlmn', 'CPlmn'];
    var curPlmnId;
    var curPlmnIdx = 0;
    var gSeq = 0;

    var init = function() {

    	$('body').css('overflow', 'hidden');

    	var url = _CTX + "mainboard/getInit";
		var params = {};
		var commonAjax = $.ajaxProxy($.reqPost(url).setParams(params).build());

		var ourl = _CTX + "mainboard/getMainInfo";
		var oparams = {};
		oparams.plmnord = 'ord';
		oparams.precision = _precision||2;
		var ocommonAjax = $.ajaxProxy($.reqPost(ourl).setParams(oparams).build());

		$.when.apply($, [ commonAjax, ocommonAjax]).then(function() {
			var resArr = arguments;
			var partnersResponse = null;
			var ordPlmn = null;

			$.each(resArr, function(i, res){
	            if (i === 0){
	            	partnersResponse =  res;
	            }else {
	            	ordPlmn =  res;
	            }
	        });

			var res = {};
			res.partnersResponse = partnersResponse;
			res.ordPlmn = ordPlmn;

			return res;
		}).done(function(res) {
			var partnersResponse = res.partnersResponse.partners;

			_precision = res.partnersResponse.cd.cdVal1;

			plmnord = res.ordPlmn;

			//partners list
			partnersOps.push({label:'-', value:'-'});
			_.each(partnersResponse, function(v, k) {
				var op = {label:'', value:''};
//				op.label = v['plmnId'];
//				op.value = v['plmnId'];

				op.label = v['cdId'];
				op.value = v['cdVal1'];

				partnersOps.push(op);

			});


			if(!_.isEmpty(plmnord)) {
				setSec = plmnord[0].revcur||20000;
				_astrikLen = plmnord[0].revamt||3;
			}

			setTotal();

			setTimer = setInterval(setTotal, setSec);

		});
    }

    var selectPure = function(partNetVal) {

    	var sp1;

    	$('.single-select div').remove();

    	sp1 = new SelectPure(".single-select", {
            options: partnersOps,
            value: partNetVal,
            multiple: false,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function onChange(value) {

                $('#rcvPlmnId').val(value);

                curPlmnId = value;
                gSeq = 1;

                clearInterval(setTimer);

                setTotal();

    			setTimer = setInterval(setTotal, setSec);
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

		return sp1;
    }


    function setTotal() {

    	if(!curPlmnId) {
    		curPlmnId = plmnord[0].rcvplmnid;
    		curPlmnIdx = 0;
    		gSeq = 1;

    		selectPure(curPlmnId);
    	}

    	if(gSeq > 3) {
    		gSeq = 1;

    		if(plmnord.length == (curPlmnIdx+1) ) {
    			curPlmnIdx = 0;
    		}else {
    			curPlmnIdx++;
    		}
    		curPlmnId = plmnord[curPlmnIdx].rcvplmnid;

    		selectPure(curPlmnId);
    	}

    	var murl = _CTX + "mainboard/getMainInfo";
		var mparams = {};
		mparams.plmnord = 'data';
		mparams.rcvplmnid = curPlmnId;
		mparams.seq = gSeq;
		mparams.precision = _precision||0;

		var mcommonAjax = $.ajaxProxy($.reqPost(murl).setParams(mparams).build());

		var lurl = _CTX + "mainboard/getSalesInfo";
		var lparams = {};
		lparams.plmnord = 'data';
		lparams.rcvplmnid = curPlmnId;
		lparams.seq = gSeq;

		var lcommonAjax = $.ajaxProxy($.reqPost(lurl).setParams(lparams).build());

		$.when.apply($, [ mcommonAjax, lcommonAjax]).then(function() {
			var resArr = arguments;
			var mainResponse = null;
			var salesResponse = null;

			$.each(resArr, function(i, res){
	            if (i === 0){
	            	mainResponse =  res;
	            }else {
	            	salesResponse = res;
	            }
	        });

			var res = {};
			res.mainResponse = mainResponse;
			res.salesResponse = salesResponse;

			return res;
		}).done(function(res) {
			var mainData = res.mainResponse;
			var saleData = res.salesResponse;

			gSeq++;

			$('#rcvPlmnId').val(curPlmnId);
	    	var data = _.find(mainData, function(dd) {
				return dd.rcvplmnid == curPlmnId; // && dd.seq == gSeq;
			});

			$('#inCommitPeriod, #outCommitPeriod').text('Period : ');
			$('#inCommitPercnt, #outCommitPercnt').html('<span></span>');
			$('#inCommitAmt, #outCommitAmt').html('<em></em>');
			$('.tui-chart').remove();
			$('.no-data').removeClass('no-data');
			$('.no-data-cont').remove();

			$(".dashboard-btn button").removeClass('on');
			$(".dashboard-btn button:eq(0)").addClass('on');
			$(".dashboard-group .line-graph-group .line-graph").hide();
			$(".dashboard-group .line-graph-group .line-graph.ib").show();
			$('.graph-state p').hide();
			$('#outgoingTitId').show();

			$('#revReceiTooltip, #expReceiTooltip, #totRevTooltip, #totExpTooltip').unbind().css('cursor','');
			$('.tooltiptext').remove();

			//animation
			var options  = {};
//			$('.pie-total-group').effect('slide', options, 1500);
//			$('.processing-group').effect('explode', options, 2000, function() {
//					$(this).show();
//				});
//			options = { to : ".processing-group .title", className:"ui-effects-transfer" }
//			options = {percent : 50}

//			$('.process-in .inr ul li span:last-child span').effect('explode', options, 1500, function() {  //explode , transfer
//					$(this).show('slow');
//				});


			$('.processing-group .inr ul li span:last-child em:last-child').css('float', 'right');
			$('.processing-group .inr ul li span:last-child span').effect('explode', options, 700, function() {  //explode , transfer
				$(this).show('slow');
			});

//			options = { to : ".process-out-transfer", className:"ui-effects-transfer" }
//
//			$('.process-out .inr ul li span:last-child span').effect('transfer', options, 1500, function() {  //explode , transfer
//				$(this).show('slow');
//			});

//			$('.receivable-group').effect('slide', options, 500);
//			$('.commitment-group').effect('slide', options, 500);


			$('#totRevPeriod').text('Period : ' + data.revminday + ' ~ ' + data.revmaxday);

			var totRev = curFmt(data.revamt);
			var totRevAst = '', totRevAmt = '';
			if(totRev.includes('*')) {
				totRevAst = totRev.substr(0, totRev.lastIndexOf('*')+1);
				totRevAmt = totRev.substr(totRev.lastIndexOf('*')+1);

				if(totRevAmt.indexOf(',')==0) {
					totRevAmt = totRevAmt.substr(1);
					totRevAst = totRevAst + ',';
				}
			}else {
				totRevAmt = totRev;
			}

			$('#totRevVal').html('<span class="currency-amount">'+totRevAst +'<span class="totRevCntUp">' + totRevAmt +'</span><em>'+data.revcur+'</em></span>');

			$('.totRevCntUp').countUp({
			      'time': 1000,
			      'delay': 10
			    });

			//tooltip
			var tooltipTxt = '';
			if(Number(data.revtoolamt) > 0) {
				tooltipTxt = 'Netted Amount : ' + curFmt(Math.abs(data.revtoolamt), _precision) + ' ' + data.revcur;
			}else if(Number(data.revtoolamt) < 0) {
				tooltipTxt = 'Netted Amount : <span style="color:red">' + curFmt(Math.abs(data.revtoolamt), _precision) + ' ' + data.revcur +'</span>';
			}

			if(tooltipTxt) {
				$('#totRevTooltip').on('mouseover mouseout', function(e) {
					var $top = $(this).offset().top + 58;
					var $left = $(this).offset().left + 30;

					$('.tooltiptext').remove();

					$('body').append('<div class="tooltiptext">' + tooltipTxt +'</div>');

					(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();

					return false;
				}).css('cursor', 'pointer');
			}


			$('#totRevDataVal').html('<span class="dash-data-amount">'+curFmt(data.revdataamt, _precision) +'<em>'+data.revcur+'</em></span>');
			$('#totRevVocaVal').html('<span class="dash-data-amount">'+curFmt(data.revvoiceamt, _precision) +'<em>'+data.revcur+'</em></span>');
			$('#totRevSmsVal').html('<span class="dash-data-amount">'+curFmt(data.revsmsamt, _precision) +'<em>'+data.revcur+'</em></span>');

			var revenue = {'smsAmt': data.revsmsamt, 'dataAmt' : data.revdataamt, 'voiceAmt' : data.revvoiceamt};

			totalPieChart('pie-areaTotRevPieChart', 'Revenue', revenue);

			$('#totExpPeriod').text('Period : ' + data.expminday + ' ~ ' + data.expmaxday);

			var totExp = curFmt(data.expamt);
			var totExpAst = '', totExpAmt = '';
			if(totExp.includes('*')) {
				totExpAst = totExp.substr(0, totExp.lastIndexOf('*')+1);
				totExpAmt = totExp.substr(totExp.lastIndexOf('*')+1);

				if(totExpAmt.indexOf(',')==0) {
					totExpAmt = totExpAmt.substr(1);
					totExpAst = totExpAst + ',';
				}
			}else {
				totExpAmt = totExp;
			}

			$('#totExpVal').html('<span class="currency-amount">'+totExpAst +'<span class="totExpCntUp">' + totExpAmt  +'</span><em>'+data.expcur+'</em></span>');

			$('.totExpCntUp').countUp({
			      'time': 1000,
			      'delay': 10
			    });

			$('#totExpDataVal').html('<span class="dash-data-amount">'+curFmt(data.expdataamt, _precision) +'<em>'+data.expcur+'</em></span>');
			$('#totExpVocaVal').html('<span class="dash-data-amount">'+curFmt(data.expvoiceamt, _precision) +'<em>'+data.expcur+'</em></span>');
			$('#totExpSmsVal').html('<span class="dash-data-amount">'+curFmt(data.expsmsamt, _precision) +'<em>'+data.expcur+'</em></span>');


			//tooltip
			var tooltipTxt1 = '';
			if(Number(data.exptoolamt) < 0) {
				tooltipTxt1 = 'Netted Amount : ' + curFmt(Math.abs(data.exptoolamt), _precision) + ' ' + data.revcur;
			}else if(Number(data.exptoolamt) > 0) {
				tooltipTxt1 = 'Netted Amount : <span style="color:red">' + curFmt(data.exptoolamt, _precision) + ' ' + data.revcur +'</span>';
			}

			if(tooltipTxt1) {
				$('#totExpTooltip').on('mouseover mouseout', function(e) {
					var $top = $(this).offset().top + 58;
					var $left = $(this).offset().left + 30;

					$('.tooltiptext').remove();

					$('body').append('<div class="tooltiptext">' + tooltipTxt1 +'</div>');

					(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();

					return false;
				}).css('cursor', 'pointer');
			}


			var expense = {'smsAmt': data.expsmsamt, 'dataAmt' : data.expdataamt, 'voiceAmt' : data.expvoiceamt};

			totalPieChart('pie-areaTotExpPieChart', 'Expense', expense);

			//processed inbound
			$('#revTapLastHhmm').text('last updated : ' + data.revminsetlday + ' ~ ' + data.revtaphhmm );
			$('#revVoiceQnt').text(curFmt(data.revvoiceqnt,2));
			$('#revDataQnt').text(curFmt(data.revdataqnt,2));
			$('#revSmsQnt').text(curFmt(data.revsmsqnt));

			//processed outbound
			$('#expTapLastHhmm').text('last updated : ' + data.expminsetlday + ' ~ ' + data.exptaphhmm );
			$('#expVoiceQnt').text(curFmt(data.expvoiceqnt,2));
			$('#expDataQnt').text(curFmt(data.expdataqnt,2));
			$('#expSmsQnt').text(curFmt(data.expsmsqnt));

			//receibable
			$('#revReceiPeriod').text('Period : ~ ' + data.receimaxday);

			var receiv = curFmt(data.receiamt);
			var receivAst = '', receivAmt = '';
			if(receiv.includes('*')) {
				receivAst = receiv.substr(0, receiv.lastIndexOf('*')+1);
				receivAmt = receiv.substr(receiv.lastIndexOf('*')+1);

				if(receivAmt.indexOf(',')==0) {
					receivAmt = receivAmt.substr(1);
					receivAst = receivAst + ',';
				}
			}else {
				receivAmt = receiv;
			}

			$('#revReceiAmt').html('<em>'+data.receicur+'</em><em>' + receivAst +'<span class="receiCntUpId">'+receivAmt+'</span></em>');

			$('.receiCntUpId').countUp({
		      'time': 1000,
		      'delay': 10
		    });


			//tooltip
			var tooltipTxt2 = '';
			if(Number(data.receitoolamt) > 0) {
				tooltipTxt2 = 'Netted Amount : ' + curFmt(data.receitoolamt) + ' ' + data.receicur;
			}else if(Number(data.receitoolamt) < 0) {
				tooltipTxt2 = 'Netted Amount : <span style="color:red">-' + curFmt(data.receitoolamt) + ' ' + data.receicur +'</span>';
			}

			if(tooltipTxt2) {
				$('#revReceiTooltip').on('mouseover mouseout', function(e) {
					var $top = $(this).offset().top + 58;
					var $left = $(this).offset().left + 30;

					$('.tooltiptext').remove();

					$('body').append('<div class="tooltiptext">' + tooltipTxt2 +'</div>');

					(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();

					return false;
				}).css('cursor', 'pointer');
			}


			//payable
			var paya = curFmt(data.payamt);
			var payaAst = '', payaAmt = '';
			if(paya.includes('*')) {
				payaAst = paya.substr(0, paya.lastIndexOf('*')+1);
				payaAmt = paya.substr(paya.lastIndexOf('*')+1);

				if(payaAmt.indexOf(',')==0) {
					payaAmt = payaAmt.substr(1);
					payaAst = payaAst + ',';
				}

			}else {
				payaAmt = paya;
			}

			$('#expReceiPeriod').text('Period : ~ ' + data.paymaxday);
			$('#expReceiAmt').html('<em>'+data.paycur+'</em><em>' + payaAst +'<span class="payCntUpId">'+payaAmt+'</span></em>');

			$('.payCntUpId').countUp({
		      'time': 1000,
		      'delay': 10
		    });


			//tooltip
			var ptooltipTxt = '';
			if(Number(data.paytoolamt) < 0) {
				ptooltipTxt = 'Netted Amount : ' + curFmt(Math.abs(data.paytoolamt)) + ' ' + data.receicur;
			}else if(Number(data.paytoolamt) > 0) {
				ptooltipTxt = 'Netted Amount : <span style="color:red">' + curFmt(Math.abs(data.paytoolamt)) + ' ' + data.receicur +'</span>';
			}

			if(ptooltipTxt) {
				$('#expReceiTooltip').on('mouseover mouseout', function(e) {
					var $top = $(this).offset().top + 58;
					var $left = $(this).offset().left + 30;

					$('.tooltiptext').remove();

					$('body').append('<div class="tooltiptext">' + ptooltipTxt +'</div>');

					(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();

					return false;
				}).css('cursor', 'pointer');
			}

			//commitment inbound
			$('#pie-areaInCommitPieChart').removeClass('no-data');
			$('#pie-areaInCommitPieChart .no-data-cont').remove();


			$('#inCommitPeriod').text('Period : ' + data.incommitminday + ' ~ ' + data.incommitmaxday);
			$('#inCommitPercnt').html(data.incommitpercnt+'<span>%</span>');
			$('#inCommitAmt').html(curFmt(data.incommitamt)+'<em>'+data.incommitcur+'</em>');


			var incommit = {'commitAmt' : data.incommitamt, 'sumAmt':data.incommitsumamt, 'percnt' : data.incommitpercnt}

			commitPieChart('pie-areaInCommitPieChart', 'Revenue', incommit);

			//commitment outbound
			$('#outCommitPeriod').text('Period : ' + data.outcommitminday + ' ~ ' + data.outcommitmaxday);
			$('#outCommitPercnt').html(data.outcommitpercnt+'<span>%</span>');
			$('#outCommitAmt').html(curFmt(data.outcommitamt)+'<em>'+data.outcommitcur+'</em>');

			var outcommit = {'commitAmt' : data.outcommitamt, 'sumAmt':data.outcommitsumamt, 'percnt' : data.outcommitpercnt}

			commitPieChart('pie-areaOutCommitPieChart', 'Expense', outcommit);

			//
			var inline = _.filter(saleData, function(dd) {
					return dd.outin == 'IN';
				});

			var inresults = [];

			_.each(inline, function(v, k) {
				var o = {'name': v['years'], data :[]};
				o.data.push(v['jan']);
				o.data.push(v['feb']);
				o.data.push(v['mar']);
				o.data.push(v['apr']);
				o.data.push(v['may']);
				o.data.push(v['jun']);
				o.data.push(v['jul']);
				o.data.push(v['aug']);
				o.data.push(v['sep']);
				o.data.push(v['oct']);
				o.data.push(v['nov']);
				o.data.push(v['dece']);

				inresults.push(o);
			});

			createLineChart('inboundLineChart', _.sortBy(inresults, 'name').reverse());

			var outline = _.filter(saleData, function(dd) {
				return dd.outin == 'OUT';
				});

			var outresults = [];

			_.each(outline, function(v, k) {
				var o = {'name': v['years'], data :[]};
				o.data.push(v['jan']);
				o.data.push(v['feb']);
				o.data.push(v['mar']);
				o.data.push(v['apr']);
				o.data.push(v['may']);
				o.data.push(v['jun']);
				o.data.push(v['jul']);
				o.data.push(v['aug']);
				o.data.push(v['sep']);
				o.data.push(v['oct']);
				o.data.push(v['nov']);
				o.data.push(v['dece']);

				outresults.push(o);
			});

			createLineChart('outboundLineChart', _.sortBy(outresults, 'name').reverse());

			notiModule.runNotiPushDemo();

		});



    }
    /**
     * Pie chart
     */
    function totalPieChart(chartId, cagegoriNm, seri) {

    	var series = [];
    	series.push({name :'SMS', data: seri.smsAmt});
    	series.push({name :'Data', data: seri.dataAmt});
    	series.push({name :'Voice', data: seri.voiceAmt});


    	var container = document.getElementById(chartId);
        var data = {
            categories: [cagegoriNm],
            series: series
        };
        var options = {
            chart: {
                width: 170,
                height: 200,
                format: function (value, chartType, areaType, valuetype, legendName) {
                    if (areaType === 'makingSeriesLabel') {
                        value = legendName;
                    }
                    return value;
                }
            },
            legend: {
                visible: false,
                align: 'left'
            },
            series: {
                radiusRange: ['0%', '100%']
            },
            tooltip: {
                suffix: ''
                ,template: function(){
                	return '';
                }
            }
        };
        var theme = {
            series: {
                colors: [   //data #f1b1c5 voi #c2efc5  sms #89e4e4
                    '#89e4e4', '#f1b1c5', '#c2efc5'
                ],
                column: {
                    colors: ['red', 'orange', 'yellow', 'green', 'blue']
                }
            },
            label: {
                color: '#fff',
                fontFamily: 'NotoSans-Regular',
                align: 'center'
            },
            chart: {
                fontFamily: 'NotoSans-Regular',
                background: {
                    // color: 'red',
                    opacity: 1
                }
            },
            title: {
                align: 'bottom',
                fontSize: 13,
                fontFamily: 'NotoSans-Regular',
                fontWeight: 'bold',
                color: '#fff'
            }
        };
        tui.chart.registerTheme('myTheme', theme);
        options.theme = 'myTheme';

        tui.chart.pieChart(container, data, options);
    }

    /**
     * sales line chart
     */
    function createLineChart(chartId, results) {

    	var container = document.getElementById(chartId);

    	var curMon = moment().format('M');
    	var series = [];

    	_.each(results.reverse(), function(v, k) {

    		var year = v['name'];
    		var dat = _.map(v['data']);

    		if(year == moment().year()) {
    			var pdat671 = _.map(dat, function(v3,k3) {
    				return k3 < curMon ? v3 : null;
    			});
    			series.push({name : year, data: pdat671});

    			if(curMon != '12') {
    				var ndat678 = _.map(dat, function(v4,k4) {
    					return k4 >= (curMon -1) ? v4 : null;
    				});
    				series.push({name : year+' '+_predict, data: ndat678});
    			}

    		}else {
    			series.push({name : year, data: dat});
    		}
    	})


        var data = {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: series
        };

//    	var preMon = moment().subtract(1, 'month').format('MMM');
//    	var nextMon = moment().add(1, 'month').format('MMM');
//
//    	var currentMon = moment().format('MMM');

        var options = {
            chart: {
                width: 650,
                height: 260,
                title: '',
                format : '1,000'
            },
            yAxis: {
                title: ''
            },
            xAxis: {
                title: '',
                pointOnColumn: false,
                dateFormat: 'MMM',
                tickInterval: 'auto'
            },
            series: {
                showDot: false,
                zoomable: true
            },
            tooltip: {
                suffix: '',
                grouped : false
                ,template: function(category, item, categoryTimeStamp){
                	return '';
                }

            },
            legend: {
                visible: true,
                align: 'top',
                showCheckbox : false
            }
//            ,plot: {
//                bands: [{
//                    range: [preMon, nextMon],
//                    color: 'gray',
//                    opacity: 0.2
//                }],
//                lines: [{
//                    value: '70',
//                    color: '#fa2828'
//                }]
//            }
        };

        tui.chart.lineChart(container, data, options);
    }

    /**
     * commitment pie chart
     */
    function commitPieChart(chartId, pieTit, commit) {

    	var series = [];
    	if(commit.percnt < 100) {
    		series.push({name :'all', data: (commit.commitAmt - commit.sumAmt)});
    	}
    	series.push({name : pieTit, data: commit.sumAmt});


    	var container = document.getElementById(chartId);
        var data = {
            categories: ['Commitment'],
            series: series
        };
        var options = {
            chart: {
                width: 200,
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
                radiusRange: ['80%', '100%'],
                showLabel: false
            },
            tooltip: {
                suffix: ''
                ,template: function(category, item, categoryTimeStamp){
                	return '';
                }
            }
        };
        var theme = {
            series: {
                colors: [
                    '#f3f3f3', '#0fc8cd'
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
                    // color: 'red',
                    opacity: 1
                }
            },
            title: {
                align: 'bottom',
                fontSize: 13,
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
     * currency
     */
    function curFmt(amt, precision) {
    	if(!amt) {
    		return "0";
    	}

    	if(!precision) {
    		precision = "0";
    	}

    	amt = String(amt);

    	_testYn='Y';
    	if(_testYn == 'Y') {  // Y

    		var bAmt = "", pAmt = "";
    		var threeAmt = "", astrikAmt = "", lpadAmt = "";
    		var threeComAmt = "";
    		var rslt ="";

    		if(amt.includes('.')) {
    			var p = amt.indexOf('.');

    			bAmt = amt.substring(0, p);
    			pAmt = amt.substring(p);
    		}else {
    			bAmt = amt;
    		}

    		if(bAmt.length > _astrikLen) {
    			threeAmt = bAmt.substr(bAmt.length - _astrikLen);
    			astrikAmt = bAmt.substr(0, bAmt.length - _astrikLen);
    		}else {
    			threeAmt = bAmt;
    		}

    		if(threeAmt) {
    			var idx = 1;
    			for(let i = threeAmt.length; i > 0;i--) {

    				if(idx%3==0) {
    					threeComAmt = "," + threeAmt.charAt(threeAmt.length-idx) + threeComAmt;
    				}else {
    					threeComAmt = threeAmt.charAt(threeAmt.length - idx) + threeComAmt;
    				}
    				idx++;
    			}
    		}

    		if(astrikAmt) {
    			var alen = astrikAmt.length;

    			for(let i =0; i<alen;i++) {
    				var realLen = i + _astrikLen;
    				if(realLen == 0) {
    					lpadAmt = "*" + lpadAmt + ",";
    				}
    				else if(realLen%3==0) {
    					lpadAmt = "*," + lpadAmt;
    				}else {
    					lpadAmt = "*" + lpadAmt;
    				}
    			}
    		}

    		rslt = lpadAmt + threeComAmt + pAmt;

    		if(rslt.indexOf(',')==0) {
    			rslt = rslt.substr(1);
    		}

    		return rslt.replace(/,,/g, ',');

    	}else {

    		return currency(amt, {separator:',', precision : precision}).format();
    	}
    }

    // module event handlers
    var thisModuleEventHandlers = function() {

    	var dashBtn = $(".dashboard-btn button");
    	var graph = $(".dashboard-group .line-graph-group .line-graph");
    	dashBtn.on('click', function () {

    		$('.graph-state p').hide();

    		var now  = $(this);
    		dashBtn.removeClass('on');
    		now.addClass('on');
    		var indx = $(this).index();
    		graph.hide();
    		if(indx == 0) {
    			$('#outgoingTitId').show();
    			$(".dashboard-group .line-graph-group .line-graph.ib").show();
    		}else {
    			$('#incomingTitId').show();
    			$(".dashboard-group .line-graph-group .line-graph.ob").show();
    		}
    	});


    }; // end of event handler


    // module initial functions
    var thisModuleInitializr = function() {
        alertReturnMessage();
        init();
    };


    // dom ready
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    });

})(window, jQuery, thisPage, notiModule);
