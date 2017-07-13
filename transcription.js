// // Initial code copied from Web Speech API Demonstration: https://www.google.com/intl/en/chrome/demos/speech.html


// // $(document).ready(function(){
// //     // $("#rijks").click(function() {
// //     //     $("#rijksPage").animate({
// //     //         'marginTop': '0'
// //     //     }, 650);
// //     // });
// // });

// showInfo('info_start');

// var final_transcript = '';
// var recognizing = false;
// var ignore_onend;
// var start_timestamp;

// if (!('webkitSpeechRecognition' in window)) {
//   upgrade();
// } else {
//     start_button.style.display = 'inline-block';
//     var recognition = new webkitSpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     // when recording started
//     recognition.onstart = function() {
//         console.log("1: on start");
//         recognizing = true;
//         showInfo('info_speak_now');
//         start_img.src = 'mic-animate.gif';
//     };

//     // haven't seen yet
//     recognition.onerror = function(event) {
//         console.log("2: on error");
//         if (event.error == 'no-speech') {
//             start_img.src = 'mic.gif';
//             showInfo('info_no_speech');
//             ignore_onend = true;
//         }
//         if (event.error == 'audio-capture') {
//             start_img.src = 'mic.gif';
//             showInfo('info_no_microphone');
//             ignore_onend = true;
//         }
//         if (event.error == 'not-allowed') {
//             if (event.timeStamp - start_timestamp < 100) {
//                 showInfo('info_blocked');
//             }
//             else {
//                 showInfo('info_denied');
//             }
//             ignore_onend = true;
//         }
//     };

//     // when recording stopped
//     recognition.onend = function() {
//         console.log("3: on end");
//         recognizing = false;
//         if (ignore_onend) {
//             return;
//         }
//         start_img.src = 'mic.gif';
//         if (!final_transcript) {
//             showInfo('info_start');
//             return;
//         }
//         showInfo('');
//         if (window.getSelection) {
//             window.getSelection().removeAllRanges();
//             var range = document.createRange();
//             range.selectNode(document.getElementById('final_span'));
//             window.getSelection().addRange(range);
//         }
//     };

//     // continually updating as audio is recorded - most important
//     recognition.onresult = function(event) {
//         console.log("4: on result");
//         var interim_transcript = '';
//         for (var i = event.resultIndex; i < event.results.length; ++i) {
//             // only enters when stopping recording/transcription
//             if (event.results[i].isFinal) {
//                 final_transcript += event.results[i][0].transcript;
//             }
//             else {
//                 interim_transcript += event.results[i][0].transcript;
//             }
//             if (final_transcript.indexOf("name") !== -1){
//                 final_transcript = final_transcript.replace(/name/g, '<span class="highlight">name</span>');
//             }
//         }
//         final_transcript = capitalize(final_transcript);
//         final_span.innerHTML = linebreak(final_transcript);
//         interim_span.innerHTML = linebreak(interim_transcript);
//     };
// }

// function upgrade() {
//     start_button.style.visibility = 'hidden';
//     showInfo('info_upgrade');
// }

// var two_line = /\n\n/g;
// var one_line = /\n/g;
// function linebreak(s) {
//     return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
// }

// var first_char = /\S/;
// function capitalize(s) {
//     return s.replace(first_char, function(m) { return m.toUpperCase(); });
// }

// // when start button clicked to start and stop recording
// function startButton(event) {
//     console.log("5: start button");
//     if (recognizing) {
//         recognition.stop();
//         return;
//     }
//     final_transcript = '';
//     recognition.start();
//     ignore_onend = false;
//     final_span.innerHTML = '';
//     interim_span.innerHTML = '';
//     start_img.src = 'mic-slash.gif';
//     showInfo('info_allow');
//     start_timestamp = event.timeStamp;
// }

// // at start and throughout?
// function showInfo(s) {
//     console.log("6: show info");
//     if (s) {
//         for (var child = info.firstChild; child; child = child.nextSibling) {
//             if (child.style) {
//                 child.style.display = child.id == s ? 'inline' : 'none';
//             }
//         }
//         info.style.visibility = 'visible';
//     }
//     else {
//         info.style.visibility = 'hidden';
//     }
// }
