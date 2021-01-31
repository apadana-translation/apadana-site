var modalParent = document.querySelector('body');

$('.modal-open, #modal-close').click(function() {
  var modalState = modalParent.getAttribute('modal-state');
  if (modalState != 'is-open') {
    modalParent.setAttribute('modal-state', 'is-open');
  } else {
    modalParent.setAttribute('modal-state', 'is-closed');
  }
});
