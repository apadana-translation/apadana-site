class PoemSidenotes extends HTMLElement {
  connectedCallback() {
    const postContainer = document.querySelector('.poem .poem__content, .has-notes');
    if (!postContainer) return;

    const footnoteContainer = postContainer.querySelector('.footnotes');
    if (!footnoteContainer) return;

    const footnotes = footnoteContainer.querySelectorAll(':scope > ol > li');
    if (!footnotes.length) return;

    let refCounter = 1;

    footnotes.forEach(footnoteEl => {
      const footnoteID = footnoteEl.id;
      const escapedID = CSS.escape(footnoteID);
      const refAnchor = postContainer.querySelector(`a[href='#${escapedID}']`);
      if (!refAnchor) return;

      const refSup = refAnchor.parentElement?.tagName === 'SUP' ? refAnchor.parentElement : null;
      const refMark = refSup || refAnchor;

      // Walk up to find the first element that is a direct child of postContainer
      let pivot = refMark;
      while (pivot.parentElement && pivot.parentElement !== postContainer) {
        pivot = pivot.parentElement;
      }
      if (!pivot || pivot === postContainer) return;

      const ref = refCounter++;
      const sidenoteID = footnoteID.replace(/^f/, 's');

      // Build sidenote element
      const aside = document.createElement('aside');
      aside.className = 'sidenote';
      aside.id = sidenoteID;
      aside.setAttribute('data-ref', ref);
      aside.innerHTML = footnoteEl.innerHTML;

      const refMarkSpan = document.createElement('span');
      refMarkSpan.className = 'ref-mark';
      refMarkSpan.textContent = ref;
      aside.prepend(refMarkSpan);

      // Update the in-text anchor to point to the sidenote
      refAnchor.textContent = ref;
      refAnchor.href = `#${sidenoteID}`;

      // Insert before the pivot paragraph
      postContainer.insertBefore(aside, pivot);

      // Hide the original footnote list item
      footnoteEl.hidden = true;
    });

    // Hide the footnotes section and its separator
    footnoteContainer.hidden = true;
    const sep = postContainer.querySelector('.footnotes-sep');
    if (sep) sep.hidden = true;

    // Show/hide based on viewport width
    this._updateVisibility();
    window.addEventListener('resize', () => this._updateVisibility(), { passive: true });
  }

  _updateVisibility() {
    const show = window.matchMedia('(min-width: 880px)').matches;
    document.querySelectorAll('aside.sidenote').forEach(aside => {
      aside.hidden = !show;
    });
    // Also restore footnote container visibility on small screens
    const footnoteContainer = document.querySelector('.poem .poem__content .footnotes, .has-notes .footnotes');
    if (footnoteContainer) {
      footnoteContainer.hidden = show;
      const sep = footnoteContainer.parentElement?.querySelector('.footnotes-sep');
      if (sep) sep.hidden = show;
    }
  }
}

customElements.define('poem-sidenotes', PoemSidenotes);
