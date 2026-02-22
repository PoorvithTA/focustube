chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-focus") {
    chrome.storage.sync.get(["enabled"], (res) => {
      const newState = !res.enabled;
      chrome.storage.sync.set({ enabled: newState });
    });
  }
});
