// Master Contract (Agreement between carries) 
function ContMstr(contId) {
    this.contId = contId || '';
    this.contTypeCd  = '';
    this.contMemo = '';
    this.contrId = '';
    this.trmPlmnIds = []; // My Network
    this.rcvPlmnIds = []; // Partner Network
    this.contDtls = []; // Contract(Sub)
    this.sysTrtrId = '';
    this.sysSvcId = '';
    this.sysRecdCretDt = '';
    this.sysRecdChgDt = '';
}

//ContMstr.prototype.pushContDtl = function(contDtl) {
//    this.contDtls.push(contDtl);
//};

//ContDtl.prototype.getContDtls = function() {
//    return this.contDtls;
//};


// Contrct Detail (Contract Of The Agreement)
function ContDtl(contDtlId) {
    this.contDtlId = contDtlId || '';
    this.contId = '';
    this.contStDate = '';
    this.contExpDate = '';
    this.contExpNotiDate = '';
    this.contAutoUpdYn = '';
    this.contDtlMemo = '';
    this.contCurCd = '';
    this.taxAplyTypeCd = '';
    this.taxAplyPecnt = ''; // %
    this.exceptAplyCall = '';
    this.bcContId = '';
    this.contSttusCd = '';
    this.contBasTarifs = [];
    this.contSpclTarifs = [];
    this.sysTrtrId = '';
    this.sysSvcId = '';
    this.sysRecdCretDt = '';
    this.sysRecdChgDt = ''; 
}

//ContDtl.prototype.pushContBasTarif = function(contBasTarif) {
//    this.contBasTarifs.push(contBasTarif);
//};

//ContDtl.prototype.getContBasTarifs = function() {
//    return this.contBasTarifs;
//};

//ContDtl.prototype.pushContSpclTarif = function(contSpclTarif) {
//    this.contSpclTarifs.push(contSpclTarif);
//};

//ContDtl.prototype.getContSpclTarifs = function() {
//    return this.contSpclTarifs;
//};


// Base Condition Of Contract 
function ContBasTarif(contBasTarifId) {
    this.contBasTarifId = contBasTarifId || '';
    this.callTypeCd = '';
    this.stelTarif = ''; // IOT %
    this.stelVlm = '';
    this.stelUnit = '';
    this.adtnFeeTypeCd = '';
    this.adtnFeeAmt = ''; 
    this.contDtlId = '';
    this.taxAply = '';
    this.sysTrtrId = '';
    this.sysSvcId = '';
    this.sysRecdCretDt = '';
    this.sysRecdChgDt = ''; 
}


// Special Condition Of Contract 
function ContSpclTarif(contSpclTarifId) {
    this.contSpclTarifId = contSpclTarifId || '';
    this.modelTypeCd = '';
    this.callTypeCd= ''; 
    this.thrsMin = '';
    this.thrsMax = '';
    this.thrsUnit = '';
    this.stepNo = '';
    this.contDtlId = '';
    this.fixAmt = '';
    this.fixAmtDate = '';
    this.fixAmtCur = '';
    this.spclMemo = '';
    this.spclNotiDate = '';
    this.contSpclBasTarifs = [];
    this.thrsTypeCd = '';
    this.sysTrtrId = '';
    this.sysSvcId = '';
    this.sysRecdCretDt = '';
    this.sysRecdChgDt = ''; 
}

//ContSpclTarif.prototype.pushContSpclBasTarif = function(contSpclBasTarif) {
//    this.contSpclBasTarifs.push(contSpclBasTarif);
//};

//ContSpclTarif.prototype.getContSpclBasTarifs = function() {
//    return this.contSpclBasTarifs;
//};


// Detail Condition Of the Each Special Condtion 
function ContSpclBasTarif(contBasTarifId) {
    this.contBasTarifId = contBasTarifId || '';
    this.callTypeCd = '';
    this.stelTarif = ''; // IOT %
    this.stelVlm = '';
    this.stelUnit = '';
    this.adtnFeeTypeCd = '';
    this.adtnFeeAmt = ''; 
    this.contSpclTarifId = ''; // FK of ContSpclTarif
    this.contDtlId = '';
    this.taxAply = '';
    this.sysTrtrId = '';
    this.sysSvcId = '';
    this.sysRecdCretDt = '';
    this.sysRecdChgDt = ''; 
}


/**
 *  selectbox
 */
function initSingleSelectbox(element, selectName, options, selected, withoutEmpty = false) {
    $(element).empty();
    
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


// ContDtl Bas Tarif Html 
function generateContBasTarifHtml(contBasTarif, contractCodes, basTariftype, usedCallTypes = []) {
    ({ contBasTarifId, callTypeCd, stelTarif, stelVlm, stelUnit, adtnFeeTypeCd, adtnFeeAmt, taxAply } = contBasTarif);
    const callTypeCodes = contractCodes['callTypeCodes'];
    const unitCodes = contractCodes['unitCodes'];
    const addFeeTypeCodes = contractCodes['addFeeTypeCodes'];
    
    // callType
    const callTypeCodeOption = callTypeCodes.filter(function(callTypeCode) {
        return callTypeCode.cdId !== 'ASVC';
    }).map(function(callTypeCode) {
        return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
    });
    
    // unit(stelUnit)
    const unitCodeOption = unitCodes.map(function(unitCode) {
        return { label : unitCode.cdVal1, value : unitCode.cdId }
    });
    
    let selectUnitCodeOption = [];
    
    if (callTypeCd.startsWith('M')) {
        selectUnitCodeOption = unitCodeOption.filter(unit => (unit.value === 'MIN' || unit.value === 'SEC'));
    } else if (callTypeCd.startsWith('SM')) {
        selectUnitCodeOption = unitCodeOption.filter(unit => unit.value === 'OCR');
    } else {
        selectUnitCodeOption = unitCodeOption.filter(unit => (unit.value === 'MB' || unit.value === 'KB'));
    }
    
    // addFeeType
    const addFeeTypeOption = addFeeTypeCodes.map(function(addFeeTypeCode) {
        return { label : addFeeTypeCode.cdVal1, value : addFeeTypeCode.cdId }
    });
    
    let selectAddFeeTypeOption = [];
    
    if (callTypeCd.startsWith('M')) {
        selectAddFeeTypeOption = addFeeTypeOption.filter(addFeeType => addFeeType.value === 'CSF');
    }
    
    let basTarifHtml = '<tr id="' + contBasTarifId + '" class="border0 basTarif">';
    
    // Call Type
    basTarifHtml += '<td>';
    basTarifHtml += '<div class="select-box">';
    basTarifHtml += '<select class="callTypeOpts">';
    //basTarifHtml += '<option value="">Choice</option>';
    
    callTypeCodeOption.forEach(elm => {
        if (elm.value === callTypeCd) {
            basTarifHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
        } 
        //else {
        //    basTarifHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
        //}
    });
    
    basTarifHtml += '</select>';
    basTarifHtml += '</div>';
    basTarifHtml += '</td>';
    // end of Call Type

    // IOT (stelTarif)
    basTarifHtml += '<td>';
    basTarifHtml += '<div class="select-box">';
    basTarifHtml += '<div>';
    basTarifHtml += '<input type="text" name="stelTarif" value="' + stelTarif + '" maxlength="10" class="right decimal">';
    basTarifHtml += '</div>';
    basTarifHtml += '</div>';
    basTarifHtml += '</td>';
    // end of IOT

    // Volume (stelVolume)
    basTarifHtml += '<td>';
    basTarifHtml += '<div class="select-box">';
    basTarifHtml += '<div>';
    basTarifHtml += '<input type="text" name="stelVolume" value="' + stelVlm + '" maxlength="10" class="right numberOnly">';
    basTarifHtml += '</div>';
    basTarifHtml += '</div>';
    basTarifHtml += '</td>';
    // end of Volume

    //  Unit (stelUnit)
    basTarifHtml += '<td>';
    
    const unitId = "basUnit-" + Math.random().toString(36).substr(2, 17);
    
    basTarifHtml += '<div id=' + unitId + ' class="select-box">';
    basTarifHtml += '<select class="unitOpts">';
    basTarifHtml += '<option value="">Choice</option>';
    
    selectUnitCodeOption.forEach(elm => {
        if (elm.value === stelUnit) {
            basTarifHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
        } else {
            basTarifHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
        }
    });

    basTarifHtml += '</select>';
    basTarifHtml += '</div>';
    basTarifHtml += '</td>';
    // end of Unit

    // Additional Fee Type (adtnFeeTypeCd)
    basTarifHtml += '<td>';
    
    const addFeeId = "addFee-" + Math.random().toString(36).substr(2, 17);
    
    basTarifHtml += '<div id=' + addFeeId + ' class="select-box">';
    basTarifHtml += '<select class="addFeeTypeOpts">';
    basTarifHtml += '<option value="">Choice</option>';
    
    selectAddFeeTypeOption.forEach(elm => {
        if (elm.value === adtnFeeTypeCd) {
            basTarifHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
        } else {
            basTarifHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
        }
    });

    basTarifHtml += '</select>';
    basTarifHtml += '</div>';
    basTarifHtml += '</td>';
    // end of Additional Fee Type

    // Additional Fee Amount (adtnFeeAmt)
    basTarifHtml += '<td>';
    basTarifHtml += '<div class="select-box">';
    basTarifHtml += '<div>';
    
    if (callTypeCd.startsWith('M')) {
        basTarifHtml += '<input type="text" name="adtnFeeAmt" value="' + (adtnFeeAmt || "") + '" maxlength="10" class="right adtnFeeAmt numberOnly" >';
    } else {
        basTarifHtml += '<input type="text" name="adtnFeeAmt" value="' + (adtnFeeAmt || "") + '" maxlength="10" class="right adtnFeeAmt numberOnly" readonly >';
    }
    
    basTarifHtml += '</div>';
    basTarifHtml += '</div>';
    basTarifHtml += '</td>';
    // end of Additional Fee Amount
    
    const checkboxId = "check-" + Math.random().toString(36).substr(2, 17);

    // TAX Only (taxAply)
    basTarifHtml += '<td>';
    
    if (taxAply === 'TAY') {
        basTarifHtml += '<input type="checkbox" id="' + checkboxId + '"name="taxAply" checked class="hide">';
    } else {
        basTarifHtml += '<input type="checkbox" id="' + checkboxId + '"name="taxAply" class="hide">';
    }
    basTarifHtml += '<label for="' + checkboxId + '"><i class="ico checkbox"><em>선택</em></i></label>';
        
    // Delete Buttion
    if (basTariftype !== 'specialCond') {
        basTarifHtml += '<button type="button" class="add-type-button">';
        basTarifHtml += '<i class="ico remove"><em>삭제하기</em></i>';
        basTarifHtml += '</button>';
    }
    
    // end of Delete Buttion
    basTarifHtml += '</td>';
    // end of TAX Only
    basTarifHtml += '</tr>';
    
    // 8. update basCallTypes
    if (basTariftype !== 'specialCond') {
        let defaultCallType = '';
        let newCallTypeCodeOption = callTypeCodes.filter(function(callTypeCode) {
            return callTypeCode.cdId !== 'ASVC';
        })
        .filter(function(callTypeCode) {
            return !usedCallTypes.includes(callTypeCode.cdId);
        })
        .map(function(callTypeCode) {
            return { label : callTypeCode.cdVal1, value : callTypeCode.cdId }
        });
        newCallTypeCodeOption = _.sortBy(newCallTypeCodeOption, 'label');
        
        initSingleSelectbox('#callType', 'callTypeOpts', newCallTypeCodeOption, defaultCallType);
    }
    
    return basTarifHtml;
    
}


//create Previous Special Condition Panel
function generatePrevSpecialCondPanel(specialModel, contSpclTarifs, contCurCd, contractCodes) {
    const unitCodes = contractCodes['unitCodes'];
    const unitCodeOption = unitCodes.map(function(unitCode) {
        return { label : unitCode.cdVal1, value : unitCode.cdId }
    });
    
    // add user selected currency
    unitCodeOption.push( { label: contCurCd, value : contCurCd } );
    
    let spclCondPanelHtml ='<div class="table-box padding5-type add-type special-condition spcl-panel ' + (specialModel === 'CMIT' && 'cmit' || 'imsi') + '">';
        spclCondPanelHtml +='<table class="border0">';
        spclCondPanelHtml +='<colgroup>';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col style="width:80px">';
        spclCondPanelHtml +='<col style="width:182px">';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col style="width:255px">';
        spclCondPanelHtml +='</colgroup>';
        spclCondPanelHtml +='<thead>';
        spclCondPanelHtml +='<tr>';
        spclCondPanelHtml +='<th>Model</th>';
        spclCondPanelHtml +='<th>Step</th>';
        spclCondPanelHtml +='<th>Call type</th>';
        spclCondPanelHtml +='<th>Min Thr.</th>';
        spclCondPanelHtml +='<th>Max Thr.</th>';
        spclCondPanelHtml +='<th>Unit</th>';
        spclCondPanelHtml +='<th>Apply</th>';
        spclCondPanelHtml +='</tr>';
        spclCondPanelHtml +='</thead>';
        spclCondPanelHtml +='<tbody class="spclModel">';
        
        let spclCallTypeIds = [];
        
        contSpclTarifs.forEach( (contSpclTarif, idx, array) => {
            
            // Start Special Cond Rows
            spclCondPanelHtml +='<tr id="' + contSpclTarif.contSpclTarifId + '" class="spclCond">';
            
            const specialModelName = (contSpclTarif.modelTypeCd === 'CMIT') && 'Commitment' || 'IMSI Cap';
            
            // Special Model Type Cd
            spclCondPanelHtml +='<td>';
            spclCondPanelHtml +='<div class="select-box">';
            spclCondPanelHtml +='<div>';
            spclCondPanelHtml +='<input type="text" name="modelTypeCd" value="' + specialModelName + '" class="right" readOnly >';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</td>'
            // Special Model Type Cd
            
            // Start StepNo
            spclCondPanelHtml +='<td>';
            spclCondPanelHtml +='<div class="select-box">';
            spclCondPanelHtml +='<div>';
            spclCondPanelHtml +='<input type="text" name="stepNo" value="' + contSpclTarif.stepNo + '" class="right" readOnly >';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</td>';
            // End StepNo
            
            // Call Type
            spclCondPanelHtml += '<td class="sp">';
            const spclCallTypeId = "spclCallType-" + Math.random().toString(36).substr(2, 17);
            spclCondPanelHtml += '<div class="multi-select spclCallType" id="' + spclCallTypeId + '">';
            spclCondPanelHtml += '</div>';
            spclCondPanelHtml += '</td>';
            
            spclCallTypeIds.push(spclCallTypeId);
            // Call Type
            
            // Start threshold (Min Threshold)
            spclCondPanelHtml +='<td>';
            spclCondPanelHtml +='<div class="select-box">';
            spclCondPanelHtml +='<div>';
            spclCondPanelHtml +='<input type="text" name="thrsMin" value="' + contSpclTarif.thrsMin + '" maxlength="10" class="right decimal">';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</td>';
            // Start threshold (Min Threshold)
            
            // End threshold (Max Threshold)
            spclCondPanelHtml +='<td>';
            spclCondPanelHtml +='<div class="select-box">';
            spclCondPanelHtml +='<div>';
            spclCondPanelHtml +='<input type="text" name="thrsMax" value="' + contSpclTarif.thrsMax + '" maxlength="10" class="right decimal">';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</div>';
            spclCondPanelHtml +='</td>';
            // End threshold (Max Threshold)
            
            // Start Unit (stelUnit)
            spclCondPanelHtml += '<td>';
            
            const spclUnitId = "spclUnit-" + Math.random().toString(36).substr(2, 17);
            
            spclCondPanelHtml += '<div id=' + spclUnitId + ' class="select-box">';
            spclCondPanelHtml += '<select class="spclUnitOpts">';
            
            unitCodeOption.forEach(elm => {
                if (elm.value === contSpclTarif.thrsUnit) {
                    spclCondPanelHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
                } else {
                    spclCondPanelHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
                }
            });
            
            spclCondPanelHtml += '</select>';
            spclCondPanelHtml += '</div>';
            spclCondPanelHtml += '</td>';
            // End Unit (stelUnit)
            
            spclCondPanelHtml +='<td class="pd-l15 left">';
            // ThresholdType
            spclCondPanelHtml +='<span class="thresholdType">' + getThrsTypeCodeValue(contSpclTarif.thrsTypeCd) + '</span>';
            // ThresholdType
            
            // Tab Modal For Special Condition Setup
            spclCondPanelHtml +='<button type="button" class="btn edit editSpclCond"><i class="ico edit"></i>Edit</button>';
            
            if (idx === array.length -1) {
                spclCondPanelHtml +='<button type="button" class="add-type-button add"><i class="ico add-gray"><em>추가하기</em></i></button>';
                spclCondPanelHtml +='<button type="button" class="add-type-button remove"><i class="ico remove"><em>삭제하기</em></i></button>';
            } else {
                spclCondPanelHtml +='<button type="button" class="add-type-button add" style="display:none;"><i class="ico add-gray"><em>추가하기</em></i></button>';
                spclCondPanelHtml +='<button type="button" class="add-type-button remove" style="display:none;"><i class="ico remove"><em>삭제하기</em></i></button>';
            }
            
            // Tab Modal For Special Condition Setup
            
            spclCondPanelHtml +='</td>';
            spclCondPanelHtml +='</tr>';
            // End Special Cond Rows 
            
            /**
             * ADD Toggle Table 
             */
            if (contSpclTarif.thrsTypeCd === 'CHR') { // Change Rate
                spclCondPanelHtml += generateChangeRateToggleConds(contSpclTarif.contSpclBasTarifs);
                
            } else if (contSpclTarif.thrsTypeCd === 'FXC') { // Fixed Charge
                spclCondPanelHtml += generateFixedChargeToggleConds(contSpclTarif);
                
            } else if (contSpclTarif.thrsTypeCd === 'SPR') { // Special Rule
                spclCondPanelHtml += generateSecialRuleToggleConds(contSpclTarif);
            }
            
        });
        
        spclCondPanelHtml +='</tbody>';
        spclCondPanelHtml +='</table>';
        
        // Panel Delete
        spclCondPanelHtml +='<button type="button" class="btn delete"><i class="ico delete"><em>테이블 삭제하기</em></i></button>';
        spclCondPanelHtml +='</div>'
            
        return { spclCondPanelHtml, spclCallTypeIds };
        
}


/**
 * Thrs Type code convert
 */
function getThrsTypeCodeValue(thrsTypeCd) {
    return {
        SRT: 'Straight',
        CHR: 'Change Rate',
        FXC: 'Fixed Charge',
        SPR: 'Special Rule'
     }[thrsTypeCd];
};


// create New Special Condition Panel
function generateSpecialCondPanel(specialModel, contCurCd, contractCodes) {
    const unitCodes = contractCodes['unitCodes'];
    const unitCodeOption = unitCodes.map(function(unitCode) {
        return { label : unitCode.cdVal1, value : unitCode.cdId }
    });
    
    // add user selected currency
    unitCodeOption.push( { label: contCurCd, value : contCurCd } );
    
    let spclCondPanelHtml ='<div class="table-box padding5-type add-type special-condition spcl-panel ' + (specialModel === 'CMIT' && 'cmit' || 'imsi') + '">';
        spclCondPanelHtml +='<table class="border0">';
        spclCondPanelHtml +='<colgroup>';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col style="width:80px">';
        spclCondPanelHtml +='<col style="width:182px">';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col>';
        spclCondPanelHtml +='<col style="width:135px">';
        spclCondPanelHtml +='<col style="width:255px">';
        spclCondPanelHtml +='</colgroup>';
        spclCondPanelHtml +='<thead>';
        spclCondPanelHtml +='<tr>';
        spclCondPanelHtml +='<th>Model</th>';
        spclCondPanelHtml +='<th>Step</th>';
        spclCondPanelHtml +='<th>Call type</th>';
        spclCondPanelHtml +='<th>Min Thr.</th>';
        spclCondPanelHtml +='<th>Max Thr.</th>';
        spclCondPanelHtml +='<th>Unit</th>';
        spclCondPanelHtml +='<th>Apply</th>';
        spclCondPanelHtml +='</tr>';
        spclCondPanelHtml +='</thead>';
        spclCondPanelHtml +='<tbody class="spclModel">';
        
        // Special Conditon Rows
        const tmpSpclCondId = "spclCond-" + Math.random().toString(36).substr(2, 17);
        spclCondPanelHtml +='<tr id="' + tmpSpclCondId + '" class="spclCond">';
        
        const specialModelName = (specialModel === 'CMIT') && 'Commitment' || 'IMSI Cap';
        
        // Special Model Type Cd
        spclCondPanelHtml +='<td>';
        spclCondPanelHtml +='<div class="select-box">';
        spclCondPanelHtml +='<div>';
        spclCondPanelHtml +='<input type="text" name="modelTypeCd" value="' + specialModelName + '" class="right" readOnly >';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</td>'
        // Special Model Type Cd
        
        // Start StepNo
        spclCondPanelHtml +='<td>';
        spclCondPanelHtml +='<div class="select-box">';
        spclCondPanelHtml +='<div>';
        spclCondPanelHtml +='<input type="text" name="stepNo" value="1" class="right" readOnly >';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</td>';
        // End Step
        
        // Call Type
        spclCondPanelHtml += '<td class="sp">';
        const spclCallTypeId = "spclCallType-" + Math.random().toString(36).substr(2, 17);
        spclCondPanelHtml += '<div class="select-group">';
        spclCondPanelHtml += '<div class="multi-select spclCallType" id="' + spclCallTypeId + '">';
        spclCondPanelHtml += '</div>';
        spclCondPanelHtml += '</div>';
        spclCondPanelHtml += '</td>';
        // Call Type
        
        // Start threshold (Min Threshold)
        spclCondPanelHtml +='<td>';
        spclCondPanelHtml +='<div class="select-box">';
        spclCondPanelHtml +='<div>';
        spclCondPanelHtml +='<input type="text" name="thrsMin" value="0" maxlength="10" class="right decimal">';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</td>';
        // Start threshold (Min Threshold)
        
        // End threshold (Max Threshold)
        spclCondPanelHtml +='<td>';
        spclCondPanelHtml +='<div class="select-box">';
        spclCondPanelHtml +='<div>';
        spclCondPanelHtml +='<input type="text" name="thrsMax" value="0" maxlength="10" class="right decimal">';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</div>';
        spclCondPanelHtml +='</td>';
        // End threshold (Max Threshold)
        
        // Unit (stelUnit)
        spclCondPanelHtml += '<td>';
        
        const spclUnitId = "spclUnit-" + Math.random().toString(36).substr(2, 17);
        
        spclCondPanelHtml += '<div id=' + spclUnitId + ' class="select-box">';
        spclCondPanelHtml += '<select class="spclUnitOpts">';
        
        unitCodeOption.forEach(elm => {
            if (elm.value === contCurCd) {
                spclCondPanelHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
            } else {
                spclCondPanelHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
            }
        });
        
        spclCondPanelHtml += '</select>';
        spclCondPanelHtml += '</div>';
        spclCondPanelHtml += '</td>';
        // Unit
        
        spclCondPanelHtml +='<td class="pd-l15 left">';
        // ThresholdType
        spclCondPanelHtml +='<span class="thresholdType">Straight</span>';
        // ThresholdType
        
        // Tab Modal For Special Condition Setup
        spclCondPanelHtml +='<button type="button" class="btn edit editSpclCond"><i class="ico edit"></i>Edit</button>';
        spclCondPanelHtml +='<button type="button" class="add-type-button add"><i class="ico add-gray"><em>추가하기</em></i></button>';
        spclCondPanelHtml +='<button type="button" class="add-type-button remove"><i class="ico remove"><em>삭제하기</em></i></button>';
        // Tab Modal For Special Condition Setup
        
        spclCondPanelHtml +='</td>';
        spclCondPanelHtml +='</tr>';
        
        // Special Conditon Rows 
        
        spclCondPanelHtml +='</tbody>';
        spclCondPanelHtml +='</table>';
        
        // Panel Delete
        spclCondPanelHtml +='<button type="button" class="btn delete"><i class="ico delete"><em>테이블 삭제하기</em></i></button>';
        spclCondPanelHtml +='</div>'
        
        return { spclCondPanelHtml, spclCallTypeId };
        
}


// Create Special Condition Row
function generateSpecialCondPanelRow(specialModel, specialRows, contCurCd, contractCodes, prevLastThrsMax = 0) {
    const unitCodes = contractCodes['unitCodes'];
    
    // unit(stelUnit)
    const unitCodeOption = unitCodes.map(function(unitCode) {
        return { label : unitCode.cdVal1, value : unitCode.cdId }
    });
    
    // add user select currency
    unitCodeOption.push( { label: contCurCd, value : contCurCd } );
    
    // Special Conditon Rows 
    const tmpSpclCondId = "spclCond-" + Math.random().toString(36).substr(2, 17);
    let spclCondPanelRowHtml = '<tr id="' + tmpSpclCondId + '" class="spclCond">';
        
        // Special Model Type Cd
        spclCondPanelRowHtml +='<td>';
        spclCondPanelRowHtml +='<div class="select-box">';
        spclCondPanelRowHtml +='<div>';
        spclCondPanelRowHtml +='<input type="text" name="modelTypeCd" value="' + specialModel + '" class="right" readOnly >';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</td>'
        // Special Model Type Cd
        
        // Step
        spclCondPanelRowHtml +='<td>';
        spclCondPanelRowHtml +='<div class="select-box">';
        spclCondPanelRowHtml +='<div>';
        spclCondPanelRowHtml +='<input type="text" name="stepNo" value="' + (specialRows + 1) + '" class="right" readOnly >';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</td>';
        // Step
        
        // Call Type
        spclCondPanelRowHtml += '<td class="sp">';
        const spclCallTypeId = "spclCallType-" + Math.random().toString(36).substr(2, 17);
        spclCondPanelRowHtml += '<div class="multi-select spclCallType" id="' + spclCallTypeId + '">';
        spclCondPanelRowHtml += '</div>';
        spclCondPanelRowHtml += '</td>';
        // Call Type
        
        // Start threshold (Min Threshold)
        spclCondPanelRowHtml +='<td>';
        spclCondPanelRowHtml +='<div class="select-box">';
        spclCondPanelRowHtml +='<div>';
        spclCondPanelRowHtml +='<input type="text" name="thrsMin" value="' + prevLastThrsMax + '" maxlength="10" class="right decimal">';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</td>';
        // Start threshold (Min Threshold)
        
        // End threshold (Max Threshold)
        spclCondPanelRowHtml +='<td>';
        spclCondPanelRowHtml +='<div class="select-box">';
        spclCondPanelRowHtml +='<div>';
        spclCondPanelRowHtml +='<input type="text" name="thrsMax" value="0" maxlength="10" class="right decimal">';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</div>';
        spclCondPanelRowHtml +='</td>';
        // End threshold (Max Threshold)
        
        // Unit (stelUnit)
        spclCondPanelRowHtml += '<td>';
        
        const spclUnitId = "spclUnit-" + Math.random().toString(36).substr(2, 17);
        
        spclCondPanelRowHtml += '<div id=' + spclUnitId + ' class="select-box">';
        spclCondPanelRowHtml += '<select class="spclUnitOpts">';
        spclCondPanelRowHtml += '<option value="">Choice</option>';
        
        unitCodeOption.forEach(elm => {
            if (elm.value === contCurCd) {
                spclCondPanelRowHtml += '<option value="' + elm.value + '" selected >' + elm.label + '</option>';
            } else {
                spclCondPanelRowHtml += '<option value="' + elm.value + '">' + elm.label + '</option>';
            }
        });
    
        spclCondPanelRowHtml += '</select>';
        spclCondPanelRowHtml += '</div>';
        spclCondPanelRowHtml += '</td>';
        // Unit
        
        spclCondPanelRowHtml +='<td class="pd-l15 left">';
        // ThresholdType
        spclCondPanelRowHtml +='<span class="thresholdType">Straight</span>';
        // ThresholdType
        
        // Tab Modal For Special Condition Setup
        spclCondPanelRowHtml +='<button type="button" class="btn edit editSpclCond"><i class="ico edit"></i>Edit</button>';
        spclCondPanelRowHtml +='<button type="button" class="add-type-button add"><i class="ico add-gray"><em>추가하기</em></i></button>';
        spclCondPanelRowHtml +='<button type="button" class="add-type-button remove"><i class="ico remove"><em>삭제하기</em></i></button>';
        // Tab Modal For Special Condition Setup
        
        spclCondPanelRowHtml +='</td>';
        spclCondPanelRowHtml +='</tr>';
        
        // Special Conditon Rows
    
    return { spclCondPanelRowHtml, spclCallTypeId };
    
}


/**
 * get CallType
 */
function getCallType(callTypeCd) {
    return {
        'GPRS': 'GPRS',
        'MTC': 'Voice-MTC',
        'SMS-MO': 'SMS-MO',
        'ASVC': 'All Service',
        'SMS-MT': 'SMS-MT',
        'MOC-Home': 'Voice-Home',
        'MOC-Int': 'Voice-International',
        'MOC-Local': 'Voice-Local'
     }[callTypeCd];
}


/**
 * get Unit
 */
function getUnit(unitCd) {
    return {
        MIN: 'Minute',
        MB: 'Megabyte',
        OCR: 'Occurrence',
        KB: 'Kilobyte',
        SEC: 'Second'
    }[unitCd];
}


// Change Rate Special Condition Toggle Table
function generateChangeRateToggleConds(contSpclBasTarifs) {
    let spclToggleCondsHtml = '';
    
    if (contSpclBasTarifs.length) {
        
        // header
        spclToggleCondsHtml += '<tr class="toggleSpclCond">';
        spclToggleCondsHtml += '<td colspan="7" class="pd0">';
        spclToggleCondsHtml += '<div class="apply-toggle">';
        spclToggleCondsHtml += '<button type="button" class="btn add" style="width:100%"><i class="ico arr-toggle"></i><span>Change Rage</span></button>';
        spclToggleCondsHtml += '<div class="inr" style="display: none;">';
        spclToggleCondsHtml += '<div class="table-box padding5-type gray-type">';
        spclToggleCondsHtml += '<table class="w100">';
        spclToggleCondsHtml += '<colgroup>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col style="width:80px">';
        spclToggleCondsHtml += '<thead>';
        spclToggleCondsHtml += '<tr>';
        spclToggleCondsHtml += '<th>Call Type</th>';
        spclToggleCondsHtml += '<th>IOT</th>';
        spclToggleCondsHtml += '<th>Volume</th>';
        spclToggleCondsHtml += '<th>Unit</th>';
        spclToggleCondsHtml += '<th>Additional Fee Type</th>';
        spclToggleCondsHtml += '<th>Additional Fee</th>';
        spclToggleCondsHtml += '<th>Applying TAX</th>';
        spclToggleCondsHtml += '</tr>';
        spclToggleCondsHtml += '</thead>';
        
        contSpclBasTarifs.forEach( contSpclBasTarif => {
            
            // callType
            spclToggleCondsHtml += '<tr>';
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<div class="select-box">';
            spclToggleCondsHtml += '<div>';
            spclToggleCondsHtml += '<input type="text" value="' + getCallType(contSpclBasTarif.callTypeCd) + '" class="left" readonly >';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</td>';
            
            // IOT
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<div class="select-box">';
            spclToggleCondsHtml += '<div>';
            spclToggleCondsHtml += '<input type="text" value="' + contSpclBasTarif.stelTarif + '" class="left" readonly >';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</td>';
            
            // Volume
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<div class="select-box">';
            spclToggleCondsHtml += '<div>';
            spclToggleCondsHtml += '<input type="text" value="' + contSpclBasTarif.stelVlm + '" class="left" readonly >';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</td>';
            
            // Unit
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<div class="select-box">';
            spclToggleCondsHtml += '<div>';
            spclToggleCondsHtml += '<input type="text" value="' + getUnit(contSpclBasTarif.stelUnit) + '" class="left" readonly >';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</td>';
            
            // Add Fee Type
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<div class="select-box">';
            spclToggleCondsHtml += '<div>';
            spclToggleCondsHtml += '<input type="text" value="' + (contSpclBasTarif.adtnFeeTypeCd && 'Call Setup Fee' || '-') + '" class="left" readonly >';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</td>';
            
            // Add Fee Amount
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<div class="select-box">';
            spclToggleCondsHtml += '<div>';
            spclToggleCondsHtml += '<input type="text" value="' + (contSpclBasTarif.adtnFeeAmt || '-') + '" class="left" readonly >';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</div>';
            spclToggleCondsHtml += '</td>';
            
            // Tax Aply
            spclToggleCondsHtml += '<td>';
            spclToggleCondsHtml += '<input type="checkbox" value="' + contSpclBasTarif.taxAply + '" class="hide" ' + (contSpclBasTarif.taxAply === 'TAY' && 'checked') + ' disabled >';
            spclToggleCondsHtml += '<label for="chk1-1"><i class="ico checkbox"><em>선택</em></i></label>';
            spclToggleCondsHtml += '</td>';
            spclToggleCondsHtml += '</tr>';
            
        });
        
        spclToggleCondsHtml += '</tbody>';
        spclToggleCondsHtml += '</table>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        spclToggleCondsHtml += '</tr>';
        
    }
        
    return spclToggleCondsHtml;
    
}


// Fixed Charge Special Condition Toggle Table
function generateFixedChargeToggleConds(contSpclTarif) {
    let spclToggleCondsHtml = '';
    
        // header
        spclToggleCondsHtml += '<tr class="toggleSpclCond">';
        spclToggleCondsHtml += '<td colspan="7" class="pd0">';
        spclToggleCondsHtml += '<div class="apply-toggle">';
        spclToggleCondsHtml += '<button type="button" class="btn add" style="width:100%"><i class="ico arr-toggle"></i><span>Fixed Charge</span></button>';
        spclToggleCondsHtml += '<div class="inr" style="display: none;">';
        spclToggleCondsHtml += '<div class="table-box padding5-type gray-type">';
        spclToggleCondsHtml += '<table class="w100">';
        spclToggleCondsHtml += '<colgroup>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '</colgroup>';
        spclToggleCondsHtml += '<thead>';
        spclToggleCondsHtml += '<tr>';
        spclToggleCondsHtml += '<th>Settlement period</th>'; // 정산주기
        spclToggleCondsHtml += '<th>Amount</th>'; // 금액
        spclToggleCondsHtml += '<th>Currency</th>';
        spclToggleCondsHtml += '</tr>';
        spclToggleCondsHtml += '</thead>';
        
        // fixAmtDate
        spclToggleCondsHtml += '<tr>';
        spclToggleCondsHtml += '<td>';
        spclToggleCondsHtml += '<div class="select-box">';
        spclToggleCondsHtml += '<div>';
        spclToggleCondsHtml += '<input type="text" value="' +  $.dateFormat(contSpclTarif.fixAmtDate) + '" class="left" readonly >';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        
        // fixAmt
        spclToggleCondsHtml += '<td>';
        spclToggleCondsHtml += '<div class="select-box">';
        spclToggleCondsHtml += '<div>';
        spclToggleCondsHtml += '<input type="text" value="' + (contSpclTarif.fixAmt || '') + '" class="left" readonly >';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        
        // fixAmtCur
        spclToggleCondsHtml += '<td>';
        spclToggleCondsHtml += '<div class="select-box">';
        spclToggleCondsHtml += '<div>';
        spclToggleCondsHtml += '<input type="text" value="' + contSpclTarif.fixAmtCur + '" class="left" readonly >';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        
        spclToggleCondsHtml += '</tbody>';
        spclToggleCondsHtml += '</table>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        spclToggleCondsHtml += '</tr>';
        
        
    return spclToggleCondsHtml;
    
}


// Special Rule Condition Toggle Table
function generateSecialRuleToggleConds(contSpclTarif) {
    let spclToggleCondsHtml = '';
    
        // header
        spclToggleCondsHtml += '<tr class="toggleSpclCond">';
        spclToggleCondsHtml += '<td colspan="7" class="pd0">';
        spclToggleCondsHtml += '<div class="apply-toggle">';
        spclToggleCondsHtml += '<button type="button" class="btn add" style="width:100%"><i class="ico arr-toggle"></i><span>Special Rule</span></button>';
        spclToggleCondsHtml += '<div class="inr" style="display: none;">';
        spclToggleCondsHtml += '<div class="table-box padding5-type gray-type">';
        spclToggleCondsHtml += '<table class="w100">';
        spclToggleCondsHtml += '<colgroup>';
        spclToggleCondsHtml += '<col style="width:224px">';
        spclToggleCondsHtml += '<col>';
        spclToggleCondsHtml += '</colgroup>';
        spclToggleCondsHtml += '<thead>';
        spclToggleCondsHtml += '<tr>';
        spclToggleCondsHtml += '<th>Reminder date</th>';
        spclToggleCondsHtml += '<th>MEMO</th>';
        spclToggleCondsHtml += '</tr>';
        spclToggleCondsHtml += '</thead>';
        
        // spclNotiDate
        spclToggleCondsHtml += '<tr>';
        spclToggleCondsHtml += '<td>';
        spclToggleCondsHtml += '<div class="select-box">';
        spclToggleCondsHtml += '<div>';
        spclToggleCondsHtml += '<input type="text" value="' + $.dateFormat(contSpclTarif.spclNotiDate) + '" class="left" readonly >';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        
        // spclMemo
        spclToggleCondsHtml += '<td>';
        spclToggleCondsHtml += '<div class="select-box">';
        spclToggleCondsHtml += '<div>';
        spclToggleCondsHtml += '<input type="text" value="' + (contSpclTarif.spclMemo || '') + '" class="left" readonly >';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        
        spclToggleCondsHtml += '</tbody>';
        spclToggleCondsHtml += '</table>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</div>';
        spclToggleCondsHtml += '</td>';
        spclToggleCondsHtml += '</tr>';
        
        
    return spclToggleCondsHtml;
    
}

