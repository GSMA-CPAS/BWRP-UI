const notiModule = (function(global, $, _, _m, _todo, thisPage) {

    const _CTX = thisPage.ctx;
    let sock = null;
    let stompClient = null;
    
    
    // init todo count
    function initTodo() {
        let url = _CTX + "todo/findMyTodo";
        $.ajaxProxy($.reqGet(url).build()).done(function(response) {
            $('.badge').text(response.data.todoCount);
        });
        
    }
    
    
    // connect and subscribe
    function connect(){
        let url = _CTX + 'todo/notification'; // endpoint
        sock = new SockJS(url);
        stompClient = Stomp.over(sock);
        stompClient.debug = () => {};
        stompClient.connect({}, function(frame){
            stompClient.subscribe('/subscribe/todo', onMessage);
       });
    
    }
    
    
    //get return message from server
    function onMessage(message){
        let curTodoCnt = parseInt($('.badge').text(), 10);
        let newTodoCnt = parseInt(message.body, 10);
        _todo.set('notifier', 'position', 'top-right');
        
        if (newTodoCnt > curTodoCnt) {
            let newMsg = `<p>New todo has been added.<br/>You have total ${message.body} todo now.</p>`;
            _todo.notify(newMsg, 'success', 5, function() {});
        }
        
        // update todo count
        $('.badge').text(message.body);
       
    }
    
    
    // get random number between range
    function randomINtFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    
    // sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // noti push demo
    async function runNotiPushDemo() {
        _todo.set('notifier', 'position', 'top-right');
        let randomCount = 0;
        $('.badge').text(randomCount);
        await sleep(2000);
        randomCount = randomCount + randomINtFromInterval(5, 15);
        $('.badge').text(randomCount);
        let newMsg = `<p>New todo has been added.<br/>You have total ${randomCount} todo now.</p>`;
        _todo.notify(newMsg, 'success', 5, function() {}); // auto dismiss after 5 sec
    }
    
    
    // dom ready
    $(function() {
        initTodo();
        connect();
    });
    
    
    return {
        runNotiPushDemo : runNotiPushDemo
    }

})(window, jQuery, _, moment, alertify, thisPage);
