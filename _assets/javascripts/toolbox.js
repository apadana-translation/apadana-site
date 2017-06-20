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
var toggleState = function (elem, one) {
  var elem = document.querySelectorAll(elem), i;
  for (i = 0; i < elem.length; ++i) {
    elem[i].setAttribute('data-state', one);
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
$(toggleChHeadings).children(':checkbox').change(function() {
  if (this.checked) {
    toggleState(elemChHeadings, 'on');
  } else {
    toggleState(elemChHeadings, 'off');
  }
});
toggleChHeadings.onmouseover = function() {
  hoverState(elemChHeadings, 'on');
};
toggleChHeadings.onmouseout = function() {
  hoverState(elemChHeadings, 'off');
};

// Events for sidenotes
var toggleNotes = document.querySelector('#toggle--notes');
var elemNotes = ['aside.sidenote', 'a.footnoteRef'];
$(toggleNotes).children(':checkbox').change(function() {
  if (this.checked) {
    toggleState(elemNotes, 'on');
  } else {
    toggleState(elemNotes, 'off');
  }
});
toggleNotes.onmouseover = function() {
  hoverState(elemNotes, 'on');
};
toggleNotes.onmouseout = function() {
  hoverState(elemNotes, 'off');
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
$(toggleBrackets).children(':checkbox').change(function() {
  if (this.checked) {
    toggleState(elemBrackets, 'on');
  } else {
    toggleState(elemBrackets, 'off');
  }
});
toggleBrackets.onmouseover = function() {
  hoverState(elemBrackets, 'on');
};
toggleBrackets.onmouseout = function() {
  hoverState(elemBrackets, 'off');
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
$(toggleVerseNumbers).children(':checkbox').change(function() {
  if (this.checked) {
    toggleState(elemVerseNumbers, 'on');
  } else {
    toggleState(elemVerseNumbers, 'off');
  }
});
toggleVerseNumbers.onmouseover = function() {
  hoverState(elemVerseNumbers, 'on');
};
toggleVerseNumbers.onmouseout = function() {
  hoverState(elemVerseNumbers, 'off');
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
var diacritics = new RegExp('\(' + diacriticsKeys + '\)(?!([^<]+)?>)', 'g');
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
$(toggleDiacritics).children(':checkbox').change(function() {
  if (this.checked) {
    toggleState(elemDiacritics, 'on');
  } else {
    toggleState(elemDiacritics, 'off');
  }
});
toggleDiacritics.onmouseover = function() {
  hoverState(elemDiacritics, 'on');
};
toggleDiacritics.onmouseout = function() {
  hoverState(elemDiacritics, 'off');
};

// Toggle all
var toggleAll = document.querySelectorAll('.switch__input');
$(toggleAll[0]).change(function() {
  $(toggleAll).not(":eq(0)").prop('checked', $(toggleAll).prop('checked')).trigger('change');
});
