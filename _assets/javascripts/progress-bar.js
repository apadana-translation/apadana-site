// Reading progress bar for poems
// based on https://codepen.io/jpod/pen/oqKvw

$(document).on('ready', function() {  
  var winHeight = $(window).height(),
      docHeight = $('.poem').height(),
      progressBar = $('progress'),
      max, value;

  /* Set the max scrollable area */
  max = docHeight - winHeight;
  progressBar.attr('max', max);

  $(document).on('scroll', function(){
     value = $(window).scrollTop();
     progressBar.attr('value', value);
  });
});
