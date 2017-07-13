/*
    Initial code copied from:
        arijitdasgupta's node_chat project: https://github.com/arijitdasgupta/node_chat
        & Web Speech API Demonstration: https://www.google.com/intl/en/chrome/demos/speech.html
*/


// socket stuff

if(!WebSocket){
	$('#user').add('p').addClass('page_text').text('Your browser does not support WebSocket, you cannot chat!');
}
var Socket;
var username;

$('#user input').keypress(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13){
		// Get username from user text input
		var val = $("#user input").val();
		username = val;
		$('#user').remove();

		// Configure the chat URL
		chat_url = window.location.href;
		chat_url = chat_url.substr(4);
		chat_url = 'ws' + chat_url;

		// Open chat socket
		Socket = new WebSocket(chat_url, 'chat-protocol'); 
		
		// Static text: appears at start of chat and stays on the screen
		Socket.addEventListener('open', function(event){
			// $('#chat_input').show();
			$('#messages').show();
			$('#messages').append('<p class = "chat_text">Press the microphone whenever you would like to communicate to the team.</p>')
			// $('#chat_input').focus();
			$('#log_in_status').text("You are logged in as " + username).show();
		});
		
		// Dynamic chat text
		Socket.addEventListener('message', function(event){
				var object = eval('('+event.data+')');
				var sender = object['sender'];
				var message = object['message'];
				var appendable = '<p class = "chat_text">' + sender + ' -- ' + message + '</p>';
				$('#messages').append(appendable);
				window.scrollBy(0,200);
		});
		
		Socket.addEventListener('error', function(event){
			return;
		});
	}					
});

// Whenever a key is pressed while user inside input entry box
$('#chat_input').keypress(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
    // If user returns (sends message)
	if (code == 13){
		message = $('#chat_input').val();
		sender = username;
		$('#chat_input').val('')
		json_data = JSON.stringify({'message':message, 'sender':sender});
        console.log(json_data);
		Socket.send(json_data);
	}
});

$(".highlight").click(function() {
    console.log('hihihih!!!!!');
    alert('hi');
});



// transcription stuff

showDirections('info_start');

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // when recording started
    recognition.onstart = function() {
        console.log("1: on start");
        recognizing = true;
        showDirections('info_speak_now');
        start_img.src = 'mic-animate.gif';
    };

    // haven't seen yet
    recognition.onerror = function(event) {
        console.log("2: on error");
        if (event.error == 'no-speech') {
            start_img.src = 'mic.gif';
            showDirections('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'mic.gif';
            showDirections('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showDirections('info_blocked');
            }
            else {
                showDirections('info_denied');
            }
            ignore_onend = true;
        }
    };

    // when recording stopped
    recognition.onend = function() {
        console.log("3: on end");
        recognizing = false;

        // Unlikely?
        if (ignore_onend) {
            return;
        }
        start_img.src = 'mic.gif';
        if (!final_transcript) {
            showDirections('info_start');
            return;
        }


        showDirections('');

        // Not sure what this does?
        if (window.getSelection) {
            console.log('hm?');
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            console.log(range);
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }

        // Sends transcription to post in chat
        message = final_transcript;
        sender = username;
        $('#chat_input').val('');
        json_data = JSON.stringify({'message':message, 'sender':sender});
        console.log(json_data);
        Socket.send(json_data);

        // SHUNTA WRITE CODE HERE
        // if the message string contains the word "name" then a notification appears
        var pattern = /name/;

        //returns true or false...
        var exists = pattern.test(message);

        if(exists){//true statement, do whatever
  
        }
        else{
          //false statement..do whatever 
    };

    // continually updating as audio is recorded - most important
    recognition.onresult = function(event) {
        console.log("4: on result");
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            // only enters when stopping recording/transcription
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            }
            else {
                interim_transcript += event.results[i][0].transcript;
            }
            if (final_transcript.indexOf("name") !== -1){
                final_transcript = final_transcript.replace(/name/g, '<button class="highlight">name</button>');
            }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
    };
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    showDirections('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

// when start button clicked to start and stop recording
function startButton(event) {
    console.log("5: start button");
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'mic-slash.gif';
    showDirections('info_allow');
    start_timestamp = event.timeStamp;
}

// at start and throughout?
function showDirections(s) {
    console.log("6: show info");
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    }
    else {
        info.style.visibility = 'hidden';
    }
}