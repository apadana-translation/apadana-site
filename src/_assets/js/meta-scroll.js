class MetaScroll extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector('#poem')) return;
    if (!window.matchMedia('(min-width: 880px)').matches) return;

    const container = document.querySelector('.poem__meta');
    const inner = document.querySelector('.meta-inner');
    if (!container || !inner) return;

    const update = () => {
      if (!window.matchMedia('(min-width: 880px)').matches) return;
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const containerBottom = containerTop + container.offsetHeight;
      const innerBottom = inner.offsetHeight + containerTop;
      const scrollBottom = window.scrollY + innerBottom + 64;

      if (scrollBottom > containerBottom) {
        inner.style.position = 'absolute';
        inner.style.bottom = '64px';
      } else {
        inner.style.position = 'fixed';
        inner.style.bottom = 'auto';
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }
}

customElements.define('meta-scroll', MetaScroll);
