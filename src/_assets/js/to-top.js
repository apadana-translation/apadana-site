class ToTopButton extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector('#poem')) return;

    const sidebarBtn = document.querySelector('.poem__meta .to-top');
    if (sidebarBtn) {
      sidebarBtn.style.display = 'none';
      window.addEventListener('scroll', () => {
        sidebarBtn.style.display = window.scrollY > 200 ? '' : 'none';
      }, { passive: true });
    }

    document.querySelectorAll('.to-top').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}

customElements.define('to-top-button', ToTopButton);
