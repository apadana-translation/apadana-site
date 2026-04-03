class SocialShare extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      const link = e.target.closest('.js-social-share');
      if (!link) return;
      e.preventDefault();
      const width = 500, height = 300;
      const left = screen.width / 2 - width / 2;
      const top = screen.height / 2 - height / 2;
      window.open(
        link.href,
        '',
        `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`
      );
    });
  }
}

customElements.define('social-share', SocialShare);
