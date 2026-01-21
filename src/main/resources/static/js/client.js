////////////////////////////////////////////
// 这里实现标签页的切换
////////////////////////////////////////////

function initSwitchTab() {
    // 1. 先获取到相关的元素(标签页的按钮, 会话列表, 好友列表)
    let tabSession = document.querySelector('.tab .tab-session');
    let tabFriend = document.querySelector('.tab .tab-friend');
    // querySelectorAll 可以同时选中多个元素. 得到的结果是个数组
    // [0] 就是会话列表
    // [1] 就是好友列表
    let lists = document.querySelectorAll('.list');
    // 2. 针对标签页按钮, 注册点击事件. 
    //    如果是点击 会话标签按钮, 就把会话标签按钮的背景图片进行设置. 
    //    同时把会话列表显示出来, 把好友列表隐藏
    //    如果是点击 好友标签按钮, 就把好友标签按钮的背景图片进行设置. 
    //    同时把好友列表显示出来, 把会话列表进行隐藏
    tabSession.onclick = function() {
        // a) 设置图标
        tabSession.style.backgroundImage = 'url(img/对话.png)';
        tabFriend.style.backgroundImage = 'url(img/用户2.png)';
        // b) 让会话列表显示出来, 让好友列表进行隐藏
        lists[0].classList = 'list';
        lists[1].classList = 'list hide';
    }

    tabFriend.onclick = function() {
        // a) 设置图标
        tabSession.style.backgroundImage = 'url(img/对话2.png)';
        tabFriend.style.backgroundImage = 'url(img/用户.png)'
        // b) 让好友列表显示, 让会话列表隐藏
        lists[0].classList = 'list hide';
        lists[1].classList = 'list';
    }
}

//进行调用
initSwitchTab();


////////////////////////////////
// WebSocket初始化
////////////////////////////////
let webSocket = new WebSocket("ws://127.0.0.1:8080/SessionMessage");
webSocket.onopen=function() {
    console.log("连接成功！");
}
webSocket.onclose=function(){
    console.log("链接断开！");
}

webSocket.onmessage=function(e){
    console.log("消息：",e.data);
    let rep = JSON.parse(e.data);
    if(rep.type=="message") {
        handleMessage(rep);
    }else{
        console.log("rep.message不符合");
    }
}

webSocket.onerror=function(){
    console.log("WebSocket发送异常");
}

//handleMessage()
function handleMessage(rep) {

    let sessionLi = findSessionLi(rep.sessionId);

    if(sessionLi==null) {
        sessionLi = document.createElement('li');
        sessionLi.setAttribute('message-session-id',rep.sessionId);
        sessionLi.innerHTML = '<h3>'+rep.fromName+'</h3>'+'<p></p>';

        //添加点击事件
        sessionLi.onclick = function(){
            sessionOnclick(sessionLi);
        }
    }

    //添加新消息展示到会话列表框
    let p = sessionLi.querySelector('p');
    p.innerHTML = rep.content;
    //截断
    if(p.innerHTML.length>10)
    {
        p.innerHTML=p.innerHTML.substring(0,10) + '...';
    }
    //将列表置顶
    let sessionLis = document.querySelector('#session-list');
    sessionLis.insertBefore(sessionLi,sessionLis.children[0]);

    //添加新消息
    if(sessionLi.className == 'selected'){
        let sessionShowDiv = document.querySelector('.right .message-show');
        addMessage(sessionShowDiv,rep);    
        scrollBottom(sessionShowDiv);
    }


}

function findSessionLi(curSessionId) {
    let sessionLis=document.querySelectorAll('#session-list>li');
    for(let sessionLi of sessionLis){
        let sessionId=sessionLi.getAttribute('message-session-id');
        if(sessionId==curSessionId){
            return sessionLi;
        }
    }
    return null;
}


////////////////////////////////
// 为发送按钮注册点击事件
////////////////////////////////
//获取编辑框和按钮
let messageInput = document.querySelector('.right .message-input');
let sendButton = document.querySelector('.right .ctrl');

// 为输入框添加键盘事件：Enter发送，Ctrl+Enter换行
messageInput.onkeydown = function(event) {
    // 按下Enter键且没有按Ctrl键时发送消息
    if (event.key === 'Enter' && !event.ctrlKey) {
        event.preventDefault(); // 阻止默认的换行行为
        sendButton.click(); // 触发发送按钮的点击事件
    }
    // 按下Ctrl+Enter时换行（浏览器默认行为，不需要额外处理）
}

//
sendButton.onclick=function(){
    let content = messageInput.value;
    if(!content){
        return;
    }

    //获取sessionId
    let sessionLi = document.querySelector('#session-list .selected');
    if(sessionLi==null) {
        return;
    }

    let sessionId = sessionLi.getAttribute('message-session-id');
    //构造json数据
    let req = {
        type:'message',
        sessionId:sessionId,
        content:content
    }
    //将json数据转成json字符串
    req=JSON.stringify(req);
    //发送数据
    webSocket.send(req);

    //清空输入框
    messageInput.value='';


}

////////////////////////////////
// 获取用户信息
////////////////////////////////
getUserInfo();
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/userInfo",
        success: function (result) {
            // $(".user").text(resiult.username);
            if (result && result.userId > 0) {
                let userDiv = document.querySelector('.main .left .user');
                userDiv.innerHTML = userDiv.innerHTML=result.username;
                userDiv.setAttribute('user-id', result.userId);
            }else{
                alert("登录失败请检查用户名和密码");
                location.assign("/login.html")
            }
        }
    });
}





////////////////////////////////
// 获取好友列表
////////////////////////////////
getFriendList();
function getFriendList(){
    $.ajax({
        type:"get",
        url:"/friendList",
        success: function(result) {
            //获取朋友列表ul
            let friendUl = document.querySelector("#friend-list");
            //清空ul
            friendUl.innerHTML = "";

            for(let friend of result){
            //创建子列表li
            let li = document.createElement('li');
            //将h3加入li
            li.innerHTML = "<h4>"+friend.friendName+"</h4>";

            // 此处把 friendId 也记录下来, 以备后用. 
            // 把 friendId 作为一个 html 的自定义属性, 加到 li 标签上就行了. 
            li.setAttribute('friend-id', friend.friendId);

            //将li加入ul
            friendUl.appendChild(li);

            li.onclick = function() {
                // 参数表示区分了当前用户点击的是哪个好友. 
                clickFriend(friend);
            }
            }
        },
        error: function(){
            alert("获取好友列表失败");
        }
        
    })
}

// 点击好友列表项, 触发的函数
function clickFriend(friend) {
    // // 1. 先判定一下当前这个好友是否有对应的会话. 
    // //    使用一个单独的函数来实现. 这个函数参数是用户的名字. 返回值是一个 li 标签. 找到了就是返回了对应会话列表里的 li; 如果没找到, 返回 null
    // let sessionLi = findSessionByName(friend.friendName);
    // let sessionListUL = document.querySelector('#session-list');
    // if (sessionLi) {
    //     // 2. 如果存在匹配的结果, 就把这个会话设置成选中状态, 获取历史消息, 并且置顶. 
    //     //    insertBefore 把这个找到的 li 标签放到最前面去. 
    //     sessionListUL.insertBefore(sessionLi, sessionListUL.children[0]);
    //     //    此处设置会话选中状态, 获取历史消息, 这俩功能其实在上面的 clickSession 中已经有了. 
    //     //    此处直接调用 clickSession 即可
    //     //    clickSession(sessionLi);
    //     //    或者还可以模拟一下点击操作. 
    //     sessionLi.click();
    // } else {
    //     // 3. 如果不存在匹配的结果, 就创建个新会话(创建 li 标签 + 通知服务器)
    //     sessionLi = document.createElement('li');
    //     //    构造 li 标签内容. 由于新会话没有 "最后一条消息", p 标签内容就设为空即可
    //     sessionLi.innerHTML = '<h3>' + friend.friendName + '</h3>' + '<p></p>';
    //     //    把标签进行置顶
    //     sessionListUL.insertBefore(sessionLi, sessionListUL.children[0]);
    //     sessionLi.onclick = function() {
    //         clickSession(sessionLi);
    //     }
    //     sessionLi.click();
    //     //     发送消息给服务器, 告诉服务器当前新创建的会话是啥样的. 
    //     createSession(friend.friendId, sessionLi);
    // }
    // // 4. 还需要把标签页给切换到 会话列表. 
    // //    实现方式很容易, 只要找到会话列表标签页按钮, 模拟一个点击操作即可. 
    // let tabSession = document.querySelector('.tab .tab-session');
    // tabSession.click();
    

    let sessionLi = findSessionByName(friend.friendName);
    //如果session存在，插入会话的第一位，设为被选中状态，加载会话信息
    let sessionUL = document.querySelector('#session-list')
    if(sessionLi) {
        sessionUL.insertBefore(sessionLi, sessionUL.children[0]);
        // 此处要设置会话历史信息 TODO()
        //点击标签，设为被选中高亮
        
        //点击标签
        sessionOnclick(sessionLi);

        //或者模拟点击点击
        sessionLi.click();
        // //发送给服务器，让服务器生成会话信息，返回sessionId保存到sessionLi以备后用
        // createSession(friend.friendId, sessionLi);
    }else{
        //如果不存在则新建一个li
        sessionLi  = document.createElement('li');
        //因为会话内容为空所以，p标签设为空
        sessionLi.innerHTML = '<h3>'+ friend.friendName +'</h3>'+'<p></p>';

        //将sessionLi插入第一
        sessionUL.insertBefore(sessionLi, sessionUL.children[0]);
        //注册点击事件，模拟点击
        sessionLi.onclick = function() {
            sessionOnclick(sessionLi);
        }

        sessionLi.click();

        //在服务器创建新的会话
        createSession(friend.friendId, sessionLi);
    }

    //还要将标签页切换到会话列表
    let tabSession = document.querySelector('.tab .tab-session');
    tabSession.click();
}

function createSession (friendId, sessionLi) {
    $.ajax({
        type:'post',
        url:'/session?toUserId=' + friendId,
        success: function(body) {
            console.log("sessionId为:",body.sessionId);
            sessionLi.setAttribute('message-session-id', body.sessionId);
        },
        error: function() {
            alert('创建新会话失败');
        }

    });
}

// //根据username查询li
function findSessionByName(username) {
    // 先获取到会话列表中所有的 li 标签
    // 然后依次遍历, 看看这些 li 标签谁的名字和要查找的名字一致. 
    let sessionLis = document.querySelectorAll('#session-list>li');
    for (let sessionLi of sessionLis) {
        // 获取到该 li 标签里的 h3 标签, 进一步得到名字
        let h3 = sessionLi.querySelector('h3');
        if (h3.innerHTML == username) {
            return sessionLi;
        }
    }
    return null;
}


//获取会话列表
function getSessionList() {
    $.ajax({
        type:'get',
        url:'/sessionList',
        success: function(body) {
            let sessionList = document.querySelector("#session-list");
            sessionList.innerHTML = "";

            for(let session of body) {
                if(session.lastMessage == null)
                {
                    session.lastMessage = '';
                }
                if(session.lastMessage >10)
                {
                    session.lastMessage = session.lastMessage.substring(0,10);
                }

                let li = document.createElement('li');

                //将sessionId存在li中
                li.setAttribute("message-session-id", session.sessionId);
                li.innerHTML = '<h3>' + session.friends[0].friendName + '</h3>'+
                                '<p>' + session.lastMessage + '</p>';
                
                //将sessionId保存在前端以备后用
                li.setAttribute('message-session-id', session.sessionId);
                //将li添加到列表

                sessionList.appendChild(li);

                //为session注册点击事件
                li.onclick = function() {
                    sessionOnclick(li);
                };
                
            }
        },error:function(){
            alert("获取会话列表失败");
        }
    });
}

getSessionList();

function sessionOnclick(currentLi) {
    //获取到全部的li
    let sessionLis = document.querySelectorAll('#session-list>li');
    //将选中的元素设置为高亮，
    activeSession(sessionLis,currentLi);
    //获取历史数据
    let sessionId = currentLi.getAttribute('message-session-id');
    getHistoryMessage(sessionId);
}

function activeSession(sessionLis,currentLi) {
    //从所有li列表中，找到被点击的元素，并设置为高亮
    for(let session of sessionLis) {
        if(session == currentLi) {
            session.className = 'selected';
        }else{
            //不是就设置为''不应用高亮
            session.className = '';
        }
    }

}

//获取指定会话的历史信息
function getHistoryMessage(sessionId) {
    //清空右边的内容
    let titleDiv = document.querySelector('.right .title')
    let messageShowDiv = document.querySelector('.right .message-show');
    titleDiv.innerHTML = '';
    messageShowDiv.innerHTML = '';

    //设置会话的标题
    let selectH3 = document.querySelector('#session-list .selected>h3');
    // selectedH3 可能不存在的. 比如页面加载阶段, 可能并没有哪个会话被选中. 
    if(selectH3){
        titleDiv.innerHTML=selectH3.innerHTML;
    }else{
        //会话不存在，直接返回不调用后端获取历史消息
        return;
    }

    //访问后端获取数据
    $.ajax({
        type:'get',
        url:'message?sessionId=' + sessionId,
        success: function(body) {
            for(let message of body) {
                addMessage(messageShowDiv,message);
            }

            //将内容滚动到底部
            scrollBottom(messageShowDiv)
        },
        error: function(){
            alert("获取历史消息失败");
        }
    });

}

// 把 messageShowDiv 里的内容滚动到底部.
function scrollBottom(elem) {
    // 1. 获取到可视区域的高度
    let clientHeight = elem.offsetHeight;
    // 2. 获取到内容的总高度
    let scrollHeight = elem.scrollHeight;
    // 3. 进行滚动操作, 第一个参数是水平方向滚动的尺寸. 第二个参数是垂直方向滚动的尺寸
    elem.scrollTo(0, scrollHeight - clientHeight);
}

function addMessage(messageShowDiv,message) {
    //获取之前保存在前端的用户名
    let selectUserName = document.querySelector('.left .user').innerHTML;
    //创建一个消息列表
    let messageDiv = document.createElement('div');

    if (message.fromName == selectUserName) {
        //如果消息发送人和当前用户名相同，靠右
        messageDiv.className = 'message message-right';
    } else {
        //消息是别人发的，靠左
        messageDiv.className = 'message message-left';
    }

    //赋值div
    messageDiv.innerHTML = '<div class="box">' + '<h4>' + message.fromName + '</h4>'
        + '<p>' + message.content + '</p>'
        + '<div>';

    //
    messageShowDiv.appendChild(messageDiv);


}