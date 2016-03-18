<?php

 include("../config.db.php");
 include("Login.html");

if(isset($_POST['clickToLogin'])){
 	$username=$_POST['username'];
	$sql="select * from users where user_id='$username'";
	$query=mysql_query($sql);
	$result=mysql_fetch_array($query);
	$exist='false';
	$exist=is_array($result);
	if($exist==1){
		$pwinput=$_POST['password'];
		if($pwinput==$result['user_password']){
			
			$_SESSION['uid']=$result['user_id'];
			$_SESSION['user_shell']=md5($result['user_id'].$result['user_password']);
			
			echo "<script>window.location.href='../views/index.php'; </script>";
		}

		else {
			echo "<script>alert('wrong password!');</script>";
			SESSION_destroy();
		}
 	}
 	else {
 		echo "<script> alert('wrong username!'); </script>";

 	}
 }

?>
