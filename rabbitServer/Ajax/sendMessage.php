<?php


//json_message里包含 receiver_id,content  :  {"receiver_id":"123456","content":"654321"}

 include("../config.db.php");
 $json_message = json_decode($_GET[json_message]);
 $my_id=$_SESSION['uid'];
 $new_message=array("sender_id"=>"$my_id",
					"receiver_id"=>"$json_message[receiver_id]",
					"content"=>"$json_message[content]");
 $me->sendMessage($new_message);
?>
