// JavaScript Document
$("#btn-post").click(function(){
	$.ajax({
		type:"POST",
		url:"../Ajax/updateProfile.php",
		data:$.parseJSON('{"new_name":"'+$("#new-name").val()+'","new_sex": "'+$("#new-name").val()+'","new_birthday":"'+$("#new-birthday").val()+'","new-signature":"'+$("#new-signature").val()+'"}'),
		dataType:"json",
		success:function(){
			console.log("update profile success");
			window.location.href="../views/me.html";
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);	
		},
		})
	});

function updateProfile(){
	var newPro ={
		"new_name":$("input#new-name").val(),
		"new_sex":$("input#new-sex").val(),
		"new_birthday":$("input#new-birthday").val(),
		"new-signature":$("input#new-signature").val()
		};
	
	$("#btn-post").click(function(){
		$.ajax({
			type:"POST",
			url:"../Ajax/updateProfile.php",
			data:newPro,
			dataType:"json",
			success:function(){
				console.log("update profile success");
				window.location.href="../views/me.html";
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);	
			},
			})
		});
}