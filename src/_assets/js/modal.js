class ModalDialog extends HTMLElement {
  connectedCallback() {
    const dialog = this.querySelector('dialog');
    if (!dialog) return;

    document.addEventListener('click', (e) => {
      if (e.target.closest('.modal-open')) {
        dialog.showModal();
      }
    });
  }
}

customElements.define('modal-dialog', ModalDialog);
