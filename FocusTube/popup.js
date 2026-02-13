const toggle = document.getElementById("toggle");
const statusText = document.getElementById("status");
const modeSelect = document.getElementById("modeSelect");
const advancedOptions = document.getElementById("advancedOptions");

const hideHome = document.getElementById("hideHome");
const hideShorts = document.getElementById("hideShorts");
const hideComments = document.getElementById("hideComments");
const hideRelated = document.getElementById("hideRelated");

/* Load saved settings */
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

    toggle.checked = res.enabled ?? false;
    statusText.textContent = toggle.checked ? "ON" : "OFF";

    modeSelect.value = res.mode ?? "normal";
    advancedOptions.style.display =
      modeSelect.value === "advanced" ? "block" : "none";

    hideHome.checked = res.hideHome ?? false;
    hideShorts.checked = res.hideShorts ?? false;
    hideComments.checked = res.hideComments ?? false;
    hideRelated.checked = res.hideRelated ?? false;
  }
);

/* Master toggle */
toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
  statusText.textContent = toggle.checked ? "ON" : "OFF";
});

/* Mode change */
modeSelect.addEventListener("change", () => {
  chrome.storage.sync.set({ mode: modeSelect.value });

advancedOptions.style.display =
  modeSelect.value === "advanced" ? "block" : "none";


/* Advanced checkboxes */
[hideHome, hideShorts, hideComments, hideRelated].forEach(el => {
  el.addEventListener("change", () => {
    chrome.storage.sync.set({
      hideHome: hideHome.checked,
      hideShorts: hideShorts.checked,
      hideComments: hideComments.checked,
      hideRelated: hideRelated.checked
    });
  });
})});
