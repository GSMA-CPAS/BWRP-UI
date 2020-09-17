(function(global, $, _, _m, thisPage) {
    
    /**
     * define local consts or variables
     */
    const _CTX = thisPage.ctx;
    const _RtnMsg = thisPage.rtnMsg;
    
    /**
     * define module functions
     */
    
    // show return message
    function alertReturnMessage() {
        if (_RtnMsg) {
            global.alert(_RtnMsg);
        }
    }
    

    function findCommonCodes() {
        
        let url = _CTX + "dch/contract/findCommonCodes";
        
        $.ajaxProxy($.reqGet(url).build()).then(function(res) {
            let myNetworks = res.data['myNetworks'];
            let partnerNetworks = res.data['partnerNetworks'];
            
            // 1. myNetwork plmn selectbox
            let defaultNetworks = myNetworks.map(myNetwork => myNetwork.cdId);
            let myNetworkOption = myNetworks.map(function(myNetwork) {
                return { label : myNetwork.cdId, value : myNetwork.cdVal1 }
            });
            
            initMultiSelectbox('#myNetwork', myNetworkOption, defaultNetworks, 'myNetwork');
            
            // 2. receiver plmn selectbox
            let partnerNetworkOption = partnerNetworks.map(function(partnerNetwork) {
                return { label : partnerNetwork.cdId, value : partnerNetwork.cdVal1 }
            });
            
            initAutoCompleteMultiSelectbox('#partnerNetwork', partnerNetworkOption, [], 'partnerNetwork');
            
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
               onChange: function onChange(value) {
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
               onChange: function onChange(value) {
                   $(element).data(dataName, value);
               }
        });
        
        return sp;
         
    }
    
    
    // get element bind data
    function getValueFromElement(element, dataName) {
        return $(element).data(dataName);
    }
    
    
    /**
     * define event handlers
     */
    const thisModuleEventHandlers = function() {
        
        /**
         * Agreement(Contract) Grid Table Render
         */
        let _TABLE = $('#contractTable').DataTable({
            colReorder: true, // [default:false]
            orderMulti: false,
            lengthChange: false, // Disable the paging length setter
            serverSide : true,
            order : [[2, 'desc']], // order desc by cretDt
            filter : false,
            info : false,
            dom: 'lrtip',
            ajax: {
                
                url: _CTX + "dch/contract/findMasterContractBetweenPlmns",
                
                data: function (data) {
                    
                    for (let col in data.columns) {
                        
                        let column = data.columns[col];
                        
                        let myNetwork = getValueFromElement('#myNetwork', 'myNetwork') 
                            && getValueFromElement('#myNetwork', 'myNetwork').join(',');
                        
                        if(column.data === 'trmPlmnId' && myNetwork) {
                            column.search.value = myNetwork;
                        }
                        
                        let partnerNetwork = getValueFromElement('#partnerNetwork', 'partnerNetwork') 
                            && getValueFromElement('#partnerNetwork', 'partnerNetwork').join(',');
                        
                        if(column.data === 'rcvPlmnId' && partnerNetwork) {
                            column.search.value = partnerNetwork;
                        }
                        
                        let contrId = $('#contrId').val();
                        
                        if(column.data === 'contrId' && $('#contrId').val()) {
                            column.search.value = contrId;
                        }
                        
                        let contMemo = $('#contMemo').val();
                        
                        if(column.data === 'contMemo' && contMemo) {
                            column.search.value = contMemo;
                        }
                        
                     }
                    
                    return JSON.stringify(data);
                }
            
            },
            
            // define columns attributes
            columns: [
                { data: "trmPlmnId" }, // myNetwork
                { data: "rcvPlmnId" }, // partnerNetwork
                { data: "sysRecdCretDt" }, 
                { data: "contrId", sortable: false }, // responsible
                { data: "contMemo", sortable: false }, 
                { data: "contId", visible: false } // masterContract id
            ],
            
            // additional column rendering of uppper columns 
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: 2, // create date
                    render: function (data, type, row, meta) {
                        return $.dateFormat(data);
                    }
                }
            ],
            
            // row created callback
            createdRow : function(row, data, index) {
                $('td', row).eq(0).addClass('contDtl');
                $('td', row).eq(0).css('cursor', 'pointer');
                $(row).data('trmPlmnId', data.trmPlmnId);
                $(row).data('rcvPlmnId', data.rcvPlmnId);
            } 
            
        });
        
        
        /**
         * search agreements(contracts between carriers)
         */
        $('#searchAgreement').on('click', function(e) {
            
            // trmPlmnId(MyNetwork)
            //let myNetwork = getValueFromElement('#myNetwork', 'myNetwork')
            //    && getValueFromElement('#myNetwork', 'myNetwork').join(',');
            //
            //if (!myNetwork) {
            //    global.alert(thisPage.appMsg001);
            //    return;
            //}
            
            _TABLE.draw();
        });
        
        
        $(document).on('click', '.contDtl', function(e) {
            e.preventDefault();
            let trmPlmnId = $(this).closest('tr').data('trmPlmnId');
            let rcvPlmnId = $(this).closest('tr').data('rcvPlmnId');
            let url = _CTX + 'dch/contract/contractDetail?myNetwork=' + trmPlmnId + '&partnerNetwork=' + rcvPlmnId;
            global.location.href = url;
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
