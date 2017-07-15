function sidenoteFire() {
	var $postContainer, breakpoint;
	$postContainer = $('.poem, .page');
	breakpoint = 'min-width: 880px';

	$postContainer.sidenotes();

	function sidenotePosition(width) {
		/* Set the matchMedia */
		if (window.matchMedia('(' + width + ')').matches) {
		/* Changes when we reach the min-width  */
			$('.poem, .page').sidenotes('show');
		} else {
      $('.poem, .page').sidenotes('hide');
    };
  };
	/* Call the function */
  sidenotePosition(breakpoint);
}

$(document).on('ready', function() {
  sidenoteFire();
});
