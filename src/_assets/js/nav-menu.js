class NavMenu extends HTMLElement {
  connectedCallback() {
    this._abort = new AbortController();
    this._activeId = null;

    const media = this.dataset.alwaysOpenMedia;
    this._mq = media ? window.matchMedia(media) : null;

    this._toggles().forEach(btn => {
      btn.addEventListener('click', this._onClick, { signal: this._abort.signal });
    });

    this.addEventListener('focusout', this._onFocusOut, { signal: this._abort.signal });
    this.addEventListener('keydown', this._onKeyDown, { signal: this._abort.signal });
    window.addEventListener('click', this._onClickOutside, { signal: this._abort.signal });
    this._mq?.addEventListener('change', this._update, { signal: this._abort.signal });

    this._update();
  }

  disconnectedCallback() {
    this._abort?.abort();
  }

  _toggles() {
    return Array.from(this.querySelectorAll('button[aria-controls]'))
      .filter(el => el.closest('nav-menu') === this);
  }

  _panels() {
    return Array.from(this.querySelectorAll('[data-open]'))
      .filter(el => el.closest('nav-menu') === this);
  }

  _update = () => {
    const forceOpen = !!this._mq?.matches;
    const active = this._activeId;

    this._toggles().forEach(btn => {
      const id = btn.getAttribute('aria-controls');
      btn.setAttribute('aria-expanded', `${forceOpen || active === id}`);
    });

    this._panels().forEach(panel => {
      const open = forceOpen || active === panel.id;
      panel.dataset.open = `${open}`;
      panel.toggleAttribute('inert', !open);
    });
  };

  _onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = e.currentTarget.getAttribute('aria-controls');
    this._activeId = this._activeId === id ? null : id;
    this._update();
  };

  _onFocusOut = (e) => {
    if (e.relatedTarget && !this.contains(e.relatedTarget)) {
      this._activeId = null;
      this._update();
    }
  };

  _onKeyDown = (e) => {
    if (e.key === 'Escape' && this._activeId) {
      const id = this._activeId;
      this._activeId = null;
      this._update();
      this._toggles().find(b => b.getAttribute('aria-controls') === id)?.focus();
    }
  };

  _onClickOutside = (e) => {
    if (!this.contains(e.target)) {
      this._activeId = null;
      this._update();
    }
  };
}

customElements.define('nav-menu', NavMenu);
