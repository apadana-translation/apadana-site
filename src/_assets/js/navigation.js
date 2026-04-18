class PoemNavigation extends HTMLElement {
  connectedCallback() {
    this._initProgressBar();
    this._initChapterAccordionMutex();
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

  _initChapterAccordionMutex() {
    this.querySelector('label[for=chapter-3]')?.addEventListener('click', () => {
      const ch4 = this.querySelector('input#chapter-4');
      if (ch4) ch4.checked = false;
    });
    this.querySelector('label[for=chapter-4]')?.addEventListener('click', () => {
      const ch3 = this.querySelector('input#chapter-3');
      if (ch3) ch3.checked = false;
    });
  }
}

customElements.define('poem-navigation', PoemNavigation);
