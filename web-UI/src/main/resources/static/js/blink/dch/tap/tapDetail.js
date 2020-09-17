(function(global, $, _, _m, thisPage) {
    
    /**
     * define local consts or variables
     */
    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    const _LINK_INFO = thisPage.listLinkInfo;
    let _COMMON_CODES = {};
    let _TABLE = null;
    let _PRECISION = 2;
    let _BTN_SEARCH = "LINK";
    let _PRE_TOTAL = 0;
    
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
            let callTypeCodes = res.data.callTypeCodes;
            
            // 1. myNetwork plmn selectbox
            let defaultMyNetworks = _LINK_INFO && [_LINK_INFO.trmPlmnId] || myNetworks.map(myNetwork => myNetwork.cdId);
            let myNetworkOption = myNetworks.map(function(myNetwork) {
                return { label : myNetwork.cdVal1, value : myNetwork.cdId }
            });
            
            initMultiSelectbox('#myNetwork', myNetworkOption, defaultMyNetworks, 'myNetwork');
            
            // 2. receiver plmn selectbox
            let defaultPartnerNetwork = _LINK_INFO && [_LINK_INFO.rcvPlmnId] || [];
            let partnerNetworkOption = partnerNetworks.map(function(partnerNetwork) {
                return { label : partnerNetwork.cdVal1, value : partnerNetwork.cdId }
            });
            
            initAutoCompleteMultiSelectbox('#partnerNetwork', partnerNetworkOption, defaultPartnerNetwork, 'partnerNetwork');
            
            // 3. Tap Direction selectbox
            let tapDirectionCodes = res.data['tapDirectionCodes'];
            let defaultDirection = _LINK_INFO && _LINK_INFO.tapDirection || 'TAP-Out';
            let tapDrectionOption = tapDirectionCodes.map(function(tapDirectionCode) {
                return { label : tapDirectionCode.cdVal1.substring(0, tapDirectionCode.cdVal1.indexOf('(')), value : tapDirectionCode.cdId }
            });
            
            initSingleSelectbox('#tapDirection', 'tapDrectionOpts', tapDrectionOption, defaultDirection, true);
            
            // 4. currency
            let currencyCodes = res.data['currencyCodes'];
            let defaultCurrency = 'SDR';
            let currencyOption = currencyCodes.map(function(currencyCode) {
                return { label : currencyCode.cdVal1, value : currencyCode.cdId }
            });
            
            initAutoCompleteSingleSelectbox('#curCurrency', currencyOption, defaultCurrency, 'currency');
            
            // 5. callType
//            let defaultCallType = 'ASVC';
//            let callTypeCodes = res.data['callTypeCodes'];
//            let callTypeCodeOption = callTypeCodes.map(function(callTypeCode) {
//                return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
//                //return { label : callTypeCode.cdVal1, value : callTypeCode.cdVal1 }
//            });
//            
//            initSingleSelectbox('#callType', 'callTypeOpts', callTypeCodeOption, defaultCallType, true);
            
            
            // 5. callType
            let defaultCallTypeCodes = ['ASVC'];
            let callTypeCodeOption = callTypeCodes.map(callTypeCode => ({ label : callTypeCode.cdVal1, value : callTypeCode.cdId }));
            callTypeCodeOption = _.sortBy(callTypeCodeOption, 'label');
            
            initMultiSelectbox('#callType', callTypeCodeOption, defaultCallTypeCodes, 'callType');
            
            // 6. Tap Detail Search Date Range Condition
            let tapDtlSrchDateCondCodes = res.data['tapDtlSrchDateCondCodes'];
            
            let defaultDtlSrchDateCond = 'CRTDT';
            let tapDtlSrchDateCondOption = tapDtlSrchDateCondCodes.map(function(tapDtlSrchDateCondCode) {
                return { label : tapDtlSrchDateCondCode.cdVal1, value : tapDtlSrchDateCondCode.cdId }
            });
            
            initSingleSelectbox('#tapDtlSrchDateCond', 'tapDtlSrchDateCondOpts', tapDtlSrchDateCondOption, defaultDtlSrchDateCond, true);
            
            
            // 7. decimalPrecision
            _PRECISION = res.data.listPrecision.cdVal1;
            
            
            // 8. init datepicker
            let searchRange = res.data.searchRange.cdVal1;
            createSearchStartDatepicker(searchRange);
            createSearchEndDatepicker(searchRange);
            initContractCalendarDate();
            
            // Start DataTables immediately in case TAP List Link cliked
            _LINK_INFO && drawTapDetailGrid().draw();
            
            
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
            onChange: function (value) {
                $(element).data(dataName, value);
            }
        });
        
        return sp;
        
    }
    
    
    // create multi select box
    function initMultiSelectbox(element, options, values, dataName) {
        // set init value
        $(element).empty();
        if (element === '#callType') {
            $(element).html('<span>Call Type</span>');
        } else if (element === '#myNetwork') {
            $(element).html('<span>My Network</span>');
        }
        $(element).data(dataName, values);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: values,
            multiple: true,
            autocomplete: false,
            icon: "fa fa-times",
            onChange: function (value) {
                
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
                    _BTN_SEARCH = "BTN"; // button search (full search)
                    _TABLE && _TABLE.draw() || drawTapDetailGrid().draw();
                    _BTN_SEARCH = "SCR"; // scroll search
                }
            }
        });
        
        return sp;
        
    }
    
    
    function getValueFromElement(element, dataName) {
        return $(element).data(dataName);
    }
    
    
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
    
    
    // set start date (start of month)
    function setSearchStartDate(element) {
        $(element).data('datepicker').selectDate(_LINK_INFO && _m(_LINK_INFO.fileCretDtVal, ['YYYY-MM-DD']).toDate() 
                || _m().startOf('month').toDate());
    }
    
    
    // set end date (today)
    function setSearchEndDate(element) {
        $(element).data('datepicker').selectDate(_LINK_INFO && _m(_LINK_INFO.fileCretDtVal, ['YYYY-MM-DD']).toDate() 
                || _m().toDate());
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
                    //$('#searchStartDate').data('datepicker').selectDate(_m().startOf('month').toDate());
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
     * draw Tab Detail Grid Table
     */
    function drawTapDetailGrid() {
        
        _TABLE = $('#dataTables').DataTable({
            orderCellsTop: false,
            fixedHeader: true,
            colReorder: false,
            orderMulti: false,
            serverSide: true,
            paging: true,
            pageLength: 20,
            scrollCollapse: true,
            deferLoading: 0,
            scrollX: true,
            scrollY: 540,
            order: [[0, 'desc'], [1, 'desc']], // multi column ordering
            dom: 'tp',
            ajax: {
                url: _CTX + "dch/tap/tapDetail/findTapDetail",
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
                        
                        // tapDtlSrchDateCond
                        let dateSearchCond = $(document).find('.tapDtlSrchDateCondOpts').val();
                        
                        if(column.data === 'dateSearchCond') {
                            column.search.value = dateSearchCond;
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
                        
                        // imsiId
                        let imsiId = $('#imsiId').val();
                        
                        if(column.data === 'imsiId') {
                            column.search.value = imsiId;
                        }
                        
                        // roamFileName
                        let roamFileNm = $('#roamFileNm').val();
                        
                        if(column.data === 'roamFileNm') {
                            column.search.value = roamFileNm;
                        }
                        
                        // callType
                        let callTypes = getValueFromElement('#callType', 'callType')
                            && getValueFromElement('#callType', 'callType').join(',');
                        
                        if(column.data === 'callTypes' && callTypes) {
                            column.search.value = callTypes;
                        }
                        
                        // buttion search
                        let btnSearch = _BTN_SEARCH;
                        
                        if(column.data === 'btnSearch') {
                            column.search.value = btnSearch;
                        }
                        
                        // total count
                        let preTotal = _PRE_TOTAL;
                        
                        if(column.data === 'preTotal') {
                            column.search.value = preTotal;
                        }
                        
                    }
                    
                    return JSON.stringify(data);
                },
                // ajax finished
                dataSrc: function(json) {
                    _BTN_SEARCH = "SCR";
                    return json.data;
                }
            },
            
            // define columns attributes
            columns: [
                /** Grid Member Params **/
                { data: "roamFileNm" }, // TAP file name
                { data: "localTime" }, // call start time
                { data: "hpmn", sortable: false }, // hpmn
                { data: "vpmn", sortable: false }, // vpmn
                { data: "tapDirection", sortable: false }, 
                { data: "recdNo", sortable: false }, // recdNo
                { data: "imsiId", sortable: false }, // imsi
                { data: "callType", sortable: false }, // callType
                { data: "calledNo", sortable: false }, // calledNo
                { data: "volumn", sortable: false }, // volumn
                { data: "unit", sortable: false }, // unit
                { data: "charge", sortable: false }, // charge
                { data: "setlCharge", sortable: false }, // setlCharge
                /** Query Only Params **/
                { data: "dateSearchCond", visible: false }, // date search cond
                { data: "trmPlmnId", visible: false }, // MyNetwork
                { data: "rcvPlmnId", visible: false }, // PartnerNetwork
                { data: "currency", visible: false }, // currency
                { data: "startDate", visible: false }, // Search Start Date
                { data: "endDate", visible: false }, // Search End Date
                { data: "btnSearch", visible: false }, // button Search
                { data: "callTypes", visible: false }, // callTypes
                { data: "preTotal", visible: false } // Pre Total
            ],
            
            // additional column rendering of uppper columns 
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 5, 6], // tapFileNm ~ imsiId
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: 7, // callType
                    //className: "right",
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: [8, 10], // called No, unit
                    //className: "right",
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: 9, // volume
                    className: "right",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                },
                {
                    targets: [11, 12], // decimal values (charge, setl charge)
                    //className: "right",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.decimalFormat(data, _PRECISION) + '">' + $.decimalFormat(data, _PRECISION) + '</div>';
                    }
                }
            ],
            
            footerCallback : function(tfoot, data, start, end, display) {
                //let api = this.api();
                //let $footer = $(api.table().footer());
                
                if (!_.isEmpty(data)) {
                    _PRE_TOTAL = data[0].preTotal || 0;
                    //$footer.find('td:eq(1)').html($.decimalFormat(data[0].sumCharge, _PRECISION));
                    //$footer.find('td:eq(2)').html($.decimalFormat(data[0].sumSetlCharge, _PRECISION));
                    //data[0].sumCharge && $('#sumCharge').html('<span class="ellipsis" title="' + $.decimalFormat(data[0].sumCharge, _PRECISION) + '">' + $.decimalFormat(data[0].sumCharge, _PRECISION) + '</span>');
                    //data[0].sumSetlCharge && $('#sumSetlCharge').html('<span class="ellipsis" title="' + $.decimalFormat(data[0].sumSetlCharge, _PRECISION) + '">' + $.decimalFormat(data[0].sumSetlCharge, _PRECISION) + '</span>');
                } else {
                    //$footer.find('td.sum').html(0);
                    //$('span.sum').html(0);
                }
            }
            
        }); // end of tapList DataTables
        
        return _TABLE;
        
    } // end of draw TabList function
    
    
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
            return;
        }
        
        let callTypes = getValueFromElement('#callType', 'callType');
        
        if (_.isEmpty(callTypes)) {
            global.alert(thisPage.appMsg008);
            return;
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
        $('#searchTapDetail').on('click', function (e) {
            if (!validateSearchForm()) {
                return;
            }
            // start dataTables
            _BTN_SEARCH = "BTN";
            _PRE_TOTAL = 0;
            _TABLE && _TABLE.draw() || drawTapDetailGrid().draw();
            _BTN_SEARCH = "SCR";
        });
        
        
        // Number Only
        $(document).on('keypress', '.numberOnly', function(e) {
            let regex = /^[0-9]*$/;
            let charCode = e.which || e.keyCode;
            let str = e.key || String.fromCharCode(charCode);
            if (regex.test(str)) {
                return true;
            }
            return false;
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
            downloadTapDetailExcel();
        });
        
        
        /**
         * FileNm Search
         */
        $('#roamFileNm').on('keypress', function(e) {
            if (e.which === 13) {
                _BTN_SEARCH = "BTN";
                _PRE_TOTAL = 0;
                _TABLE && _TABLE.draw() || drawTapDetailGrid().draw();
                _BTN_SEARCH = "SCR";
            }
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
