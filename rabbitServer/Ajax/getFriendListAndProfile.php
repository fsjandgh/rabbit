<?php
include("../config.db.php");


$my_id=$_SESSION['uid'];
$friendList = $me->getFriendsList($my_id);
$profile = $me->getProfile($my_id);

$myarray = ARRAY(
'profile'=>$profile,
'friends'=>$friendList
);
$init=json_encode($myarray);
echo $init;
?>
