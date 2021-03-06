/*****
Toggle "scholarly" features on & off on poems.

The following features are toggle-able in the toolbox:
1) ALL FEATURES
2) sidenotes
3) content in square brackets
4) verse numbers
5) diacritics (switch to non-accented notation)
*****/

function addToggleTags() {
  // ===================================
  // Tag DOM features to allow toggle
  // ===================================
  // Brackets
  // Add <span> tag around all square brackets, preserve text inside
  // https://stackoverflow.com/questions/17750648/add-span-to-specific-words
  var brackets = /(\[)([a-zA-Z\s_.,;!“”‘’]+)(\])/g;
  var bracketTitles = /(<h3[^>]*>)(\[)(.*?)(\])(<\/h3>)/g;

  // Verse Numbers
  // Add <span> tag around all verse numbers (look for square or round brackets with only letters, numbers, dashes, or commas inside)
  var verseNumbers = /(\s[\(\[][a-z0-9-,\s]+[\)\]])/g;

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
    "Ṣ":"S",
    "Ś":"Sh",
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

  $("#poem").html(function(_,html) {
    html = html.replace(brackets, '<span class="bracket" data-state="on">$1</span>$2<span class="bracket" data-state="on">$3</span>');
    html = html.replace(bracketTitles, '$1<span class="bracket" data-state="on">$2</span>$3<span class="bracket" data-state="on">$4</span>$5');
    html = html.replace(verseNumbers, '<span class="verse-number" data-state="on">$1</span>');
    html = html.replace(diacritics, function($1, match, key) {
      var key = $1,
          swap = diacriticsMap[key] || match;
      var string = '<span class="diacritics" data-state="on">' + key + '</span><span class="no-diacritics" data-state="off">' + swap + '</span>';
      return string;
    });
    return html;
  });

  // ===================================
  // Toggle Events
  // ===================================

  // Toggles
  var toggleNotes = document.querySelector('#toggle--notes');
  var toggleBrackets = document.querySelector('#toggle--brackets');
  var toggleVerseNumbers = document.querySelector('#toggle--verse-numbers');
  var toggleDiacritics = document.querySelector('#toggle--diacritics');
  var toggleAll = document.querySelectorAll('.switch');

  // Toggle elements
  var elemNotes = ['aside.sidenote', 'a.footnoteRef'];
  var elemBrackets = 'span.bracket';
  var elemVerseNumbers = 'span.verse-number';
  var elemDiacritics = 'span.diacritics';
  var elemNoDiacritics = 'span.no-diacritics';

  // Fire toggles
  toggle(toggleNotes, elemNotes, 'on', 'off');
  toggle(toggleBrackets, elemBrackets, 'on', 'off');
  toggle(toggleVerseNumbers, elemVerseNumbers, 'on', 'off');
  toggle(toggleDiacritics, elemNoDiacritics, 'off', 'on');
  toggle(toggleDiacritics, elemDiacritics, 'on', 'off');

  // 5) Toggle all
  var toggleAllInputs = $(toggleAll).children(':checkbox');
  $(toggleAll[0]).on('mouseover mouseout', function(e) {
    $(toggleAll).not(":eq(0)").trigger(e.type);
  });
  $(toggleAllInputs[0]).change(function() {
    $(toggleAllInputs).not(":eq(0)").prop('checked', $(toggleAllInputs).prop('checked')).trigger('change');
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
};

// ===================================
// Fire on Ready (only on poems)
// ===================================
(function($) {
  if($('main').is('#poem')){
    addToggleTags();
  }
})(jQuery);
