var audioId	=	document.getElementById('audio-player');

$('#audio-control').click(function(e) {
  e.preventDefault();
  var audioRf = $('#audio-player');
	if (audioRf.prop('paused') == false) {
    audioRf.get(0).pause();
		$(this).addClass('is-paused').removeClass('is-playing');
	} else {
		audioRf.get(0).play();
	  $(this).addClass('is-playing').removeClass('is-paused');
	}
});

function audioProgress() {

  var duration	=	audioId.duration,
      currentTime		=	audioId.currentTime,
      percent = Math.max(0, Math.min(1, currentTime / duration)),
      circle = $('#audio-progress .animated-circle');

  updateProgress(percent, circle);

  // if(duration == currentTime) {
  //   $('#audio_control').removeClass('active');
  //   $('#bar').removeAttr('style');
  //   $('.audioprogress').addClass('ease-none');
  // }
}
