/*
* Fix sidebar at some point and remove
* fixed position at content bottom
*/
function metaScroll () {
  var $window = $(window),
      $container = $('.poem__meta'),
      containerBottom = $container.offset().top + $container.outerHeight(true),
      $inner = $('.meta-inner'),
      innerBottom = $inner.outerHeight(true) + $container.offset().top;

  $window.scroll(function() {
    var scrollBottom = $window.scrollTop() + innerBottom + 64;
    if (scrollBottom > containerBottom) {
      $('.meta-inner').css({"position": "absolute", "bottom": "64px"});
    } else {
      $('.meta-inner').css({"position": "fixed", "bottom": "auto"});
    }
  });
};

// Init based on window width (Match to SASS $medium-large breakpoint)
(function($) {
	function mediaSize() {
		/* Set the matchMedia */
		if (window.matchMedia('(min-width: 880px)').matches) {
			metaScroll();
		};
  };
	/* Call the function */
  mediaSize();
  /* Attach the function to the resize event listener */
	window.addEventListener('resize', mediaSize, false);
})(jQuery);
