<?php

	session_start();
 	date_default_timezone_set("Asia/Shanghai");
    $db_config["hostname"]    = "127.0.0.1";    //服务器地址
    $db_config["username"]    = "root";        //数据库用户名
    $db_config["password"]    = "1234";        //数据库密码
    $db_config["database"]    = "rabbit";        //数据库名称
    $db_config["charset"]        = "utf8";
    include('db.php');
    include('Classes/users.php');
    $db    = new db();
    $db->connect($db_config);
    $me = new users();
    //test connection
/*
    $row = $db->row_select('users', 'id=1');
    echo $row[0][name];
    $array = array('id'=>'','password'=>'123','name'=>'me');
    $row = $db->row_insert('users',$array);
*/
?>