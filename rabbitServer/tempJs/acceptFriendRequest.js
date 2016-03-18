// JavaScript Document

//$.url().param('friend_id')

var newFriend={
	"friend_id":
		};
$("#btn-accept").click(function(){
	$.ajax({
		type:"POST",
		url:"../Ajax/acceptFriendRequest.php",
		data:newFriend,
		dataType:"json",
		success:function(){
			console.log("accepted");
			window.location.href="../views/index.html";
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);	
		},
		})
	});