var timer;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	console.log(request)

	if(request.msg == "Search") {
		$("#interim").html(request.transcript)
		$(".cancel").css("display", "block")
		timer = setTimeout(function() {
			chrome.tabs.create({'url': request.redirectUrl}, function(tab){

			})
		}, 1500)
	}
})

$(".cancel").click(function(){
	clearTimeout(timer);
	window.close()
})
