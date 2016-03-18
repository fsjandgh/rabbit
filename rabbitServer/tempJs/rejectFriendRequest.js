// JavaScript Document
var newFriend={
	"friend_id":$.url().param('friend_id')
		};
$("#btn-reject").click(function(){
	$.ajax({
		type:"POST",
		url:"../Ajax/rejectFriendRequest.php",
		data:newFriend,
		dataType:"json",
		success:function(){
			console.log("rejected");
			window.location.href="../views/index.html";
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);	
		},
		})
	});