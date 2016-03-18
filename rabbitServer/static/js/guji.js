
$(document).ready(function(){

    $.ajax({
        type:"GET",//使用get方法访问后台
        url:"../Ajax/getFriendListAndProfile.php",//要访问的后台地址
        dataType:"json",//要接收的数据类型
        success:function(data){
            //初始化个人信息页面
            var arr = eval(data);
            console.log(arr);
            if (arr.profile === 'user does not exist!') {
                window.location.href = "/rabbit1212/Rabbit/Login/login.php"
            }
            var pro = arr.profile;
            var user_id = pro.user_id;
            var user_name = pro.user_name;
            var user_birthday = pro.user_birthday;
            var user_signature = pro.user_signature;
            var user_head_portrait = pro.user_head_portrait;
            var friend = arr.friends;

            setData(user_name, user_birthday, user_signature, user_head_portrait);

            //初始化联系人列表
            setFriends(friend);

            //初始化聊天列表
            setChatList(user_head_portrait, user_name, friend);
            setChatDetailSwitch(friend, user_head_portrait);

            mainJs();


            var socket = io.connect('http://rabbitpiyoko.com:3000');
            setTimeout(function(){
                socket.emit('connectionSuccess',{user_id:user_id});
            },1000);
            $('#biu').click(function(){
                if ($('#msg-input').val().length === 0) {
                    showOuterMessage('#chat-panel', false, '还未输入消息！');
                }
                else {
                    msg = $('#msg-input').val()
                    $('#msg-input').val('');
                    var message = {
                        sender_id:user_id,
                        receiver_id:$("#detailFriendName").attr('data'),
                        pm_content:msg
                    }
                    socket.emit('sendMsg', message);
                }
            });
            socket.on('receiveMsg',function(message){
                var receiveORsend = "";
                var friendId = "";
                if(message.sender_id === user_id) {
                    receiveORsend = "send";
                    friendId = message.receiver_id;
                }
                else if(message.receiver_id === user_id){
                    receiveORsend = "receive";
                    friendId = message.sender_id;
                }
                for(var i=0;i<friend.length;i++)
                {
                    if(friend[i].friend_id == friendId) {
                        var chat=friend[i].all_messages.push({
                            pm_content: message.pm_content,
                            pm_id:message.pm_id,
                            pm_state:message.pm_state,
                            pm_time:message.pm_time,
                            receiveORsend:receiveORsend
                        });
                        setChatList(user_head_portrait, user_name, friend);
                        console.log(friend[i].all_messages);
                        setChatDetailSwitch(friend, user_head_portrait);
                        if($('#detailFriendName').attr('data') === friendId) {
                            var friendHead = $('#detailFriendHead').attr('src');
                            var pm_content=message.pm_content;
                            if(receiveORsend == "send") {
                                $("#chat-panel").append('<div class="row"><div class="col-xs-10"><div class="tooltip fade left in" style="right:1em;z-index:0;"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+pm_content+'</div></div></div><div class="col-xs-2 headback"><img style="z-index:0;" src="'+user_head_portrait+'"class="head my-head"/></div></div>');
                            }
                            else if(receiveORsend == "receive") {
                                $("#chat-panel").append('<div class="row"><div class="col-xs-2 headback friend-head"><img style="z-index:0;" src="'+friendHead+'"class="head friend-head "/> </div><div class="col-xs-10"><div class="tooltip fade right in" style="left:1em;z-index:0;"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+pm_content+'</div></div></div></div>');
                            }
                            setTimeout(function(){
                                var h = $('#chat-panel').height();
                                if (h > 0) {
                                    $('html,body').animate({scrollTop:h}, 500);
                                }
                            },200)
                        }
                        break;
                    }
                }
            });
            $('#sureSearch').click(function(){
                var searchId = $('#newFriendSearch').val();
                if (searchId === ''){
                    showOuterMessage('#searcherForm', false, '输入对方的用户名啦><');
                } else {
                    socket.emit('searchFriend',{searchId:searchId, my_id:user_id});
                }
            })
            socket.on('searchFriendResult',function(searchFriendDetail){
                if ( !searchFriendDetail ) {
                    showOuterMessage('#searcherForm', false, '没有找到用户><');
                }
                else {
                    $('#searcherForm').hide();
                    $('#searcherResult').show();
                    if ( searchFriendDetail.added === true ) {
                        $('#addWin').html("耐心点等待回复啦><");
                        $('#addWin').attr('disabled','disabled');
                    } else if ( user_id === searchFriendDetail.user_id ) {
                        $('#addWin').html("不能添加自己><");
                        $('#addWin').attr('disabled','disabled');
                    }
                    for ( one in friend ) {
                        if ( friend[one].friend_id === searchFriendDetail.user_id ) {
                            $('#addWin').html("不能再加一次><");
                            $('#addWin').attr('disabled','disabled');
                            break;
                        }
                    }
                    $('#searchResultName').attr('data', searchFriendDetail.user_id);
                    $('#searchResultName').html(searchFriendDetail.user_name);
                    $('#searchResultHead').attr('src', searchFriendDetail.user_head_portrait);
                    $('#searchResultSignature').html(searchFriendDetail.user_signature);
                }
            })
            $('#addWin').click(function(){
                var helloWord = $('#helloWord').val();
                var addMessage = {
                    sender_id:user_id,
                    receiver_id:$('#searchResultName').attr('data'),
                    sender_name:user_name,
                    pm_content:helloWord
                }
                if (helloWord === '') {

                }
                else {
                    socket.emit('addFriend', addMessage);
                }
            })
            socket.on('newHello',function(newFriend) {
                friend.push(newFriend);
                setFriends(friend);
                setChatList(user_head_portrait, user_name, friend);
                setChatDetailSwitch(friend, user_head_portrait);
            })
            socket.on('receiveAdd', function(){
                showOuterMessage('.linkmandatePanel', true, '请求发送成功');
                setTimeout(function(){
                    window.location.hash = 'chat';
                },1000);
            })
            socket.on('addAccepted',function(newFriend) {
                friend.push(newFriend);
                setFriends(friend);
                setChatList(user_head_portrait, user_name, friend);
                setChatDetailSwitch(friend, user_head_portrait);
            })
            $('#acceptFriend').click(function(){
                var addMessage = {
                    friend_id:user_id,
                    my_id: $('#detailFriendName').attr('data'),
                    remark_name: user_name,
                    pm_id:$('#detailFriendName').attr('pm_id')
                }
                console.log("addSure");
                socket.emit('addSure', addMessage);
            })
            $('#refuseFriend').click(function(){
                var refuseMessage = {
                    my_id:user_id,
                    friend_id: $('#detailFriendName').attr('data'),
                    pm_id:$('#detailFriendName').attr('pm_id')
                }
                console.log("refuseSure");
                socket.emit('refuseSure', refuseMessage);
            })
            socket.on('addSuccess', function(){
                showOuterMessage('#chatListBack', true, '添加成功')
                $('#addButtons').hide();
                $('#biu').removeAttr('disabled');
                $('#msg-input').removeAttr('disabled');
                for(var i=0;i<friend.length;i++) {
                    if(friend[i].friend_id == $('#detailFriendName').attr('data')) {
                        console.log(friend);
                        friend[i].all_messages[0].pm_state = '1';
                        break;
                    }
                }
            })
            socket.on('refuseSuccess', function(){
                showOuterMessage('#chatListBack', false, '拒绝成功')
                $('#addButtons').hide();
                for(var i=0;i<friend.length;i++) {
                    if(friend[i].friend_id == $('#detailFriendName').attr('data')) {
                        friend.remove(i);
                        setFriends(friend);
                        setChatList(user_head_portrait, user_name, friend);
                        setChatDetailSwitch(friend, user_head_portrait);
                        window.location.hash = "chat"
                    }
                }
            })
            $('#changeNickButton').click(function(){
                socket.emit('changeNickName',{
                    my_id:user_id,
                    friend_id:$('#friendPro-id').html(),
                    remark_name:$('#friendPro-remarkname').val()
                });
                return false;
            });
            socket.on('setNickSuccess',function(msg) {
                for(var i=0;i<friend.length;i++) {
                    if(friend[i].friend_id == msg.friend_id) {
                        friend[i].remark_name = msg.remark_name;
                        setFriends(friend);
                        setChatList(user_head_portrait, user_name, friend);
                        setChatDetailSwitch(friend, user_head_portrait);
                    }
                }
            });
            $('#deleteFriendButton').click(function() {
                socket.emit('deleteFriend',{
                    my_id:user_id,
                    friend_id:$('#friendPro-id').html(),
                });
            })
            socket.on('deleteSuccess',function(msg) {
                for(var i=0;i<friend.length;i++) {
                    if(friend[i].friend_id == msg.friend_id) {
                        console.log("Delete");
                        friend.remove(i);
                        setFriends(friend);
                        setChatList(user_head_portrait, user_name, friend);
                        setChatDetailSwitch(friend, user_head_portrait);
                        if( $('#friendPro-id').html() === msg.friend_id || $('#detailFriendName').attr('data') === msg.friend_id ) {
                             window.location.hash = 'chat';
                        }
                    }
                }
            });
            $('#changeDataButton').click(function() {
                socket.emit('changeData',{
                    user_id:user_id,
                    user_name:$('#nameInput').val(),
                    user_signature:$('#signInput').val()
                });
            })
            socket.on('changeDataSuccess',function(msg) {
                user_name = msg.user_name;
                user_signature = msg.user_signature;
                setData(user_name, user_birthday, user_signature, user_head_portrait);
            })

        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        },
        complete:function(XMLHttpRequest,textStatus){
            this;//调用本次ajax请求时传递的options参数
        }
    })
    <!----------------------------------main.js------------------------------------------->
    function mainJs()
    {
        $(".nav-icon").click(function(){
            window.location.hash = $(this).attr("for");
        })
        window.onhashchange = function(){
            changePage();
        }
        var changePage = function(){
            var nowpage = window.location.hash;
            var nowdetail = nowpage.split("#");
            $(".page").hide();
            $(nowpage).show();
            $(".bottom-icon").removeClass("nav-active nav-unactive");
            $(".bottom-icon").addClass("nav-unactive");
            $(".fui-"+nowdetail[1]).removeClass("nav-unactive");
            $(".fui-"+nowdetail[1]).addClass("nav-active");
            if(nowpage === '#chat'||nowpage === '#home'||nowpage === '#user') {
                $("#bottomGuide").show();
            }
        }

        $("#back2chat").click(function(){
            $('#biu').removeAttr('disabled');
            $('#msg-input').removeAttr('disabled');
            window.location.hash = "chat";
            $('#addButtons').hide();
        })
        <!------------------------迟早消灭你们！！！！！！！！！---------------------------->
        $('#changeMyDataButton').click(function(){
            window.location.hash = "changeMyData";
            $("#bottomGuide").hide();
        })



        window.location.hash = 'chat';
        changePage();
    }
    var setFriends = function(friend) {
        console.log(friend);
        $('#friend-list').empty();
        for(var i=0;i<friend.length;i++) {
            var friend_id = friend[i].friend_id;
            var remark_name = friend[i].remark_name;
            var friend_signature = friend[i].friend_signature;
            var friend_head_portrait = friend[i].friend_head_portrait;
            $("#friend-list").append('<div class="row lululu friendCheck"><div class="col-xs-12"><div class="string"></div></div><div class="col-xs-2 friendHeadback"><img class="head friend-head" src="'+friend_head_portrait+'" /></div><div class="col-xs-10 friends" data="'+friend_id+'"><h2 class="friendName" >'+remark_name+'</h2><p>'+friend_signature+'</p></div></div>');
        }
    }
    var setChatList = function(user_head_portrait, user_name, friend) {
      if (friend.length > 1) {
        friend = combine(friend);
      }
        $('#chat-list').empty();
        for(var i=friend.length-1;i>=0;i--) {
            var chat = friend[i].all_messages;
            if(chat.length != 0) {
                var chat_friend_id = friend[i].friend_id;
                var chat_friend_head = friend[i].friend_head_portrait;
                var chat_friend_name = friend[i].remark_name;
                var chat_lastest = chat[chat.length - 1].pm_content;
                var chat_last_time = chat[chat.length - 1].pm_time;
                var chat_id = chat[chat.length - 1].pm_id;
                $("#chat-list").append('<div class="row listback friendCheck" data="'+chat_id+'"><div class="col-xs-2 headback"><img class="head friend-head" src="'+chat_friend_head+'"/></div><div class="col-xs-10 friends" data="'+chat_friend_id+'"><h2 class="friendName">'+chat_friend_name+'</h2><p>'+chat_lastest+'</p><p class="time">'+chat_last_time+'</p><div class="string"></div></div></div>');
            } else {
                break;
            }
        }
    }
    $(".back2chat").click(function(){
        window.location.hash = "chat";
        $('#addWin').html('加为好友');
        $('#addWin').removeAttr('disabled','disabled');
        $('#addButtons').hide();
        $("#bottomGuide").show();
    })
    $('#add2').on('click',function(){
        window.location.hash = "searchUser";
        $('#searcherForm').show();
        $('#searcherResult').hide();
        $("#bottomGuide").hide();
    })
    $('#addFriendButton').click(function(){
        if ($("#showAdder").css('display') === 'none') {
            $("#showAdder").show();
        } else {
            $("#showAdder").hide();
        }
    })
    $('#unlogin').click(function(){
      window.location.href='/rabbit1212/Rabbit/Login/login.php';
    })
    Array.prototype.remove=function(dx) {
        if(isNaN(dx)||dx>this.length){return false;}
        for(var i=0,n=0;i<this.length;i++) {
            if(this[i]!=this[dx]) {
                this[n++]=this[i]
            }
        }
        this.length-=1
    }
    var setChatDetailSwitch = function(friend, user_head_portrait){
        $(".friendCheck").on('click',function() {
            $("#chat-panel").empty();
            var friendName = $(this).find(".friendName").text();
            var friendHead = $(this).find(".head").attr("src");
            var friendId = $(this).find(".friends").attr("data");
            $("#detailFriendName").text(friendName)
            $("#detailFriendName").attr('data', friendId)
            $("#detailFriendHead").attr('src',friendHead);
            $(".headback .my-head").attr('src',user_head_portrait);
            for(var i=0;i<friend.length;i++) {
                if(friend[i].friend_id == friendId) {
                    var chat=friend[i].all_messages;
                    console.log(chat);
                    for(var j = 0; j < chat.length; j++) {
                        var receiveORsend = chat[j].receiveORsend;
                        var state = chat[j].pm_state;
                        if(receiveORsend == "send") {
                            var pm_content=chat[j].pm_content;
                            $("#chat-panel").append('<div class="row"><div class="col-xs-10"><div class="tooltip fade left in"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+pm_content+'</div></div></div><div class="col-xs-2 headback"><img style="z-index:-1;" src="'+user_head_portrait+'"class="head my-head"/></div></div>');
                        }
                        else if(receiveORsend == "receive") {
                            var pm_content=chat[j].pm_content;
                            $("#chat-panel").append('<div class="row"><div class="col-xs-2 headback friend-head"><img style="z-index:0;" src="'+friendHead+'"class="head friend-head "/> </div><div class="col-xs-10"><div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+pm_content+'</div></div></div></div>');
                        }
                        if (chat[j].pm_state === "3") {
                            $('#biu').attr('disabled','disabled');
                            $('#msg-input').attr('disabled','disabled');
                            $('#addButtons').show();
                            $('#detailFriendName').attr('pm_id',chat[j].pm_id);
                        }
                    }
                    break;
                }
            }
            setTimeout(function(){
                var h = $('#chat-panel').height();
                console.log(h);
                if (h > 0) {
                    $('html,body').animate({scrollTop:h}, 500);
                }
            },200)
            setFriendDetailSwitch(friendId, friend);
            window.location.hash = "chatDetail"
            $("#bottomGuide").hide();
        })
    }
    var setFriendDetailSwitch = function(friendId, friend) {
        $('.friend-head').on('click',function() {
            console.log(friendId);
            for(var i=0;i<friend.length;i++) {
                if(friend[i].friend_id == friendId) {
                    $("p#friendPro-name").html(friend[i].friend_name);
                    $("p#friendPro-id").html(friend[i].friend_id);
                    $("p#friendPro-birthday").html(friend[i].friend_birthday);
                    $("#friendPro-remarkname").attr('value',friend[i].remark_name);
                    $("p#friendPro-signature").html(friend[i].friend_signature);
                    $(".friendPro-head").attr('src',friend[i].friend_head_portrait);
                }
            }
            window.location.hash = "friendDetail"
            $("#bottomGuide").hide();
        })
    }
    var showOuterMessage = function(father, state, word) {
        if (state === true) {
            $(father).append('<div class="col-xs-10 col-xs-offset-1 outerMessage goodMsg"> <p>'+word+'</p> </div>')
        }
        else {
            $(father).append('<div class="col-xs-10 col-xs-offset-1 outerMessage badMsg"> <p>'+word+'</p> </div>')
        }
        setTimeout(function(){
            $('.outerMessage').remove();
        },1000);
    }
    var setData = function(user_name, user_birthday, user_signature, user_head_portrait) {
        $("#small-head").attr('src',user_head_portrait);
        $("#small-name").html(user_name);
        $("p#username").html(user_name);
        $("p#birthday").html(user_birthday);
        $("p#signature").html(user_signature);
        $("#head").attr('src',user_head_portrait);
    }
    var combine = function(friend) {
      var tail;
      for (var i=friend.length-1;i>=0;i--) {
            var chat = friend[i].all_messages;
        if ( chat.length === 0 ) {
          tail.push(friend[o]);
          friend.remove(o);
        }
      }
      friend = sort(friend);
      if (typeof(tail)!="undefined") friend.push(tail);
      return friend;
    }
    var sort = function(friend) {
      if (friend.length == 0) return [];
      console.log("sort!");
      var left = new Array();
      var right = new Array();
      var pivot = friend[0];
      for (var i = 1; i < friend.length; i++) {
        if ( friend[i].all_messages[friend[i].all_messages.length - 1].pm_id < friend[0].all_messages[friend[0].all_messages.length - 1].pm_id ) {
          left.push(friend[i]);
        } else {
          right.push(friend[i]);
        }
      }
      return sort(left).concat(pivot,sort(right));
    }
});
