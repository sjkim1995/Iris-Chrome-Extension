const start = new Audio('../sound/start.mp3');
start.play()

chrome.tabs.create({'url': chrome.extension.getURL('index.html'), 'active': false}, function(tab){
	navigator.webkitGetUserMedia({
	    audio: true,
	}, function(stream) {
	    stream.stop();
	   	
	    // Now you know that you have audio permission. Do whatever you want...
	}, function() {
	    // Aw. No permission (or no microphone available).
	});
})

