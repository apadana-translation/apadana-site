var audioId	=	document.getElementById('html5-audio');

$('#audio-control').click(function(e) {
  e.preventDefault();
  var audioRf = $('#html5-audio');
	if (audioRf.prop('paused') == false) {
    audioRf.get(0).pause();
		$(this).addClass('is-paused').removeClass('is-playing');
	} else {
		audioRf.get(0).play();
	  $(this).addClass('is-playing').removeClass('is-paused');
	}
});

$('#audio-rewind').click(function(e) {
  e.preventDefault();
  var audioRf = $('#html5-audio');
  audioRf.get(0).currentTime -= 10;
});

function audioProgress() {

  var duration	=	audioId.duration,
      currentTime	=	audioId.currentTime,
      percent = Math.max(0, Math.min(1, currentTime / duration)),
      circle = $('#audio-progress .animated-circle');

  updateProgress(percent, circle);
}
