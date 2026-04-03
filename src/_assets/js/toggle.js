class PoemToggles extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector('#poem')) return;
    this._tagDOM();
    this._initToggles();
  }

  _tagDOM() {
    const poemContent = document.querySelector('#poem-content');
    if (!poemContent) return;

    const brackets = /(\[)([a-zA-Z\s_.,;!""'']+)(\])/g;
    const bracketTitles = /(<h3[^>]*>)(\[)(.*?)(\])(<\/h3>)/g;
    const verseNumbers = /(\s[\(\[][a-z0-9-,\s]+[\)\]])/g;

    const diacriticsMap = {
      "Ā":"A","Ī":"I","Ū":"U","Ṅ":"N","Ñ":"N","Ṭ":"T","Ḍ":"D","Ṇ":"N",
      "Ṃ":"M","Ŋ":"M","Ḷ":"L","Ṣ":"S","Ś":"Sh",
      "ā":"a","ī":"i","ū":"u","ṅ":"n","ñ":"n","ṭ":"t","ḍ":"d","ṇ":"n",
      "ṃ":"m","ŋ":"m","ḷ":"l","ṣ":"s","ś":"sh"
    };
    const diacriticsKeys = Object.keys(diacriticsMap).join('|');
    const diacritics = new RegExp('(' + diacriticsKeys + ')(?!([^<]+)?>)', 'g');

    poemContent.innerHTML = poemContent.innerHTML
      .replace(brackets, '<span class="bracket" data-state="on">$1</span>$2<span class="bracket" data-state="on">$3</span>')
      .replace(bracketTitles, '$1<span class="bracket" data-state="on">$2</span>$3<span class="bracket" data-state="on">$4</span>$5')
      .replace(verseNumbers, '<span class="verse-number" data-state="on">$1</span>')
      .replace(diacritics, ($1) => {
        const swap = diacriticsMap[$1] || $1;
        return `<span class="diacritics" data-state="on">${$1}</span><span class="no-diacritics" data-state="off">${swap}</span>`;
      });
  }

  _initToggles() {
    const setAttr = (selector, attr, value) => {
      document.querySelectorAll(selector).forEach(el => el.setAttribute(attr, value));
    };

    const bindToggle = (buttonEl, selectors, onState, offState) => {
      if (!buttonEl) return;
      const checkbox = buttonEl.querySelector(':scope > input[type=checkbox]');
      if (!checkbox) return;

      const selectorList = Array.isArray(selectors) ? selectors : [selectors];

      checkbox.addEventListener('change', () => {
        const state = checkbox.checked ? onState : offState;
        selectorList.forEach(sel => setAttr(sel, 'data-state', state));
      });

      buttonEl.addEventListener('mouseover', () => {
        selectorList.forEach(sel => setAttr(sel, 'data-hover', 'on'));
      });
      buttonEl.addEventListener('mouseout', () => {
        selectorList.forEach(sel => setAttr(sel, 'data-hover', 'off'));
      });
    };

    const toggleNotes = document.querySelector('#toggle--notes');
    const toggleBrackets = document.querySelector('#toggle--brackets');
    const toggleVerseNumbers = document.querySelector('#toggle--verse-numbers');
    const toggleDiacritics = document.querySelector('#toggle--diacritics');
    const toggleAll = document.querySelector('#toggle--all');

    bindToggle(toggleNotes, ['aside.sidenote', 'a.footnoteRef'], 'on', 'off');
    bindToggle(toggleBrackets, 'span.bracket', 'on', 'off');
    bindToggle(toggleVerseNumbers, 'span.verse-number', 'on', 'off');
    bindToggle(toggleDiacritics, ['span.diacritics', 'span.no-diacritics'], null, null);

    // Diacritics toggle inverts two selectors independently
    const toggleDiacriticsEl = toggleDiacritics?.querySelector(':scope > input[type=checkbox]');
    if (toggleDiacriticsEl) {
      // Remove the binding from bindToggle for diacritics since it needs split logic
      const newCheckbox = toggleDiacriticsEl.cloneNode(true);
      toggleDiacriticsEl.replaceWith(newCheckbox);
      newCheckbox.addEventListener('change', () => {
        setAttr('span.no-diacritics', 'data-state', newCheckbox.checked ? 'off' : 'on');
        setAttr('span.diacritics', 'data-state', newCheckbox.checked ? 'on' : 'off');
      });
    }

    // Master toggle
    if (toggleAll) {
      const masterCheckbox = toggleAll.querySelector(':scope > input[type=checkbox]');
      const switches = document.querySelectorAll('.switch:not(.switch--master)');

      masterCheckbox?.addEventListener('change', () => {
        switches.forEach(sw => {
          const cb = sw.querySelector('input[type=checkbox]');
          if (cb && cb.checked !== masterCheckbox.checked) {
            cb.checked = masterCheckbox.checked;
            cb.dispatchEvent(new Event('change'));
          }
        });
      });

      toggleAll.addEventListener('mouseover', () => {
        switches.forEach(sw => sw.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
      });
      toggleAll.addEventListener('mouseout', () => {
        switches.forEach(sw => sw.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));
      });
    }
  }
}

customElements.define('poem-toggles', PoemToggles);
