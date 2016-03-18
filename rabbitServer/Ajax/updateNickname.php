<?php

//json_friendship里包含 friend_id,remarkname  :  {"friend_id":"123456","remark_name":"654321"}

 include("../config.db.php");
 $json_friendship = json_decode($_GET[json_friendship]);
 $my_id=$_SESSION['uid'];
 $friendship=array("my_id"=>"$my_id",
					"friend_id"=>"$json_message[friend_id]",
					"remark_name"=>"$json_message[remark_name]");
 $me->updateNickname($friendship);
?>
