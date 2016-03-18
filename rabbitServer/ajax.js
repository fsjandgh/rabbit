var xmlHttp;
function S_xmlhttprequest(){
	if(window.ActiveObject){
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");

		}else if(window.XMLHttpRequest){

			xmlHttp=new XMLHttpRequest();
			}

}
function postMessage(json_message){
	S_xmlhttprequest();
	xmlHttp.open("POST","../SendMessage/sendMessage.php?message="+json_message,true);
	//xmlHttp.onreadystatechange=likesuccess;
	xmlHttp.send(null);
}
