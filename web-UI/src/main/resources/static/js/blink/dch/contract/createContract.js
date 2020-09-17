(function(global, $, _, _m, thisPage) {
    
    /**
     * define module global variables
     */
    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    const _USERNAME = thisPage.username;
    const _BTN_ROLE = thisPage.btnRole;
    let _MSZI = 99;
    let _COMMON_CODES = {};
    let _TMP_SPCL_ID = '';
    let _BAS_CALL_TYPES = [];
    let _DATE_PICKER_INIT = false;
    
    /**
     * Contract Domain
     */
    let _CONT_MSTR_DOMAIN = new ContMstr(); 
    let _CONT_DTL_DOMAIN = new ContDtl(); 
    
    /**
     * define module functions
     */
    
    // alert init message
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
            let contTypeCodes = res.data['contTypeCodes'];
            let contAutoUpdYnCodes = res.data['contAutoUpdYnCodes'];
            let currencyCodes = res.data['currencyCodes'];
            let excludeCallTypeCodes = res.data['excludeCallTypeCodes'];
            //let addFeeTypeCodes = res.data['addFeeTypeCodes'];
            let callTypeCodes = res.data['callTypeCodes'];
            // let unitCodes = res.data['unitCodes'];
            let specialModeCodes = res.data['specialModeCodes'];
            let taxAplyTypeCodes = res.data['taxAplyTypeCodes'];
            //let thrsTypeCodes = res.data['thrsTypeCodes']; // Change Rate, Fixed Charge ...
            // Do you wanna input past contract? (Y or N)
            let allowPastCont = res.data.allowPastCont.cdVal1;
            
            // 1. myNetwork plmn selectbox
            let defaultNetworks = myNetworks.map(myNetwork => myNetwork.cdId);
            let myNetworkOption = myNetworks.map(function(myNetwork) {
                return { label : myNetwork.cdVal1, value : myNetwork.cdId }
            });
            
            initMultiSelectbox('#myNetwork', myNetworkOption, defaultNetworks, 'myNetwork');
            
            // 2. receiver plmn selectbox
            let partnerNetworkOption = partnerNetworks.map(function(partnerNetwork) {
                return { label : partnerNetwork.cdVal1, value : partnerNetwork.cdId }
            });
            
            initAutoCompleteMultiSelectbox('#partnerNetwork', partnerNetworkOption, [], 'partnerNetwork');
            
            // 3. contType selectbox
            let defaultContType = 'IOBR';
            let contTypeOption = contTypeCodes.map(function(contTypeCode) {
                return { label : contTypeCode.cdVal1, value : contTypeCode.cdId }
            });
            
            initSingleSelectbox('#contType', 'contTypeOpts', contTypeOption, defaultContType, true)
            
            // 4. contAutoUpdYn selectbox
            let defaultAutoUpdYnOption = 'AUY'; // contract auto yes
            let contAutoUpdYnOption = contAutoUpdYnCodes.map(function(contAutoUpdYnCode) {
                return { label : contAutoUpdYnCode.cdVal1, value : contAutoUpdYnCode.cdId }
            });
            
            initSingleSelectbox('#contAutoUpdYn', 'contAutoUpdYnOpts', contAutoUpdYnOption, defaultAutoUpdYnOption, true);
            
            // 5. currency  & fixAmtCur codes selectbox with auto detect
            let defaultCurrency = 'SDR'
            let currencyOption = currencyCodes.map(function(currencyCode) {
                return { label : currencyCode.cdVal1, value : currencyCode.cdId }
            });
            
            initAutoCompleteSingleSelectbox('#currency', currencyOption, defaultCurrency, 'currency');
            initAutoCompleteSingleSelectbox('#fixAmtCur', currencyOption, defaultCurrency, 'fixAmtCur');
            
            // 6. tax appliation type
            let defaultTaxAplyType = 'EXC'; // excluded
            let taxAplyTypeOption = taxAplyTypeCodes.map(function(taxAplyTypeCode) {
                return { label : taxAplyTypeCode.cdVal1, value : taxAplyTypeCode.cdId }
            });
            
            initSingleSelectbox('#taxAplyType', 'taxAplyTypeOpts', taxAplyTypeOption, defaultTaxAplyType, true);
            
            // 7. excluded calls 
            let excludeCallTypeOption = excludeCallTypeCodes.map(function(excludeCallTypeCode) {
                return { label : excludeCallTypeCode.cdVal1, value : excludeCallTypeCode.cdId }
            });
            
            let defaultExcludeCall = excludeCallTypeOption.map(function(option) {
                return option.value;
            });
            
            initMultiSelectbox('#excludeCalls', excludeCallTypeOption, defaultExcludeCall, 'excludeCalls');
            
            // 8. callType
            let defaultCallType = '';
            let callTypeCodeOption = callTypeCodes.filter(function(callTypeCode) {
                return callTypeCode.cdId !== 'ASVC';
            }).map(function(callTypeCode) {
                return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
            });
            callTypeCodeOption = _.sortBy(callTypeCodeOption, 'label');
            
            initSingleSelectbox('#callType', 'callTypeOpts', callTypeCodeOption, defaultCallType);
            initSingleSelectbox('#callType2', 'callTypeOpts', callTypeCodeOption, defaultCallType);
            
            // 9. unit (dependent on callType, so not rendering here)
            let defaultUnitType = '';
            //let unitCodeOption = unitCodes.map(function(unitCode) {
            //    return { label : unitCode.cdVal1, value : unitCode.cdId }
            //});
            initSingleSelectbox('#unit', 'unitOpts', [], defaultUnitType);
            
            // 10. additional fee type
            let defaultAddFeeType = '';
            //let addFeeTypeOption = addFeeTypeCodes.map(function(addFeeTypeCode) {
            //    return { label : addFeeTypeCode.cdVal1, value : addFeeTypeCode.cdId }
            //});
            initSingleSelectbox('#addFeeType', 'addFeeTypeOpts', [], defaultAddFeeType);
            
            // 11. special model
            let defaultSepcialMode = '';
            let specialModeOption = specialModeCodes.map(function(specialModeCode) {
                return { label : specialModeCode.cdVal1, value : specialModeCode.cdId }
            });
            
            initSingleSelectbox('#specialModel', 'specialModelOpts', specialModeOption, defaultSepcialMode);
            
            
            /**
             * init datepicker
             */
            createContractStartDatepicker(allowPastCont);
            createContractEndDatepicker();
            createContractEndNotiDatepicker();
            createSpclCondFixRateTabDatepicker();
            createSpclCondNotiDateTabDatepicker();
            initContractCalendarDate();
            _DATE_PICKER_INIT = true;
            
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
        
    } // end of findContractPlmns
    

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
               onChange: function onChange(value) {
                   $(element).data(dataName, value);
               }
        });
        
        return sp;
         
    }
    

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
               onChange: function onChange(value) {
                   
                   // special tarif callType
                   if (element.startsWith('#spclCallType-')) {
                       
                       if (value.includes('ASVC') && value[0] !== 'ASVC') {
                           let newDefaults = ['ASVC'];
                           $(element).data(dataName, newDefaults);
                           initMultiSelectbox(element, options, newDefaults, dataName);
                       } else if (value.includes('ASVC') && value[0] === 'ASVC') {
                           let newDefaults = value.filter(c => c !== 'ASVC');
                           $(element).data(dataName, newDefaults);
                           initMultiSelectbox(element, options, newDefaults, dataName);
                       } else {
                           $(element).data(dataName, value);
                       }
                       
                   } else {
                       $(element).data(dataName, value);
                   }
                   
               }
        });
        
        return sp;
         
    }
    

    function initAutoCompleteSingleSelectbox(element, options, value, dataName) {
        $(element).empty();
        $(element).html('<span>Currency</span>');
        
        // set init value
        $(element).data(dataName, value);
        // render selectbox
        let sp = new SelectPure(element, {
            options: options,
            value: value,
            autocomplete: true,
            onChange: function onChange(value) {
                
                if (element === '#currency') {
                    
                    let $spclUnitOpts = $(document).find('.spclUnitOpts');
                    
                    // unit(stelUnit)
                    let unitCodes = _COMMON_CODES['unitCodes'];
                    let unitCodeOption = unitCodes.map(function(unitCode) {
                        return { label : unitCode.cdVal1, value : unitCode.cdId }
                    });
                    
                    // push changed currency
                    unitCodeOption.push( { label: value, value : value } );
                    
                    // spclUnitHtml
                    let    spclUnitHtml = '<option value="">Choice</option>';
                        
                    unitCodeOption.forEach(elm => {
                        if (elm.value === value) {
                            spclUnitHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
                        } else {
                            spclUnitHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
                        }
                    });
                    
                    // change selectbox
                    $spclUnitOpts.html(spclUnitHtml);
                    
                }
                
                // value to data tag
                $(element).data(dataName, value);
                
            }
        });
        
        return sp;
        
    }
    

    function initSingleSelectbox(element, selectName, options, selected, withoutEmpty = false) {
        if (element === '#callType') $(element).empty();
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
     * get data value from element
     */
    function getValueFromElement(element, dataName) {
        return $(element).data(dataName);
    }
    

    function validMinimumContractSubmit() {
        
        /** CONTRACT AGREEMENT **/
        // myNetwork
        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork').join(',');
        
        if (!myNetwork) {
            global.alert(thisPage.appMsg001);
            return false;
        }
        
        // partnerNetwork
        let partnerNetwork = getValueFromElement('#partnerNetwork', 'partnerNetwork').join(',');
        
        if (!partnerNetwork) {
            global.alert(thisPage.appMsg002);
            return false;
        }
        
        // contType
        let contTypeCd = $('.contTypeOpts').val();
        
        if (!contTypeCd) {
            global.alert(thisPage.appMsg003);
            return false;
        }
        
        // contractor Id
        let contrId = $('#contrId').val();
        
        if (!contrId) {
            global.alert(thisPage.appMsg004);
            return false;
        }
        
        // cont memo
        //let contMemo = $('#contMemo').val();

        
        /** CONTRACT AGREEMENT **/
        
        /** CONTRACT DETAIL **/
        
        // contract start day
        let contStDate = $('#contStDate').val();
        
        if (!contStDate) {
            global.alert(thisPage.appMsg005);
            return false;
        }
        
        // contract end day
        let contExpDate = $('#contExpDate').val();
        
        if (!contExpDate) {
            global.alert(thisPage.appMsg006);
            return false;
        }
        
        // contract end noti day
        let contExpNotiDate = $('#contExpNotiDate').val();
        
        if (!contExpNotiDate) {
            global.alert(thisPage.appMsg007);
            return false;
        }
        
        // auto update
        let contAutoUpdYn= $('.contAutoUpdYnOpts').val();
        
        if (!contAutoUpdYn) {
            global.alert(thisPage.appMsg008);
            return false;
        }
        
        
        /** CONTRACT DETAIL **/
        
        /** CONTRACT DETAIL - IB **/
        // currency
        let contCurCd = getValueFromElement('#currency', 'currency');
        
        if (!contCurCd) {
            global.alert(thisPage.appMsg009);
            return false;
        }
        
        // tax application type
        let taxAplyTypeCd = $('.taxAplyTypeOpts').val();
        
        if (!taxAplyTypeCd) {
            global.alert(thisPage.appMsg010);
            return false;
        }
        
        // tax apply ratio
        let taxAplyPecnt = $('#taxAplyPecnt').val();
        
        if (!taxAplyPecnt) {
            global.alert(thisPage.appMsg011);
            return false;
        }
        
        
        return true;
        
        /** CONTRACT DETAIL - IB **/
    }
    

    function assembleContractDomains(url, contSttusCd = 'WRK') {
        
        // last form validation
        let basCondValid = true;
        let spclCondValid = true;
        
        /** CONTRACT AGREEMENT **/
        // myNetwork
        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork');
        
        // partnerNetwork
        let partnerNetwork = getValueFromElement('#partnerNetwork', 'partnerNetwork');
        
        // contType
        let contTypeCd = $('.contTypeOpts').val();
        
        // contractor Id
        let contrId = $('#contrId').val();
        
        // cont memo
        let contMemo = $('#contMemo').val();
        
        /** CONTRACT AGREEMENT **/
        
        // contract start day
        let contStDate = $('#contStDate').val();
        
        /** CONTRACT DETAIL **/
        // contract end day
        let contExpDate = $('#contExpDate').val();
        
        // contract end noti day
        let contExpNotiDate = $('#contExpNotiDate').val();
        
        // auto update
        let contAutoUpdYn= $('.contAutoUpdYnOpts').val();
        
        // contract detail memo
        let contDtlMemo = $('#contDtlMemo').val();
        /** CONTRACT DETAIL **/
        
        /** CONTRACT DETAIL - IB **/
        // currency
        let contCurCd = getValueFromElement('#currency', 'currency');
        
        // tax application type
        let taxAplyTypeCd = $('.taxAplyTypeOpts').val();
        
        // tax apply ratio
        let taxAplyPecnt = $('#taxAplyPecnt').val();
        
        // exclude call[Satellite, Premium]
        let exceptAplyCall = getValueFromElement('#excludeCalls', 'excludeCalls').join(",");
        
        let sysSvcId = _CTX + 'dch/contract/createContract';
        
        /** CONTRACT DETAIL - IB **/
        
        /** Set Data Of Contract Master(Agreement) **/
        _CONT_MSTR_DOMAIN.trmPlmnIds = myNetwork;
        _CONT_MSTR_DOMAIN.rcvPlmnIds = partnerNetwork;
        _CONT_MSTR_DOMAIN.contTypeCd = contTypeCd;
        _CONT_MSTR_DOMAIN.contrId = contrId;
        _CONT_MSTR_DOMAIN.contMemo = contMemo;
        _CONT_MSTR_DOMAIN.sysTrtrId = _USERNAME;
        _CONT_MSTR_DOMAIN.sysSvcId = url;
        _CONT_MSTR_DOMAIN.contDtls = [];
        
        /** Set Data Of Contract detail(Contract)  **/
        _CONT_DTL_DOMAIN.contStDate = contStDate;
        _CONT_DTL_DOMAIN.contExpDate = contExpDate;
        _CONT_DTL_DOMAIN.contExpNotiDate = contExpNotiDate;
        _CONT_DTL_DOMAIN.contAutoUpdYn = contAutoUpdYn;
        _CONT_DTL_DOMAIN.contDtlMemo = contDtlMemo;
        _CONT_DTL_DOMAIN.contCurCd = contCurCd;
        _CONT_DTL_DOMAIN.contSttusCd = contSttusCd;
        _CONT_DTL_DOMAIN.taxAplyTypeCd = taxAplyTypeCd;
        _CONT_DTL_DOMAIN.taxAplyPecnt = taxAplyPecnt;
        _CONT_DTL_DOMAIN.exceptAplyCall = exceptAplyCall;
        _CONT_DTL_DOMAIN.sysTrtrId = _USERNAME;
        _CONT_DTL_DOMAIN.sysSvcId = sysSvcId;
        
        
        /** Set Data Of Contract Base Tarif **/
        _CONT_DTL_DOMAIN.contBasTarifs.length = 0;
        
        $('#newContBasTarifs').find('tr').each(function() {
            let callTypeCd = $(this).find('td select.callTypeOpts').val();
            
            let stelTarif = $(this).find('td input[name="stelTarif"]').val();
            if (!stelTarif) {
                global.alert(thisPage.appMsg021);
                $(this).closest('tr').find('td input[name="stelTarif"]').focus();
                basCondValid = false;
                return false;
            }
            
            
            let stelVlm = $(this).find('td input[name="stelVolume"]').val();
            
            if (!stelVlm) {
                global.alert(thisPage.appMsg022);
                $(this).closest('tr').find('td input[name="stelVolume"]').focus();
                basCondValid = false;
                return false;
            }
            
            let stelUnit = $(this).find('td select.unitOpts').val();
            let adtnFeeTypeCd = $(this).find('td select.addFeeTypeOpts').val();
            let adtnFeeAmt = $(this).find('td input[name="adtnFeeAmt"]').val();
            
            if (adtnFeeTypeCd === 'CSF' && adtnFeeAmt === '') {
                global.alert(thisPage.appMsg024);
                $(this).closest('tr').find('td input[name="adtnFeeAmt"]').focus();
                basCondValid = false;
                return false;
            }
            
            let taxAply = $(this).find('td input[name="taxAply"]').is(':checked') && 'TAY' || 'TAN';
            
            let contBasTarif = new ContBasTarif();
            contBasTarif.callTypeCd = callTypeCd;
            contBasTarif.stelTarif = stelTarif;
            contBasTarif.stelVlm = stelVlm;
            contBasTarif.stelUnit = stelUnit;
            contBasTarif.adtnFeeTypeCd = adtnFeeTypeCd;
            contBasTarif.adtnFeeAmt = adtnFeeAmt;
            contBasTarif.taxAply = taxAply;
            contBasTarif.sysTrtrId = _USERNAME;
            contBasTarif.sysSvcId = sysSvcId;
            _CONT_DTL_DOMAIN.contBasTarifs.push(contBasTarif);
        
        });

        if (!basCondValid) {
            _CONT_DTL_DOMAIN.contBasTarifs.length = 0;
            return basCondValid;
        }
        
        if (_.isEmpty(_CONT_DTL_DOMAIN.contBasTarifs)) {
            global.alert(thisPage.appMsg012);
            return;
        }
        
        let contSpclTarifs = _CONT_DTL_DOMAIN.contSpclTarifs;

        if (_.isEmpty(contSpclTarifs)) {
            /** Assemble Domain With BaseBasTarif Only **/
            _CONT_MSTR_DOMAIN.contDtls.push(_CONT_DTL_DOMAIN);
            return _CONT_MSTR_DOMAIN;
        }

        let lastContSpclTarifs = [];
        let $spclPanel = $(document).find('div.spcl-panel');
        
        $spclPanel.each(function() {
            
            let $spclConds = $(this).find('tr.spclCond');
            
            $spclConds.each(function() {
            
                if ($(this).attr('id')) {
                    
                    let contSpclTarifId = $(this).attr('id'); 
                    let modelTypeCd = ($(this).find('td input[name="modelTypeCd"]').val() === 'Commitment') && 'CMIT' || 'IMSI'
                    let stepNo = $(this).find('td input[name="stepNo"]').val();
                    // callType
                    let callTypeId = $(this).find('div.spclCallType').attr('id');
                    let callTypes = getValueFromElement('#' + callTypeId, 'spclCallType');
                    
                    if (_.isEmpty(callTypes)) {
                        global.alert(thisPage.appMsg013);
                        spclCondValid = false;
                        return false;
                    }
                    
                    let isAllService = callTypes.find(callType => callType === 'ASVC');
                    let callTypeCd= isAllService || getValueFromElement('#' + callTypeId, 'spclCallType').join(',');
                    let thrsMin = $(this).find('td input[name="thrsMin"]').val();
                    let thrsMax = $(this).find('td input[name="thrsMax"]').val();
                    let thrsUnit = $(this).find('td select.spclUnitOpts').val();
                    
                    if (thrsMin === '') { // allow 0 value
                        global.alert(thisPage.appMsg014);
                        $(this).closest('tr').find('td input[name="thrsMin"]').focus();
                        spclCondValid = false;
                        return false;
                    }
                    
                    if (!thrsMax) {
                        global.alert(thisPage.appMsg015);
                        $(this).closest('tr').find('td input[name="thrsMax"]').focus();
                        spclCondValid = false;
                        return false;
                    }
                    
                    if (parseFloat(thrsMin) >= parseFloat(thrsMax)) {
                        global.alert(thisPage.appMsg016);
                        $(this).closest('tr').find('td input[name="thrsMax"]').focus();
                        spclCondValid = false;
                        return false;
                    }
                    
                    lastContSpclTarifs.push({ contSpclTarifId, modelTypeCd, stepNo, callTypeCd, thrsMin, thrsMax, thrsUnit });
                    
                }
            
            });
            
        });
        

        if (!spclCondValid) {
            _CONT_DTL_DOMAIN.contBasTarifs.length= 0;
            return spclCondValid;
        }
        
        lastContSpclTarifs.forEach(lastContSpclTarif => {
            
            contSpclTarifs.forEach(contSpclTarif => {
                
                if (contSpclTarif.contSpclTarifId === lastContSpclTarif.contSpclTarifId) { // compare with temp SpclCondId
                    
                    contSpclTarif.modelTypeCd = lastContSpclTarif.modelTypeCd;
                    contSpclTarif.stepNo = lastContSpclTarif.stepNo;
                    contSpclTarif.callTypeCd = lastContSpclTarif.callTypeCd;
                    contSpclTarif.thrsMin = lastContSpclTarif.thrsMin;
                    contSpclTarif.thrsMax = lastContSpclTarif.thrsMax;
                    contSpclTarif.thrsUnit = lastContSpclTarif.thrsUnit;
                    contSpclTarif.sysTrtrId = _USERNAME;
                    contSpclTarif.sysSvcId = sysSvcId;
                    
                    let contSpclBasTarifs = contSpclTarif.contSpclBasTarifs;
                    
                    contSpclBasTarifs.forEach(contSpclBasTarif => {
                        contSpclBasTarif.sysTrtrId = _USERNAME;
                        contSpclBasTarif.sysSvcId = sysSvcId;
                    });
                    
                }
                
            });
            
        });
        
        /** Assemble Domain With SpecialBasTarif **/
        _CONT_MSTR_DOMAIN.contDtls.push(_CONT_DTL_DOMAIN);
        return _CONT_MSTR_DOMAIN;
        
    }
    

    function createContractStartDatepicker(allowPastCont) {
        
        // 1. Allow to input past contract
        if (allowPastCont.toUpperCase() === 'Y') {
            
            $('#contStDate').datepicker({
                dateFormat: "yyyy-mm-dd",
                closeButton: true,
                autoClose: true,
                //minDate: _m().add(1, 'd').toDate(),
                onSelect: function (formatDate, date, picker) {
                    // Do nothing if selection was cleared
                    if (!date) return;
                    // Trigger only if date is changed
                    let startDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                    let endDate = _m($('#contExpDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                    
                    if (!endDate.isValid()) return;
                    
                    if (endDate.isValid() && startDate.isSameOrAfter(endDate)) {
                        global.alert(thisPage.appMsg017);
                        picker.clear();
                        //picker.selectDate(endDate.subtract(365, 'd').toDate());
                    }
                    
                    if (_DATE_PICKER_INIT) {
                        let contEndDt = startDate.add(12, 'months').subtract(1, 'days').toDate();
                        let endNotiDt = _m(contEndDt).subtract(2, 'months').toDate();
                        $('#contExpNotiDate').data('datepicker').clear();
                        $('#contExpDate').data('datepicker').clear();
                        $('#contExpDate').data('datepicker').selectDate(contEndDt);
                        $('#contExpNotiDate').data('datepicker').selectDate(endNotiDt);
                        
                    }
                    
                }
            
            });
            
        } else { // 2. DO NOT Allow to input past contract (default)
           
            $('#contStDate').datepicker({
                dateFormat: "yyyy-mm-dd",
                closeButton: true,
                autoClose: true,
                minDate: _m().add(1, 'd').toDate(),
                onSelect: function (formatDate, date, picker) {
                    // Do nothing if selection was cleared
                    if (!date) return;
                    // Trigger only if date is changed
                    let startDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                    let endDate = _m($('#contExpDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                    
                    if (!endDate.isValid()) return;
                    
                    if (endDate.isValid() && startDate.isSameOrAfter(endDate)) {
                        global.alert(thisPage.appMsg017);
                        //picker.clear();
                        picker.selectDate(_m(new Date()).add(1, 'days').toDate());
                    }
                    
                    if (_DATE_PICKER_INIT) {
                        let contEndDt = startDate.add(12, 'months').subtract(1, 'days').toDate();
                        let endNotiDt = _m(contEndDt).subtract(2, 'months').toDate();
                        $('#contExpNotiDate').data('datepicker').clear();
                        $('#contExpDate').data('datepicker').clear();
                        $('#contExpDate').data('datepicker').selectDate(contEndDt);
                        $('#contExpNotiDate').data('datepicker').selectDate(endNotiDt);
                        
                    }
                    
                }
            
            });
            
        }
        
    }
    

    function createContractEndDatepicker() {
        
        $('#contExpDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                
                // Do nothing if selection was cleared
                if (!date) return;
                // Trigger only if date is changed
                let startDate = _m($('#contStDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                let endDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                
                if (!startDate.isValid()) return;
                
                if (startDate.isValid() && endDate.isSameOrBefore(startDate)) {
                    global.alert(thisPage.appMsg018);
                    //picker.clear();
                    picker.selectDate(startDate.add(12, 'months').subtract(1, 'days').toDate());
                }
                
            }
        
        });
        
    }
    

    function createContractEndNotiDatepicker() {
        
        $('#contExpNotiDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                
                // Do nothing if selection was cleared
                if (!date) return;
                
                // Trigger only if date is changed
                let notiDate = _m(formatDate, ["YYYY-MM-DD HH:mm:ss"]); // date
                let startDate = _m($('#contStDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                let endDate = _m($('#contExpDate').val(), ["YYYY-MM-DD HH:mm:ss"]);
                
                if (!startDate.isValid() || !endDate.isValid()) return;
                
                if (notiDate.isValid() && (notiDate.isSameOrBefore(startDate) || notiDate.isSameOrAfter(endDate))) {
                    global.alert(thisPage.appMsg019);
                    //picker.clear();
                    picker.selectDate(endDate.subtract(2, 'months').toDate());
                }
            }
            
        });
        
    }
    

    function createSpclCondFixRateTabDatepicker() {
        
        $('#fixAmtDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                if (!date) return;
            }
        });
    }
    

    function createSpclCondNotiDateTabDatepicker() {
        
        $('#spclNotiDate').datepicker({
            dateFormat: "yyyy-mm-dd",
            closeButton: true,
            autoClose: true,
            onSelect: function (formatDate, date, picker) {
                if (!date) return;
            }
        });
    }
    
    
    // add days from now
    function addDays(days) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    }
    
    
    // set start date
    function setContractStartDate() {
        $('#contStDate').data('datepicker').selectDate(_m(new Date()).add(1, 'days').toDate());
    }
    
    
    // set end date
    function setContractEndDate() {
        $('#contExpDate').data('datepicker').selectDate(_m(new Date()).add(6, 'months').toDate()); // select round image bug fix 
        $('#contExpDate').data('datepicker').selectDate(_m(new Date()).add(12, 'months').toDate());
    }
    
    
    // set end notification date
    function setContractEndNotiDate() {
        $('#contExpNotiDate').data('datepicker').selectDate(_m(new Date()).add(10, 'months').toDate());
    }
    
    
    // set fixed rate settle date
    function setFixedRateDate() {
        $('#fixAmtDate').data('datepicker').selectDate(new Date());
    }
    
    
    // set special cond noti date
    function setSpecialCondNotiDate() {
        $('#spclNotiDate').data('datepicker').selectDate(new Date());
    }
    
    
    // init calendar date
    function initContractCalendarDate() {
        setContractStartDate(); // contract start day
        setContractEndDate(); // contract end day
        setContractEndNotiDate(); // contract end noti day
        setFixedRateDate(); //fixed rate settle day
        setSpecialCondNotiDate(); // special cond noti day
    }
    
    
    // validate CondDtl basTarif
    function validCondDtlBasTarif({ callTypeCd, stelTarif, stelVlm, stelUnit, adtnFeeTypeCd, adtnFeeAmt }) {

        if (!callTypeCd) {
            global.alert(thisPage.appMsg020);
            return false;
        }
        
        if (!stelTarif) {
            global.alert(thisPage.appMsg021);
            $('#stelTarif').focus();
            return false;
        }
        
        if (!stelVlm) {
            global.alert(thisPage.appMsg022);
            $('#stelVolume').focus();
            return false;
        }
        
        if (!stelUnit) {
            global.alert(thisPage.appMsg023);
            return false;
        }
        
        
        if (callTypeCd.startsWith('M') && adtnFeeTypeCd && adtnFeeAmt === '') { // 0 Allow
            global.alert(thisPage.appMsg024);
            $('#adtnFeeAmt').focus();
            return false;
        }
        
        return true;
    
    }
    
    
    // validate SPclCond basTarif (Tab Modal Form)
    function validSpclCondBasTarif(contSpclBasTarif, $this) {
        
        ({ callTypeCd, stelTarif, stelVlm, stelUnit, adtnFeeTypeCd, adtnFeeAmt } = contSpclBasTarif);
        
        if (!callTypeCd) {
            global.alert(thisPage.appMsg020);
            return false;
        }
        
        if (!stelTarif) {
            global.alert(thisPage.appMsg021);
            $this.find('td:eq(1) input').focus();
            return false;
        }
        
        if (!stelVlm) {
            global.alert(thisPage.appMsg022);
            $this.find('td:eq(2) input').focus();
            return false;
        }
        
        if (!stelUnit) {
            global.alert(thisPage.appMsg023);
            return false;
        }
        
        
        if (callTypeCd.startsWith('M') && adtnFeeTypeCd && adtnFeeAmt === '') { // 0 Allow
            global.alert(thisPage.appMsg024);
            $this.find('td:eq(5) input').focus();
            return false;
        }
        
        return true;

    }
    
    
    // TAB Input Value Reset
    function spclCondTabModalFormReset() {
        
        //$('#spclActiveTab').removeData('activeTab');
        $('#spclCondEditModal').siblings().removeClass("on");
        $('#changeRate').addClass("on");
        $('#fixedCharge').removeClass("on");
        $('#specialRule').removeClass("on");
        $('#changeRate').parents(".tab-group").find(".tab-box:not(:eq(0))").removeClass("on");
        $('#changeRate').parents(".tab-group").find(".tab-box:eq(0)").addClass("on");
        
        $('#fixAmt').val('');
        $('#fixAmtDate').data('datepicker').selectDate(new Date());
        
        let currencyCodes = _COMMON_CODES.currencyCodes;
        let defaultCurrency = 'SDR';
        let currencyOption = currencyCodes.map(function(currencyCode) {
            return { label : currencyCode.cdVal1, value : currencyCode.cdId }
        });
        initAutoCompleteSingleSelectbox('#fixAmtCur', currencyOption, defaultCurrency, 'fixAmtCur');
        
        $('#spclMemo').val('');
        $('#spclNotiDate').data('datepicker').selectDate(new Date());
        
    }
    
    
    /**
     * Define event handlers
     */
    const thisModuleEventHandlers = function() {
        
        $('#addContBasDtlTarif').on('click', function(e) {
            // Non Right Role User
            if (_BTN_ROLE === 0 || _BTN_ROLE === 3) return;
            
            let callTypeCd = $(this).closest('tr').find('td select.callTypeOpts').val();
            let stelTarif = $('#stelTarif').val();
            let stelVlm = $('#stelVolume').val();
            let stelUnit = $(this).closest('tr').find('td select.unitOpts').val();
            let adtnFeeTypeCd = $(this).closest('tr').find('td select.addFeeTypeOpts').val();
            let adtnFeeAmt = $('#adtnFeeAmt').val();
            let taxAply = $('#taxAply').is(':checked') && 'TAY' || 'TAN';
            
            // add basTarif validation
            if (!validCondDtlBasTarif({ callTypeCd, stelTarif, stelVlm, stelUnit, adtnFeeTypeCd, adtnFeeAmt })) return;
            
            // create basTarif Model
            let tmpBasTarifId = "basCond-" + Math.random().toString(36).substr(2, 17);
            let contBasTarif = new ContBasTarif(tmpBasTarifId);
            contBasTarif.callTypeCd = callTypeCd;
            contBasTarif.stelTarif = stelTarif;
            contBasTarif.stelVlm = stelVlm;
            contBasTarif.stelUnit = stelUnit;
            contBasTarif.adtnFeeTypeCd = adtnFeeTypeCd;
            contBasTarif.adtnFeeAmt = adtnFeeAmt;
            contBasTarif.taxAply = taxAply;
            
            // set to contDtl Object
            _CONT_DTL_DOMAIN.contBasTarifs.push(contBasTarif);
            
            //add used callTypes
            _BAS_CALL_TYPES.push(callTypeCd);
            
            let basTarifType = 'basTarifCond';
            let basTarifHtml = generateContBasTarifHtml(contBasTarif, _COMMON_CODES, basTarifType, _BAS_CALL_TYPES);
            
            $('#newContBasTarifs').append(basTarifHtml);
            $('#newContBasTarifDiv').show();
            
            // reset ContDltBastTarif form
            $('#contBasTarifs').find('td .callTypeOpts').val('');
            $('#stelTarif').val('');
            $('#stelVolume').val('');
            $('#contBasTarifs').find('td .unitOpts').val('');
            $('#contBasTarifs').find('td .addFeeTypeOpts').val('');
            $('#adtnFeeAmt').val('');
            $('#taxAply').prop('checked', false);
            
        });
        
 
        $(document).on('click','.add-table + .table-box .add-type-button',function(e) {
            let callType = $(this).closest('tr').find('td:eq(0) select').val();
            let tmpBasTarifId = $(this).closest('tr').attr('id');
            let contBasTarifs = _CONT_DTL_DOMAIN.contBasTarifs;
            let contDtlBasTarifIdx = contBasTarifs.findIndex(contBasTarif => contBasTarif.contBasTarifId === tmpBasTarifId); // compare with temp SpclCondId
            if (contDtlBasTarifIdx > -1) contBasTarifs.splice(contDtlBasTarifIdx, 1);
            let basTarifTrs = $(this).parents(".table-box").find("tbody > tr").length;
            if(basTarifTrs <= 1) $(this).parents(".table-box").hide();
            $(this).parent().parent().remove();
            
            _BAS_CALL_TYPES = _BAS_CALL_TYPES.filter(basCallType => basCallType !== callType);
            
            // update callType selector
            const callTypeCodes = _COMMON_CODES['callTypeCodes'];
            let defaultCallType = '';
            let newCallTypeCodeOption = callTypeCodes.filter(function(callTypeCode) {
                return callTypeCode.cdId !== 'ASVC';
            })
            .filter(function(callTypeCode) {
                return !_BAS_CALL_TYPES.includes(callTypeCode.cdId);
            })
            .map(function(callTypeCode) {
                return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
            });
            newCallTypeCodeOption = _.sortBy(newCallTypeCodeOption, 'label');
            
            initSingleSelectbox('#callType', 'callTypeOpts', newCallTypeCodeOption, defaultCallType);
            
        });
        
        
        // Additional Fee Type
        $(document).on('change', '.addFeeTypeOpts', function(e) {
            let addFeeType = $(this).val();
            let $addFee = $(this).closest('tr').find('td:eq(5)').find('input');
            if (addFeeType === 'CSF') {
                $addFee.val(0);
            } else {
                $addFee.val('');
            }
        });
        
        
        // Tax Amount Float Number Only (decimal type)
        $('.decimal').on('keypress', function(e) {
            if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57) 
                    || (e.which == 46 && $(this).caret().start == 0)) {
                e.preventDefault();
            }
        });
        
        $('.decimal').on('keyup', function(e) {
            if ($(this).val().indexOf('.') == 0) {
                $(this).val($(this).val().substring(1));
            }
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
        

        $(document).on('change', '.callTypeOpts', function(e) {
            let callType = $(this).val();
            let $unitSelect = $(this).closest('tr').find('td select.unitOpts');
            let $addFeeTypeInput = $(this).closest('tr').find('td input.adtnFeeAmt');
            
            let unitSelectContainerId = $unitSelect.parent().closest('div').attr('id');
            let defaultUnitType = '';
            let unitCodes = _COMMON_CODES['unitCodes'];
            let unitCodeOption = unitCodes.map(function(unitCode) {
                return { label : unitCode.cdVal1, value : unitCode.cdId }
            });
            
            let $addFeeSelect = $(this).closest('tr').find('td select.addFeeTypeOpts');
            let addFeeSelectContainerId = $addFeeSelect.parent().closest('div').attr('id');
            
            let defaultAddFeeType = 'Call Setup Fee';
            let addFeeTypeCodes = _COMMON_CODES['addFeeTypeCodes'];
            let addFeeTypeOption = addFeeTypeCodes.map(function(addFeeTypeCode) {
                return { label : addFeeTypeCode.cdVal1, value : addFeeTypeCode.cdId }
            });
            
            if (callType.startsWith('M')) { // calltype is a kind of voice
                let voiceUnitCodeOption = unitCodeOption.filter(unit => (unit.value === 'MIN' || unit.value === 'SEC'));
                $('#' + unitSelectContainerId).empty();
                initSingleSelectbox('#' + unitSelectContainerId, 'unitOpts', voiceUnitCodeOption, defaultUnitType);
                
                $('#' + addFeeSelectContainerId).empty();
                initSingleSelectbox('#' + addFeeSelectContainerId, 'addFeeTypeOpts', addFeeTypeOption, defaultAddFeeType);
                
                $addFeeTypeInput.prop('readonly', false);
                
            } else if (callType.startsWith('SM')) { // calltype is a kind of sms
                let smsUnitCodeOption = unitCodeOption.filter(unit => unit.value === 'OCR');
                let smsDefaultType = 'Occurrence';
                $('#' + unitSelectContainerId).empty();
                initSingleSelectbox('#' + unitSelectContainerId, 'unitOpts', smsUnitCodeOption, smsDefaultType);
                
                $('#' + addFeeSelectContainerId).empty();
                initSingleSelectbox('#' + addFeeSelectContainerId, 'addFeeTypeOpts', [], defaultUnitType);
                
                $addFeeTypeInput.val('').prop('readonly', true);
                
            } else if (callType === 'GPRS') { // calltype is data
                let dataUnitCodeOption = unitCodeOption.filter(unit => (unit.value === 'MB' || unit.value === 'KB'));
                $('#' + unitSelectContainerId).empty();
                initSingleSelectbox('#' + unitSelectContainerId, 'unitOpts', dataUnitCodeOption, defaultUnitType);
                
                $('#' + addFeeSelectContainerId).empty();
                initSingleSelectbox('#' + addFeeSelectContainerId, 'addFeeTypeOpts', [], defaultUnitType);
                
                $addFeeTypeInput.val('').prop('readonly', true);
                
            } else { // Choice = '' // calltype is not selected
                $('#' + unitSelectContainerId).empty();
                initSingleSelectbox('#' + unitSelectContainerId, 'unitOpts', [], defaultUnitType);
                
                $('#' + addFeeSelectContainerId).empty();
                initSingleSelectbox('#' + addFeeSelectContainerId, 'addFeeTypeOpts', [], defaultUnitType);
                
                $addFeeTypeInput.val('').prop('readonly', true);
                
            }
            
        });
        

        $('#addSpecialModel').on('click', function(e) {
            // Non Right Role User
            if (_BTN_ROLE === 0 || _BTN_ROLE === 3) return;
            
            let spcialModel = $(this).closest('div').find('select.specialModelOpts').val();
            let contCurCd = getValueFromElement('#currency', 'currency');
            let cmitPanels = $(document).find('.special-condition.cmit').length;
            let imsiPanels = $(document).find('.special-condition.imsi').length;
            
            if (!spcialModel) {
                global.alert(thisPage.appMsg025);
                return;
            }
            
            if (!$('#newContBasTarifs').find('tr').length) {
                global.alert(thisPage.appMsg026);
                return;
            }
            
            if (!(spcialModel === 'CMIT' && cmitPanels === 0 && imsiPanels === 0)
                    && !(spcialModel === 'CMIT' && cmitPanels === 0 && imsiPanels === 1)
                    && !(spcialModel === 'IMSI' && cmitPanels === 0 && imsiPanels === 0)
                    && !(spcialModel === 'IMSI' && cmitPanels === 1 && imsiPanels === 0)) {
                    
                global.alert(thisPage.appMsg027);
                return;
            }
            
            ({ spclCondPanelHtml, spclCallTypeId } = generateSpecialCondPanel(spcialModel, contCurCd, _COMMON_CODES));
            
            $(this).parents(".list-group").find(".inr ~ .btn-group").before(spclCondPanelHtml);
            
            let defaultCallTypeCodes = ['ASVC'];
            let callTypeCodes = _COMMON_CODES['callTypeCodes'];
            let callTypeCodeOption = callTypeCodes.map(function(callTypeCode) {
                return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
            });
            callTypeCodeOption = _.sortBy(callTypeCodeOption, 'label');
            
            initMultiSelectbox('#' + spclCallTypeId, callTypeCodeOption, defaultCallTypeCodes, 'spclCallType');
            
  
            let $latestSpclPanel = $(document).find('div.spcl-panel').last(); 
            
            $latestSpclPanel.find('.multi-select').each(function(idx) {
                _MSZI = _MSZI - 10;
                $(this).css('z-index', _MSZI); 
            });

            let $newSpclCondTr =  $latestSpclPanel.find('tr.spclCond');
            let tmpSpclCondId = $newSpclCondTr.attr('id');
            
            let contSpclTarif = new ContSpclTarif();
            
            contSpclTarif.contSpclTarifId = tmpSpclCondId; 
            contSpclTarif.modelTypeCd = ($newSpclCondTr.find('td input[name="modelTypeCd"]').val() === 'Commitment') && 'CMIT' || 'IMSI';
            contSpclTarif.stepNo = $newSpclCondTr.find('td input[name="stepNo"]').val();
            let callTypeId = $newSpclCondTr.find('div.spclCallType').attr('id');
            let callTypes = getValueFromElement('#' + callTypeId, 'spclCallType');
            
            let isAllService = callTypes.find(callType => callType === 'ASVC');
            contSpclTarif.callTypeCd= isAllService || getValueFromElement('#' + callTypeId, 'spclCallType').join(',');
            contSpclTarif.thrsMin = $newSpclCondTr.find('td input[name="thrsMin"]').val();
            contSpclTarif.thrsMax = $newSpclCondTr.find('td input[name="thrsMax"]').val();
            contSpclTarif.thrsUnit = $newSpclCondTr.find('td select.spclUnitOpts').val();
            contSpclTarif.thrsTypeCd = 'SRT'; // straight
            
            _CONT_DTL_DOMAIN.contSpclTarifs.push(contSpclTarif);
            
        });
        
 
        $(document).on('click','.table-box.add-type .btn.delete',function() {
            let tmpSpclCondIds = [];
            
            $(this).closest('div.spcl-panel').find('tr.spclCond').each(function() {
                tmpSpclCondIds.push($(this).attr('id'));
            });
            
            let contSpclTarifs = _CONT_DTL_DOMAIN.contSpclTarifs;
            
            tmpSpclCondIds.forEach(tmpSpclCondId => {
                
                let contSpclTarifsIdx = contSpclTarifs.findIndex(contSpclTarif => contSpclTarif.contSpclTarifId === tmpSpclCondId); // compare with temp SpclCondId
                if (contSpclTarifsIdx > -1) contSpclTarifs.splice(contSpclTarifsIdx, 1);
                
            });
            
            $(this).parents('div.spcl-panel').remove();
            
        });
        
   
        $(document).on('click','.table-box.special-condition .add-type-button.remove',function(e) {
            if ($(this).hasClass("remove")) {
                
                let $tableSelect = $(this).parents(".table-box.special-condition");
                let spclConds = $tableSelect.find("tbody.spclModel > tr.spclCond").length;
                
                if (spclConds > 1) {

                    let tmpSpclCondId = $(this).closest('tr').attr('id');
                    let contSpclTarifs = _CONT_DTL_DOMAIN.contSpclTarifs;
                    let contSpclTarifIdx = contSpclTarifs.findIndex(contSpclTarif => contSpclTarif.contSpclTarifId === tmpSpclCondId); // compare with temp SpclCondId
                    if (contSpclTarifIdx > -1) contSpclTarifs.splice(contSpclTarifIdx, 1);
                    
                    let $spclCondTr = $(this).closest('tr'); // self
                    $spclCondTr.next('tr.toggleSpclCond').remove();
                    $spclCondTr.remove();
                    
                    $tableSelect.find("tbody.spclMode > tr.spclCond").each(function(i) {
                        let stepNo = i + 1;
                        $(this).find("td:eq(1) input").val(stepNo);
                    });
                    
                    $tableSelect.find("tbody.spclModel > tr.spclCond:last .add-type-button").show();
                    
                }
                
            }
            
        });
        

        $(document).on('click', '.editSpclCond', function(e) {
            let tabIndex = 0;
            
            // spclCallType
            let spclCallTypeId = $(this).closest('tr').find('div.spclCallType').attr('id');
            let spclCallTypes = getValueFromElement('#' + spclCallTypeId, 'spclCallType');
            
            if (_.isEmpty(spclCallTypes)) {
                global.alert(thisPage.appMsg020);
                return;
            }
            
            // special condition row validation
            let prevLastThrsMin = $(this).closest('tr').find('td input[name="thrsMin"]').val();
            let prevLastThrsMax = $(this).closest('tr').find('td input[name="thrsMax"]').val();
            
            
            if (prevLastThrsMin === '') { // allow 0 value
                global.alert(thisPage.appMsg014);
                $(this).closest('tr').find('td input[name="thrsMin"]').focus();
                return;
            }
            
            if (!prevLastThrsMax) {
                global.alert(thisPage.appMsg015);
                $(this).closest('tr').find('td input[name="thrsMax"]').focus();
                return;
            }
            
            if (parseFloat(prevLastThrsMin) >= parseFloat(prevLastThrsMax)) {
                global.alert(thisPage.appMsg016);
                $(this).closest('tr').find('td input[name="thrsMax"]').focus();
                return;
            }
            
            // this basTarif is dependent on spclCond
            let basTarifType = 'specialCond';
            let basTarifExists = $('#newContBasTarifDiv').is(':visible');
            
            if (!basTarifExists) {
                global.alert(thisPage.appMsg028);
                return;
            }
            
            // 1.check ContDtlDomain if ContSpclTarif with Trid is
            let tmpSpclCondId = $(this).closest('tr').attr('id');
            
            let contSpclTarifs = _CONT_DTL_DOMAIN.contSpclTarifs;
            let contSpclTarif = contSpclTarifs.find(contSpclTarif => contSpclTarif.contSpclTarifId === tmpSpclCondId); // compare with temp SpclCondId
            
            contSpclTarif.modelTypeCd = ($(this).closest('tr').find('td input[name="modelTypeCd"]').val() === 'Commitment') && 'CMIT' || 'IMSI';
            contSpclTarif.stepNo = $(this).closest('tr').find('td input[name="stepNo"]').val();
            let callTypeId = $(this).closest('tr').find('div.spclCallType').attr('id');
            let callTypes = getValueFromElement('#' + callTypeId, 'spclCallType');
            let isAllService = callTypes.find(callType => callType === 'ASVC');
            contSpclTarif.callTypeCd= isAllService && 'ASVC' || getValueFromElement('#' + callTypeId, 'spclCallType').join(',');
            contSpclTarif.thrsMin = $(this).closest('tr').find('td input[name="thrsMin"]').val();
            contSpclTarif.thrsMax = $(this).closest('tr').find('td input[name="thrsMax"]').val();
            contSpclTarif.thrsUnit= $(this).closest('tr').find('td select.spclUnitOpts').val();
            
            _TMP_SPCL_ID = contSpclTarif.contSpclTarifId;
            
            let basTariHtmls = [];
            
            let contSpclBasTarifs = contSpclTarif.contSpclBasTarifs;
            
            if (!_.isEmpty(contSpclBasTarifs)) {
                contSpclBasTarifs.forEach(function(contSpclBasTarif) {
                    let basTarifHtml = generateContBasTarifHtml(contSpclBasTarif, _COMMON_CODES, basTarifType);
                    basTariHtmls.push(basTarifHtml);
                });
                
            } 
            
            else {
                
                // create Change Rate table of tab modal
                $('#newContBasTarifs').find('tr').each(function() {
                    let callTypeCd = $(this).find('td select.callTypeOpts').val();
                    let stelTarif = $(this).find('td input[name="stelTarif"]').val();
                    let stelVlm = $(this).find('td input[name="stelVolume"]').val();
                    let stelUnit = $(this).find('td select.unitOpts').val();
                    let adtnFeeTypeCd = $(this).find('td select.addFeeTypeOpts').val();
                    let adtnFeeAmt = $(this).find('td input[name="adtnFeeAmt"]').val();
                    let taxAply = $(this).find('td input[name="taxAply"]').is(':checked') && 'TAY' || 'TAN';
                    
                    let contBasTarif = new ContBasTarif();
                    contBasTarif.callTypeCd = callTypeCd;
                    contBasTarif.stelTarif = stelTarif;
                    contBasTarif.stelVlm = stelVlm;
                    contBasTarif.stelUnit = stelUnit;
                    contBasTarif.adtnFeeTypeCd = adtnFeeTypeCd;
                    contBasTarif.adtnFeeAmt = adtnFeeAmt;
                    contBasTarif.taxAply = taxAply;
                    
                    let basTarifHtml = generateContBasTarifHtml(contBasTarif, _COMMON_CODES, basTarifType);
                    basTariHtmls.push(basTarifHtml);
                    
                });
                
            }
            
            // append basTarif settings
            $('#contSpclBasTarif').empty();
            basTariHtmls.forEach(basTariHtml => $('#contSpclBasTarif').append(basTariHtml));
            
            if (contSpclTarif.fixAmt) {
                tabIndex = 1;
                let fixAmt = contSpclTarif.fixAmt;
                //let fixAmtDate = _m(contSpclTarif.fixAmtDate, ["YYYY-MM-DD"]).format("YYYY-MM-DD");
                let fixAmtCur = contSpclTarif.fixAmtCur;
                $('#fixAmt').val(fixAmt);
                $('#fixAmtDate').data('datepicker').selectDate(_m(contSpclTarif.fixAmtDate, ["YYYY-MM-DD"]).toDate());
                let currencyCodes = _COMMON_CODES.currencyCodes;
                let currencyOption = currencyCodes.map(function(currencyCode) {
                    return { label : currencyCode.cdVal1, value : currencyCode.cdId }
                });
                
                initAutoCompleteSingleSelectbox('#fixAmtCur', currencyOption, fixAmtCur, 'fixAmtCur');
                
            }

            if (contSpclTarif.spclMemo) {
                tabIndex = 2;
                let spclMemo = contSpclTarif.spclMemo;
                //let spclNotiDate = _m(contSpclTarif.spclNotiDate, ["YYYY-MM-DD"]).format("YYYY-MM-DD");
                $('#spclMemo').val(spclMemo);
                $('#spclNotiDate').data('datepicker').selectDate(_m(contSpclTarif.spclNotiDate, ["YYYY-MM-DD"]).toDate());
                
            }
            
            // Special Conditon Modal Open - Select Working Tab
            $('#spclActiveTab').find('button.spclTab').not(':eq(' + tabIndex + ')').removeClass('on');
            $('#spclActiveTab').find('button.spclTab').eq(tabIndex).addClass('on');
            $('#spclActiveTab').find('div.tab-box').not(':eq(' + tabIndex + ')').removeClass('on');
            $('#spclActiveTab').find('div.tab-box').eq(tabIndex).addClass('on');
            $('#spclCondEditModal').modal();
            
        });
        

        $(document).on('click','.table-box.special-condition .add-type-button.add',function(e) {
            
            // spclCallType
            let spclCallTypeId = $(this).closest('tr').find('div.spclCallType').attr('id');
            let spclCallTypes = getValueFromElement('#' + spclCallTypeId, 'spclCallType');
            
            if (_.isEmpty(spclCallTypes)) {
                global.alert(thisPage.appMsg020);
                return;
            }
            
            // special condition row validation
            let prevLastThrsMin = $(this).closest('tr').find('td input[name="thrsMin"]').val();
            let prevLastThrsMax = $(this).closest('tr').find('td input[name="thrsMax"]').val();
            
            if (prevLastThrsMin === '') { // allow 0 value
                global.alert(thisPage.appMsg014);
                $(this).closest('tr').find('td input[name="thrsMin"]').focus();
                return;
            }
            
            if (!prevLastThrsMax) {
                global.alert(thisPage.appMsg015);
                $(this).closest('tr').find('td input[name="thrsMax"]').focus();
                return;
            }
            
            if (parseFloat(prevLastThrsMin) >= parseFloat(prevLastThrsMax)) {
                global.alert(thisPage.appMsg016);
                $(this).closest('tr').find('td input[name="thrsMax"]').focus();
                return;
            }
            
            let specialModel = $(this).closest('tr').find('td:first-child input').val();
            
            let contCurCd = getValueFromElement('#currency', 'currency');
            let specialRows = $(this).parents(".table-box.special-condition").find('tbody > tr.spclCond').length;
            
            ({ spclCondPanelRowHtml, spclCallTypeId } = generateSpecialCondPanelRow(specialModel, specialRows, contCurCd, _COMMON_CODES, prevLastThrsMax));
            
            if(specialRows <= 7) {
                
                let tmpSpclCondId = $(this).closest('tr').attr('id');
                
                let contSpclTarifs = _CONT_DTL_DOMAIN.contSpclTarifs;
                let contSpclTarif = contSpclTarifs.find(contSpclTarif => contSpclTarif.contSpclTarifId === tmpSpclCondId); // compare with temp SpclCondId
                
                contSpclTarif.contSpclTarifId = tmpSpclCondId;
                
                contSpclTarif.modelTypeCd = ($(this).closest('tr').find('td input[name="modelTypeCd"]').val() === 'Commitment') && 'CMIT' || 'IMSI';
                contSpclTarif.stepNo = $(this).closest('tr').find('td input[name="stepNo"]').val();
                let callTypeId = $(this).closest('tr').find('div.spclCallType').attr('id');
                let callTypes = getValueFromElement('#' + callTypeId, 'spclCallType');
                let isAllService = callTypes.find(callType => callType === 'ASVC');
                contSpclTarif.callTypeCd= isAllService || getValueFromElement('#' + callTypeId, 'spclCallType').join(',');
                contSpclTarif.thrsMin = $(this).closest('tr').find('td input[name="thrsMin"]').val();
                contSpclTarif.thrsMax = $(this).closest('tr').find('td input[name="thrsMax"]').val();
                contSpclTarif.thrsUnit = $(this).closest('tr').find('td select.spclUnitOpts').val();
                
                $(this).parents(".table-box.special-condition").find('tbody.spclModel').append(spclCondPanelRowHtml);
                $(this).parents(".table-box.special-condition").find("tbody.spclModel > tr:not(:last-child) .add-type-button").hide();
                
                // setup multi-select
                let defaultCallTypeCodes = ['ASVC'];
                let callTypeCodes = _COMMON_CODES['callTypeCodes'];
                let callTypeCodeOption = callTypeCodes.map(function(callTypeCode) {
                    return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
                });
                callTypeCodeOption = _.sortBy(callTypeCodeOption, 'label');
                
                initMultiSelectbox('#' + spclCallTypeId, callTypeCodeOption, defaultCallTypeCodes, 'spclCallType');
                
                // init select z-index when select
                let $spclCondPanel = $(this).closest('div.spcl-panel');
                let firstSelectIndex = $spclCondPanel.find('.multi-select').first().css("z-index");
                let $multiSelect = $spclCondPanel.find('.multi-select').not(":first");
                
                $multiSelect.each(function(i){
                    $(this).css('z-index', firstSelectIndex - 1);
                });

                let $nextSpclCondTr =  $spclCondPanel.find('tr.spclCond').last();
                let nextTmpSpclCondId = $nextSpclCondTr.attr('id');
                
                let nextContSpclTarif = new ContSpclTarif();
                nextContSpclTarif.contSpclTarifId = nextTmpSpclCondId; 
                nextContSpclTarif.modelTypeCd = ($nextSpclCondTr.find('td input[name="modelTypeCd"]').val() === 'Commitment') && 'CMIT' || 'IMSI';
                nextContSpclTarif.stepNo = $nextSpclCondTr.find('td input[name="stepNo"]').val();
                let nextCallTypeId = $nextSpclCondTr.find('div.spclCallType').attr('id');
                let nextCallTypes = getValueFromElement('#' + nextCallTypeId, 'spclCallType');
                let nextIsAllSerivce = nextCallTypes.find(nextCallType => nextCallType === 'ASVC');
                nextContSpclTarif.callTypeCd = nextIsAllSerivce || getValueFromElement('#' + nextCallTypeId, 'spclCallType').join(',');
                nextContSpclTarif.thrsMin = $nextSpclCondTr.find('td input[name="thrsMin"]').val();
                nextContSpclTarif.thrsMax = $nextSpclCondTr.find('td input[name="thrsMax"]').val();
                nextContSpclTarif.thrsUnit = $nextSpclCondTr.find('td select.spclUnitOpts').val();
                nextContSpclTarif.thrsTypeCd = 'SRT'; // straight
                
                _CONT_DTL_DOMAIN.contSpclTarifs.push(nextContSpclTarif);
                
            }
            
        });
        
        
        /**
         * TAP Modal (Change Rate) 저장(SAVE)
         */
        $('#saveSpclModal').on('click', function(e) {
            let spclCondValid = true;
            let tmpContSpclBasTarifs = [];
            let activeTabName = $('#spclActiveTab').find('button.on').attr('id');
            
            let contSpclTarifs = _CONT_DTL_DOMAIN.contSpclTarifs;
            let contSpclTarif = contSpclTarifs.find(contSpclTarif => contSpclTarif.contSpclTarifId === _TMP_SPCL_ID); // compare with temp SpclCondId
            
            if (activeTabName === 'changeRate') {
                
                $('#changeRateTab').find('tbody tr').each(function(idx) {
                    
                    let callTypeCd = $(this).find('td:eq(0) select').val();
                    let stelTarif = $(this).find('td:eq(1) input').val(); // IOT
                    let stelVlm = $(this).find('td:eq(2) input').val();
                    let stelUnit = $(this).find('td:eq(3) select').val();
                    let adtnFeeTypeCd = $(this).find('td:eq(4) select').val();
                    let adtnFeeAmt = $(this).find('td:eq(5) input').val();
                    let taxAply = $(this).find('td:eq(6) input').is(':checked') && 'TAY' || 'TAN';
                    
                    let contSpclBasTarif = new ContSpclBasTarif();
                    contSpclBasTarif.callTypeCd = callTypeCd;
                    contSpclBasTarif.stelTarif = stelTarif;
                    contSpclBasTarif.stelVlm = stelVlm;
                    contSpclBasTarif.stelUnit = stelUnit;
                    contSpclBasTarif.adtnFeeTypeCd = adtnFeeTypeCd;
                    contSpclBasTarif.adtnFeeAmt = adtnFeeAmt; 
                    contSpclBasTarif.taxAply = taxAply;
                    
                    // save basTarif validation
                    if (!validSpclCondBasTarif(contSpclBasTarif, $(this))) {
                        spclCondValid = false;
                        tmpContSpclBasTarifs.length = 0;
                        return false;
                    }
                    
                    tmpContSpclBasTarifs.push(contSpclBasTarif);
                    
                });
                
                if (spclCondValid) {
                    contSpclTarif.contSpclBasTarifs = tmpContSpclBasTarifs;
                    contSpclTarif.thrsTypeCd = 'CHR'; // change rate
                    
                    contSpclTarif.fixAmtDate = '';
                    contSpclTarif.fixAmt = '';
                    contSpclTarif.fixAmtCur = '';
                    contSpclTarif.spclNotiDate = '';
                    contSpclTarif.spclMemo = '';
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).find('.thresholdType').text('Change Rate');
                    
                    let spclToggleChangeRateHtml = generateChangeRateToggleConds(tmpContSpclBasTarifs);
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).next('tr.toggleSpclCond').remove();
                    
                    if (spclToggleChangeRateHtml) {
                        $(document).find('tr#' + _TMP_SPCL_ID).after(spclToggleChangeRateHtml);
                    }
                    
                    $('#spclCondEditModal').modal('hide');
                    
                    spclCondTabModalFormReset();
                }
                
            } else if (activeTabName === 'fixedCharge') {
                let fixAmtDate = $('#fixedChargeTab').find('input#fixAmtDate').val();
                let fixAmt = $.trim($('#fixedChargeTab').find('input#fixAmt').val());
                let fixAmtCur = getValueFromElement('#fixAmtCur', 'fixAmtCur');
                
                if (!fixAmtDate) {
                    global.alert(thisPage.appMsg029);
                    spclCondValid = false;
                } else if (!fixAmt) {
                    global.alert(thisPage.appMsg030);
                    spclCondValid = false;
                }
                
                if (spclCondValid) {
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).next('tr.toggleSpclCond').remove();
                    
                    contSpclTarif.fixAmtDate = _m(fixAmtDate, ["YYYY-MM-DD"]).format("YYYY-MM-DD");
                    contSpclTarif.fixAmt = fixAmt;
                    contSpclTarif.fixAmtCur = fixAmtCur;
                    contSpclTarif.thrsTypeCd = 'FXC'; // fixed charge
                    
                    contSpclTarif.contSpclBasTarifs = [];
                    contSpclTarif.spclNotiDate = '';
                    contSpclTarif.spclMemo = '';
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).find('.thresholdType').text('Fixed Charge');
                    
                    let spclToggleFixedChargeHtml = generateFixedChargeToggleConds(contSpclTarif);
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).next('tr.toggleSpclCond').remove();
                    
                    if (spclToggleFixedChargeHtml) {
                        $(document).find('tr#' + _TMP_SPCL_ID).after(spclToggleFixedChargeHtml);
                    }
                    
                    $('#spclCondEditModal').modal('hide');
                    
                    spclCondTabModalFormReset();
                    
                }
                
            } else if (activeTabName === 'specialRule') {
                
                let spclNotiDate = $('#specialRuleTab').find('input#spclNotiDate').val();
                let spclMemo = $.trim($('#specialRuleTab').find('input#spclMemo').val());
                
                if (!spclNotiDate) {
                    spclCondValid = false;
                    global.alert(thisPage.appMsg031);
                } else if (!spclMemo) {
                    spclCondValid = false;
                    global.alert(thisPage.appMsg032);
                }
                
                if (spclCondValid) {
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).next('tr.toggleSpclCond').remove();
                    
                    contSpclTarif.spclNotiDate = _m(spclNotiDate, ["YYYY-MM-DD"]).format("YYYY-MM-DD");
                    contSpclTarif.spclMemo = spclMemo;
                    contSpclTarif.thrsTypeCd = 'SPR'; // special rule
                    
                    contSpclTarif.contSpclBasTarifs = [];
                    contSpclTarif.fixAmtDate = '';
                    contSpclTarif.fixAmt = '';
                    contSpclTarif.fixAmtCur = '';
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).find('.thresholdType').text('Special Rule');
                    
                    let spclToggleSpcialRuleHtml = generateSecialRuleToggleConds(contSpclTarif);
                    
                    $(document).find('tr#' + _TMP_SPCL_ID).next('tr.toggleSpclCond').remove();
                    
                    if (spclToggleSpcialRuleHtml) {
                        $(document).find('tr#' + _TMP_SPCL_ID).after(spclToggleSpcialRuleHtml);
                    }
                    
                    $('#spclCondEditModal').modal('hide');
                    
                    spclCondTabModalFormReset();
                    
                }
                
            }
            
            return true;
            
        });
        

        $(document).on('click',".apply-toggle > button",function() {
            $(this).toggleClass("on");
            $(this).next().stop().slideToggle('600');
        });
        

        $(".tab-group .tab-btn button").on('click',function(e) {
            let index = $(this).index();
            $(this).siblings().removeClass("on");
            $(this).addClass("on");
            $(this).parents(".tab-group").find(".tab-box:not(:eq(" + index + "))").removeClass("on");
            $(this).parents(".tab-group").find(".tab-box:eq(" + index + ")").addClass("on");
        });
        

        $('#closeSpclModal').on('click', function(e) {
            spclCondTabModalFormReset();
            $('#spclCondEditModal').modal('hide');
        });
        

        $('#saveNewAgreement').on('click', function(e) {
            // validate submit form
            if (!validMinimumContractSubmit()) return;
            
            // confirm before request
            let confirm = global.confirm(thisPage.appMsg033);
            if (!confirm) return;
            
            let url = _CTX + "dch/contract/createNewMasterContract";
            let params = assembleContractDomains(url);
            if (!params) return;
            
            $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
                let result = response['data'];
                global.alert(thisPage.appMsg034);
                let url = _CTX + 'dch/contract/contractDetail?myNetwork=' + result.trmPlmnId + '&partnerNetwork=' + result.rcvPlmnId;
                global.location.replace(url);
                
            });
            
        });
    
        $('#requestConsent').on('click', function(e) {
            // validate submit form
            if (!validMinimumContractSubmit()) return;
            
            // confirm before reqeust
            let confirm = global.confirm(thisPage.appMsg035);
            if (!confirm) return;
            
            let url = _CTX + "dch/contract/requestAgreementOnNewContract";
            let params = assembleContractDomains(url);
            if (!params) return;
            
            $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
                let result = response['data'];
                if (result.statusCodeValue === 200) {
                    global.alert(thisPage.appMsg036);
                } else {
                    global.alert(thisPage.appMsg037);
                }
                let trmPlmnId = _.sortBy(params.trmPlmnIds).join(",");
                let rcvPlmnId = _.sortBy(params.rcvPlmnIds).join(",");
                let url = _CTX + 'dch/contract/contractDetail?myNetwork=' + trmPlmnId + '&partnerNetwork=' + rcvPlmnId;
                global.location.replace(url);
            });
            
        });
        
        
        /**
         * datepicker icon click event
         */
        $(document).on('click', '.calendar', function() {
            $(this).prev('input').focus();
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
