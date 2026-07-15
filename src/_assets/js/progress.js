class ReadingProgress extends HTMLElement {
  connectedCallback() {
    const article = this.closest('main')?.querySelector('article.poem');
    if (!article) return;

    const circle = this.querySelector('.animated-circle');
    const counter = this.querySelector('.progress__count');

    const update = () => {
      const max = Math.max(1, article.offsetHeight - window.innerHeight);
      const perc = Math.max(0, Math.min(1, window.scrollY / max));

      if (circle) circle.style.strokeDashoffset = 126 * (1 - perc);
      if (counter) counter.textContent = Math.round(perc * 100) + '%';
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

customElements.define('reading-progress', ReadingProgress);
