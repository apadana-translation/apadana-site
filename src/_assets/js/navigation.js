class PoemNavigation extends HTMLElement {
  connectedCallback() {
    this._initTabs();
    this._initMobileScroll();
  }

  _initTabs() {
    // Toggle radio off when clicking an already-checked label
    document.querySelectorAll('.tab__label, .chapter').forEach(label => {
      label.addEventListener('click', (e) => {
        const input = label.previousElementSibling;
        if (input && input.type === 'radio' && input.checked) {
          e.preventDefault();
          input.checked = false;
        }
      });
    });

    const tabNavigation = document.getElementById('tabNavigation');
    const tabTools = document.getElementById('tabTools');
    const tabGroupNavigation = document.getElementById('tabGroupNavigation');
    const tabGroupTools = document.getElementById('tabGroupTools');

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

    // Selecting a radio in one tab group unchecks the other
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

    // Chapters 3 and 4 are mutually exclusive
    document.querySelector('label[for=chapter-3]')?.addEventListener('click', () => {
      const ch4 = document.querySelector('input#chapter-4');
      if (ch4) ch4.checked = false;
    });
    document.querySelector('label[for=chapter-4]')?.addEventListener('click', () => {
      const ch3 = document.querySelector('input#chapter-3');
      if (ch3) ch3.checked = false;
    });
  }

  _initMobileScroll() {
    const navBar = document.querySelector('.header--poem');
    const pagination = document.querySelector('.mobile-pagination');
    if (!navBar || !pagination) return;

    let lastScrollTop = 0;
    const delta = 5;
    let didScroll = false;

    window.addEventListener('scroll', () => { didScroll = true; }, { passive: true });

    setInterval(() => {
      if (!didScroll) return;
      didScroll = false;
      const st = window.scrollY;
      if (Math.abs(lastScrollTop - st) <= delta) return;

      if (st > lastScrollTop && st > navBar.offsetHeight) {
        pagination.classList.remove('nav-show');
        pagination.classList.add('nav-below');
      } else if (st + window.innerHeight < document.documentElement.scrollHeight) {
        pagination.classList.remove('nav-below');
        pagination.classList.add('nav-show');
      }
      lastScrollTop = st;
    }, 125);
  }
}

customElements.define('poem-navigation', PoemNavigation);
