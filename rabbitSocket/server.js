var io = require('socket.io').listen(3000);
var mysql = require('mysql');
var group = [];
var sqlCon = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database:'rabbit',
}


console.log("server listening on port 3000.");

Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

io.sockets.on('connection', function(socket){
    socket.on('connectionSuccess',function(usr){
        group.push({
            user_id:usr.user_id,
            socket:socket
        })
        for (var o in group ) {
            console.log(group[o].user_id);
        }
    });
    console.log("new connection!");
    socket.on('sendMsg', function(msg) {
        var client = mysql.createConnection(sqlCon)
        myDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
        msg.pm_state = 0;
        msg.pm_time = myDate.toLocaleString();
        client.connect();
        var sql1 = 'INSERT INTO `private_messages` ( `sender_id`, `receiver_id`, `pm_time`, `pm_content`, `pm_state` ) VALUES ("'+msg.sender_id+'", "'+msg.receiver_id+'", "'+msg.pm_time+'", "'+msg.pm_content+'","'+msg.pm_state+'" );'
        var sql2 = 'SELECT LAST_INSERT_ID()';
        client.query(sql1, function(err1,res1){
            if(err1) console.log(err1);
            client.query(sql2, function(err2, rows){
                if (err2) console.log(err2);
                msg.pm_id = rows[0]['LAST_INSERT_ID()'];
                client.end();
                console.log(msg);
                for (var o in group ) {
                    if ( group[o].user_id === msg.receiver_id) {
                        msg.pm_state = 1;
                        group[o].socket.emit('receiveMsg', msg);
                        break;
                    }
                }
                socket.emit('receiveMsg', msg);
            })
        });
    })
    socket.on('searchFriend', function(msg){
        var client = mysql.createConnection(sqlCon)
        client.connect();
        var sql1 = 'select user_id, user_name, user_sex, user_head_portrait, user_signature from users where user_id="' + msg.searchId + '";';
        var sql2 = 'select my_id from friends where my_id="' + msg.searchId + '" and friend_id="'+msg.my_id+'";';
        client.query(sql1, function(err1, rows1){
            if(err1) console.log("1:"+err1);
            client.query(sql2, function(err2, rows2) {
                if(err2) console.log("2:"+err2);
                if (rows2.length > 0) {
                    console.log(rows1);
                    rows1[0].added = true;
                }
                socket.emit('searchFriendResult',rows1[0]);
                client.end();
            })
        });
    })
    socket.on('addFriend',function(msg){
        var client = mysql.createConnection(sqlCon)
        myDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
        msg.pm_state = 3;
        msg.pm_time = myDate.toLocaleString();
        client.connect();
        console.log(msg);
        var sql1 = 'INSERT INTO `friends` ( `my_id`, `friend_id` ,`remark_name` ) VALUES ("'+msg.receiver_id+'", "'+msg.sender_id+'", "'+msg.sender_name+'")';
        var sql2 = 'INSERT INTO `private_messages` ( `sender_id`, `receiver_id`, `pm_time`, `pm_content`, `pm_state` ) VALUES ("'+msg.sender_id+'", "'+msg.receiver_id+'", "'+msg.pm_time+'", "'+msg.pm_content+'","'+msg.pm_state+'" );'
        var sql3 = 'SELECT LAST_INSERT_ID()';
        var sql4 = 'SELECT * FROM `users` WHERE user_id="'+msg.sender_id+'";';
        console.log(sql4);
        client.query(sql1, function(err1,res1){
            if(err1) console.log(err1);
            client.query(sql2, function(err2,res2){
                if(err2) console.log(err2);
                for (var o in group ) {
                    if ( group[o].user_id === msg.receiver_id) {
                        client.query(sql3,function(err3,row1) {
                            if(err3) console.log(err3);
                            client.query(sql4,function(err4,row2) {
                                if(err4) console.log(err4);
                                all_messages=[{
                                    pm_content:msg.pm_content,
                                    pm_id:row1[0]['LAST_INSERT_ID()'],
                                    pm_state:'3',
                                    pm_time:msg.pm_time,
                                    receiveORsend:'receive'
                                }];
                                var newFriend = {
                                    all_messages:all_messages,
                                    friend_birthday:row2[0].user_birthday,
                                    friend_head_portrait:row2[0].user_head_portrait,
                                    friend_id:row2[0].user_id,
                                    friend_name:row2[0].user_name,
                                    friend_sex:row2[0].user_sex,
                                    friend_signature:row2[0].user_signature,
                                    remark_name:row2[0].user_name,
                                };
                                client.end();
                                console.log(newFriend);
                                group[o].socket.emit('newHello', newFriend);
                            });
                        });
                        break;
                    }
                }
                socket.emit('receiveAdd');
            });
        });
    });
    socket.on('addSure',function(msg){
        var client = mysql.createConnection(sqlCon)
        client.connect();
        console.log(msg);
        var sql1 = 'INSERT INTO `friends` ( `my_id`, `friend_id` ,`remark_name` ) VALUES ("'+msg.my_id+'", "'+msg.friend_id+'", "'+msg.remark_name+'")';
        var sql2 = 'UPDATE `private_messages` SET pm_state="1" WHERE pm_id="'+msg.pm_id+'";'
        var sql3 = 'SELECT * FROM `users` WHERE user_id="'+msg.friend_id+'";';
        client.query(sql1, function(err1,res1){
            if(err1) console.log(err1);
            client.query(sql2, function(err2,res2){
                if(err2) console.log(err2);
                for (var o in group ) {
                    if ( group[o].user_id === msg.my_id) {
                        client.query(sql3, function(err3,row) {
                            if(err3) console.log(err3);
                            var newFriend = {
                                all_messages:[],
                                friend_birthday:row[0].user_birthday,
                                friend_head_portrait:row[0].user_head_portrait,
                                friend_id:row[0].user_id,
                                friend_name:row[0].user_name,
                                friend_sex:row[0].user_sex,
                                friend_signature:row[0].user_signature,
                                remark_name:row[0].user_name,
                            };
                            client.end();
                            console.log(newFriend);
                            group[o].socket.emit('addAccepted', newFriend);
                        })
                        break;
                    }
                }
                socket.emit('addSuccess');
            });
        });
    })
    socket.on('refuseSure',function(msg){
        var client = mysql.createConnection(sqlCon)
        client.connect();
        console.log(msg);
        var sql1 = 'DELETE FROM `friends` WHERE my_id="'+msg.my_id+'" and friend_id="'+msg.friend_id+'";';
        var sql2 = 'DELETE FROM `private_messages` WHERE pm_id="'+msg.pm_id+'";'
        client.query(sql1, function(err1,res1){
            if(err1) console.log(err1);
            client.query(sql2, function(err2,res2){
                console.log(sql2);
                if(err2) console.log(err2);
                client.end();
                socket.emit('refuseSuccess');
            });
        });
    })
    socket.on('changeNickName',function(msg) {
        var client = mysql.createConnection(sqlCon)
        var sql = 'UPDATE `friends` SET remark_name="'+msg.remark_name+'" WHERE my_id="'+msg.my_id+'" AND friend_id="'+msg.friend_id+'";'
        client.query(sql, function(err,res){
            if(err) console.log(err);
            socket.emit('setNickSuccess',msg);
            client.end();
        });
    });
    socket.on('changeData',function(msg) {
        var client = mysql.createConnection(sqlCon)
        var sql = 'UPDATE `users` SET user_name="'+msg.user_name+'", user_signature="'+msg.user_signature+'" WHERE user_id="'+msg.user_id+'";'
        client.query(sql, function(err,res){
            if(err) console.log(err);
            socket.emit('changeDataSuccess',msg);
            client.end();
        });
    });
    socket.on('deleteFriend',function(msg) {
        var client = mysql.createConnection(sqlCon)
        var sql1 = 'DELETE FROM `friends`  WHERE my_id="'+msg.my_id+'" AND friend_id="'+msg.friend_id+'";'
        var sql2 = 'DELETE FROM `friends`  WHERE my_id="'+msg.friend_id+'" AND friend_id="'+msg.my_id+'";'
        var sql3 = 'DELETE FROM `private_messages`  WHERE sender_id="'+msg.friend_id+'" AND receiver_id="'+msg.my_id+'";'
        var sql4 = 'DELETE FROM `private_messages`  WHERE sender_id="'+msg.my_id+'" AND receiver_id="'+msg.friend_id+'";'
        client.query(sql1, function(err1,res1){
            if(err1) console.log(err1);
            client.query(sql2, function(err2, res2) {
                if (err2) console.log(err2);
                client.query(sql3, function(err3, res3) {
                    if (err3) console.log(err3);
                    client.query(sql4, function(err4, res4) {
                        if (err4) console.log(err4);
                        for (var o in group ) {
                            if ( group[o].user_id === msg.friend_id) {
                                console.log(msg.friend_id);
                                group[o].socket.emit('deleteSuccess', {
                                    friend_id:msg.my_id
                                });
                                break;
                            }
                        }
                        socket.emit('deleteSuccess',{
                            friend_id:msg.friend_id
                        });
                        client.end();
                    });
                });
            });
        });
    });
    socket.on('disconnect', function() {
        for (var o in group) {
            if ( group[o].socket === socket) {
                delete group[o];
                break;
            }
        }
    });
});
