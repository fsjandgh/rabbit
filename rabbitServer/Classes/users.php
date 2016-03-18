<?php

	class users{

		//获取好友列表
		function getFriendsList($my_id){

			$sql1="SELECT * FROM `friends` WHERE `my_id`='$my_id'";
			$getFriendList=mysql_query($sql1);

			$recentContactFriends = array();
			while($myFriend = mysql_fetch_array($getFriendList)){
				//查找所有消息
				$sql3 = "SELECT *
						FROM  `private_messages`
						WHERE  `sender_id` =  '$my_id'
						AND  `receiver_id` =  '$myFriend[friend_id]'
						OR  `sender_id` =  '$myFriend[friend_id]'
						AND  `receiver_id` =  '$my_id' order by pm_time asc";
				$getAllMessage=mysql_query($sql3);
				$allMessages = array();
				while($myMessage = mysql_fetch_array($getAllMessage)){
					//将消息记录压进数组
					$single_message = array(
					'pm_id'=>(int)$myMessage['pm_id'],
					'pm_time'=>$myMessage['pm_time'],
					'pm_content'=>$myMessage['pm_content'],
					'pm_state'=>$myMessage['pm_state'],
					'receiveORsend'=>$myMessage['sender_id']==$my_id?'send':'receive'
					);
					array_push($allMessages,$single_message);
				}
				//获取好友的资料
				$friend_profile = $this->getProfile($myFriend['friend_id']);
				//压进数组
				$single_record = array(

				'friend_id'=>$myFriend['friend_id'],
				'remark_name'=>$myFriend['remark_name'],

				'friend_name'=>$friend_profile['user_name'],
				'friend_sex'=>$friend_profile['user_sex'],
				'friend_birthday'=>$friend_profile['user_birthday'],
				'friend_head_portrait'=>$friend_profile['user_head_portrait'],
				'friend_signature'=>$friend_profile['user_signature'],

				'all_messages'=>$allMessages
				);
				array_push($recentContactFriends, $single_record);
			}
			return $recentContactFriends;
		}


		//获取用户资料
		function getProfile($user_id){

			$sql1="select * from users where user_id='$user_id'";
			$getUserProfile=mysql_query($sql1);
			if($userProfile=mysql_fetch_array($getUserProfile)){
				$profile = ARRAY(
					'user_id'=>$userProfile['user_id'],
					'user_name'=>$userProfile['user_name'],
					'user_sex'=>$userProfile['user_sex'],
					'user_birthday'=>$userProfile['user_birthday'],
					'user_head_portrait'=>$userProfile['user_head_portrait'],
					'user_signature'=>$userProfile['user_signature']
				);
				return $profile;
			}
			else return 'user does not exist!';
		}

		//更新个人资料
		function updateProfile($newProfile,$my_id){
			//查找出原本的资料，如果没有修改的就把原本的值赋值给新的资料
			$sql1="select * from users where user_id='$my_id'";
			$query=mysql_query($sql1);
			$result=mysql_fetch_array($query);

			if($newProfile['new_name']=='')
				$newProfile['new_name']=$result['user_name'];
			if($newProfile['new_sex']=='')
				$newProfile['new_sex']=$result['user_sex'];
			if($newProfile['new_birthday']=='')
				$newProfile['new_birthday']=$result['user_birthday'];
			if($newProfile['new_signature']=='')
				$newProfile['new_signature']=$result['user_signature'];
			//执行更新操作
			$sql2 = "UPDATE `users` SET " .
					"`user_name`='$newProfile[new_name]'," .
					"`user_sex`='$newProfile[new_sex]'," .
					"`user_birthday`='$newProfile[new_birthday]'," .
					"`user_signature`='$newProfile[new_signature]'WHERE `user_id`='$my_id'";
			$updateProfile = mysql_query($sql2);

			//执行更新操作
			$sql2 = "UPDATE `users` SET `user_signature`='a' WHERE `user_id`='$my_id'";
			$updateProfile = mysql_query($sql2);

			return $result[user_name];

		}


		//发送信息
		function sendMessage($new_message){


		 $timestamp = date('Y-m-d H:i:s');

		 $sql1="INSERT INTO `private_messages`" .
		 		"(`pm_id`, `sender_id`, `reciever_id`, " .
		 		"`pm_time`, `pm_content`, `pm_state`) VALUES " .
		 		"('','$new_message[sender_id]','$new_message[receiver_id]','$timestamp','$new_message[content]','0')";
		 $result=mysql_query($sql1) or die( mysql_error() );

		}

		//查找用户
		function searchUser($user_id){
			$user = $this->getProfile($user_id);
			if(is_array($user))
				return $user;
			else return false;
		}

		//接受好友请求
		function acceptFriendRequest($friendship){

				$sql1="INSERT INTO `friends`(`my_id`, `friend_id`, `remark_name`)" .
						" VALUES ('$friendship[my_id]','$friendship[friend_id]','')";
				$acceptFriendRequest =  mysql_query($sql1) or die ( mysql_error() );
				$sql2="INSERT INTO `friends`(`my_id`, `friend_id`, `remark_name`) " .
						"VALUES ('$friendship[friend_id]','$friendship[my_id]','')";
				$beAccepedFriendRequest = mysql_query($sql2)or die ( mysql_error() );
		}

		//拒绝好友请求
		function rejectFriendRequest($friendship){

			$sql1="DELETE FROM `private_messages` WHERE " .
					"`sender_id`='$friendship[friend_id]' AND `receiver_id`='$friendship[my_id]'";
			$rejectFriendRequest = mysql_query($sql1) or die  ( mysql_error() );
			//echo $friendship[friend_id];
		}

		//修改昵称
		function updateNickname($friendship){
			$sql1="UPDATE `friends`SET`remark_name`='$friendship[remark_name]' WHERE " .
					"`my_id`='$friendship[my_id]' AND `friend_id`='$friendship[friend_id]'";
			$updateNickname = mysql_query($sql1) or die  ( mysql_error() );
		}

	}

?>
