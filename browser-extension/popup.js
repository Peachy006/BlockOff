
const enableBtn = document.getElementById("enable");
const disableBtn = document.getElementById("disable");
const reportBtn = document.getElementById("report");

// Toggle button state
function updateButtons(enabled) {
  enableBtn.disabled = enabled;
  disableBtn.disabled = !enabled;
}

// Load state on popup open
chrome.storage.local.get("warningEnabled", (result) => {
  updateButtons(result.warningEnabled === true);
});

// Enable warnings
enableBtn.onclick = () => {
  chrome.storage.local.set({ warningEnabled: true }, () => {
    updateButtons(true);
  });
};

// Disable warnings
disableBtn.onclick = () => {
  chrome.storage.local.set({ warningEnabled: false }, () => {
    updateButtons(false);
  });
};

// Report site
reportBtn.onclick = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.url || tab.url.startsWith("chrome://")) {
    alert("Cannot report this page.");
    return;
  }

  // ✅ Send to backend later — for now log
  console.log("Reporting site:", tab.url);

  alert("Thanks! This site has been reported.");
};
``
