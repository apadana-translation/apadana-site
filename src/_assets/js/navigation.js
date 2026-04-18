class PoemNavigation extends HTMLElement {
  connectedCallback() {
    this._initTabs();
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

  _initTabs() {
    this.querySelectorAll('.tab__label, .chapter').forEach(label => {
      label.addEventListener('click', (e) => {
        const input = label.previousElementSibling;
        if (input && input.type === 'radio' && input.checked) {
          e.preventDefault();
          input.checked = false;
        }
      });
    });

    const tabNavigation = this.querySelector('#tabNavigation');
    const tabTools = this.querySelector('#tabTools');
    const tabGroupNavigation = this.querySelector('#tabGroupNavigation');
    const tabGroupTools = this.querySelector('#tabGroupTools');

    const setTab = (el, state) => el && el.setAttribute('data-tab', state);
    const toggleTab = (el, on, off) => {
      if (!el) return;
      el.setAttribute('data-tab', el.getAttribute('data-tab') === on ? off : on);
    };

    tabNavigation?.addEventListener('click', (e) => {
      e.preventDefault();
      setTab(tabGroupTools, 'off');
      toggleTab(tabGroupNavigation, 'on', 'off');
    });

    tabTools?.addEventListener('click', (e) => {
      e.preventDefault();
      setTab(tabGroupNavigation, 'off');
      toggleTab(tabGroupTools, 'on', 'off');
    });

    tabGroupNavigation?.querySelectorAll('input[type=radio]').forEach(input => {
      input.addEventListener('click', () => {
        tabGroupTools?.querySelectorAll('input[type=radio]').forEach(r => { r.checked = false; });
      });
    });

    tabGroupTools?.querySelectorAll('input[type=radio]').forEach(input => {
      input.addEventListener('click', () => {
        tabGroupNavigation?.querySelectorAll('input[type=radio]').forEach(r => { r.checked = false; });
      });
    });

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
