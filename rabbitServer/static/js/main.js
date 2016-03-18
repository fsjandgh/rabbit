var pages = new Array("#chat","#user","#home")
$(".nav-icon").click(function(){
    window.location.hash = $(this).attr("for");
})
$("body").swipe({
    swipeLeft:function(){
        nowpage = window.location.hash;
        for(var i = 0; i < 2; i ++){
            if(pages[i] === nowpage){
                window.location.hash = pages[i+1]
                return;
            }
        }
        window.location.hash = pages[0];
    },
    swipeRight:function(){
        nowpage = window.location.hash;
        for(var i = 1; i < 3; i ++){
            if(pages[i] === nowpage){
                window.location.hash = pages[i-1]
                return;
            }
        }
        window.location.hash = pages[2];
    }
})
window.onhashchange = function(){
    changePage();
}
var changePage = function(){
    var nowpage = window.location.hash;
    var nowdetail = nowpage.split("#");
    $(".page").hide();
    $(nowpage).show();
    $(".bottom-icon").removeClass("nav-active nav-unactive");
    $(".bottom-icon").addClass("nav-unactive");
    $(".fui-"+nowdetail[1]).removeClass("nav-unactive");
    $(".fui-"+nowdetail[1]).addClass("nav-active");
}
$(".friendCheck").on('click',function(){
     var friendName = $(this).find(".friendName").text();
	 var friendId = $(this).find(".friends").attr("data");
	 console.log(friendId);
     $("#detailFriendName").text(friendName)
     window.location.hash = "chatDetail"
     $("#bottomGuide").hide();
})
$("#back2chat").click(function(){
     window.location.hash = "chat";
     $("#bottomGuide").show();
})
