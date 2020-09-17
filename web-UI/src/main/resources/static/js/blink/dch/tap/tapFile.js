(function(global, $, _, _m, thisPage) {
    
    /**
     * define local consts or variables
     */
    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    let _COMMON_CODES = {};
    let _TABLE = null;
    
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
            let defaultMyNetworks = myNetworks.map(myNetwork => myNetwork.cdId);
            let myNetworkOption = myNetworks.map(function(myNetwork) {
                return { label : myNetwork.cdVal1, value : myNetwork.cdId }
            });
            
            initMultiSelectbox('#myNetwork', myNetworkOption, defaultMyNetworks, 'myNetwork');
            
            // 2. receiver plmn selectbox
            let defaultPartnerNetwork = [];
            let partnerNetworkOption = partnerNetworks.map(function(partnerNetwork) {
                return { label : partnerNetwork.cdVal1, value : partnerNetwork.cdId }
            });
            
            initAutoCompleteMultiSelectbox('#partnerNetwork', partnerNetworkOption, defaultPartnerNetwork, 'partnerNetwork');
            
            // 3. File Search Date Range Condition
            let tapFileSrchDateCondCodes = res.data['tapFileSrchDateCondCodes'];
            
            let defaultFileSrchDateCond = 'CRTDT';
            let tapFileSrchDateCondOption = tapFileSrchDateCondCodes.map(function(tapFileSrchDateCondCode) {
                return { label : tapFileSrchDateCondCode.cdVal1, value : tapFileSrchDateCondCode.cdId }
            });
            
            initSingleSelectbox('#tapFileSrchDateCond', 'tapFileSrchDateCondOpts', tapFileSrchDateCondOption, defaultFileSrchDateCond, true);
            
            // 4. File Processed Status
            let tapFileTrtSttusCodes = res.data['tapFileTrtSttusCodes'];
            tapFileTrtSttusCodes = _.unique(tapFileTrtSttusCodes, 'cdVal1');
            
            let defaultTapFileTrtSttus = '';
            let tapFileTrtSttusOption = tapFileTrtSttusCodes.map(function(tapFileTrtSttusCode) {
                return { label : tapFileTrtSttusCode.cdVal1, value : tapFileTrtSttusCode.cdId }
            });
            
            let all = { label : 'All', value: '' };
            tapFileTrtSttusOption.splice(0, 0, all);
            
            initSingleSelectbox('#tapFileTrtSttus', 'tapFileTrtSttusOpts', tapFileTrtSttusOption, defaultTapFileTrtSttus, true);
            
            
            // 5. Tap Direction selectbox
            let tapDirectionCodes = res.data['tapDirectionCodes'];
            let defaultDirection = 'TAP-Out';
            let tapDrectionOption = tapDirectionCodes.map(function(tapDirectionCode) {
                return { label : tapDirectionCode.cdVal1, value : tapDirectionCode.cdId }
            });
            
            initSingleSelectbox('#tapDirection', 'tapDrectionOpts', tapDrectionOption, defaultDirection, true);
            
            // multiselect close when other multiselect open
            $(".select-pure__select").on('click', function () {
                $(".select-pure__select").removeClass("select-pure__select--opened");
                $(this).addClass("select-pure__select--opened");
            });
            
            
            /**
             * Multi-Select Re-Event Bind
             */
            
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
            
            // init datepicker
            createSearchStartDatepicker();
            createSearchEndDatepicker();
            createSearchSettleMonthDatepicker();
            initContractCalendarDate();
            
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
    
    
    // set settle month
    function setSearchSettleMonth(element) {
        $(element).data('datepicker').selectDate(_m().toDate());
    }
    
    // set start date (start of month)
    function setSearchStartDate(element) {
        $(element).data('datepicker').selectDate(_m().startOf('month').toDate());
    }
    
    
    // set end date (today)
    function setSearchEndDate(element) {
        $(element).data('datepicker').selectDate(_m().toDate());
    }
    
    
    // init calendar date
    function initContractCalendarDate() {
        setSearchSettleMonth('#searchSettleMonth'); // search settle month
        //setSearchStartDate('#searchStartDate'); // search start day
        //setSearchEndDate('#searchEndDate'); // search end day
    }
    
 
    function createSearchSettleMonthDatepicker() {
        
        $('#searchSettleMonth').datepicker({
            dateFormat: "yyyy-mm",
            closeButton: true,
            maxDate: new Date(),
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                // Do nothing if selection was cleared
                if (!date) {
                    return;
                }
                
                $('#searchStartDate').data('datepicker').clear();
                $('#searchEndDate').data('datepicker').clear();
                $('#searchStartDate').data('datepicker').selectDate(_m(date).startOf('month').toDate());
                $('#searchEndDate').data('datepicker').selectDate(_m(date).endOf('month').toDate());
                
            }
            
        });
        
    }
    

    function createSearchStartDatepicker() {
        
        $('#searchStartDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            //maxDate: new Date(),
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                // Do nothing if selection was cleared
                if (!date) {
                    return;
                }
                
                // Trigger only if date is changed
                let startDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                let endDate = _m($('#searchEndDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                let settleMonth = _m($('#searchSettleMonth').val(), ["YYYY-MM-DD HH:mm:ss"]);
                
                if (!endDate.isValid()) {
                    return;
                }
                
                if (endDate.isValid() && startDate.isAfter(endDate)) {
                    global.alert(thisPage.appMsg001);
                    picker.clear();
                    $('#searchEndDate').data('datepicker').clear();
                    picker.selectDate(_m(settleMonth).startOf('month').toDate());
                    $('#searchEndDate').data('datepicker').selectDate(_m(date).endOf('month').toDate());
                }
                
            }
            
        });
        
    }
    

    function createSearchEndDatepicker() {
        
        $('#searchEndDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            //maxDate: new Date(),
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                // Do nothing if selection was cleared
                if (!date) {
                    return;
                }
                
                // Trigger only if date is changed
                let startDate = _m($('#searchStartDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                let endDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                let settleMonth = _m($('#searchSettleMonth').val(), ["YYYY-MM-DD HH:mm:ss"]);
                
                if (!startDate.isValid()) {
                    return;
                }
                
                if (startDate.isValid() && endDate.isBefore(startDate)) {
                    global.alert(thisPage.appMsg004);
                    $('#searchStartDate').data('datepicker').clear();
                    picker.clear();
                    $('#searchStartDate').data('datepicker').selectDate(_m(date).startOf('month').toDate());
                    picker.selectDate(_m(settleMonth).endOf('month').toDate());
                }
                
            }
        
        });
        
    }
    
    
    /**
     * draw Tab Detail Grid Table
     */
    function drawTapFileGrid() {
        
        _TABLE = $('#dataTables').DataTable({
            orderCellsTop : true,
            orderMulti: false,
            fixedHeader : true,
            serverSide : true,
            deferRender: true,
            info: false,
            deferLoading: 0,
            scrollY: 450,
            scrollX: true,
            scrollCollapse: true,
            scroller: {
                displayBuffer: 20
            },
            order: [[0, 'desc'], [3, 'asc']], // multi column ordering
            dom: 'ts',
            ajax: {
                url: _CTX + "dch/tap/tapFile/findTapFile",
                // before ajax request set specific search parameters
                data: function (data) {
                    
                    // request params of columns
                    for (let col in data.columns) {
                        
                        let column = data.columns[col];
                        
                        // setlMonth
                        let setlMonth = $(document).find('#searchSettleMonth').val();
                        
                        if(column.data === 'setlMonth' && setlMonth) {
                            column.search.value = setlMonth;
                        }
                        
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
                        
                        // tapFileSrchDateCond
                        let dateSearchCond = $(document).find('.tapFileSrchDateCondOpts').val();
                        
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
                        
                        // fileTrtSttusCd
                        let trtSttusCd = $(document).find('.tapFileTrtSttusOpts').val();
                        
                        if(column.data === 'trtSttusCd') {
                            column.search.value = trtSttusCd;
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
                { data: "inptFileNm" }, // TAP file name
                { data: "trmPlmnId" }, // trmPlmnId
                { data: "rcvPlmnId" }, // rcvPlmnId
                { data: "fileCretDtVal" }, // TAP file create date
                { data: "trtFnsDt" }, // TAP file process date
                { data: "tapDirection", sortable: false }, 
                { data: "trtSttusCd", sortable: false }, // TAP file process status
                { data: "setlMonth", sortable: false }, // settle month
                { data: "totCdrCnt", sortable: false }, // total TAP file record count
                { data: "cdrCnt", sortable: false }, // normal TAP file record count
                { data: "errCnt", sortable: false }, // error TAP file record count
                /** Query Only Params **/
                { data: "dateSearchCond", visible: false }, // date search cond
                { data: "startDate", visible: false }, // Search Start Date
                { data: "endDate", visible: false } // Search End Date
            ],
            
            // additional column rendering of uppper columns 
            columnDefs: [
                {
                    targets: [0, 1, 2, 5, 6, 7], // tapFileNm ~ imsiId
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: [3, 4], // create, process date
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.dateFormat(data, 'D') + '">' + $.dateFormat(data, 'D') + '</div>';
                    }
                },
                {
                    targets: [8, 9, 10], // volume
                    className: "right",
                    render: function (data, type, row, meta) {
                        return '<div class="ellipsis" title="' + $.numberFormat(data) + '">' + $.numberFormat(data) + '</div>';
                    }
                }
            ],
            
            footerCallback : function(tfoot, data, start, end, display) {
                //let api = this.api();
                //let $footer = $(api.table().footer());
                
                if (!_.isEmpty(data)) {
                    //$footer.find('td:eq(1)').html($.numberFormat(data[0].sumTotCdrCnt));
                    //$footer.find('td:eq(2)').html($.numberFormat(data[0].sumCdrCnt));
                    //$footer.find('td:eq(3)').html($.numberFormat(data[0].sumErrCnt));
                    data[0].sumTotCdrCnt && $('#sumTotCdrCnt').html('<span class="ellipsis" title="' + $.numberFormat(data[0].sumTotCdrCnt) + '">' + $.numberFormat(data[0].sumTotCdrCnt) + '</span>');
                    data[0].sumCdrCnt && $('#sumCdrCnt').html('<span class="ellipsis" title="' + $.numberFormat(data[0].sumCdrCnt) + '">' + $.numberFormat(data[0].sumCdrCnt) + '</span>');
                    data[0].sumErrCnt && $('#sumErrCnt').html('<span class="ellipsis" title="' + $.numberFormat(data[0].sumErrCnt) + '">' + $.numberFormat(data[0].sumErrCnt) + '</span>');
                } else {
                    //$footer.find('td.sum').html(0);
                    $('span.sum').html(0);
                }
                
            }
            
            
        }); // end of tapList DataTables
        
        
        return _TABLE;
        
    } // end of draw TabList function
    
    
    /**
     * Excel Download
     */
    function downloadTapFileExcel() {
        let url = _CTX + "dch/tap/tapFile/downloadTapFileExcel";
        let order = _TABLE.order();
        let orderSequel = generateColumnsOrderSequel(order);
        
        // setlMonth
        let setlMonth = $(document).find('#searchSettleMonth').val();
        
        // trmPlmnId(MyNetwork)
        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork')
            && getValueFromElement('#myNetwork', 'myNetwork').join(',');
        
        // rcvPlmnId(PatnerNetwork)
        let partnerNetwork = getValueFromElement('#partnerNetwork', 'partnerNetwork')
            && getValueFromElement('#partnerNetwork', 'partnerNetwork').join(',');
        
        // tapFileSrchDateCond
        let dateSearchCond = $(document).find('.tapFileSrchDateCondOpts').val();
        
        // Search Start Date
        let startDate = _m($(document).find('#searchStartDate').val(), ["YYYY/MM/DD HH:mm:ss"]).format('YYYY-MM-DD HH:mm:ss');
        
        // Search End Date
        let endDate = _m($(document).find('#searchEndDate').val(), ["YYYY/MM/DD HH:mm:ss"]).format('YYYY-MM-DD HH:mm:ss');
        
        // Tap File Direction (TAP-In, TAP-Out)
        let tapDirection = $(document).find('.tapDrectionOpts').val();
        
        // fileTrtSttusCd
        let trtSttusCd = $(document).find('.tapFileTrtSttusOpts').val();
        
        $('<form action="' + url + '" method="POST"></form>')
        .append('<input type="hidden" name="setlMonth" value="' + setlMonth + '" />')
        .append('<input type="hidden" name="trmPlmnId" value="' + myNetwork + '" />')
        .append('<input type="hidden" name="rcvPlmnId" value="' + partnerNetwork + '" />')
        .append('<input type="hidden" name="dateSearchCond" value="' + dateSearchCond + '" />')
        .append('<input type="hidden" name="startDate" value="' + startDate + '" />')
        .append('<input type="hidden" name="endDate" value="' + endDate + '" />')
        .append('<input type="hidden" name="tapDirection" value="' + tapDirection + '" />')
        .append('<input type="hidden" name="trtSttusCd" value="' + trtSttusCd + '" />')
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
        
        let setlMonth = $(document).find('#searchSettleMonth').val();
        if (!setlMonth) {
            global.alert(thisPage.appMsg008);
            return false;
        }
        
        let startDate = $(document).find('#searchStartDate').val();
        if (!startDate) {
            global.alert(thisPage.appMsg005)
            return false;
        }
        
        let endDate = $(document).find('#searchEndDate').val();
        if (!endDate) {
            global.alert(thisPage.appMsg006)
            return false;
        }
        
        // trmPlmnId(MyNetwork)
        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork')
            && getValueFromElement('#myNetwork', 'myNetwork').join(',');
        
        if (!myNetwork) {
            global.alert(thisPage.appMsg007)
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
        $('#searchTapFile').on('click', function (e) {
            if (!validateSearchForm()) {
               return;
            }
            // start dataTables
            _TABLE && _TABLE.draw() || drawTapFileGrid().draw();
        });
        
        
        /**
         * Tap File Excel Down
         */
        $('#excelDown').on('click', function(e) {
            e.preventDefault();
            if (!$('#results').find('tr').length) {
                global.alert("Result does not exist.");
                return;
            }
            downloadTapFileExcel();
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
