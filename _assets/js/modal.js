// TODO: DRY this out!

var modalParent = document.querySelector('body'),
    modalOpen = document.querySelector('#modal-toggle'),
    modalClose = document.querySelector('#modal-close');

modalOpen.onclick = function() {
  var modalState = this.getAttribute('modal-state');
  if (modalState != 'is-open') {
    this.setAttribute('modal-state', 'is-open');
    modalParent.setAttribute('modal-state', 'is-open');
    modalClose.setAttribute('modal-state', 'is-open');

  } else {
    this.setAttribute('modal-state', 'is-closed');
    modalParent.setAttribute('modal-state', 'is-closed');
    modalClose.setAttribute('modal-state', 'is-closed');
  }
};

modalClose.onclick = function() {
  var modalState = this.getAttribute('modal-state');
  if (modalState != 'is-open') {
    this.setAttribute('modal-state', 'is-open');
    modalParent.setAttribute('modal-state', 'is-open');
    modalOpen.setAttribute('modal-state', 'is-open');

  } else {
    this.setAttribute('modal-state', 'is-closed');
    modalParent.setAttribute('modal-state', 'is-closed');
    modalOpen.setAttribute('modal-state', 'is-closed');
  }
};
