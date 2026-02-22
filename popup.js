const toggle      = document.getElementById("toggle");
const statusEl    = document.getElementById("status");
const btnNormal   = document.getElementById("btnNormal");
const btnAdvanced = document.getElementById("btnAdvanced");
const modeHint    = document.getElementById("modeHint");
const filterHint  = document.getElementById("filterHint");

// Filter buttons
const filterBtns = {
  hideHome:     document.getElementById("btn-hideHome"),
  hideShorts:   document.getElementById("btn-hideShorts"),
  hideComments: document.getElementById("btn-hideComments"),
  hideRelated:  document.getElementById("btn-hideRelated"),
};

// State
let state = {
  enabled:      false,
  mode:         "normal",
  hideHome:     false,
  hideShorts:   false,
  hideComments: false,
  hideRelated:  false,
};

/* ── RENDER ── */
function render() {
  // Focus toggle
  toggle.checked = state.enabled;
  statusEl.textContent = state.enabled ? "Enabled — distractions hidden" : "Disabled";
  statusEl.classList.toggle("on", state.enabled);

  // Mode buttons
  btnNormal.classList.toggle("active",   state.mode === "normal");
  btnAdvanced.classList.toggle("active", state.mode === "advanced");

  const isAdvanced = state.mode === "advanced";

  modeHint.textContent = isAdvanced
    ? "Choose which elements to hide below."
    : "Hides feed, Shorts, comments & related.";

  filterHint.textContent = isAdvanced
    ? "Tap an icon to toggle."
    : "Switch to Advanced to customize.";

  // In Normal mode, all 4 are effectively ON (hidden). Buttons disabled.
  // In Advanced mode, individual state applies. Buttons enabled.
  Object.entries(filterBtns).forEach(([key, btn]) => {
    const isSlashed = isAdvanced ? state[key] : true; // normal = all hidden
    btn.classList.toggle("slashed", isSlashed);
    btn.disabled = !isAdvanced;
  });
}

/* ── SAVE & RENDER ── */
function save() {
  chrome.storage.sync.set(state);
  render();
}

/* ── LOAD ── */
chrome.storage.sync.get(
  ["enabled", "mode", "hideHome", "hideShorts", "hideComments", "hideRelated"],
  (res) => {
    state.enabled      = res.enabled      ?? false;
    state.mode         = res.mode         ?? "normal";
    state.hideHome     = res.hideHome     ?? false;
    state.hideShorts   = res.hideShorts   ?? false;
    state.hideComments = res.hideComments ?? false;
    state.hideRelated  = res.hideRelated  ?? false;
    render();
  }
);

/* ── EVENTS ── */
toggle.addEventListener("change", () => {
  state.enabled = toggle.checked;
  save();
});

btnNormal.addEventListener("click", () => {
  state.mode = "normal";
  save();
});

btnAdvanced.addEventListener("click", () => {
  state.mode = "advanced";
  save();
});

Object.entries(filterBtns).forEach(([key, btn]) => {
  btn.addEventListener("click", () => {
    if (state.mode !== "advanced") return;
    state[key] = !state[key];
    save();
  });
});
