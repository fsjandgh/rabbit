// JavaScript Document
var newMessage ={
	"friend_id":,
	"content":
		};
		
$("#btn-biu").click(function(){
	$.ajax({
		type:"POST",
		url:"../Ajax/sendMessage.php",
		data:newMessage,
		dataType:"json",
		success:function(){
			console.log("biu success");
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);	
		},
	})
});