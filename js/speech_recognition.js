/*chrome.runtime.onMessage.addListener(function(message, sender) {
	if(!sender.tab && message.type === "start") {
		setUpRecognition();
	}
});*/
window.addEventListener("load", setUpRecognition, false);
const start = new Audio('../sound/start.mp3');
/**
 * Checks if speech recognition is supported, creates an instance, and starts listening
 */
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

	//speechInput.lang = ;

	// Start speech recognition.
	speechInput.start();

}

/**
 * Called when speech recognition has begun
 */
function recognitionStarted() {
	chrome.extension.sendMessage({
		type: "ready"
	});
}

/**
 * Callback for unsuccessful speech recognition
 * @param {SpeechRecognitionError} e - The recognition error
 */
function recognitionFailed(e) {

	console.log(e)
	// Send error information
	chrome.extension.sendMessage({
		type: "error",
		text: "An error occurred",
		subtext: e.error.replace(/-/g, " ")
	});
	chrome.tabs.create({'url': chrome.extension.getURL('../index.html')}, function(tab){

	})
}

var navigations = {
	Youtube: 'http://www.youtube.com',
	Google: 'http://www.google.com',
	Facebook: 'http://www.facebook.com',
	Wikipedia: 'http://www.wikipedia.org'
}

/**
 * Callback for successful speech recognition
 * @param {SpeechRecognitionEvent} e - The speech recognition result event
 */
function recognitionSucceeded(e) {

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

	var result = e.results[0][0].transcript;
	result = result.split(" ")
	$("#loading").html("Redirecting...")
	redirectURL = 'http://www.' + result.join('');
	if (redirectURL.search('.com') == -1) {
		console.log("no substring")
		redirectURL += '.com';
	}

	window.location.href = redirectURL;


	// Send the most accurate interpretation of the speech.
	chrome.extension.sendMessage({
		type: "result",
		text: e.results[e.resultIndex][0].transcript
	});
}
