(function(global, $, _, _m, thisPage) {
    
    /**
     * define local consts or variables
     */
    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    const _NOTE = thisPage.note;
    let _COMMON_CODES = {};
    let _TABLE = null;
    let _PRECISION = 2;

    /**
     * define module functions
     */

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
            let myNetworks = res.data['myNetworks'];
            let partnerNetworks = res.data['partnerNetworks'];
            
            // 1. myNetwork plmn selectbox
            let defaultMyNetworks = _NOTE && [_NOTE.trmPlmnId] || myNetworks.map(myNetwork => myNetwork.cdId);
            let myNetworkOption = myNetworks.map(function(myNetwork) {
                return { label : myNetwork.cdVal1, value : myNetwork.cdId }
            });
            
            initMultiSelectbox('#myNetwork', myNetworkOption, defaultMyNetworks, 'myNetwork');
            
            // 2. receiver plmn selectbox
            let defaultPartnerNetwork = _NOTE && [_NOTE.rcvPlmnId] || [];
            let partnerNetworkOption = partnerNetworks.map(function(partnerNetwork) {
                return { label : partnerNetwork.cdVal1, value : partnerNetwork.cdId }
            });
            
            initAutoCompleteMultiSelectbox('#partnerNetwork', partnerNetworkOption, defaultPartnerNetwork, 'partnerNetwork');
            
            // 3. Tap Direction selectbox
            let tapDirectionCodes = res.data['tapDirectionCodes'];
            
            let defaultDirection = _NOTE && _NOTE.tapDirection || 'TAP-Out';
            let tapDrectionOption = tapDirectionCodes.map(function(tapDirectionCode) {
                return { label : tapDirectionCode.cdVal1, value : tapDirectionCode.cdId }
            });
            
            initSingleSelectbox('#tapDirection', 'tapDrectionOpts', tapDrectionOption, defaultDirection, true)
            
            // 4. currency
            let currencyCodes = res.data['currencyCodes'];
            let defaultCurrency = 'SDR';
            let currencyOption = currencyCodes.map(function(currencyCode) {
                return { label : currencyCode.cdVal1, value : currencyCode.cdId }
            });
            
            initAutoCompleteSingleSelectbox('#curCurrency', currencyOption, defaultCurrency, 'currency');
            
            // 5. decimalPrecision
            _PRECISION = res.data.listPrecision.cdVal1;
            
            // 6. init datepicker
            let searchRange = res.data.searchRange.cdVal1;
            createSearchStartDatepicker(searchRange);
            createSearchEndDatepicker(searchRange);
            initContractCalendarDate();
            
            // note link -> tap list
            _NOTE && drawTapListGrid().draw();
            
            
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
                
                if (key === 38) { //up
                    $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').prev().css('background-color','#f5f9f9');
                    $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').next().css('background-color','');
                } else if (key === 40) { //down
                    if (ix === -1) {
                        $(this).siblings('div:not(".select-pure__option--hidden"):first').css('background-color','#f5f9f9');
                    } else {
                        $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').next().css('background-color','#f5f9f9');
                        $(this).siblings('div:not(".select-pure__option--hidden")[style*="background-color: rgb(245, 249, 249)"]').prev().css('background-color','');
                    }
                } else if (key === 13) { //enter
                    $(this).siblings('div[style*="background-color: rgb(245, 249, 249)"]').click();
                    $(this).siblings('div').css('background-color','');
                }
                
            }); //arrow key event end
            
            
        });
        
    }
    
    
    // create auto detected multi select box
    function initAutoCompleteMultiSelectbox(element, options, values, dataName) {
        // set init value
        $(element).data(dataName, values);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: values,
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: function(value) {
                $(element).data(dataName, value);
            }
        });
        
        return sp;
        
    }
    
    
    // create multi select box
    function initMultiSelectbox(element, options, values, dataName) {
        // set init value
        $(element).data(dataName, values);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: values,
            multiple: true,
            autocomplete: false,
            icon: "fa fa-times",
            onChange: function(value) {
                $(element).data(dataName, value);
            }
        });
        
        return sp;
        
    }
    
    function initAutoCompleteSingleSelectbox(element, options, value, dataName) {
        // set init value
        $(element).data(dataName, value);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: value,
            autocomplete: true,
            onChange: function (value) {
                // value to data tag
                $(element).data(dataName, value);
                if (dataName === 'currency') {
                    _TABLE && _TABLE.draw() || drawTapListGrid().draw();
                }
            }
        });
        
        return sp;
        
    }
    
    
    function getValueFromElement(element, dataName) {
        return $(element).data(dataName);
    }
    

    function initSingleSelectbox(element, selectName, options, selected, withoutEmpty = false) {
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
    
    
    // set start date (start of month)
    function setSearchStartDate(element) {
        $(element).data('datepicker').selectDate(_NOTE && _m(_NOTE.startDate, ["YYYY-MM-DD"]).toDate() || _m().startOf('month').toDate());
    }
    
    
    // set end date (today)
    function setSearchEndDate(element) {
        $(element).data('datepicker').selectDate(_NOTE && _m(_NOTE.endDate, ["YYYY-MM-DD"]).toDate() || _m().toDate());
    }
    
    
    // init calendar date
    function initContractCalendarDate() {
        setSearchStartDate('#searchStartDate'); // search start day
        setSearchEndDate('#searchEndDate'); // search end day
    }
    
    function createSearchStartDatepicker(searchRange) {
        
        $('#searchStartDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            maxDate: new Date(),
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                
                // Do nothing if selection was cleared
                if (!date) {
                    return;
                }
                // Trigger only if date is changed
                let startDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                let endDate = _m($('#searchEndDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                
                if (!endDate.isValid()) {
                    return;
                }
                
                if (endDate.isValid() && startDate.isAfter(endDate)) {
                    global.alert(thisPage.appMsg001);
                    picker.clear();
                    //$('#searchEndDate').data('datepicker').clear();
                    //picker.selectDate(_m().startOf('month').toDate());
                    //$('#searchEndDate').data('datepicker').selectDate(new Date());
                }
                
                let diff = endDate.diff(startDate, 'days');
                
                if (diff > parseInt(searchRange, 10)) {
                    //let sixtyDaysBefore = endDate.subtract(60, 'days');
                    //picker.clear();
                    //picker.selectDate(sixtyDaysBefore.toDate());
                    let sixtyDaysAfter = startDate.add(60, 'days');
                    global.alert(`${thisPage.appMsg002} ${searchRange} ${thisPage.appMsg003}`);
                    $('#searchEndDate').data('datepicker').clear();
                    $('#searchEndDate').data('datepicker').selectDate(sixtyDaysAfter.toDate());
                }
            }
            
        });
        
    }
    
    function createSearchEndDatepicker(searchRange) {
        
        $('#searchEndDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            maxDate: new Date(),
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                
                // Do nothing if selection was cleared
                if (!date) {
                    return;
                }
                
                // Trigger only if date is changed
                let startDate = _m($('#searchStartDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                let endDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                
                if (!startDate.isValid()) {
                    return;
                }
                
                if (startDate.isValid() && endDate.isBefore(startDate)) {
                    global.alert(thisPage.appMsg004);
                    //$('#searchStartDate').data('datepicker').clear();
                    picker.clear();
                    //$('#searchStartDate').data('datepicker').selectDate(_m(date).startOf('month').toDate());
                    //picker.selectDate(new Date());
                }
                
                let diff = endDate.diff(startDate, 'days');
                
                if (diff > parseInt(searchRange, 10)) {
                    //let sixtyDaysAfter = startDate.add(60, 'days');
                    //picker.clear();
                    //picker.selectDate(sixtyDaysAfter.toDate());
                    global.alert(`${thisPage.appMsg002} ${searchRange} ${thisPage.appMsg003}`);
                    let sixtyDaysBefore = endDate.subtract(60, 'days');
                    $('#searchStartDate').data('datepicker').clear();
                    $('#searchStartDate').data('datepicker').selectDate(sixtyDaysBefore.toDate());
                }
                
            }
        
        });
        
    }
    
    
    /**
     * draw Tab List Grid Table
     */
    function drawTapListGrid() {
        
        _TABLE = $('#dataTables').DataTable({
            orderCellsTop : true,
            orderMulti: false,
            fixedHeader : true,
            serverSide : true,
            scrollY : 450,
            scrollX : true,
            info : false,
            scrollCollapse : true,
            scroller: {
                displayBuffer: 20
            },
            order : [[0, 'desc']],
            dom: 'ts',
            deferRender: true,
            deferLoading : 0,
            ajax: {
                url: _CTX + "dch/tap/tapList/findTapList",
                // before ajax request set specific search parameters
                data: function (data) {
                    
                    // request params of columns
                    for (let col in data.columns) {
                        
                        let column = data.columns[col];
                        
                        // trmPlmnId(MyNetwork)
                        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork')
                            && getValueFromElement('#myNetwork', 'myNetwork').join(',');
                        
                        if(column.data === 'trmPlmnId' && myNetwork) {
                            column.search.value = myNetwork;
                        }
                        
                        // rcvPlmnId(PatnerNetwork)
                        let partnerNetwork = getValueFromElement('#partnerNetwork', 'partnerNetwork')
                            && getValueFromElement('#partnerNetwork', 'partnerNetwork').join(',');
                        
                        if (!partnerNetwork) {
                            let partnerNetworks = _COMMON_CODES['partnerNetworks'];
                            partnerNetwork = partnerNetworks.map(function(partnerNetwork) {
                                return partnerNetwork.cdId;
                            }).join(',');
                        }
                        
                        if(column.data === 'rcvPlmnId' && partnerNetwork) {
                            column.search.value = partnerNetwork;
                        }
                        
                        // Search Start Date
                        let startDate = $(document).find('#searchStartDate').val();
                        
                        if(column.data === 'startDate' && startDate) {
                            column.search.value = startDate;
                        }
                        
                        // Search End Date
                        let endDate = $(document).find('#searchEndDate').val();
                        
                        if(column.data === 'endDate' && endDate) {
                            column.search.value = endDate;
                        }
                        
                        // Tap File Direction (TAP-In, TAP-Out)
                        let tapDirection = $(document).find('.tapDrectionOpts').val();
                        
                        if(column.data === 'tapDirection') {
                            column.search.value = tapDirection;
                        }
                        
                        // Currency
                        let currency = getValueFromElement('#curCurrency', 'currency');
                        
                        if(column.data === 'currency') {
                            column.search.value = currency;
                        }
                        
                    }
                    
                    return JSON.stringify(data);
                },
                // ajax finished
                dataSrc: function(json) {
                    return json.data;
                }
            },
            
            // define columns attributes
            columns: [
                /** Grid Member Params **/
                { data: "fileCretDateVal" }, // file created date
                { data: "trmPlmnId" }, // myNetwork
                { data: "rcvPlmnId" }, // partnerNetwork
                { data: "tapDirection", sortable: false }, 
                { data: "tapSeq", sortable: false }, 
                { data: "totalRecdCnt", sortable: false }, 
                { data: "totalCalcAmt", sortable: false }, 
                { data: "mocVoRecdCnt", sortable: false }, 
                { data: "mocVoUseQnt", sortable: false }, 
                { data: "mocVoCalcAmt", sortable: false }, 
                { data: "mtcVoRecdCnt", sortable: false }, 
                { data: "mtcVoUseQnt", sortable: false }, 
                { data: "mtcVoCalcAmt", sortable: false }, 
                { data: "dataRecdCnt", sortable: false }, 
                { data: "dataUseQnt", sortable: false }, 
                { data: "dataCalcAmt", sortable: false }, 
                { data: "smsRecdCnt", sortable: false }, 
                { data: "smsCalcAmt", sortable: false }, 
                /** Query Only Params **/
                { data: "currency", visible: false }, // currency
                { data: "startDate", visible: false }, // Search Start Date
                { data: "endDate", visible: false }, // Search End Date
                { data: "btnSearch", visible: false } // button Search
            ],
            
            // additional column rendering of uppper columns 
            columnDefs: [
                {
                    targets: 0, // create date
                    className: "center",
                    render: function (data, type, row, meta) {
                        return data && '<a href="javascript:;" class="tapDetail">' + data + '</a>' || '-';
                    }
                },
                {
                    targets: [1, 2, 3], // my plmn & partner plmn & direction
                    className: "center",
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: 4, // sequence
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: 5, // total records
                    className: "total",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                },
                {
                    targets: 6, // total gross
                    className: "total",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.decimalFormat(data, _PRECISION) + '">' + $.decimalFormat(data, _PRECISION) + '</div>';
                    }
                },
                
                {
                    targets: [7, 8], // moc records, duration
                    className: "moc",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                },
                {
                    targets: 9, // moc gross
                    className: "moc",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.decimalFormat(data, _PRECISION) + '">' + $.decimalFormat(data, _PRECISION) + '</div>';
                    }
                },
                {
                    targets: [10, 11], // mtc records, duration
                    className: "mtc",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                },
                {
                    targets: 12, // mtc gross
                    className: "mtc",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.decimalFormat(data, _PRECISION) + '">' + $.decimalFormat(data, _PRECISION) + '</div>';
                    }
                },
                {
                    targets: [13, 14], // data records, duration
                    className: "data",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                },
                {
                    targets: 15, // data gross
                    className: "data",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.decimalFormat(data, _PRECISION) + '">' + $.decimalFormat(data, _PRECISION) + '</div>';
                    }
                },
                {
                    targets: 16, // sms records
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                },
                {
                    targets: 17, // sms gross
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.decimalFormat(data, _PRECISION) + '">' + $.decimalFormat(data, _PRECISION) + '</div>';
                    }
                }
                
            ],
            
            // row created callback
            createdRow : function(row, data, index) {
                $(row).data('trmPlmnId', data.trmPlmnId);
                $(row).data('rcvPlmnId', data.rcvPlmnId);
                $(row).data('fileCretDateVal', data.fileCretDateVal);
                $(row).data('tapDirection', data.tapDirection);
            },
            
            // footer
            footerCallback : function(tfoot, data, start, end, display) {
                let api = this.api();
                let $footer = $(api.table().footer());
                
                if (!_.isEmpty(data)) {
                    // TOTAL
                    $footer.find('td:eq(1)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumRecdTotal) + '">' + $.numberFormat(data[0].sumRecdTotal) + '</div>');
                    $footer.find('td:eq(2)').html('<div class="ellipsis" title="' + $.decimalFormat(data[0].sumAmtTotal, _PRECISION) + '">' + $.decimalFormat(data[0].sumAmtTotal, _PRECISION) + '</div>');
                    // MOC
                    $footer.find('td:eq(3)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumRecdMoc) + '">' + $.numberFormat(data[0].sumRecdMoc) + '</div>');
                    $footer.find('td:eq(4)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumUseMoc) + '">' + $.numberFormat(data[0].sumUseMoc) + '</div>');
                    $footer.find('td:eq(5)').html('<div class="ellipsis" title="' + $.decimalFormat(data[0].sumAmtMoc, _PRECISION) + '">' + $.decimalFormat(data[0].sumAmtMoc, _PRECISION) + '</div>');
                    // MTC
                    $footer.find('td:eq(6)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumRecdMtc) + '">' + $.numberFormat(data[0].sumRecdMtc) + '</div>');
                    $footer.find('td:eq(7)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumUseMtc) + '">' + $.numberFormat(data[0].sumUseMtc) + '</div>');
                    $footer.find('td:eq(8)').html('<div class="ellipsis" title="' + $.decimalFormat(data[0].sumAmtMtc, _PRECISION) + '">' + $.decimalFormat(data[0].sumAmtMtc, _PRECISION) + '</div>');
                    // DATA
                    $footer.find('td:eq(9)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumRecdData) + '">' + $.numberFormat(data[0].sumRecdData) + '</div>');
                    $footer.find('td:eq(10)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumUseData) + '">' + $.numberFormat(data[0].sumUseData) + '</div>');
                    $footer.find('td:eq(11)').html('<div class="ellipsis" title="' + $.decimalFormat(data[0].sumAmtData, _PRECISION) + '">' + $.decimalFormat(data[0].sumAmtData, _PRECISION) + '</div>');
                    // SMS
                    $footer.find('td:eq(12)').html('<div class="ellipsis" title="' + $.numberFormat(data[0].sumRecdSms) + '">' + $.numberFormat(data[0].sumRecdSms) + '</div>');
                    $footer.find('td:eq(13)').html('<div class="ellipsis" title="' + $.decimalFormat(data[0].sumAmtSms, _PRECISION) + '">' + $.decimalFormat(data[0].sumAmtSms, _PRECISION) + '</div>');
                    
                } else {
                    $('td.sum').html(0);
                }
                
            }
            ,drawCallback : function(settings) {
                $('.dataTables_scrollFootInner, .dataTables_scrollHeadInner').css('padding-right', '17px');
            }
            
        }); // end of tapList DataTables
        
        return _TABLE;
        
    } // end of draw TabList function
    
    
    /**
     * Excel Download
     */
    function downloadTapListExcel() {
        let url = _CTX + "dch/tap/tapList/downloadTapListExcel";
        let order = _TABLE.order();
        let orderSequel = generateColumnsOrderSequel(order);
        
        // trmPlmnId(MyNetwork)
        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork')
            && getValueFromElement('#myNetwork', 'myNetwork').join(',');
        
        // rcvPlmnId(PatnerNetwork)
        let partnerNetwork = getValueFromElement('#partnerNetwork', 'partnerNetwork')
            && getValueFromElement('#partnerNetwork', 'partnerNetwork').join(',');
        
        // Search Start Date
        let startDate = _m($(document).find('#searchStartDate').val(), ["YYYY/MM/DD HH:mm:ss"]).format('YYYY-MM-DD HH:mm:ss');
        
        // Search End Date
        let endDate = _m($(document).find('#searchEndDate').val(), ["YYYY/MM/DD HH:mm:ss"]).format('YYYY-MM-DD HH:mm:ss');
        
        // Tap File Direction (TAP-In, TAP-Out)
        let tapDirection = $(document).find('.tapDrectionOpts').val();
        
        // Currency
        let currency = getValueFromElement('#curCurrency', 'currency');
        
        $('<form action="' + url + '" method="POST"></form>')
        .append('<input type="hidden" name="trmPlmnId" value="' + myNetwork + '" />')
        .append('<input type="hidden" name="rcvPlmnId" value="' + partnerNetwork + '" />')
        .append('<input type="hidden" name="startDate" value="' + startDate + '" />')
        .append('<input type="hidden" name="endDate" value="' + endDate + '" />')
        .append('<input type="hidden" name="tapDirection" value="' + tapDirection + '" />')
        .append('<input type="hidden" name="currency" value="' + currency + '" />')
        .append('<input type="hidden" name="orderSequel" value="' + orderSequel + '" />')
        .appendTo('body')
        .submit()
        .remove();
        
    }
    
    
    /**
     * orderSequel
     */
    function generateColumnsOrderSequel(orders) {
        let orderSequel = '';
        orders.forEach((o, i, arr) => {
            if (i === arr.length - 1) {
                orderSequel += (o[0] + 2) + ' '  + o[1];
            } else {
                orderSequel += (o[0] + 2) + ' '  + o[1] + ', ';
            }
        });
        return orderSequel;
    }
    
    
    /**
     * search form validation
     */
    function validateSearchForm() {
        
        let startDate = $(document).find('#searchStartDate').val();
        if (!startDate) {
            global.alert(thisPage.appMsg005);
            return false;
        }
        
        let endDate = $(document).find('#searchEndDate').val();
        if (!endDate) {
            global.alert(thisPage.appMsg006);
            return false;
        }
        
        // trmPlmnId(MyNetwork)
        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork')
            && getValueFromElement('#myNetwork', 'myNetwork').join(',');
        
        if (!myNetwork) {
            global.alert(thisPage.appMsg007);
            return false;
        }
        
        return true;
        
    }
    
    
    /**
     * define event handlers
     */
    const thisModuleEventHandlers = function() {
        
        /**
         * datepicker icon click event
         */
        $(document).on('click', '.calendar', function() {
            $(this).prev('input').focus();
        });
        
        
        /**
         * search event
         */
        $('#searchTapList').on('click', function (e) {
            if (!validateSearchForm()) {
                return;
            }
            // start dataTables
            _TABLE && _TABLE.draw() || drawTapListGrid().draw();
            
        });
        
        
        /**
         * go to TAP detail page
         */
        $(document).on('click', '.tapDetail', function(e) {
            let trmPlmnId = $(this).closest('tr').data('trmPlmnId');
            let rcvPlmnId = $(this).closest('tr').data('rcvPlmnId');
            let fileCretDateVal = $(this).closest('tr').data('fileCretDateVal');
            let tapDirection = $(this).closest('tr').data('tapDirection');
            let url = _CTX + 'dch/tap/tapDetail';
            
            $('<form action="' + url + '" method="post"></form>')
            .append('<input type="hidden" name="trmPlmnId" value="' + trmPlmnId + '" />')
            .append('<input type="hidden" name="rcvPlmnId" value="' + rcvPlmnId + '" />')
            .append('<input type="hidden" name="fileCretDtVal" value="' + fileCretDateVal + '" />')
            .append('<input type="hidden" name="tapDirection" value="' + tapDirection + '" />')
            .appendTo('body')
            .submit()
            .remove();
        });
        
        
        /**
         * Tap List Excel Down
         */
        $('#excelDown').on('click', function(e) {
            e.preventDefault();
            if (!$('#results').find('tr').length) {
                global.alert("Result does not exist.");
                return;
            }
            downloadTapListExcel();
        });
        
        
    }; // end of event handlers
    
    
    /**
     * define page initial functions
     */
    const thisModuleInitializr = function() {
        alertReturnMessage();
        findCommonCodes();
    }; // end of module Initializr
    
    
    /**
     * jQuery DOM Ready
     */
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    }); // end of jquery DOM ready
    
})(window, jQuery, _, moment, thisPage);
