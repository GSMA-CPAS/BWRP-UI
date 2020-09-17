(function(global, $, thisPage) {

    var _CTX = thisPage.ctx;
//    var _USERNAME = thisPage.username;
    var _RTN_MSG = thisPage.rtnMsg;
    
    var _predict = thisPage.prediction;
    
    // total amt, outstanding amt
    var _precision = 0;
    
    // show return message
    function alertReturnMessage() {
        if (_RTN_MSG) {
            global.alert(_RTN_MSG);
        }
    }
    
    var init = function() {
    	
    	$('body').css('overflow', 'hidden');
    	
    	var url = _CTX + "dashboard/getInit";
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
			
			_precision = res.cd.cdVal1;
						
			var partnersOps = [];
			
			var partNetVal = '-';
											
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
						
			var sp = new SelectPure(".single-select", {
	            options: partnersOps,
	            value: partNetVal,
	            multiple: false,
	            autocomplete: true,
	            icon: "fa fa-times",
	            onChange: function onChange(value) {
	                $('#rcvPlmnId').val(value);
	                
	                allChange(value);
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
			
			//
			allChange(partNetVal);
			
			return sp;
						
		});	
    }
    /**
     * Pie chart
     */
    var totalPieChart = function(chartId, cagegoriNm, seri) {
    	
    	var series = [];
    	
    	var dataPercnt = seri.dataPercnt;
    	var voicePercnt = seri.voicePercnt;
    	var smsPercnt = seri.smsPercnt;
        	
    	series.push({name :'SMS', data: smsPercnt});
    	series.push({name :'Data', data: dataPercnt});
    	series.push({name :'Voice', data: voicePercnt});
    	
    	
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
//                showLabel: true,
//                showLegend : true,
//                labelAlign :'outer'
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
     * change plmn
     */
    function allChange(plmnId) {

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
		
        inboundLineChart(plmnId);
        outboundLineChart(plmnId);
        
        totalRevenuePieChart(plmnId);
        getInProcessed(plmnId);
        getReceivable(plmnId);
        inboundCommitPieChart(plmnId);
        
        totalExpensePieChart(plmnId);
        getOutProcessed(plmnId);
        getPayable(plmnId);
        outboundCommitPieChart(plmnId);
    }
    
    /**
     * Inbound Sales Line Chart
     */
    function inboundLineChart(plmnId) {
    	var params = {};
    	
    	var curYear = moment().year();
    	var preYear = moment().subtract(1, 'year').format('YYYY');
    	
        params.periods = [preYear, curYear];  // ['2018', '2019']
        params.companyCode = plmnId;  
        params.direction = 'IBR';  // inbound: IBR / outbound: OBR
        
        var url = _CTX + "fch/dashboardSalesInfo";

        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {

            var results = response['data'];

        	if(results.unit || results.period) {
        		results = [];
        	}
        	
            createLineChart('inboundLineChart', results);
        });
    	
    }
    
    /**
     * Outbound Sales Line Chart
     */
    function outboundLineChart(plmnId) {
    	var params = {};
    	
    	var curYear = moment().year();
    	var preYear = moment().subtract(1, 'year').format('YYYY');
    	
        params.periods = [preYear, curYear];  // ['2018', '2019']
        params.companyCode = plmnId;  
        params.direction = 'OBR';  // inbound: IBR / outbound: OBR
        
        var url = _CTX + "fch/dashboardSalesInfo";

        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {

            var results = response['data'];
            
            if(results.unit || results.period) {
        		results = [];
        	}
        	
            createLineChart('outboundLineChart', results);

        });
    	
    }
    /**
     * sales line chart
     */
    function createLineChart(chartId, results) {
    	      	
    	var container = document.getElementById(chartId);
    	
    	var curMon = moment().format('M');
    	var series = [];
    	
    	_.each(results, function(v, k) {
    		
    		var year = v['name'];
    		var dat = _.map(v['data']);
    		
    		if(year == moment().year()) {
    			var pdat312 = _.map(dat, function(v1,k1) {
    				return k1 < curMon ? v1 : null;
    			});
    			series.push({name : year, data: pdat312});

    			if(curMon != '12') {
    				var ndat318 = _.map(dat, function(v2,k2) {
    					return k2 >= (curMon -1) ? v2 : null;
    				});
    				series.push({name : year+' ' + _predict, data: ndat318});
    			}
    			
    		}else {
    			series.push({name : year, data: dat});
    		}
    	})
    	
    	    	
        var data = {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: series
        };
                
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
        };
        
        tui.chart.lineChart(container, data, options);
    }

    /**
     * Inbound Total Revenue Pie Chart
     */
    function totalRevenuePieChart(plmnId) {
    	var url = _CTX + "dashboard/totalRevenuePieChart";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			var revenue = res;
						
			$('#totRevPeriod').text('Period : ' + revenue.minSetlDay + ' ~ ' + revenue.maxSetlDay);
			
			$('#totRevVal').html('<span class="currency-amount" '+ fontSize(curFmt(revenue.revenueAmt, _precision))+'>'+curFmt(revenue.revenueAmt, _precision) +'<em>'+revenue.curCd+'</em></span>');
			$('#totRevDataVal').html('<span class="dash-data-amount">'+curFmt(revenue.dataAmt, _precision) +'<em>'+revenue.curCd+'</em></span>');
			$('#totRevVocaVal').html('<span class="dash-data-amount">'+curFmt(revenue.voiceAmt, _precision) +'<em>'+revenue.curCd+'</em></span>');
			$('#totRevSmsVal').html('<span class="dash-data-amount">'+curFmt(revenue.smsAmt, _precision) +'<em>'+revenue.curCd+'</em></span>');
			

			//tooltip
			var tooltipTxt = '';
			if(res.compAmt > 0) {
				tooltipTxt = 'Netted Amount : ' + curFmt(res.compAmt, _precision) + ' ' + res.curCd;
			}else if(res.compAmt < 0) {
				tooltipTxt = 'Netted Amount : <span style="color:red">' + curFmt(Math.abs(res.compAmt), _precision) + ' ' + res.curCd +'</span>';
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
			
						
			totalPieChart('pie-areaTotRevPieChart', 'Revenue', revenue);  

		});
    }
    /**
     * in processed
     */
    function getInProcessed(plmnId) {
    	var url = _CTX + "dashboard/getInProcessed";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			var revenue = res;
						
			$('#revTapLastHhmm').text('last updated : ' + revenue.minSetlDay + ' ~ ' + revenue.lastTapHhmm );
			$('#revVoiceQnt').text(curFmt(revenue.voiceQnt,2));
			$('#revDataQnt').text(curFmt(revenue.dataQnt,2));
			$('#revSmsQnt').text(curFmt(revenue.smsQnt));
			
			ProcessedFontSize($('#revVoiceQnt'), curFmt(revenue.voiceQnt,2));
			ProcessedFontSize($('#revDataQnt'), curFmt(revenue.dataQnt,2));
			ProcessedFontSize($('#revSmsQnt'), curFmt(revenue.smsQnt));
		});
    }
    
    /**
     * outstanding receivable
     */
    function getReceivable(plmnId) {
    	var url = _CTX + "dashboard/getReceivable";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			if(res) {
				$('#revReceiPeriod').text('Period : ~ ' + res.maxSetlDay);
				$('#revReceiAmt').html('<em>'+res.curCd+'</em><em class="receiCntUpId">'+curFmt(res.sumAmt, _precision)+'</em>');
				
				//tooltip
				var tooltipTxt = '';
				if(res.compAmt > 0) {
					tooltipTxt = 'Netted Amount : ' + curFmt(res.compAmt, _precision) + ' ' + res.curCd;
				}else if(res.compAmt < 0) {
					tooltipTxt = 'Netted Amount : <span style="color:red">' + curFmt(Math.abs(res.compAmt), _precision) + ' ' + res.curCd +'</span>';
				}
				
				if(tooltipTxt) {
					$('#revReceiTooltip').on('mouseover mouseout', function(e) {
						var $top = $(this).offset().top + 58;
						var $left = $(this).offset().left + 30;
						
						$('.tooltiptext').remove();
						
						$('body').append('<div class="tooltiptext">' + tooltipTxt +'</div>');

						(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();
						
						return false;
					}).css('cursor', 'pointer');
				}
				
				$('.receiCntUpId').countUp({
					'time': 1000,
					'delay': 10
				});
			}
		});
    }
    /**
     * commitment pie chart
     */
    var commitPieChart = function(chartId, pieTit, commit) {

    	
    	var p1 = commit.percnt;
    	var p2 = 100 - Number(p1);
    	
    	var series = [];
    	if(Number(p1) < 100) {	
    		series.push({name :'all', data: p1}); //commit.lastCommitAmt});
    	}else {
    		p2 = 100;
    	}
    	series.push({name : pieTit, data: p2}); //commit.sumAmt});
    		
    	
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
                    '#0fc8cd', '#f3f3f3'
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
     * Inbound Commitment Pie Chart
     */
    function inboundCommitPieChart(plmnId) {
    	
    	var url = _CTX + "dashboard/inboundCommitPieChart";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			var commit = res;
			$('#pie-areaInCommitPieChart').removeClass('no-data');
			$('#pie-areaInCommitPieChart .no-data-cont').remove();
							
			var title = commit.dataTitle;
			if(title && commit.percnt) {
				if(title == 'inv') {
					$('#inCommitTitId').html('YoY Revenue');
				}else {
					$('#inCommitTitId').html('Commitment');
				}
			}else {
				$('#inCommitTitId').html('Commitment');
				$('#pie-areaInCommitPieChart').addClass('no-data').append('<div class="no-data-cont"><div>No Data</div></div>');
			}
			
			if(commit.minSetlDay) {
				$('#inCommitPeriod').text('Period : ' + commit.minSetlDay + ' ~ ' + commit.curDay);
			}else {

				$('#inCommitPeriod').text('Period : ');
				if(title && commit.percnt) {
					if(title == 'inv') {
						var curYear = moment().year();
				    	var preYear = moment().subtract(1, 'year').format('YYYY');
				    	
						$('#inCommitPeriod').text(curYear + ' / ' + preYear);
					}
				}
			}
			if(commit.percnt) {
				$('#inCommitPercnt').html(commit.percnt+'<span>%</span>');
			}else {
				$('#inCommitPercnt').html('<span></span>');
			}
			if(commit.commitAmt) {
				$('#inCommitAmt').html(curFmt(commit.commitAmt)+'<em>'+commit.curCd+'</em>');
			}else {
				$('#inCommitAmt').html('<em></em>');
			}
			
			commitPieChart('pie-areaInCommitPieChart', 'Revenue', commit);
		});
    }

    /**
     * Outbound Total Revenue Pie Chart
     */
    function totalExpensePieChart(plmnId) {
    	
    	var url = _CTX + "dashboard/totalExpensePieChart";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			var expense = res;
			
			$('#totExpPeriod').text('Period : ' + expense.minSetlDay + ' ~ ' + expense.maxSetlDay);
						
			$('#totExpVal').html('<span class="currency-amount" '+ fontSize(curFmt(expense.revenueAmt, _precision))+'>'+curFmt(expense.revenueAmt, _precision) +'<em>'+expense.curCd+'</em></span>');
			$('#totExpDataVal').html('<span class="dash-data-amount">'+curFmt(expense.dataAmt, _precision) +'<em>'+expense.curCd+'</em></span>');
			$('#totExpVocaVal').html('<span class="dash-data-amount">'+curFmt(expense.voiceAmt, _precision) +'<em>'+expense.curCd+'</em></span>');
			$('#totExpSmsVal').html('<span class="dash-data-amount">'+curFmt(expense.smsAmt, _precision) +'<em>'+expense.curCd+'</em></span>');
			

			//tooltip
			var tooltipTxt = '';
			if(res.compAmt < 0) {
				tooltipTxt = 'Netted Amount : ' + curFmt(Math.abs(res.compAmt), _precision) + ' ' + res.curCd;
			}else if(res.compAmt > 0) {
				tooltipTxt = 'Netted Amount : <span style="color:red">' + curFmt(res.compAmt, _precision) + ' ' + res.curCd +'</span>';
			}
			
			if(tooltipTxt) {
				$('#totExpTooltip').on('mouseover mouseout', function(e) {
					var $top = $(this).offset().top + 58;
					var $left = $(this).offset().left + 30;
					
					$('.tooltiptext').remove();

					$('body').append('<div class="tooltiptext">' + tooltipTxt +'</div>');

					(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();
					
					return false;
				}).css('cursor', 'pointer');
			}
			
			
			totalPieChart('pie-areaTotExpPieChart', 'Expense', expense);
			
		});
    }
    
    /**
     * font-size
     */
    function fontSize(expAmt) {
    	var fontSize = "";
    	
    	if(expAmt.length >= 11 && expAmt.length <= 12) {
			fontSize = "style='font-size: 31px;'";
		}else if(expAmt.length >= 13 && expAmt.length <= 14) {
			fontSize = "style='font-size: 25px;'";
		}else if(expAmt.length >= 15) {
			fontSize = "style='font-size: 20px;'";					
		}
    	
    	return fontSize;
    }
    
    /**
     * out processed
     */
    function getOutProcessed(plmnId) {
    	var url = _CTX + "dashboard/getOutProcessed";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			var expense = res;
			
			$('#expTapLastHhmm').text('last updated : ' + expense.minSetlDay + ' ~ ' + expense.lastTapHhmm );
			$('#expVoiceQnt').text(curFmt(expense.voiceQnt,2));
			$('#expDataQnt').text(curFmt(expense.dataQnt,2));
			$('#expSmsQnt').text(curFmt(expense.smsQnt));
			
			ProcessedFontSize($('#expVoiceQnt'), curFmt(expense.voiceQnt,2));
			ProcessedFontSize($('#expDataQnt'), curFmt(expense.dataQnt,2));
			ProcessedFontSize($('#expSmsQnt'), curFmt(expense.smsQnt));
		});
    }
    

    /**
     * font-size
     */
    function ProcessedFontSize($qnt, amt) {
    	var fontSize = "26px";
    	//26px
    	if(amt.length >= 12 && amt.length <= 13) {
			fontSize = "21px";
		}else if(amt.length == 14) {
			fontSize = "19px";
		}else if(amt.length >= 15) {
			fontSize = "16px";
		}
    	
    	$qnt.css('font-size', fontSize);
    }
    
    /**
     * account receivable
     */
    function getPayable(plmnId) {
    	var url = _CTX + "dashboard/getPayable";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			if(res) {
				$('#expReceiPeriod').text('Period : ~ ' + res.maxSetlDay);
				$('#expReceiAmt').html('<em>'+res.curCd+'</em><em class="payCntUpId">'+curFmt(res.sumAmt, _precision)+'</em>');
				
				//tooltip
				var tooltipTxt = '';
				if(res.compAmt < 0) {
					tooltipTxt = 'Netted Amount : ' + curFmt(Math.abs(res.compAmt), _precision) + ' ' + res.curCd;
				}else if(res.compAmt > 0) {
					tooltipTxt = 'Netted Amount : <span style="color:red">' + curFmt(res.compAmt, _precision) + ' ' + res.curCd +'</span>';
				}
				
				if(tooltipTxt) {
					$('#expReceiTooltip').on('mouseover mouseout', function(e) {
						var $top = $(this).offset().top + 58;
						var $left = $(this).offset().left + 30;
						
						$('.tooltiptext').remove();

						$('body').append('<div class="tooltiptext">' + tooltipTxt +'</div>');

						(e.type == 'mouseover') ? $('.tooltiptext').css({top : $top, left : $left}).fadeIn(500) : $('.tooltiptext').remove();
						
						return false;
					}).css('cursor', 'pointer');
				}
				
				$('.payCntUpId').countUp({
					'time': 1000,
					'delay': 10
				});
			}
		});
    }

    /**
     * Outbound Commitment Pie Chart
     */
    function outboundCommitPieChart(plmnId) {
    	var url = _CTX + "dashboard/outboundCommitmentPieChart";
		var params = {};
		params.rcvPlmnId = plmnId;
		params.precision = _precision||0;
		
		if(!plmnId)	{
			return;
		}
		
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
			var commit = res;
			
			$('#pie-areaOutCommitPieChart').removeClass('no-data');
			$('#pie-areaOutCommitPieChart .no-data-cont').remove();
						
			var title = commit.dataTitle;
			if(title && commit.percnt) {
				if(title == 'inv') {
					$('#outCommitTitId').html('YoY Cost');
				}else {
					$('#outCommitTitId').html('Commitment');
				}
			}else {
				$('#outCommitTitId').html('Commitment');
				$('#pie-areaOutCommitPieChart').addClass('no-data').append('<div class="no-data-cont"><div>No Data</div></div>');
			}
			
			if(commit.minSetlDay) {
				$('#outCommitPeriod').text('Period : ' + commit.minSetlDay + ' ~ ' + commit.curDay);
			}else {
				$('#outCommitPeriod').text('Period : ');
				if(title && commit.percnt) {
					if(title == 'inv') {
						var curYear = moment().year();
				    	var preYear = moment().subtract(1, 'year').format('YYYY');
				    	
						$('#outCommitPeriod').text(curYear + ' / ' + preYear);
					}
				}
			}
			if(commit.percnt) {
				$('#outCommitPercnt').html(commit.percnt+'<span>%</span>');
			}else {
				$('#outCommitPercnt').html('<span></span>');
			}
			if(commit.commitAmt) {
				$('#outCommitAmt').html(curFmt(commit.commitAmt)+'<em>'+commit.curCd+'</em>');
			}else {
				$('#outCommitAmt').html('<em></em>');
			}
			
			commitPieChart('pie-areaOutCommitPieChart', 'Expense', commit);
		
		});

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
    		
    	return currency(amt, {separator:',', precision : precision}).format();
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

})(window, jQuery, thisPage);
