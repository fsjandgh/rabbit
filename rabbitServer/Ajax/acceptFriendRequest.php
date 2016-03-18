<?php

//json_friend_id里包含发送好友请求的ID :     {"friend_id":"123456"}

 include("../config.db.php");
 $json_friend_id = json_decode($_GET[json_friend_id]);
 $my_id=$_SESSION['uid'];
 $friendship=array("my_id"=>"$my_id",
					"friend_id"=>"$json_friend_id[friend_id]"
					);
 $me->acceptFriendRequest($friendship);
?>
</font>