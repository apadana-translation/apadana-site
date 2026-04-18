class SocialShare extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector('button');
    if (!button) return;

    const label = button.querySelector('.tab__title');
    const canShare = typeof navigator.share === 'function';

    if (!canShare && label) {
      label.textContent = 'Copy URL';
      button.title = 'Copy URL';
      button.setAttribute('aria-label', 'Copy URL');
    }

    button.addEventListener('click', async () => {
      const url = window.location.href;
      const title = document.title;

      if (canShare) {
        try {
          await navigator.share({ title, url });
        } catch (err) {
          if (err.name !== 'AbortError') console.error(err);
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        if (label) {
          const original = label.textContent;
          label.textContent = 'Copied!';
          setTimeout(() => { label.textContent = original; }, 2000);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}

customElements.define('social-share', SocialShare);
