<?php

session_start();
 include("config.db.php");

$my_id = $_SESSION['uid'];

$test = $me->getFriendsList(test);
$profile = $me->getProfile(test);

$myarray = ARRAY(
'profile'=>$profile,
'friends'=>$test
);
$str=json_encode($myarray);
//echo $str."</br>";

$newProfile = array(
	'new_name' =>'new_name',
	'new_sex'=>'2',
	'new_birthday'=>'',
	'new_signature'=>'abcdefg'
);

$update = $me->updateProfile($newProfile,test);
//echo $update;

$searchUser = $me->searchUser(1);
//echo $searchUser['user_name'];


 $new_message=array("sender_id"=>"2",
					"receiver_id"=>"$my_id",
					"content"=>"1234");
 //$test = $me->sendMessage($new_message);

 $friendship=array(
 			'my_id'=>$my_id,
 			'friend_id'=>'2',
 			'remark_name'=>'hello'
 			);
 //$friend = $me->rejectFriendRequest($friendship);

 $test = $me->updateNickname($friendship);