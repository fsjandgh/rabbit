// JavaScript Document

//$.url().param('friend_id')

var newNickname ={
	"friend_id":,
	"remark_name":$("input#remark_name").val()
		};
		
$("#btn-post").click(function(){
	$.ajax({
		type:"POST",
		url:"../Ajax/updateNickname.php",
		data:newNickname,
		dataType:"json",
		success:function(){
			console.log("update nickname success");
			window.location.href="../views/me.html";
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);	
		},
		})
	});