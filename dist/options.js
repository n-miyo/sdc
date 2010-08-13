/*
  Copyright (c) 2010, MIYOKAWA, Nobuyoshi <n-miyo@tempus.org>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions
  are met:

  1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY EXPRESS
  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
  OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
  OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
  BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function saveOptions() {
  var searchMode = [];
  $('#optionSelections input[type=checkbox]:checked').each(function() {
    var v = $(this).attr('value');
    searchMode.push(v);
  });
  console.log("saveOptions: searchMode: " + searchMode);
  localStorage['searchMode'] = searchMode;

  var firstSearchMode =
    $('#optionSelections input[type=radio]:checked').attr('value');
  console.log("saveOptions: firstSearcgMode: " + firstSearchMode);
  localStorage['firstSearchMode'] = firstSearchMode;

  var forceRange =
    $('#forceRangeSetting').attr('checked');
  console.log("saveOptions: forceRange: " + forceRange);
  localStorage['forceRange'] = forceRange;

  // Update status
  $('#saveMessage').text(chrome.i18n.getMessage("saveMessage")).show();
  setTimeout(function() {
    $('#saveMessage').fadeOut('normal');
  }, 750);
  $("#save").attr("disabled", true);
};

// Restores select box state to saved value from localStorage.
function restoreOptions() {
  var s = '';

  var storedSearchMode = localStorage['searchMode'];
  var searchMode = DEFAULT_SEARCH_MODE;
  if (storedSearchMode) {
    searchMode = storedSearchMode.split(',');
  }
  console.log('Loaded from localstorage: ' + storedSearchMode);

  $('#optionSelections :input').attr('checked', false); // All reset.
  for (var i = 0; i < searchMode.length; i++) {
    s = 'input[type=checkbox][value=' + searchMode[i] + ']';
    $(s).attr('checked', true);
  }

  var storedFirstSearchMode = localStorage['firstSearchMode'];
  var firstMode = DEFAULT_FIRST_SEARCH_MODE;
  if (storedFirstSearchMode) {
    firstMode = storedFirstSearchMode;
  }
  s = 'input[type=radio][value=' + firstMode + ']';
  $(s).attr('checked', true);

  var storedForceRange = localStorage['forceRange'];
  var forceRange = DEFAULT_FORCE_RANGE;
  if (storedForceRange !== undefined) {
    forceRange = (storedForceRange == 'true') ? true : false;
  }
  $('#forceRangeSetting').attr('checked', forceRange);

  this.validateCheckbox();	// for safety

  $("#save").attr("disabled", true);
};

function validateCheckbox() {
  // Check radio box enable position.
  var firstSearchMode = $('#optionSelections input[type=radio]:checked');
  var s = '#optionSelections input[type=checkbox][value=' +
    firstSearchMode.attr('value') + ']';

  if ($(s).attr("checked") === false) {
    // default radio button is on invalid button, so change position.
    $(firstSearchMode).attr("checked", false);
    $("#optionSelections input[type=checkbox]:checked").each(function() {
      $('#optionSelections input[type=radio][value=' +
	$(this).attr('value') + ']').attr('checked', true);
      return false;
    });
  }

  // Check checkbox enable/disable state.
  var allChecked = $('#optionSelections input[type=checkbox]:checked');
  var disableValue = allChecked.size() === 1 ? true : false;
  // Should not allow to unset last one check box.
  allChecked.each(function() {
    $(this).attr('disabled', disableValue);
  });

  // Check radiobutton enable/disable state.
  $('#optionSelections input[type=checkbox]').each(function() {
    var r = '#optionSelections input[type=radio][value=' +
      $(this).attr('value') + ']';
    $(r).attr('disabled', (!$(this).attr('checked') || disableValue));
  });

  $("#save").attr("disabled", false);
};

$(function() {
  // Setup messages
  $("#title").text(chrome.i18n.getMessage("title"));
  $("#optionHeader").text(chrome.i18n.getMessage("optionHeader"));
  $("#tableHeaderRange").text(chrome.i18n.getMessage("tableHeaderRange"));
  $("#tableHeaderEnable").text(chrome.i18n.getMessage("tableHeaderEnable"));
  $("#tableHeaderDefault").text(chrome.i18n.getMessage("tableHeaderDefault"));
  $("#anyTime").text(chrome.i18n.getMessage("anyTime"));
  $("#latest").text(chrome.i18n.getMessage("latest"));
  $("#past24Hours").text(chrome.i18n.getMessage("past24Hours"));
  $("#pastWeek").text(chrome.i18n.getMessage("pastWeek"));
  $("#pastMonth").text(chrome.i18n.getMessage("pastMonth"));
  $("#pastYear").text(chrome.i18n.getMessage("pastYear"));
  $("#forceRangeSettingMsg").text(chrome.i18n.getMessage("forceRangeSettingMsg"));
  $("#save").text(chrome.i18n.getMessage("save"));
  $("#reset").text(chrome.i18n.getMessage("reset"));

  // add hook.
  $(":input").change(validateCheckbox);
});

/* EOF */
