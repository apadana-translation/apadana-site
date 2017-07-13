$(function(){
  'use strict';
  var $page = $('#content'),
      options = {
        debug: true,
        prefetch: true,
        cacheLength: 2,
        onStart: {
          duration: 250,
          render: function ($container) {
            $container.addClass('is-exiting');
            smoothState.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 0,
          render: function ($container, $newContent) {
            $container.removeClass('is-exiting');
            $container.html($newContent);
          }
        },
        onAfter: function() {
          $('.poem').sidenotes();
          navigation();
          addToggleTags();
          progressBar();
        }
      },
      smoothState = $page.smoothState(options).data('smoothState');
});
