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

$(document).on('ready', function() {
  navigation();
});
