// Reading progress bar for poems
// based on https://codepen.io/jpod/pen/oqKvw

$(document).on('ready', function() {
  var winHeight = $(window).height(),
      docHeight = $('.poem').height(),
      progressBar = $('progress'),
      max, value;

  /* Set the max scrollable area */
  max = docHeight - winHeight;

  $(document).on('scroll', function(){
     var value = $(window).scrollTop();
     var perc = Math.max(0, Math.min(1, value/max));
     updateProgress(perc);
  });

  function updateProgress(perc) {
    var circle_offset = 126 * perc;
    $('.animated-circle').css({
      "stroke-dashoffset" : 126 - circle_offset
    });
    $('.progress__count').html(Math.round(perc * 100) + "%");
  }
});
