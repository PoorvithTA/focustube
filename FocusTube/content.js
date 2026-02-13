let observerStarted = false;

function hideElements(selectors) {
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = "none";
    });
  });
}

/* ---------------- NORMAL MODE ---------------- */

function applyNormalMode() {
  const selectors = [
    // Home feed
    "ytd-rich-grid-renderer",

    // Shorts shelves
    "ytd-reel-shelf-renderer",
    "ytd-rich-shelf-renderer[is-shorts]",

    // Shorts sidebar
    'a[href^="/shorts"]',
    'ytd-guide-entry-renderer a[href^="/shorts"]',

    // Comments
    "ytd-comments",

    // Related / Up next
    "#related",
    "ytd-watch-next-secondary-results-renderer"
  ];

  hideElements(selectors);
}

/* ---------------- ADVANCED MODE ---------------- */

function applyAdvancedMode(settings) {
  const selectors = [];

  if (settings.hideHome) {
    selectors.push("ytd-rich-grid-renderer");
  }

  if (settings.hideShorts) {
    selectors.push(
      "ytd-reel-shelf-renderer",
      "ytd-rich-shelf-renderer[is-shorts]",
      'a[href^="/shorts"]',
      'ytd-guide-entry-renderer a[href^="/shorts"]'
    );
  }

  if (settings.hideComments) {
    selectors.push("ytd-comments");
  }

  if (settings.hideRelated) {
    selectors.push(
      "#related",
      "ytd-watch-next-secondary-results-renderer"
    );
  }

  hideElements(selectors);
}

/* ---------------- APPLY MODE ---------------- */

function applyMode() {
  chrome.storage.sync.get(
    [
      "enabled",
      "mode",
      "hideHome",
      "hideShorts",
      "hideComments",
      "hideRelated"
    ],
    (res) => {
      if (!res.enabled) return;

      if (res.mode === "advanced") {
        applyAdvancedMode(res);
      } else {
        applyNormalMode();
      }
    }
  );
}

/* ---------------- OBSERVER ---------------- */

function startObserver() {
  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(() => {
    applyMode();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/* Initial run */
applyMode();
startObserver();

/* Listen for changes */
chrome.storage.onChanged.addListener(() => {
  applyMode();
});
