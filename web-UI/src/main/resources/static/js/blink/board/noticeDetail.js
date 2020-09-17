(function(global, $, _, _m, thisPage) {

    const _CTX = thisPage.ctx;
    const _USERNAME = thisPage.username;
    const _DETAIL_MODE = thisPage.detailMode;
    const _BBS_ID = thisPage.bbsId;
    const _BBS_AUTHOR = thisPage.bbsAuthor;
    const _BTN_ROLE = thisPage.btnRole;
    const _MAX_CONTENT_BYTES = 1000;
    const _MAX_UPLOAD_FILE_SIZE = thisPage.maxFileSize; // 10MB (10,485,760)
    const _NOT_ALLOWED_FILE_TYPES = ['ade', 'adp', 'bat', 'chm', 'cmd', 'com', 'cpl', 'exe', 'hta', 'ins', 'isp', 'jar', 'jse', 'js',
        'lib', 'lnk', 'mde', 'msc', 'msp', 'mst', 'pif', 'scr', 'sct', 'shb', 'sys', 'vb', 'vbe', 'vbs', 'vxd', 'wsc', 'wsc', 'wsf', 'wsh'];
    let _ORIGIN_FILE_NM = "";
    let _STORE_FILE_NM = "";
    let _CONTENT = '';

    
    // page init
    function initNoticeDetail() {
        
        // set button by owner right
       if (_DETAIL_MODE === 'Write') { // WRITE MODE
           $('#bbsAuthor').val($.getUsernameFromEmail(_USERNAME));
           $('#threadOwner').val(_USERNAME);
           $('#createDate').val(_m().format('YYYY-MM-DD'));
           $('#writeBoard').show();
           $('#attachingFile').show();
       } else if (_DETAIL_MODE === 'Update') { // EDIT MODE
           findNoticeDetail(_DETAIL_MODE);
           $('#updateBoard').show(); 
           $('#deleteBoard').show(); 
           $('#attachingFile').show();
       } else if (_DETAIL_MODE === 'View'){
           findNoticeDetail(_DETAIL_MODE); // VIEW MODE
           //$('#attachedFile').show();
           $('#bbsTitle').prop('readonly', true);
           $('#bbsContent').prop('readonly', true);
       }
       
       // set btnRole (only admin(1) can edit)
       if (_BTN_ROLE != 1) {
           $('#bbsTitle').prop('readonly', true);
           let count = countStoredContentLength(bbsContent);
           _CONTENT = bbsContent;
           $('#count').text(count);
           $('#bbsContent').prop('readonly', true);
       }
       
       $('#bbsTitle').focus();
    }
    
    
    /**
     * find notice detail by id & author
     */
    function findNoticeDetail(detailMode) {
        let params = {};
        params.bbsId = _BBS_ID;
        params.bbsAuthor = _BBS_AUTHOR;
        
        let url = _CTX + "board/notice/findNoticeDetail";
        $.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
            ({ bbsId, bbsTitle, bbsContent, bbsAuthor, sysRecdCretDt, originFileNm, storeFileNm } = response['data']);
            $('#bbsId').val(bbsId);
            $('#bbsTitle').val(bbsTitle);
            $('#bbsAuthor').val($.getUsernameFromEmail(bbsAuthor));
            $('#threadOwner').val(bbsAuthor);
            $('#createDate').val($.dateFormat(sysRecdCretDt));
            $('#bbsContent').val(bbsContent);
            let count = countStoredContentLength(bbsContent);
            _CONTENT = bbsContent;
            $('#count').text(count);
            $('#fileName').val(originFileNm);
            $('.fileName').text(originFileNm || 'No file');
            _ORIGIN_FILE_NM = originFileNm;
            _STORE_FILE_NM = storeFileNm;
            return { detailMode, originFileNm };
            
        }).done(function(response) {
            if (detailMode === 'View' && originFileNm){
                $('#attachedFile').show();
            } else if (detailMode === 'View' && !originFileNm) {
                $('#noFile').show();
            }
        });
        
    }
    
    
    function validateUploadFileSize(fileInput) {
        let valid = true;
        
        if (fileInput.files[0].size){
            let fileSize = fileInput.files[0].size; // in bytes
            
            if(fileSize > _MAX_UPLOAD_FILE_SIZE){
                global.alert(thisPage.appMsg001);
                valid = false;
            } 
        }
        
        return valid;
    }
    

    function validateImageExtension(files){
        let valid = true;
        
        for (let i = 0; i < files.length; i++) {
            
            if (files[i]){
                let getExt = files[i].split('.').reverse()[0].toLowerCase();
                
                if (($.inArray(getExt.toLowerCase(), _NOT_ALLOWED_FILE_TYPES) > -1)){
                    global.alert(`${thisPage.appMsg002} ${files} ${thisPage.appMsg003}`);
                    valid = false;
                } 
            }
            
            if (!valid) { break; }
            
        }
        
        return valid;
        
    }
    
    
    function validateRegisterForm() {
        let fileCnt = 0;
        let files = [];
        let bbsTitle = $.trim($('#bbsTitle').val());
        let bbsContent = $.trim($('#bbsContent').val());
        
        if (!bbsTitle) {
            global.alert(thisPage.appMsg004);
            $('#bbsTitle').focus();
            return false;
        } else if (!bbsContent) {
            global.alert(thisPage.appMsg005);
            $('#bbsContent').focus();
            return false;
        }
        
        $('#boardForm').find('input[type=file]').each(function(){
            if($(this).val()){
                files.push($(this).val());
                fileCnt++;
            }
        });
        
        // check file size
        let fileInput = document.getElementById("attachFile");
        
        if(files.length) {
            if (!validateUploadFileSize(fileInput)) { return false; }
        }
        
        // check upload file extension
        if(files.length) {
            if(!validateImageExtension(files)) { return false; }
        } 
        
        return true;
        
    }
    
    
    // count stored content length
    function countStoredContentLength(content) {
        let totalBytes = 0;
        
        for (let i = 0, len = content.length; i < len; i++) {
            let curByte = content.charCodeAt(i);
            
            if (curByte > 128) {
                totalBytes += 2;
            } else {
                totalBytes++;
            }
        }
        
        return totalBytes;
    }
    
    
    // count writing content length (enter[charcode:10] -> 2byte)
    function countContentLength(content) {
        let totalBytes = 0;
        
        for (let i = 0, len = content.length; i < len; i++) {
            let curByte = content.charCodeAt(i);
            
            if (curByte === 10 || curByte > 128) {
                totalBytes += 2;
            } else {
                totalBytes++;
            }
        }
        
        return totalBytes;
    }
    
    
    // validate content length
    function validateContentLength(event, totalBytes) {
        if (totalBytes <= _MAX_CONTENT_BYTES) {
            $('#count').text(totalBytes);
            _CONTENT = event.target.value;
        } else {
            let maxBytes = $.formatNumber(_MAX_CONTENT_BYTES);
            global.alert(`${thisPage.appMsg006} ${maxBytes} ${thisPage.appMsg007}`);
            event.target.value = _CONTENT;
        }
    }
    
    
    // module event handlers
    const thisModuleEventHandlers = function() {
        
        // attach file event
        $('#attachFile').on('change', function(e) {
            
            if (this.files && this.files[0]) {
                let fileName = this.files[0].name;
                $('#fileName').val(fileName);
            } else {
                $('#fileName').val(''); 
            }
            
        });
        

        $('#writeBoard').on('click', function(e) {
            e.preventDefault();
            if (!validateRegisterForm()) return;
            let url = _CTX + "board/notice/writeNotice";
            let params = new FormData($('#boardForm')[0]);
            params.append("sysTrtrId", _USERNAME);
            params.append("sysSvcId", url);
            
            $.ajaxUpload($.reqPost(url).setParams(params).build()).done(function(response) {
//                let result = response['data'];
                global.alert(thisPage.appMsg008);
                global.location.replace(_CTX + "board/notice");
            });
            
        });
        
        
        $('#updateBoard').on('click', function(e) {
            e.preventDefault();
            if (!validateRegisterForm()) return;
            let url = _CTX + 'board/notice/updateNotice';
            let params = new FormData($('#boardForm')[0]);
            params.append("sysTrtrId", _USERNAME);
            params.append("sysSvcId", url);
            params.append("storeFileNm", _STORE_FILE_NM);
            
            $.ajaxUpload($.reqPost(url).setParams(params).build()).done(function(response) {
//                let result = response['data'];
                global.alert(thisPage.appMsg009);
                //global.location.reload();
                global.location.replace(_CTX + 'board/notice');
            });
            
        });
        
        
        $('#deleteBoard').on('click', function(e) {
            e.preventDefault();
            
            // confirm before reqeust
            var confirm = global.confirm(thisPage.appMsg010);
            if (!confirm) return;
            
            let url = _CTX + 'board/notice/deleteNotice/' + _BBS_ID;
            $.ajaxProxy($.reqGet(url).build()).done(function(response) {
//                let result = response['data'];
                global.alert(thisPage.appMsg011);
                global.location.replace(_CTX + 'board/notice');
            });
            
        });
        
        
        $('#downloadFile').on('click', function(e) {
            let url = _CTX + 'board/notice/downloadNoticeAtcFile';
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="originFileNm" value="' + _ORIGIN_FILE_NM + '" />')
            .append('<input type="hidden" name="storeFileNm" value="' + _STORE_FILE_NM + '" />')
            .appendTo('body')
            .submit()
            .remove();
        });
        
        
        $('#goToList').on('click', function(e) {
            global.location.href = _CTX + 'board/notice';
        });
        
        
        $('#bbsTitle').on('keypress', function(e) {
            let regex = /^[a-zA-Z0-9(),.!? ]*$/;
            let charCode = e.which ? e.which : e.keyCode;
            let str = e.key || String.fromCharCode(charCode);
            if (regex.test(str)) {
                return true;
            }
            return false;
        });
        
        
        // check content length
        $('#bbsContent').on('keyup', function(e) {
            let totalBytes = countContentLength(e.target.value);
            validateContentLength(e, totalBytes);
        });
        
        
    }; // end of eventHandlers
    
    // page module initializer
    const thisModuleInitializr = function() {
        initNoticeDetail();
    };
    
    
    // dom ready
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    });

})(window, jQuery, _, moment, thisPage);
