var timer;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){

	$("#myBar").css("display", "block")
	var elem = document.getElementById("myBar");
	var width = 1;
	var id = setInterval(frame, 10);
	function frame() {
	    if (width >= 100) {
	        clearInterval(id);
	    } else {
	        width++;
	        elem.style.width = width + '%';
	    }
	}

	if(request.msg == "Search") {
		$("#interim").html(request.transcript)
		$(".cancel").css("display", "block")
		timer = setTimeout(function() {
			chrome.tabs.create({'url': request.redirectUrl}, function(tab){

			})
		}, 1000)

	} else if (request.msg == "Download"){
		$("#interim").html(request.transcript)
		$(".cancel").css("display", "block")
		timer = setTimeout(function() {
			chrome.tabs.create({'url': request.redirectUrl, 'active': false}, function(tab){
			window.close();
			})
		}, 1000)
	}
})

$(".cancel").click(function(){
	clearTimeout(timer);
	window.close()
})

