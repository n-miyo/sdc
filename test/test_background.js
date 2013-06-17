/*
 *
 */

new Test.Unit.Runner(
{
  setup: function() {
  },

  teardown: function() {

  },

  // No search mode.
  testGetCurrentSearchModeWithNoMode: function() {
  with(this) {
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com")); // XXX
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo"));
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/search?q=foo"));
  };},

  // Latest
  testGetCurrentSearchModeWithHour: function() {
  with(this) {
    // colon is ':' and tbs is last part.
    assertEqual(
      1,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:h"));
    // colon is '3A' and tbs is first part.
    assertEqual(
      1,
      getCurrentSearchMode("http://www.google.com/search?tbs=qdr%3Ah&q=foo"));
  };},

  // Past 24 hours
  testGetCurrentSearchModeWithDay: function() {
  with(this) {
    // add extra params and tbs is center.
    assertEqual(
      2,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:d&hl=en"));
    // add extra params and tbs is last part.
    assertEqual(
      2,
      getCurrentSearchMode("http://www.google.com/search?num=100&q=foo&tbs=qdr:d"));
  };},

  // Past Week
  testGetCurrentSearchModeWithWeek: function() {
  with(this) {
    assertEqual(
      3,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:w&hl=en"));
    assertEqual(
      3,
      getCurrentSearchMode("http://www.google.com/search?num=100&q=foo&tbs=qdr:w"));
  };},

  // Past Month
  testGetCurrentSearchModeWithMonth: function() {
  with(this) {
    assertEqual(
      4,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:m&hl=en"));
    assertEqual(
      4,
      getCurrentSearchMode("http://www.google.com/search?num=100&q=foo&tbs=qdr:m"));
  };},

  // Past Year
  testGetCurrentSearchModeWithYear: function() {
  with(this) {
    assertEqual(
      5,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:y"));
    assertEqual(
      5,
      getCurrentSearchMode("http://www.google.com/search?tbs=qdr:y&q=foo"));
  };},

  // Invalid Params.  Ignore and should be 0.
  testGetCurrentSearchModeWithInvalidParams: function() {
  with(this) {
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=abc:y"));
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:X"));

    // First match preferred.
    assertEqual(
      5,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:y,qdr:X"));
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:X,qdr:y"));
  };},

  // Duplicated Params
  testGetCurrentSearchModeWithDuplicatedParams: function() {
  with(this) {
    assertEqual(
      4,
      getCurrentSearchMode("http://www.google.com/search?q=foo&tbs=qdr:m,qdr:h"));
  };},

  // Support Video
  testGetCurrentSearchModeWithVideo: function() {
  with(this) {
    assertEqual(
      2,
      getCurrentSearchMode("http://www.google.com/search?q=foo&tbs=qdr:d,vid:1"));
    assertEqual(
      5,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=vid:1,qdr:y"));
    // Invalid time range.
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=vid:1,qdr:X"));
  };},

  // Support News
  testGetCurrentSearchModeWithNews: function() {
  with(this) {
    assertEqual(
      2,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=nws:1,qdr:d"));
    // No time range.
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/search?q=foo&tbs=nws:1"));
    // Invalid time range.
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=nws:1,qdr:X"));
  };},

  // Support Books
  testGetCurrentSearchModeWithBooks: function() {
  with(this) {
    assertEqual(
      1,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=bks:1,qdr:h"));
    // Invalid time range.
    assertEqual(
      0,
      getCurrentSearchMode("http://www.google.com/webhp?q=foo&tbs=qdr:X,bks:1"));
  };},

  // No search category.
  testUpdateURLWithNoCategory: function() {
  with(this) {
    searchMode = 3;
    assertEqual(
      "http://www.google.com/webhp?q=foo&tbs=qdr:w",
      updateURL("http://www.google.com/webhp?q=foo"));
    searchMode = 2;
    assertEqual(
      "http://www.google.com/search?q=bar&tbs=qdr:d",
      updateURL("http://www.google.com/search?q=bar"));

    searchMode = 1;
    assertEqual(
      "http://www.google.com/search?q=bar&tbs=qdr:h",
      updateURL("http://www.google.com/search?q=bar&tbs=qdr:m"));
  };},

  // News search category.
  testUpdateURLWithNewsCategory: function() {
  with(this) {
    searchMode = 2;
    assertEqual(
      "http://www.google.com/search?q=bar&tbs=nws:1,qdr:d",
      updateURL("http://www.google.com/search?q=bar&tbs=nws:1,qdr:y"));

    // search category must move to first element.
    searchMode = 1;
    assertEqual(
      "http://www.google.com/webhp?q=foo&tbs=nws:1,qdr:h",
      updateURL("http://www.google.com/webhp?q=foo&tbs=qdr:m,nws:1"));
  };},

  // Video search category.
  testUpdateURLWithVideoCategory: function() {
  with(this) {
    searchMode = 2;
    assertEqual(
      "http://www.google.com/search?q=bar&tbs=vid:1,qdr:d",
      updateURL("http://www.google.com/search?q=bar&tbs=vid:1,qdr:y"));

    // search category must move to first element.
    searchMode = 1;
    assertEqual(
      "http://www.google.com/webhp?q=foo&tbs=vid:1,qdr:h",
      updateURL("http://www.google.com/webhp?q=foo&tbs=qdr:m,vid:1"));
  };},

  // Books search category.
  testUpdateURLWithBooksCategory: function() {
  with(this) {
    searchMode = 2;
    assertEqual(
      "http://www.google.com/search?q=bar&tbs=bks:1,qdr:d",
      updateURL("http://www.google.com/search?q=bar&tbs=bks:1,qdr:y"));

    // search category must move to first element.
    searchMode = 1;
    assertEqual(
      "http://www.google.com/webhp?q=foo&tbs=bks:1,qdr:h",
      updateURL("http://www.google.com/webhp?q=foo&tbs=qdr:m,bks:1"));
  };},

  // Duplicate category
  testUpdateURLWithDuplicateCategory: function() {
  with(this) {
    // If there multiple categories, first one is preferred.
    searchMode = 2;
    assertEqual(
      "http://www.google.com/search?q=bar&tbs=vid:1,qdr:d",
      updateURL("http://www.google.com/search?q=bar&tbs=vid:1,bks:1,qdr:y"));

    // search category must move to first element.
    searchMode = 1;
    assertEqual(
      "http://www.google.com/webhp?q=foo&tbs=bks:1,qdr:h",
      updateURL("http://www.google.com/webhp?q=foo&tbs=bks:1,qdr:m,nws:1"));
  };},

  // Category Check
  testIsValidSearchCategory: function() {
  with(this) {
    // no category
    assertEqual(
      true,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=qdr:y"));

    // valid category
    assertEqual(
      true,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=nws:1,qdr:y"));
    assertEqual(
      true,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=qdr:m,vid:1"));
    assertEqual(
      true,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=qdr:h,bks:1"));

    // Correct but not supported.  Should be true.
    assertEqual(
      true,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=cdr:1,cd_min:8/10/2010,cd_max:8/26/2010"));
    assertEqual(
      true,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=nws:1,"));

    // Wrong category
    assertEqual(
      false,
      isValidSearchCategory("http://www.google.com/search?q=bar&tbs=qdr:h,foo:1"));
  };}
});

/* EOF */
