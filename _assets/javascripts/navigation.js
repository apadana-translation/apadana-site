/*****
Uncheck radio inputs in poem navigation
*****/

$(document).ready(function() {
  $('.tab__label').on('click', function(e){
    var inputPressed = $(this).prev('input[type=radio]');
    if( inputPressed.is(':checked') ) {
      e.preventDefault();
      inputPressed.prop('checked', false );
    }
  })
});

var tabState = function (elem, one, two) {
  var elem = document.querySelector(elem);
  elem.setAttribute('data-tab', elem.getAttribute('data-tab') === one ? two : one);
};

var tabGroupNavigation = '#tabGroupNavigation';
$('#tabNavigation').on('click', function(e){
  tabState(tabGroupNavigation, 'on', 'off');
  e.preventDefault();
});

var tabGroupTools = '#tabGroupTools';
$('#tabTools').on('click', function(e){
  tabState(tabGroupTools, 'on', 'off');
  e.preventDefault();
});
