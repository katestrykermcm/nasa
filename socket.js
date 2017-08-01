/*
    Initial code copied from:
        arijitdasgupta's node_chat project: https://github.com/arijitdasgupta/node_chat
        & Web Speech API Demonstration: https://www.google.com/intl/en/chrome/demos/speech.html
*/




// Socket stuff

if(!WebSocket){
	$('#login').add('p').addClass('page_text').text('Your browser does not support WebSocket, you cannot chat!');
}
var Socket;
var username;




// Login page

$('#login input').focus();
$('#login input').keypress(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13){
		// Get username from user text input
		var val = $("#login input").val();
		username = val;
		$('#login').remove();
        // Hide this login information and reveal dashboard
        $(".appContents").removeClass('hidden');
        $(".dashboard").removeClass('hidden');




        // Configure the chat URL
        chat_url = window.location.href;
        chat_url = chat_url.substr(4);
        chat_url = 'ws' + chat_url;

        // Open chat socket
        Socket = new WebSocket(chat_url, 'chat-protocol'); 

		// // Configure the chat URL
		// chat_url = window.location.href;
		// chat_url = chat_url.substr(4);
		// chat_url = 'ws' + chat_url;

		// // Open chat socket
        // console.log(chat_url);
		// // Socket = new WebSocket(chat_url, 'chat-protocol'); 
        // Socket = new WebSocket("wss://www.katestrykermcmanus.com", 'chat-protocol'); 
		



		// Static text: appears at start of chat and stays on the screen

		Socket.addEventListener('open', function(event){
			$('.conversation').show();
            $('#loginStatus').text("Welcome, " + username + "!").show();
            setInterval(updateTime, 1000);
		});




		// Dynamic chat text

		Socket.addEventListener('message', function(event){
			var object = eval('('+event.data+')');
			var sender = object['sender'];
			var message = object['message'];
            var channel = object['channel'];
            console.log(object);

            var times = getTimes();

            // it is the main user, LPE (Simon)
            if (sender.toUpperCase() === 'LEAD INTEGRATION ENGINEER'){
                var appendable = '<div class="mainUserText transcriptionBox">' + 
                    '<span class="mainUserName transcriptionName">' + sender + '</span>' + 
                    '<span class="transcriptionTime">' + times[0] + ' <span class="noItalic">&nbsp | &nbsp </span> L - ' + times[1] + '</span><br>' + 
                    '<div class="transcriptionMessage">' + message + '</div>' + 
                '</div>';
            }
            // it is another user
            else{
                var appendable = '<div class="regularUserText transcriptionBox">' + 
                    '<span class="regularUserNames transcriptionName">' + sender + '</span>' + 
                    '<span class="transcriptionTime">' + times[0] + ' <span class="noItalic">&nbsp | &nbsp </span> L - ' + times[1] + '</span><br>' + 
                    '<div class="transcriptionMessage">' + message + '</div>' + 
                '</div>';
            }

            // Add transcripted text to currently selected channel!
            console.log(channel);
            console.log(sender);
            $('.conversation' + channel).append(appendable);

            // scroll to bottom after adding new transcription text
            $('#transcriptionContent').stop().animate({
                scrollTop: $('#transcriptionContent')[0].scrollHeight
            }, 800);
		});
		



        // Close socket

		Socket.addEventListener('error', function(event){
			return;
		});
	}					
});



window.onresize = function() {
    // dashboard width
    // check to see if transcription minimized (hidden) or not
    var position = $("#transcriptionContainer").position();
    // minimized -> take up full screen
    if (position.left == -450){ 
        $("#dashboard").width($(window).width() - 40);
        $("#dashboard").css('margin-left', 20 + 'px');
    }
    else{
        $("#dashboard").width($(window).width() - 490);
    }
    $("#dashboard").height($(window).height() - 120);

    // transcript height
    $("#transcriptionContent").height($(window).height() - 292);
}


// Dashboard

//Responsive Width
$("#dashboard").width($(window).width() - 490);
$("#dashboard").height($(window).height() - 120);





// Transcription 

// Responsive height
$("#transcriptionContent").height($(window).height() - 292);

// Minimize when header arrow clicked
$('.arrow').click(function() {
    $('#transcriptionContainer').animate({'left' : '-450px'}, 300);
    $('#transcriptionHeader').animate({'left' : '-450px'}, 300);
    $('#transcriptionButton').fadeIn('slow');
    //adjust dashboard width
    $("#dashboard").width($(window).width() - 40);
    $("#dashboard").animate({'margin-left' : 20 + 'px'}, 300);
    

});

// Open when + circle clicked
$('#transcriptionButton').click(function() {
    $('#transcriptionButton').fadeOut('fast');
    $('#transcriptionContainer').animate({'left' : '0px'}, 300);
    $('#transcriptionHeader').animate({'left' : '0px'}, 300);
    $("#dashboard").width($(window).width() - 490);
    $("#dashboard").animate({'margin-left' : 470 + 'px'}, 300);
});

// Move between channels
$('.channelTitles').click(function() {
    $('.channelTitles').removeClass('selectedChannel');
    $(this).addClass('selectedChannel');
    var channelId = $(this).attr('id');
    $('.transcription').addClass('hidden'); 


    $('#transcriptionContent').scrollTop($('#transcriptionContent')[0].scrollHeight);
    // $('#transcriptionContent').stop().animate({
    //     scrollTop: $('#transcriptionContent')[0].scrollHeight
    // }, 300);


    if (channelId == 'channelCommandNet'){
        $('#transcriptionCommandNet').removeClass('hidden');
    }
    if (channelId == 'channelLoop1'){
        $('#transcriptionLoop1').removeClass('hidden');
    }
    if (channelId == 'channelLoop2'){
        $('#transcriptionLoop2').removeClass('hidden');
    }
});





showDirections('info_start');

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {



    // var audioElement = document.createElement('audio');
    // audioElement.setAttribute('src', 'sound/solemn.mp3');
    
    // audioElement.addEventListener('ended', function() {
    //     this.play();
    // }, false);
    
    
    // $('#play').click(function() {
    //     audioElement.load();
    //     audioElement.play();
    //     return false;
    //     // $("#status").text("Status: Playing");
    // });
    
    // $('#pause').click(function() {
    //     audioElement.pause();
    //     $("#status").text("Status: Paused");
    // });
    
    // $('#restart').click(function() {
    //     audioElement.currentTime = 0;
    // });



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
        if ($('#channelCommandNet').hasClass('selectedChannel')){
            channel = "CommandNet";
        }
        else if ($('#channelLoop1').hasClass('selectedChannel')){
            channel = "Loop1";
        }
        else {
            channel = "Loop2";
        }
        json_data = JSON.stringify({'message':message, 'sender':sender, 'channel':channel});
        console.log(json_data);
        Socket.send(json_data);

        // if the message string contains the word "name" then a notification appears
        var patternAnomaly = /LCC.*332/;
        //returns true or false...
        var exists = patternAnomaly.test(message);
        if(exists){//true statement, do whatever
 			// Get the notification
			var notification = document.getElementById('anomalyNotification');
			notification.style.display = "block";
            $('#anomalyNotification').animate({'top' : '0px'}, 500);
			// When the user clicks anywhere outside of the modal, close it
			/*window.onclick = function(event) {
				if (event.target == notification) {
					notification.style.display = "none";
				}
			}*/
        }

        // if the message string contains the word "name" then a notification appears
        var patternBreak = /Break.*Break/;
        //returns true or false...
        var exists = patternBreak.test(message);
        if(exists){//true statement, do whatever
            // Get the notification
            var notification = document.getElementById('breakNotification');
            notification.style.display = "block";
            $('#breakNotification').animate({'opacity' : '1'}, 500);
        }

        $(".closeNotif").click(function() {
            $(".notifications").fadeOut("fast", function() {});
        });

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

			// CHANGE KEYWORDS TO BUTTONS
            // LCC 332
            if (final_transcript.indexOf("LCC 332") !== -1){
                final_transcript = final_transcript.replace(/LCC.*332/, '<button class="highlight transcriptButtonAnomaly">LCC-332</button>');
            }
            else if (final_transcript.indexOf("LC c3322") !== -1){
                final_transcript = final_transcript.replace(/LC.*c3322/, '<button class="highlight transcriptButtonAnomaly">LCC-332</button>');
            }
            else if (final_transcript.indexOf("LC c332") !== -1){
                final_transcript = final_transcript.replace(/LC.*c332/, '<button class="highlight transcriptButtonAnomaly">LCC-332</button>');
            }
            else if (final_transcript.indexOf("LC c33") !== -1){
                final_transcript = final_transcript.replace(/LC.*c33/, '<button class="highlight transcriptButtonAnomaly">LCC-332</button>');
            }
            else if (final_transcript.indexOf("OCC 332") !== -1){
                final_transcript = final_transcript.replace(/OCC.*332/, '<button class="highlight transcriptButtonAnomaly">LCC-332</button>');
            }
            else if (final_transcript.indexOf("CC 332") !== -1){
                final_transcript = final_transcript.replace(/CC.*332/, '<button class="highlight transcriptButtonAnomaly">LCC-332</button>');
            }

            // BREAK BREAK
            if (final_transcript.indexOf("break break") !== -1){
                final_transcript = final_transcript.replace(/break.*break/, '<button class="highlight transcriptButtonBreak">Break-Break</button>');
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

$('.conversation').on( 'click', '.highlight', function () {
    $("main").removeClass("hidden");
});

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

function getTimes() {

    var now = new Date();
    var hours = now.getHours();
    if (hours.toString().length == 1) {
        hours = "0" + hours;
    }
    var minutes = now.getMinutes();
    if (minutes.toString().length == 1) {
        minutes = "0" + minutes;
    }
    var time = hours.toString() + minutes.toString();

    // make fake L-time
    var lMinutes = 60 - minutes;
    if (lMinutes.toString().length == 1) {
        lMinutes = "0" + lMinutes;
    }
    var lSeconds = 60 - now.getSeconds();
    if (lSeconds.toString().length == 1) {
        lSeconds = "0" + lSeconds;
    }
    var lTime = "04:" + lMinutes + ":" + lSeconds;

    return [time, lTime];
}

function updateTime() {
    var times = getTimes();
    $('#currentTime').text(times[0] + ' | L - ' + times[1]).show();
}



