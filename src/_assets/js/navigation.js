function navigation() {
  // ===================================
  // Uncheck radio inputs in poem, TOC navigation
  // ===================================
  $('.tab__label, .chapter').on('click', function (e) {
    var inputPressed = $(this).prev('input[type=radio]');
    if(inputPressed.is(':checked')) {
      e.preventDefault();
      inputPressed.prop('checked', false );
    }
  });

  // ===================================
  // Toggle tab groups on small and medium screens
  // ===================================
  var tabGroupNavigation = '#tabGroupNavigation';
  var tabGroupTools = '#tabGroupTools';

  $('#tabNavigation').on('click', function (e) {
    tabState(tabGroupTools, 'off');
    tabState(tabGroupNavigation, 'on', 'off');
    e.preventDefault();
  });

  $('#tabTools').on('click', function (e) {
    tabState(tabGroupNavigation, 'off');
    tabState(tabGroupTools, 'on', 'off');
    e.preventDefault();
  });

  // function to switch data atribute state
  var tabState = function (elem, one, two) {
    var elem = document.querySelector(elem);
    elem.setAttribute('data-tab', elem.getAttribute('data-tab') === one ? two : one);
  };

  // ===================================
  // Show only one tab group or TOC chapter at a time
  // ===================================
  $(tabGroupNavigation).children('input[type=radio]').on('click', function (e) {
    $(tabGroupTools).children('input[type=radio]').prop('checked', false );
  });

  $(tabGroupTools).children('input[type=radio]').on('click', function (e) {
    $(tabGroupNavigation).children('input[type=radio]').prop('checked', false );
  });

  $('label[for=chapter-3]').on('click', function (e) {
    $('input#chapter-4').prop('checked', false );
  });

  $('label[for=chapter-4]').on('click', function (e) {
    $('input#chapter-3').prop('checked', false );
  });
}

(function () {
  navigation();
})(jQuery);

// ===================================
// Hide mobile poem header and pagination on scroll down
// based on https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c
// ===================================
var didScroll,
    lastScrollTop = 0,
    delta = 5,
    navBar = $('.header--poem'),
    navbarHeight = navBar.outerHeight(),
    paginationBar = $('.mobile-pagination');

$(window).scroll(function(event){
  didScroll = true;
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 125);

function hasScrolled() {
  var st = $(this).scrollTop();

  // Make sure they scroll more than delta
  if(Math.abs(lastScrollTop - st) <= delta)
    return;

  if (st > lastScrollTop && st > navbarHeight){
    // Scroll Down
    $('.mobile-pagination').removeClass('nav-show').addClass('nav-below');
  } else {
    // Scroll Up
    if (st + $(window).height() < $(document).height()) {
      $('.mobile-pagination').removeClass('nav-below').addClass('nav-show');
    }
  }

  lastScrollTop = st;
}
