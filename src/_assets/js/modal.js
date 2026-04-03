class PoemModal extends HTMLElement {
  connectedCallback() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.modal-open') && !e.target.closest('#modal-close')) return;
      const state = document.body.getAttribute('modal-state');
      document.body.setAttribute('modal-state', state === 'is-open' ? 'is-closed' : 'is-open');
    });
  }
}

customElements.define('poem-modal', PoemModal);
