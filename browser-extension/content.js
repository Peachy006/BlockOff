
console.log("✅ Block Off content script running on", location.href);

// 1️⃣ Automatic check on page load
chrome.storage.local.get("warningEnabled", (result) => {
  if (result.warningEnabled === true) {
    showWarningNotification();
  }
});

// 2️⃣ Manual test trigger from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_WARNING") {
    showWarningNotification();
  }
});

function showWarningNotification() {
  if (document.getElementById("blockoff-warning")) return;

  const box = document.createElement("div");
  box.id = "blockoff-warning";
  box.style.position = "fixed";
  box.style.top = "16px";
  box.style.right = "16px";
  box.style.zIndex = "999999";
  box.style.background = "white";
  box.style.border = "1px solid #ccc";
  box.style.borderRadius = "8px";
  box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  box.style.padding = "12px";
  box.style.width = "260px";
  box.style.fontFamily = "system-ui, sans-serif";
  // FORCE TEXT COLOR
  box.style.color = "#000";


  const title = document.createElement("strong");
  title.textContent = "⚠️ Warning";
  title.style.display = "block";
  title.style.marginBottom = "6px";

  const text = document.createElement("div");
  text.textContent = "This site may be unsafe.";
  text.style.marginBottom = "10px";

  const close = document.createElement("button");
  close.textContent = "Close";
  close.onclick = () => box.remove();

  box.append(title, text, close);
  document.body.appendChild(box);
}
