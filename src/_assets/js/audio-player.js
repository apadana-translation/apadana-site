/*****
Controls for playing HTML5 audio of poem recitations

The DOM includes two players (with one <audio> component):
1) in poem__meta.html sidebar for larger viewports
2) in mobile.html nav menu for small viewports
*****/

var audioId	=	document.getElementById('html5-audio'),
    audioTimeline =	document.getElementById('audio-timeline'),
    audioPlayhead =	document.getElementById('audio-playhead');

// Control playback of audio from either player
// Play and pause icons alternate display using classes .is-playing, .is-paused
$('.audio-control').click(function(e) {
  e.preventDefault();
  var audioRf = $('#html5-audio');
	if (audioRf.prop('paused') === false) {
    audioRf.get(0).pause();
		$('.audio-control').addClass('is-paused').removeClass('is-playing');
	} else {
		audioRf.get(0).play();
	  $('.audio-control').addClass('is-playing').removeClass('is-paused');
	}
});

// Rewind 10 seconds
$('.audio-rewind').click(function(e) {
  e.preventDefault();
  var audioRf = $('#html5-audio');
  audioRf.get(0).currentTime -= 10;
});

$(function() {
  if (audioId) {
    // Write duration of audio track to mobile audio player
    $('#audio-duration').html(audioId.duration.toString().toHHMMSS());

    // Reset audio track to beginning when reaches end
    audioId.addEventListener("ended", function (event) {
      $('.audio-control').addClass('is-paused').removeClass('is-playing');
      audioId.currentTime = 0;
    });

    // Make mobile playback timeline clickable & draggable (on mobile-nav)
    // http://alexkatz.me/posts/building-a-custom-html5-audio-player-with-javascript/
    audioTimeline.addEventListener("click", function (event) {
      var timelineWidth = audioTimeline.offsetWidth - audioPlayhead.offsetWidth;
    	moveplayhead(event, audioPlayhead, audioTimeline, timelineWidth);
    	audioId.currentTime = audioId.duration * clickPercent(event, audioTimeline, timelineWidth);
    }, false);
  }
});

// ===================================
// Audio Functions
// ===================================
// 1) Show playback progress
function audioProgress() {

  var currentTime	=	audioId.currentTime,
      percent = Math.max(0, Math.min(1, currentTime / audioId.duration)),
      circle = $('#audio-progress .animated-circle');

  // circular progress (desktop)
  updateProgress(percent, circle);

  // timeline (mobile)
  $('#audio-playhead').css('margin-left', percent * 100 + '%');
}

// 2) return click of timeline as decimal percentage of the total timeline width
function clickPercent(event, timeline, timelineWidth) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

// 3) drag playhead across timeline
function moveplayhead(event, playhead, timeline, timelineWidth) {
  var newMargLeft = event.clientX - getPosition(timeline);

  if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
    playhead.style.marginLeft = newMargLeft + "px";
  }
  if (newMargLeft < 0) {
    playhead.style.marginLeft = "0px";
  }
  if (newMargLeft > timelineWidth) {
    playhead.style.marginLeft = timelineWidth + "px";
  }
}

// ===================================
// Helper Functions
// ===================================

// Convert seconds to HHMMSS format
// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss/6313032
String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}

  return (hours !== "00") ? hours+':'+minutes+':'+seconds : minutes+':'+seconds;
}

// getPosition
// Returns element's left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}
