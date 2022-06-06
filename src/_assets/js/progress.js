// ===================================
// Reading progress bars for poems
// ===================================

// Circular counter for $medium-large and up displays,
// horizontal bar for mobile displays
// based partly on https://codepen.io/jpod/pen/oqKvw

// Helper function for animating circular progress counter
function updateProgress(perc, circleEl, counterEl) {
  var offsetValue = 126 * perc;
  circleEl.css("stroke-dashoffset", 126 - offsetValue);
  if (counterEl) {
    counterEl.html(Math.round(perc * 100) + "%");
  }
}

export default function progressBar() {
  var winHeight = $(window).height(),
      docHeight = $('.poem').height(),
      progressEl = $('progress'),
      circle = $('#text-progress .animated-circle'),
      counter = $('#text-progress .progress__count'),
      max, value;

  /* Set the max scrollable area */
  max = docHeight - winHeight;

  // set max value of horizontal bar
  progressEl.attr('max', max);

  $(document).on('scroll', function() {
     var value = $(window).scrollTop();
     // horizontal bar
     progressEl.attr('value', value);
     // circular counter
     var perc = Math.max(0, Math.min(1, value/max));
     updateProgress(perc, circle, counter);
  });
}
