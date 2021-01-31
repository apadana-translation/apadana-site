(function($) {
  if($('main').is('#poem')){
    // Show or hide the sticky footer button
  	$(window).scroll(function() {
  		if ($(this).scrollTop() > 200) {
  			$('.poem__meta .to-top').fadeIn(200);
  		} else {
  			$('.poem__meta .to-top').fadeOut(200);
  		}
  	});

  	// Animate the scroll to top
  	$('.to-top').click(function(e) {
  		e.preventDefault();
  		$('html, body').animate({scrollTop: 0}, 300);
  	})
  }
})(jQuery);
