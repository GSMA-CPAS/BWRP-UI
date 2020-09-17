(function(global, $, thisPage) {

    const _CTX = thisPage.ctx;
    const _RTN_MSG = thisPage.rtnMsg;
    let _TABLE = null;
    
    
    // show return message
    function alertReturnMessage() {
        if (_RTN_MSG) {
            global.alert(_RTN_MSG);
        }
    }
    
    
    /**
     * module event handlers
     */
    const thisModuleEventHandlers = function() {
        
        /**
         * Board DataTables Render
         */
        _TABLE = $('#boardDataTables').DataTable({
            colReorder: true, // [default:false]
            order: [[0, 'desc'], [1, 'asc']] ,
            lengthChange: false, // Disable the paging length setter
            serverSide : true,
            filter : false,
            info : false,
            dom: 'lrtip',
            ajax: {
                url: _CTX + 'board/findBoard',
                // before ajax request set specific search parameters
                data: function (data) {
                    
                    for (let col in data.columns) {
                        
                        let column = data.columns[col];
                        
                        let searchType = $('#searchType').val();
                        if(column.data === 'searchType' && $('#searchType').val()) {
                            column.search.value = searchType;
                        }
                        
                        let searchKeyword = $('#searchKeyword').val();
                        if(column.data === 'searchKeyword' && searchKeyword) {
                            column.search.value = searchKeyword;
                        }
                        
                     }
                    
                    return JSON.stringify(data);
                }
            },
            // define columns attributes
            columns: [
                { data: "bbsId" }, // board seq
                { data: "bbsTitle" }, // title
                { data: "originFileNm", sortable: false  }, // attach file
                { data: "bbsAuthor", sortable: false }, // author
                { data: "sysRecdCretDt", sortable: false }, // create date
                { data: "bbsHit", sortable: false }, // hit
                { data: "searchType", visible: false }, // searchType[All, Title, Content]
                { data: "searchKeyword", visible: false }, // search keyword
                { data: "sysTrtrId", visible: false } // thread owner
            ],
            // additional column rendering of uppper columns 
            columnDefs: [
                {
                    targets: 0, // bbs Id
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    targets: 1, // title
                    className: "left",
                    render: function (data, type, row, meta) {
                        return data || '-';
                    }
                },
                {
                    targets: 2, // attachFileNm
                    render: function (data, type, row, meta) {
                        return data && '<a href="javascript:;" class="downloadFile">' + data + '</a>' || '-';
                    }
                },
                {
                    targets: 3, // authorName
                    render: function (data, type, row, meta) {
                        return $.getUsernameFromEmail(data) || '-';
                    }
                },
                {
                    targets: 4, // create date
                    render: function (data, type, row, meta) {
                        return $.dateFormat(data, 'D');
                    }
                },
                {
                    targets: 5, // hit
                    render: function (data, type, row, meta) {
                        return data || 0;
                    }
                }
            ],
            // row created callback
            createdRow : function(row, data, index) {
                $('td', row).eq(0).addClass('detail');
                $('td', row).eq(0).css('cursor', 'pointer');
                $('td', row).eq(0).html(index + 1);
                $('td', row).eq(1).addClass('detail');
                $('td', row).eq(1).css('cursor', 'pointer');
                $(row).data('bbsId', data.bbsId);
                $(row).data('bbsAuthor', data.bbsAuthor);
                $(row).data('storeFileNm', data.storeFileNm);
                $(row).data('originFileNm', data.originFileNm);
            } 
            
        });
        
        
        $('#searchBoard').on('click', function(e) {
            e.preventDefault();
//            let searchKeyword = $('#searchKeyword').val();
            
//            if (!searchKeyword) {
//                global.alert('검색어를 입력해주세요.');
//                return;
//            }
            
            _TABLE.draw();
            
        });
        
        
        // Enter-key password change submit event
        $('#searchKeyword').on('keypress', function(e) {
            if (e.which == 13 || e.keyCode == 13) {
                $('#searchBoard').trigger('click');
                return false;
            }
            return true;
        });
        
        
        $('#writeBoard').on('click', function(e) {
            e.preventDefault();
            global.location.href = _CTX + 'board/writeBoard';
        });
        
        
        // dowmload attachment file
        $(document).on('click', '.downloadFile', function(e) {
            let originFileNm = $(this).closest('tr').data('originFileNm');
            let storeFileNm = $(this).closest('tr').data('storeFileNm');
            let url = _CTX + 'board/downloadBoardAtcFile';
            $('<form action="' + url + '" method="POST"></form>')
            .append('<input type="hidden" name="originFileNm" value="' + originFileNm + '" />')
            .append('<input type="hidden" name="storeFileNm" value="' + storeFileNm + '" />')
            .appendTo('body')
            .submit()
            .remove();
        });
        
        
        // move to board details
        $(document).on('click', '.detail', function(e) {
            e.preventDefault();
            let bbsId = $(this).closest('tr').data('bbsId');
            let bbsAuthor = $(this).closest('tr').data('bbsAuthor');
            let url = _CTX + 'board/boardDetail?bbsId=' + bbsId + '&bbsAuthor=' + bbsAuthor;
            global.location.href = url;
        });
        
    };

    // page initializer
    const thisModuleInitializr = function() {
        alertReturnMessage();
        
        
    };
    
    // dom ready
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    });

})(window, jQuery, thisPage);
