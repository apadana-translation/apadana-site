class PoemNavigation extends HTMLElement {
  connectedCallback() {
    this._initProgressBar();
  }

  _initProgressBar() {
    const bar = this.querySelector('progress');
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      bar.max = Math.max(1, doc.scrollHeight - window.innerHeight);
      bar.value = window.scrollY;
    };

    let rafId = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }
}

customElements.define('poem-navigation', PoemNavigation);
