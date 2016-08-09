setUpRecognition();

function setUpRecognition() {
	// start.play()
	// Check if speech recognition is supported, and send an error if it is not.
	if(!("webkitSpeechRecognition" in window)) {
		chrome.extension.sendMessage({
			type: "error",
			text: "Speech input not available",
			subtext: "You must be using Chrome 25 or later."
		});
		return;
	}
	// Create speech recognition object.
	var speechInput = new webkitSpeechRecognition();
	speechInput.continuous = false;
	speechInput.interimResults = true;

	// Set speech API event listeners.
	speechInput.onstart = recognitionStarted;
	speechInput.onerror = recognitionFailed;
	speechInput.onresult = recognitionSucceeded;

	// Start speech recognition.
	speechInput.start();

}

// Start recognition
function recognitionStarted() {
	chrome.extension.sendMessage({
		type: "ready"
	});
}

// Recognition failure callback
function recognitionFailed(e) {

	console.log(e)
	// Send error information
	chrome.extension.sendMessage({
		type: "error",
		text: "An error occurred",
		subtext: e.error.replace(/-/g, " ")
	});
	chrome.tabs.create({url: chrome.extension.getURL('../index.html')}, function(tab){

	})
}

function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

// Success callback
function recognitionSucceeded(e) {
	var searchDict = {
		ebay: '/sch/?_nkw=',
		youtube: '/results?search_query=',
		amazon: '/s/?url=search-alias%3Daps&field-keywords=',
		google: '/search?q=',
		wikipedia: '/wiki/',
		facebook: '/search/top/?q=',
		bing: '/search?q=',
		yahoo: '/search?p=gym',
		twitter: '/search?q='
	};

	// If no result was returned, send an error and then exit.
	if(e.results.length === 0) {
		alert("nothing heard")
		chrome.extension.sendMessage({
			type: "error",
			text: "Nothing was heard."
		});
		return;
	}
  var interim_transcript = '';
  var final_transcript = '';
  for (var i = e.resultIndex; i < e.results.length; ++i) {
    if (e.results[i].isFinal) {
      final_transcript += e.results[i][0].transcript;
    } else {
      interim_transcript += e.results[i][0].transcript;
    }
  }

  // final_span.innerHTML = linebreak(final_transcript);
  $("#interim").html(interim_transcript);

  if(final_transcript.length > 2){
  	var result = final_transcript;
	result = result.split(" ")
	var redirectURL;
		$("#loading").html("Redirecting...")

		var website = result[0].toLowerCase();
		if (website == 'download') {
			var currentUrl;
			chrome.tabs.query({'lastFocusedWindow': true, 'active': true}, function(tabs){
				currentUrl = tabs[0].url;

				if (currentUrl.search('youtube.com/watch?') !== -1 ) {
					redirectURL = 'http://www.youtubeinmp3.com/download/?video=' + currentUrl;
					var final = redirectURL;
					chrome.extension.sendRequest({'msg': 'Download', "redirectUrl": final, "transcript": "Downloading mp3"} );
					window.close()
				}
			})

		} else {
			redirectURL = 'http://www.' + website;

			var searchQuery = result.slice(1).join('+');

			if(searchDict[website] && searchQuery.length > 0){
				if(website === 'yahoo') {
					redirectURL = 'http://search.yahoo.com' + searchDict[website] + searchQuery;
				} else {
					redirectURL += ".com" + searchDict[website] + searchQuery;
				}
			} else if (final_transcript.indexOf('.') == -1) {
				redirectURL = 'http://www.google.com' + searchDict['google'] + result.join('+');
	 		} else {
        redirectURL = 'http://' + result.join('');
        final_transcript = result.join('');
      }
			var final = redirectURL;
			chrome.extension.sendRequest({"msg": "Search", "redirectUrl": final, "transcript": final_transcript})
			window.close();
		}

  }

}
