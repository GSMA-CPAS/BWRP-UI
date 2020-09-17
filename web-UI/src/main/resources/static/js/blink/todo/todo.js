let module = (function(global, $, _, _m, thisPage) {
    
    /**
     * define local vars or variables
     */
    var _CTX = thisPage.ctx;
    var _RtnMsg = thisPage.rtnMsg;
    var _btnRole = thisPage.btnRole;
    
    var _btnNew = thisPage['todo.btn.new'];    
    var _btnCmpl = thisPage['todo.btn.cmpl'];    
    var _msgCmpl = thisPage['todo.msg.cmpl'];    
    
    /**
     * define module functions
     */
    var _TABLE = $('#todoList').DataTable( {
			orderCellsTop : true,
			fixedHeader : true,		
//			colReorder: false, 
			serverSide : true,
			order : [[1, 'DESC']],
			dom: "tp",
			ajax : {
		    	   url : _CTX + "todo/retrieveTodoList",
		    	   data: function (data) {
		    		 	    		 
		    	   return JSON.stringify(data);
		          },
		          dataSrc: function (data) {
		              return data.data;
		          }
			}
	        ,columns: [
	        	{ data: "rno", sortable: false },
	        	{ data: "creDate", sortable: false },
	        	{ data: "todoTypeCdNm", sortable: false},
	        	{ data: "todoTitleNm", sortable: false
	        		,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				return '<div class="left">' + row.todoTitleNm +'</div>';
	        			}
	        			return data;
	        		}
	        	},
	            { data: "todoStat", sortable: false 
	        		,render : function(data, type, row, meta ) {
	        			if(type === 'display') {
	        				var html = '';
	        				if(_btnRole != 0) {  // INVO, CONT, MISS 
	        						html = '<button type="button" class="btn pdf todoCla">' + _btnNew +'</button>';
	        				}
	        				if(row.todoStat === '2') {
	        					html = _btnCmpl;
	        				}else if(row.todoStat === '0') {
	        					html = '-';
	        				}
	        				return html;
	        			}
	        			return data;
	        		}
	            },
	        	{ data: "todoId", visible: false  },
	        	{ data: "todoSbst", visible: false  },
	        	{ data: "todoTypeCd", visible: false  }
	        ],
	        columnDefs: [
                {
                    targets: [0, 1, 2, 3], 
                    className: "todoSubCla",
                    render: function (data, type, row, meta) {
                        return data;
                    }
                }
            ]
    	});
    
    
    
    // show return message
    function alertReturnMessage() {
        if (_RtnMsg) {
            global.alert(_RtnMsg);
        }
    }
    /**
     * sub contents
     */
    var format = function(d) {
    	return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
    		'<tr>' +
    		'<td class="text-left">' + d.todoSbst +
    		'</td>' +
    		'</tr>' +
    		'</table>';
    	
    }
    

    // init todo count
    function initTodo() {
        let url = _CTX + "todo/findMyTodo";
        $.ajaxProxy($.reqGet(url).build()).done(function(response) {
            $('.badge').text(response.data.todoCount);
        });
        
    }
    
    /**
     * define event handlers
     */
    var thisModuleEventHandlers = function() {
        /**
         * new button click event
         */
        $(document).on('click', '.todoCla', function(){
        	
        	var params = {};	
        	var $tr = $(this).closest('tr');
			var data = $('#todoList').DataTable().row($tr).data();
			
			if(data) {
				if(data.todoTypeCd !== 'MISS') {
					
					var url = _CTX + "todo/updateTodo";

					params.todoId = data.todoId;
					params.sysSvcId = url;
					
					if(!global.confirm(_msgCmpl)) {
						return;
					}
					
					$.ajaxProxy($.reqPost(url).setParams(params).build()).done(function(response) {
//						var result = response['data'];
						
						initTodo();
						_TABLE.draw();
					});
				}	
			}
        	
        });
        /**
         * view detail
         */
        $(document).on('click', '.todoSubCla', function() {
        	var $tr = $(this).closest('tr');
			var row = $('#todoList').DataTable().row($tr);
			
			if(row.child.isShown()) {
				row.child.hide();
				$tr.removeClass('shown');
			}else {
				row.child(format(row.data())).show();
				$tr.addClass('shown');
			}
			
        })
        
    }; // end of event handlers
    
    
    /**
     * define page initial functions
     */
    var thisModuleInitializr = function() {
        alertReturnMessage();

    }; // end of module Initializr
    
    
    /**
     * jQuery DOM Ready
     */
    $(function() {
        thisModuleInitializr();
        thisModuleEventHandlers();
    }); // end of jquery DOM ready
    
})(window, jQuery, _, moment, thisPage);
