// ===================================
// Reading progress bars for poems
// ===================================

// Circular counter for $medium-large and up displays,
// horizontal bar for mobile displays
// based partly on https://codepen.io/jpod/pen/oqKvw

function progressBar() {
  var winHeight = $(window).height(),
      docHeight = $('.poem').height(),
      progressBar = $('progress'),
      max, value;

  /* Set the max scrollable area */
  max = docHeight - winHeight;

  // set max value of horizontal bar
  progressBar.attr('max', max);

  $(document).on('scroll', function() {
     var value = $(window).scrollTop();
     // horizontal bar
     progressBar.attr('value', value);
     // circular counter
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
}

$(document).on('ready', function() {
  progressBar();
});
