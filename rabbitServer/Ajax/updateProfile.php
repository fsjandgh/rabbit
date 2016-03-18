<?php


//json_new_profile里包含发送新的名字、新的性别、新的生日、新的签名，如果没有更改就直接为空'' :
//{"new_name":"name","new_sex":"1","new_birthday":"2015-12-10","new_signature":""}（签名没有更新）

include("../config.db.php");


$my_id=$_SESSION['uid'];
$json_new_profile = json_decode($_GET[json_new_profile]);

$newProfile = array(
	'new_name' =>$json_new_profile['new_name'],
	'new_sex'=>$json_new_profile['new_sex'],
	'new_birthday'=>$json_new_profile['new_birthday'],
	'new_signature'=>$json_new_profile['new_signature']
);

$update = $me->updateProfile($newProfile,$my_id);

?>
