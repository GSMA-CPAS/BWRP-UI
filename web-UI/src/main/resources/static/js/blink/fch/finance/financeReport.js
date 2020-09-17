/**
 * Finace Report
 * 
 * @author Lee YuPyeong
 */
(function(global, $, _m, thisPage) {

    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    let _COMMON_CODES = {};
    let _PRECISION = 2;
    
    
    // show return message
    function alertReturnMessage() {
        if (_RTN_MSG) {
            global.alert(_RTN_MSG);
        }
    }
    

    function findCommonCodes() {

        let url = _CTX + "dch/contract/findCommonCodes";
        
        $.ajaxProxy($.reqGet(url).build()).then(function(res) {
            _COMMON_CODES = res.data;
            _PRECISION = res.data.listPrecision.cdVal1;
            let partnerNetworks = res.data.partnerNetworks;
            let callTypeCodes = res.data.callTypeCodes;
            let contTypeCodes = res.data.contTypeCodes; // direction
            let currencyCodes = res.data.currencyCodes;
            let salesUnitCodes = res.data.salesUnitCodes;
            
            // 1. period
            let defaultPeriod = [new Date().getFullYear().toString()];
            let selectorPeriods = createSelectorYears();
            let periods = selectorPeriods.map(selectorPeriod => ({ label : selectorPeriod, value : selectorPeriod }));
            
            initMultiSelectbox('#period', periods, defaultPeriod, 'period');
            
            // 2. partner plmn selectbox
            let defaultPartnerNetwork = ['APN'];
            let partnerNetworkOption = partnerNetworks.map(partnerNetwork => ({ label : partnerNetwork.cdVal1, value : partnerNetwork.cdId }));
            partnerNetworkOption.unshift({ label: 'All Network', value : 'APN' });
            
            initAutoCompleteMultiSelectbox('#partnerNetwork', partnerNetworkOption, defaultPartnerNetwork, 'partnerNetwork');
            
            
            // 3. callType
            let defaultCallTypeCodes = ['ASVC'];
            let callTypeCodeOption = callTypeCodes.map(callTypeCode => ({ label : callTypeCode.cdVal1, value : callTypeCode.cdId }));
            callTypeCodeOption = _.sortBy(callTypeCodeOption, 'label');
            
            initMultiSelectbox('#callType', callTypeCodeOption, defaultCallTypeCodes, 'callType');
            
            
            // 4. contType selectbox (direction)
            let defaultContType = 'IBR'; // default inbound roaming (i -> you)
            let contTypeOption = contTypeCodes.filter(contTypeCode => contTypeCode.cdId !== 'IOBR')
            .map(contTypeCode => ({ label : contTypeCode.cdVal1, value : contTypeCode.cdId }));
            
            initSingleSelectbox('#contType', 'contTypeOpts', contTypeOption, defaultContType, true)
            
            // 5. currency
            let defaultCurrency = 'SDR'
            let currencyOption = currencyCodes.map(currencyCode => ({ label : currencyCode.cdVal1, value : currencyCode.cdId }));
            
            initAutoCompleteSingleSelectbox('#curCurrency', currencyOption, defaultCurrency, 'currency');
            
            
            // 6. sales unit
            let defaultSalesUnit = 'Amount';
            let salesUnitOption = salesUnitCodes.map(salesUnitCode => ({ label : salesUnitCode.cdVal1, value : salesUnitCode.cdId }));
            
            initSingleSelectbox('#unit', 'unitOpts', salesUnitOption, defaultSalesUnit, true);
            
        
        }).done(function() {
        
            let periods = getValueFromElement('#period', 'period');
            let partnerNetworks = getValueFromElement('#partnerNetwork', 'partnerNetwork');
            let callTypes = getValueFromElement('#callType', 'callType');
            let unit = $('.unitOpts').val();
            let direction = $('.contTypeOpts').val();
            let currency = getValueFromElement('#curCurrency', 'currency');
            
            let params = {};
            params.periods = periods;
            params.partnerNetworks = partnerNetworks;
            params.callTypes = callTypes;
            params.unit = unit;
            params.direction = direction;
            params.currency = currency;
            
            let url = _CTX + "fch/findSalesInfo";
            $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
                let results = response['data'];
                drawSalesInfoTable(_.sortBy(results, 'name').reverse(), "Amount");
                drawFinancialLineChart(_.sortBy(_.sortBy(results, 'name').reverse(), 'name'));
            });
            
            
            /**
             * Multi-Select Re-Event Bind
             */
            
            // multiselect close when other multiselect open
            $(".select-pure__select").on('click', function () {
                $(".select-pure__select").removeClass("select-pure__select--opened");
                $(this).addClass("select-pure__select--opened");
            });
            
            // arrow key event
            $('.select-pure__autocomplete').on('keyup', function(e) {
                let key = e.keyCode;
                let $this = $(this);
                
                if (!$this.val()) {
                    $this.siblings().css('background-color','');
                    $('.select-pure__options').css('max-height', '161px');
                    return;
                }
                
                let ix = $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').index();
                let firstIx = $(this).siblings('div:not(".select-pure__option--hidden"):first').index();
                let lastIx = $(this).siblings('div:not(".select-pure__option--hidden"):last').index();
                let height = $(this).siblings('div:not(".select-pure__option--hidden"):first').outerHeight(true);
                
                if (lastIx - firstIx >= 3) {
                    $('.select-pure__options').css('max-height', (height * (lastIx - firstIx)) + (height * 2) + 'px');
                } else {
                    $('.select-pure__options').css('max-height', '161px');
                }
                
                if (key === 38) { // up
                    $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').prev().css('background-color','#f5f9f9');
                    $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').next().css('background-color','');
                } else if (key === 40) { // down
                    if (ix === -1) {
                        $(this).siblings('div:not(".select-pure__option--hidden"):first').css('background-color','#f5f9f9');
                    } else {
                        $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').next().css('background-color','#f5f9f9');
                        $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').prev().css('background-color','');
                    }
                } else if (key === 13) { // enter
                    $(this).siblings('div[style*="background-color: rgb(245, 249, 249)"]').click();
                    $(this).siblings('div').css('background-color','');
                    let unit = $('.unitOpts').val();
                    
                    if (unit === 'Amount') {
                        changeCurrencySearch();
                    }
                }
                
            }); //arrow key event end
            
        });
        
    }
    
    
    /**
     * 
     */
    function changeCurrencySearch() {
        let periods = getValueFromElement('#period', 'period');
        
        if (_.isEmpty(periods)) {
            global.alert(thisPage.appMsg002);
            return;
        }
        
        let partnerNetworks = getValueFromElement('#partnerNetwork', 'partnerNetwork');
        
        if (_.isEmpty(partnerNetworks)) {
            global.alert(thisPage.appMsg003);
            return;
        }
        
        let callTypes = getValueFromElement('#callType', 'callType');
        
        if (_.isEmpty(callTypes)) {
            global.alert(thisPage.appMsg004);
            return;
        }
        
        let unit = $('.unitOpts').val();
        let direction = $('.contTypeOpts').val();
        let currency = getValueFromElement('#curCurrency', 'currency');
        
        let params = {};
        params.periods = periods;
        params.partnerNetworks = partnerNetworks;
        params.callTypes = callTypes;
        params.unit = unit;
        params.direction = direction;
        params.currency = currency;
        
        let url = _CTX + "fch/findSalesInfo";
        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
            let results = response['data'];
            drawSalesInfoTable(_.sortBy(results, 'name').reverse(), unit);
            drawFinancialLineChart(_.sortBy(results, 'name').reverse());
        });
        
    }
    
    
    /**
     * multi auto-complete selectbox
     */
    function initAutoCompleteMultiSelectbox(element, options, values, dataName) {
        // set init value
        $(element).empty();
        $(element).html('<span>Partner Network</span>');
        let allPartnerNetworks = _COMMON_CODES['partnerNetworks'].map(rcvPlmn => rcvPlmn.cdId);
        
        if (values.includes('APN')) {
            $(element).data(dataName, allPartnerNetworks);
        } else {
            $(element).data(dataName, values);
        }
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: values,
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function onChange(value) {
                
                if (value.includes('APN') && value[0] !== 'APN') {
                    let newDefaults = ['APN'];
                    initAutoCompleteMultiSelectbox(element, options, newDefaults, dataName);
                    $(element).data(dataName, allPartnerNetworks);
                } 
                
                else if (value.includes('APN') && value[0] === 'APN') {
                    let newDefaults = value.filter(p => p !== 'APN');
                    $(element).data(dataName, newDefaults);
                    initAutoCompleteMultiSelectbox(element, options, newDefaults, dataName);
                }
                
                else {
                    $(element).data(dataName, value);
                }
                
            }
        });
        
        return sp;
        
    }
    
    
    /**
     * multi selectbox
     */
    function initMultiSelectbox(element, options, values, dataName) {
        // set init value
        $(element).empty();
        if (element === '#period') {
            $(element).html('<span>Period</span>');
        } else if (element === '#callType') {
            $(element).html('<span>Call Type</span>');
        }
        $(element).data(dataName, values);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: values,
            multiple: true,
            autocomplete: false,
            icon: "fa fa-times",
            onChange: function onChange(value) {
                   
                if (value.includes('ASVC') && value[0] !== 'ASVC') {
                    let newDefaults = ['ASVC'];
                    $(element).data(dataName, newDefaults);
                    initMultiSelectbox(element, options, newDefaults, dataName);
                } 
               
                else if (value.includes('ASVC') && value[0] === 'ASVC') {
                    let newDefaults = value.filter(c => c !== 'ASVC');
                    $(element).data(dataName, newDefaults);
                    initMultiSelectbox(element, options, newDefaults, dataName);
                }
               
                else {
                    $(element).data(dataName, value);
                }
               
            }
        });
        
        return sp;
         
    }
    
    
    /**
     * single selectbox
     */
    function initSingleSelectbox(element, selectName, options, selected, withoutEmpty) {
        let selectHtml = '<select class="' + selectName + '">';
        if (!withoutEmpty) {
            selectHtml += '<option value="">Choice</option>';
        }
        options.forEach(elm => {
            if (elm.value === selected) {
                selectHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
            } else {
                selectHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
            }
        });
        selectHtml += '</select>';
        $(document).find(element).append(selectHtml);
    }
    
    
    /**
     * single auto-complete selectbox
     */
    function initAutoCompleteSingleSelectbox(element, options, value, dataName) {
        // set init value
        $(element).data(dataName, value);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: value,
            autocomplete: true,
            onChange: function onChange(value) {
                $(element).data(dataName, value);
            }
        });
        
        return sp;
        
    }
    
    
    /**
     * get data value from element
     */
    function getValueFromElement(element, dataName) {
        return $(element).data(dataName);
    }
    
    
    /**
     * create select Years
     */
    function createSelectorYears(startYear) {
        let currentYear = new Date().getFullYear(), years = [];
        startYear = startYear || 2018;
        while (startYear <= currentYear) {
            years.push(String(startYear++));
        }
        return years;
    }
    
    
    // echart tooltip icon
//    function colorSpan(color){
//        return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>';
//    }
    
    
    /**
     * Draw Line Chart
     */
//    function drawFinancialLineChart(results) {
//        let seriesData = [];
//        let thisYear = parseInt(moment().format('YYYY'), 10);
//        let thisMonth = parseInt(moment().format('M'), 10);
//        let thisMonthNm = moment().format('MMM');
//        
//        let salesYear = _.pluck(results, 'name');
//        let thisYearData = results.find(d => {
//            if (d.name == thisYear) {
//                return d.data;
//            }
//        });
//        
//        let thisMonthisSale = 0;
//        
//        if (thisYearData) {
//            
//            let thisYearSale = thisYearData.data;
//            thisMonthisSale = thisYearSale[thisMonth -1];
//            
//            let tmpSale = thisYearSale.slice(thisMonth - 1);
//            
//            thisYearSale.fill(null, thisMonth);
//            
//            let forecastSale = Array(thisMonth - 1).fill(null);
//            forecastSale = forecastSale.concat(tmpSale);
//            
//            let currentSale = {};
//            currentSale.name = thisYear.toString();
//            currentSale.data = thisYearSale;
//            currentSale.type = 'line';
//            
//            let forecast = {};
//            forecast.data = forecastSale;
//            forecast.type = 'line';
//            forecast.lineStyle = {
//                type: 'dashed',
//                color: 'grey'
//            }
//            
//            seriesData.push(currentSale);
//            seriesData.push(forecast);
//            
//        }
//        
//        let otherYearSale = results.filter(d => d.name != thisYear);
//        otherYearSale = otherYearSale.map(function(d) {
//            d.type = 'line';
//            return d;
//        });
//        
//        if (!_.isEmpty(otherYearSale)) {
//            otherYearSale.forEach(d => seriesData.push(d));
//        }
//        
//        let option = {
//                
//            title: {
//                text: ''
//            },
//            tooltip: {
//                
//                trigger: 'axis',
//                
//                formatter:function(params, ticket, callback) {
//                    
//                    let res = '<p>' + params[0].name  + '</p>';
//                    let iconColors = [];
//                    
//                    for (let i = 0, l = params.length; i < l; i++) {
//                        let icon = colorSpan(params[i].color);
//                        iconColors.push(icon);
//                    }
//                    
//                    // re-render tooltip
//                    for (let i = 0, l = params.length; i < l; i++) {
//                        
//                        if (params[i].value) {
//                            
//                            if (Number.isInteger(parseInt(params[i].seriesName)) && params[i].value) {
//                                res += '<p>' + colorSpan(params[i].color) + ' ' + params[i].seriesName + ' : ' + $.decimalFormat(params[i].value, _PRECISION) + '</p>';
//                            } else if (!Number.isInteger(parseInt(params[i].seriesName)) && params[i].value) {
//                                res += '<p>' + iconColors[0] + ' ' + thisYear + ' : ' + $.decimalFormat(params[i].value, _PRECISION) + '</p>';
//                            }
//                            
//                        } else {
//                            
//                            if (Number.isInteger(parseInt(params[i].seriesName)) && params[i].value === 0) {
//                                res += '<p>' + colorSpan(params[i].color) + ' ' + params[i].seriesName + ' : ' + $.decimalFormat(0, _PRECISION) + '</p>';
//                            }
//                            
//                            if (!Number.isInteger(parseInt(params[i].seriesName)) && params[i].value === 0) {
//                                res += '<p>' + iconColors[0] + ' ' + thisYear + ' : ' + $.decimalFormat(0, _PRECISION) + '</p>';
//                            } 
//                            
//                        }
//                        
//                    }
//                    
//                    // remove duplicated tooltip if month were current month
//                    let duplicatedTooltip = '<p>' + iconColors[0] + ' ' + thisYear + ' : ' + $.decimalFormat(thisMonthisSale, _PRECISION) + '</p>';
//                    
//                    if (params[0].name === thisMonthNm) {
//                        res = res.replace(duplicatedTooltip, '');
//                    }
//                    
//                    return res;
//                }
//            
//            },
//            legend: {
//                data: salesYear // set Y
//            },
//            grid: {
//                left: '3%',
//                right: '4%',
//                bottom: '3%',
//                containLabel: true
//            },
//            toolbox: {
//                feature: {
//                    saveAsImage: {}
//                }
//            },
//            xAxis: {
//                type: 'category',
//                boundaryGap: false,
//                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//            },
//            yAxis: {
//                type: 'value'
//            },
//            
//            series: seriesData // set real data here
//        }
//        
//        echarts.init(document.getElementById("salesChart")).setOption(option, true);
//        
//    }
    
    
    
    /**
     * sales line chart
     */
    function drawFinancialLineChart(results) {
        $('.tui-chart.tui-line-chart').remove();
        let container = document.getElementById('salesChart');
        
        let curMon = moment().format('M');
        let series = [];
        
        _.each(results, function(v, k) {
            
            let year = v['name'];
            let dat = _.map(v['data']);
            
            if (year == moment().year()) {
                let pdat = _.map(dat, function(v,k) {
                    return k < curMon ? v : null;
                });
                series.push({name : year, data: pdat});
                
                if (curMon != '12') {
                    let ndat = _.map(dat, function(v,k) {
                        return k >= (curMon -1) ? v : null;
                    });
                    series.push({name : year + ' ' + thisPage.appMsg001, data: ndat});
                }
                
            } else {
                series.push({name : year, data: dat});
            }
        })
        
                
        let data = {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: series
        };
        
        let options = {
            chart: {
                width: 1200,
                height: 280,
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
                grouped : false,
                template: function(category, item, categoryTimeStamp){
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
    
    
    // get formatted sales
    function getFormatedSales(data, unit) {
        return unit === "Amount" && $.decimalFormat(data, _PRECISION) || $.numberFormat(data);
    }
    
    
    // ativate tooltip
    function activateTooltip(data, unit) {
        return (unit === "Amount" && $.decimalFormat(data, _PRECISION) || $.numberFormat(data)).length >= 10 && ('title="' + getFormatedSales(data, unit) + '"') || '';
    }
    
    
    /**
     * Create Sales Table
     */
    function drawSalesInfoTable(results, unit) {
        let html = '';
        
        results.forEach(result => {
            let total = result.data.reduce((a, b) => a + b, 0);
            
            html += '<tr>';
            html += '<td>' + result.name + '</td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[0], unit) + '>' + getFormatedSales(result.data[0], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[1], unit) + '>' + getFormatedSales(result.data[1], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[2], unit) + '>' + getFormatedSales(result.data[2], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[3], unit) + '>' + getFormatedSales(result.data[3], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[4], unit) + '>' + getFormatedSales(result.data[4], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[5], unit) + '>' + getFormatedSales(result.data[5], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[6], unit) + '>' + getFormatedSales(result.data[6], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[7], unit) + '>' + getFormatedSales(result.data[7], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[8], unit) + '>' + getFormatedSales(result.data[8], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[9], unit) + '>' + getFormatedSales(result.data[9], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[10], unit) + '>' + getFormatedSales(result.data[10], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(result.data[11], unit) + '>' + getFormatedSales(result.data[11], unit) + '</span></td>';
            html += '<td class="right"><span class="truncate active" data-toggle="tooltip"' + activateTooltip(total, unit) + '>' + getFormatedSales(total, unit) + '</span></td>';
            html += '</tr>';
            
        })
        
        $('#sales').html(html);
        
        // set gray color on forecast td of this year sales
        if (!_.isEmpty(results)) {
            let thisYear = parseInt(moment().format('YYYY'), 10);
            let thisMonth = parseInt(moment().format('M'), 10);
            let firstYear = $(document).find('#sales').find('tr:eq(0)').find('td:eq(0)').text();
            let $thisYearSales = $(document).find('#sales').find('tr:eq(0)').find('td.right');
            let total = $thisYearSales.length;
            
            if (firstYear == thisYear) {
                $thisYearSales.each(function(i) {
                    if (i >= thisMonth - 1 && i !== total -1 ) {
                        $(this).css('background-color', '#d3d3d3');
                    }
                });
            }
            
        }
        
        $('[data-toggle="tooltip"]').tooltip();
        
    }
    
    
    /**
     * module event handlers
     */
    const thisModuleEventHandlers = function() {
        
        /**
         * find sales info
         */
        $('#searchSalesInfo').on('click', function(e) {
            
            let periods = getValueFromElement('#period', 'period');
            
            if (_.isEmpty(periods)) {
                global.alert(thisPage.appMsg002);
                return;
            }
            
            let partnerNetworks = getValueFromElement('#partnerNetwork', 'partnerNetwork');
            
            if (_.isEmpty(partnerNetworks)) {
                global.alert(thisPage.appMsg003);
                return;
            }
            
            let callTypes = getValueFromElement('#callType', 'callType');
            
            if (_.isEmpty(callTypes)) {
                global.alert(thisPage.appMsg004);
                return;
            }
            
            let unit = $('.unitOpts').val();
            let direction = $('.contTypeOpts').val();
            let currency = getValueFromElement('#curCurrency', 'currency');
            
            let params = {};
            params.periods = periods;
            params.partnerNetworks = partnerNetworks;
            params.callTypes = callTypes;
            params.unit = unit;
            params.direction = direction;
            params.currency = currency;
            
            let url = _CTX + "fch/findSalesInfo";
            $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
                let results = response['data'];
                drawSalesInfoTable(_.sortBy(results, 'name').reverse(), unit);
                drawFinancialLineChart(_.sortBy(results, 'name').reverse());
            });
            
        });
        
        
    }; // end of event handlers
    

    // page initializer
    const thisModuleInitializr = function() {
        alertReturnMessage();
        findCommonCodes();
    };
    
    // dom ready
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    });

})(window, jQuery, moment, thisPage);

