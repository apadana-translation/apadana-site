class ReadingProgress extends HTMLElement {
  connectedCallback() {
    const poem = document.querySelector('article.poem');
    if (!poem) return;

    const circle = this.querySelector('.animated-circle');
    const counter = this.querySelector('.progress__count');
    const progressBar = document.querySelector('progress');

    const update = () => {
      const max = Math.max(1, poem.offsetHeight - window.innerHeight);
      const value = window.scrollY;

      if (progressBar) {
        progressBar.max = max;
        progressBar.value = value;
      }

      const perc = Math.max(0, Math.min(1, value / max));
      if (circle) circle.style.strokeDashoffset = 126 * (1 - perc);
      if (counter) counter.textContent = Math.round(perc * 100) + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }
}

customElements.define('reading-progress', ReadingProgress);
