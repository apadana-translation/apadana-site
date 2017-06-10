/*****
Toggle "scholarly" features on & off on poems.

The following features are toggle-able in the toolbox:
1) chapter headings
2) sidenotes
3) content in square brackets
4) verse numbers
5) diacritics (switch to non-accented notation)
*****/

// Reuseable toggle function with loop for all instances of an element
// Inspired by https://toddmotto.com/stop-toggling-classes-with-js-use-behaviour-driven-dom-manipulation-with-data-states/
var toggleState = function (elem, one, two) {
  var elem = document.querySelectorAll(elem), i;
  for (i = 0; i < elem.length; ++i) {
    elem[i].setAttribute('data-state', elem[i].getAttribute('data-state') === one ? two : one);
  };
};

var hoverState = function (elem, one) {
  var elem = document.querySelectorAll(elem), i;
  for (i = 0; i < elem.length; ++i) {
    elem[i].setAttribute('data-hover', one);
  };
};

// Events for chapter headings
var toggleChHeadings = document.querySelector('#toggle--ch-headings');
var elemChHeadings = 'h2.ch-heading';
toggleChHeadings.onclick = function (e) {
  toggleState(elemChHeadings, 'off', 'on');
  e.preventDefault();
};
toggleChHeadings.onmouseover = function (e) {
  hoverState(elemChHeadings, 'on');
  e.preventDefault();
};
toggleChHeadings.onmouseout = function (e) {
  hoverState(elemChHeadings, 'off');
  e.preventDefault();
};

// Events for sidenotes
var toggleNotes = document.querySelector('#toggle--notes');
var elemNotes = ['aside.sidenote', 'a.footnoteRef'];
toggleNotes.onclick = function (e) {
  toggleState(elemNotes, 'off', 'on');
  e.preventDefault();
};
toggleNotes.onmouseover = function (e) {
  hoverState(elemNotes, 'on');
  e.preventDefault();
};
toggleNotes.onmouseout = function (e) {
  hoverState(elemNotes, 'off');
  e.preventDefault();
};

// Add <span> tag around all square brackets, preserve text inside
// https://stackoverflow.com/questions/17750648/add-span-to-specific-words
var brackets = new RegExp(/(\[)([a-zA-Z\s]+)(\])/, 'g');
document.addEventListener('DOMContentLoaded', function() {
  $(".poem").html(function(_,html){
      return html.replace(brackets, '<span class="bracket" data-state="on">$1</span>$2<span class="bracket" data-state="on">$3</span>')
  });
});

// Events for brackets
var toggleBrackets = document.querySelector('#toggle--brackets');
var elemBrackets = 'span.bracket';
toggleBrackets.onclick = function (e) {
  toggleState(elemBrackets, 'off', 'on');
  e.preventDefault();
};
toggleBrackets.onmouseover = function (e) {
  hoverState(elemBrackets, 'on');
  e.preventDefault();
};
toggleBrackets.onmouseout = function (e) {
  hoverState(elemBrackets, 'off');
  e.preventDefault();
};

// Add <span> tag around all verse numbers (look for square or round brackets with only letters, numbers, dashes, or commas inside)
// https://stackoverflow.com/questions/17750648/add-span-to-specific-words
var verseNumbers = new RegExp(/(\s[\(\[][a-z0-9-,\s]+[\)\]])/, 'g');
document.addEventListener('DOMContentLoaded', function() {
  $(".poem").html(function(_,html){
      return html.replace(verseNumbers, '<span class="verse-number" data-state="on">$1</span>')
  });
});

// Events for verse numbers
var toggleVerseNumbers = document.querySelector('#toggle--verse-numbers');
var elemVerseNumbers = 'span.verse-number';
toggleVerseNumbers.onclick = function (e) {
  toggleState(elemVerseNumbers, 'off', 'on');
  e.preventDefault();
};
toggleVerseNumbers.onmouseover = function (e) {
  hoverState(elemVerseNumbers, 'on');
  e.preventDefault();
};
toggleVerseNumbers.onmouseout = function (e) {
  hoverState(elemVerseNumbers, 'off');
  e.preventDefault();
};

// Disable diacritics
// based on http://semplicewebsites.com/removing-accents-javascript
var diacriticsMap = {
  "Ā":"A",
  "Ī":"I",
  "Ū":"U",
  "Ṅ":"N",
  "Ñ":"N",
  "Ṭ":"T",
  "Ḍ":"D",
  "Ṇ":"N",
  "Ṃ":"M",
  "Ŋ":"M",
  "Ḷ":"L",
  "ā":"a",
  "ī":"i",
  "ū":"u",
  "ṅ":"n",
  "ñ":"n",
  "ṭ":"t",
  "ḍ":"d",
  "ṇ":"n",
  "ṃ":"m",
  "ŋ":"m",
  "ḷ":"l",
  "ṣ":"s",
  "ś":"sh"
};

var diacriticsKeys = Object.keys(diacriticsMap).join('|');
var diacritics = new RegExp('\(' + diacriticsKeys + '\)', 'g');
document.addEventListener('DOMContentLoaded', function() {
  $(".poem").html(function(_,html){
      return html.replace(diacritics, '<span class="diacritics" data-state="on">$1</span>')
  });
});

// String.prototype.latinize = function() {
// 	return this.replace(/[^\u0000-\u007E]/g, function(x) { return latin_map[x] || x; })
// };
//
// document.addEventListener('DOMContentLoaded', function() {
//   $(".poem").html(function(_,html){
//       return html.replace(/[^\u0000-\u007E]/g, function(x) { return diacriticMap[x] || x; })
//   });
// });

// Events for diacritics
var toggleDiacritics = document.querySelector('#toggle--diacritics');
var elemDiacritics = 'span.diacritics';
toggleDiacritics.onclick = function (e) {
  toggleState(elemDiacritics, 'off', 'on');
  e.preventDefault();
};
toggleDiacritics.onmouseover = function (e) {
  hoverState(elemDiacritics, 'on');
  e.preventDefault();
};
toggleDiacritics.onmouseout = function (e) {
  hoverState(elemDiacritics, 'off');
  e.preventDefault();
};
