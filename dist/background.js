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

var GOOGLE_REGEXP =
  new RegExp("^http(s)?:\/\/[a-zA-Z.]+\.google\.[a-zA-Z.]+\/(search|webhp|#)");
var TBS_REGEXP =
  new RegExp("[&?]+tbs=([a-zA-Z0-9:,/_]+)");
var TBS_CATREGEXP =
  new RegExp("^(nws:1|vid:1|bks:1)$");
var TBS_KNOWNTGTREGEXP =
  new RegExp("^(rltm|qdr|cdr|cd_min|cd_max|nws|vid|bks)");

var timeRange = [
  {mess: 'Any time',      opt: '',       key: 'anytime',   enable: true},
  {mess: 'Latest',        opt: 'rltm:1', key: 'latest',    enable: true},
  {mess: 'Past 24 hours', opt: 'qdr:d',  key: 'past24',    enable: true},
  {mess: 'Past week',     opt: 'qdr:w',  key: 'pastweek',  enable: true},
  {mess: 'Past month',    opt: 'qdr:m',  key: 'pastmonth', enable: true},
  {mess: 'Past year',     opt: 'qdr:y',  key: 'pastyear',  enable: true}
];
var firstSearchMode = 0;
var searchMode = 0;
var forceRange = false;

function loadOptions() {
  var
    sm = ((sm = localStorage['searchMode']) ?
          sm.split(',') : DEFAULT_SEARCH_MODE),
    fsm = ((fsm = localStorage['firstSearchMode']) ?
           fsm : DEFAULT_FIRST_SEARCH_MODE),
    sfr = localStorage['forceRange'],
    i, j;

  console.log("loaded forceRange: " + sfr);

  forceRange = DEFAULT_FORCE_RANGE;
  if (sfr !== undefined) {
    forceRange = (sfr === 'true') ? true : false;
  }
  console.log("loadOptions: forceRange: " + forceRange);

  for (i = 0; i < timeRange.length; i++) {
    timeRange[i].enable = false;
    for (j = 0; j < sm.length; j++) {
      if (timeRange[i].key === sm[j]) {
        timeRange[i].enable = true;
        console.log("loadOptions: mode: " + sm[j]);
        break;
      }
    }
    if (timeRange[i].key === fsm) {
      firstSearchMode = searchMode = i;
      console.log("loadOptions: firstSearchMode: " + fsm);
    }
  }
}

function searchWithTime(tab) {
  console.log("searchanytime:searchWithTime.");

  forwardSearchMode(tab.url);
  var new_url = updateURL(tab.url);
  if(new_url != tab.url) {
    chrome.tabs.update(tab.id, {'url': new_url});
  }
}

function forwardSearchMode(url) {
  console.log("searchanytime:forwardSearchMode: " + url);
  searchMode = getCurrentSearchMode(url);
  var i;
  for (i = 0; i < timeRange.length; i++) {
    searchMode = (searchMode+1) % timeRange.length;
    if (timeRange[searchMode].enable === true) {
      break;
    }
  }
  console.log("next searchMode: " + searchMode);
}

function getCurrentSearchMode(url) {
  console.log("searchanytime:getCurrentSearchMode.");
  console.log("url: " + url);

  var
    mode = 0,
    m = getTbs(url),
    i, fixm, sm;

  // eliminate category(e.g. nws)
  fixm = m[0];
  sm = m[1].split(',');
  for (i = 0; i < sm.length; i++) {
    if (!sm[i].match(TBS_CATREGEXP)) {
      fixm = sm[i];
      break;
    }
  }

  for (i = 0; i < timeRange.length; i++) {
    console.log(i + ": matched: " + fixm + " / mode: " + timeRange[i].opt);
    if (fixm === timeRange[i].opt) {
      mode = i;
      break;
    }
  }
  console.log("current mode: " + mode);

  return mode;
}

function updateURL(url) {
  console.log("searchanytime:updateURL: searchMode:" + searchMode);
  url = url.replace(/%3A/g, ":"); // XXX
  var
    opt = timeRange[searchMode].opt,
    m = getTbs(url);
  console.log("opt  : " + opt);
  console.log("url  : " + url);
  console.log("m    : " + m);
  if (m[0] === '') {
    url += "&tbs=" + opt;
  } else {
    url = replaceTbs(url, opt);
  }
  console.log("murl : " + url);

  return url;
}

function replaceTbs(url, opt) {
  var
    tbs = "&tbs=",
    m = getTbs(url),
    i, sm;

  url = url.replace(TBS_REGEXP, ''); // eliminate current tbs.

  // find category(e.g. nws) and concat them.
  sm = m[1].split(',');
  for (i = 0; i < sm.length; i++) {
    if (sm[i].match(TBS_CATREGEXP)) {
      tbs += sm[i] + ',';
      break;
    }
  }

  console.log("replaceTbs: newURL: " + url + tbs + opt);

  return url + tbs + opt;
}

function getTbs(url) {
  var x = url.replace(/%3A/g, ":").match(TBS_REGEXP);
  return x === null ? ['', ''] : x; // XXX
}

function isValidSearchMode(mode) {
  console.log("isValidSearchMode: " + mode + " / " + timeRange[mode].enable);
  return timeRange[mode].enable;
}

function isValidSearchCategory(url) {
  var
    m = getTbs(url),
    sm;

  if (m[0] == '') {
    return true;
  }

  sm = m[1].split(',');
  for (i = 0; i < sm.length; i++) {
    if (sm[i] !== "" && !sm[i].match(TBS_KNOWNTGTREGEXP)) {
      return false;
    }
  }

  return true;
}

function updateIconAndToolTip(tab) {
  console.log("searchanytime:updateIconAndToolTip");

  var mode = getCurrentSearchMode(tab.url);
  chrome.pageAction.setTitle(
    {'tabId': tab.id,
     'title': "sdc mode: " + timeRange[mode].mess});
  chrome.pageAction.setIcon(
    {'tabId': tab.id, 'path': 'img/icon' + mode + '.png'});
}


// ------------------------------------------------------------
chrome.tabs.onCreated.addListener(function(tabId, change_info, tab) {
  console.log("searchanytime:tabs.onCreated.addListener.");
  loadOptions();
});

chrome.tabs.onUpdated.addListener(function(tabId, change_info, tab) {
  // Example of tab.url:
  //   tab.url="http://www.google.co.jp/search?sourceid=chrome&ie=UTF-8&q=foo&esrch=FT1";
  console.log("searchanytime:onUpdated.addListener: " + change_info.status);

  if (tab.url.match(GOOGLE_REGEXP) !== null
      && isValidSearchCategory(tab.url)) {

    if (change_info.status === 'loading') {
      // avoid icon update for 'complete' status.
      console.log("tabURL: " + tab.url);

      updateIconAndToolTip(tab);
      chrome.pageAction.show(tabId);
      console.log("forceRange: " + forceRange);
      if (forceRange && !isValidSearchMode(getCurrentSearchMode(tab.url))) {
        console.log("force user range");
        searchMode = firstSearchMode;
        var new_url = updateURL(tab.url);
        if(new_url != tab.url) {
          chrome.tabs.update(tab.id, {'url': new_url});
        }
      }
    }
  } else {
    chrome.pageAction.hide(tabId);
  }
});

chrome.pageAction.onClicked.addListener(function(tab) {
  console.log("searchanytime:chrome.pageAction.onClicked.addListener.");
  searchWithTime(tab);
});

chrome.extension.onRequest.addListener(function(request, sender, sentResp) {
  console.log("searchanytime:chrome.extension.onRequest.addListener.");
  searchWithTime(tab);
});

/* EOF */
