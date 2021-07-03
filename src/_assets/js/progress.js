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
      circle = $('#text-progress .animated-circle'),
      counter = $('#text-progress .progress__count'),
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
     updateProgress(perc, circle, counter);
  });
}

// Helper function for animating circular progress counter
function updateProgress(perc, circleElem, counterElem) {
  var offsetValue = 126 * perc;
  circleElem.css({
    "stroke-dashoffset" : 126 - offsetValue
  });
  if (counterElem != null) {
    counterElem.html(Math.round(perc * 100) + "%");
  }
}
