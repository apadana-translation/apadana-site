/*****
Toggle "scholarly" features on & off on poems.

The following features are toggle-able in the toolbox:
1) chapter headings
2) sidenotes
3) content in square brackets
4) verse numbers
5) diacritics (switch to non-accented notation)
*****/

// ===================================
// Tag DOM features to allow toggle
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  // Brackets
  // Add <span> tag around all square brackets, preserve text inside
  // https://stackoverflow.com/questions/17750648/add-span-to-specific-words
  var brackets = /(\[)([a-zA-Z\s]+)(\])/g;
  $("#poem").html(function(_,html){
      return html.replace(brackets, '<span class="bracket" data-state="on">$1</span>$2<span class="bracket" data-state="on">$3</span>')
  });

  // Verse Numbers
  // Add <span> tag around all verse numbers (look for square or round brackets with only letters, numbers, dashes, or commas inside)
  var verseNumbers = /(\s[\(\[][a-z0-9-,\s]+[\)\]])/g;
  $("#poem").html(function(_,html){
      return html.replace(verseNumbers, '<span class="verse-number" data-state="on">$1</span>')
  });

  // Diacritics
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
  $("#poem").html(function(_,html){
      return html.replace(diacritics, function($1, match, key) {
        var key = $1,
            swap = diacriticsMap[key] || match;
        var string = '<span class="diacritics" data-state="on">' + key + '</span><span class="no-diacritics" data-state="off">' + swap + '</span>';
        return string;
      });
  });
});

// ===================================
// Toggle Events
// ===================================
// 1) Chapter Headings
var toggleChHeadings = document.querySelector('#toggle--ch-headings');
var elemChHeadings = 'h2.ch-heading';
toggle(toggleChHeadings, elemChHeadings, 'on', 'off');

// 2) Sidenotes
var toggleNotes = document.querySelector('#toggle--notes');
var elemNotes = ['aside.sidenote', 'a.footnoteRef'];
toggle(toggleNotes, elemNotes, 'on', 'off');

// 3) Brackets
var toggleBrackets = document.querySelector('#toggle--brackets');
var elemBrackets = 'span.bracket';
toggle(toggleBrackets, elemBrackets, 'on', 'off');

// 4) Verse Numbers
var toggleVerseNumbers = document.querySelector('#toggle--verse-numbers');
var elemVerseNumbers = 'span.verse-number';
toggle(toggleVerseNumbers, elemVerseNumbers, 'on', 'off');

// 5) Diacritics
var toggleDiacritics = document.querySelector('#toggle--diacritics');
var elemDiacritics = 'span.diacritics';
var elemNoDiacritics = 'span.no-diacritics';
toggle(toggleDiacritics, elemNoDiacritics, 'off', 'on');
toggle(toggleDiacritics, elemDiacritics, 'on', 'off');

// 6) Toggle all
var toggleAll = document.querySelectorAll('.switch__input');
$(toggleAll[0]).change(function() {
  $(toggleAll).not(":eq(0)").prop('checked', $(toggleAll).prop('checked')).trigger('change');
});

// ===================================
// Toggle Functions
// ===================================
function toggle(button, feature, one, two) {

  $(button).children(':checkbox').change(function() {
    if (this.checked) {
      data(feature, 'data-state', one);
    } else {
      data(feature, 'data-state', two);
    }
  });

  button.onmouseover = function() {
    data(feature, 'data-hover', 'on');
  };

  button.onmouseout = function() {
    data(feature, 'data-hover', 'off');
  };

  var data = function (element, attribute, state) {
    var element = document.querySelectorAll(element), i;
    for (i = 0; i < element.length; ++i) {
      element[i].setAttribute(attribute, state);
    };
  };
}