chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab){
		navigator.webkitGetUserMedia({
		    audio: true,
		}, function(stream) {
		    stream.stop();
		    // Now you know that you have audio permission. Do whatever you want...

		}, function() {
		    // Aw. No permission (or no microphone available).
		});
	})
})

