document.addEventListener("DOMContentLoaded", async () => {

  const API_BASE = "http://localhost:8080";

  // ───────── HELPERS ─────────

  function isLocalDomain(domain) {
    return (
      domain === "localhost" ||
      domain.endsWith(".local") ||
      domain.endsWith(".test") ||
      domain.endsWith(".internal") ||
      /^\d{1,3}(\.\d{1,3}){3}$/.test(domain)
    );
  }

  function getRegistrableDomain(hostname) {
    if (isLocalDomain(hostname)) return hostname;
    const parts = hostname.split(".");
    return parts.length >= 2 ? parts.slice(-2).join(".") : hostname;
  }

  function getStoredUserId() {
    return new Promise(resolve => {
      chrome.storage.local.get("userId", ({ userId }) => resolve(userId));
    });
  }

  function storeUserId(userId) {
    chrome.storage.local.set({ userId });
  }

  // ───────── DOM ELEMENTS ─────────

  const enableBtn  = document.getElementById("enable");
  const disableBtn = document.getElementById("disable");
  const reportBtn  = document.getElementById("report");

  const loginBtn = document.getElementById("login");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  const authSection = document.getElementById("auth-section");

  const domainAgeEl   = document.getElementById("domain-age");
  const reportCountEl = document.getElementById("report-count");

  // ───────── LOGIN (REAL AUTH) ─────────

  if (loginBtn) {
    loginBtn.onclick = async () => {
      // Defensive: re-fetch inputs to avoid null ID mismatch
      const emailField = document.getElementById("login-email");
      const passwordField = document.getElementById("login-password");

      if (!emailField || !passwordField) {
        alert("Login inputs not found. Check popup.html IDs.");
        console.error("Missing login-email or login-password elements");
        return;
      }

      const email = emailField.value.trim();
      const password = passwordField.value;

      console.log("LOGIN ATTEMPT", { email, password });

      if (!email || !password) {
        alert("Email and password are required.");
        return;
      }

      try {
        const res = await fetch(API_BASE + "/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({ email, password })
        });

        console.log("LOGIN STATUS:", res.status);

        const responseText = await res.text();
        console.log("LOGIN RESPONSE RAW:", responseText);

        if (!res.ok) {
          alert("Invalid email or password.");
          return;
        }

        const user = JSON.parse(responseText);
        console.log("LOGIN SUCCESS USER:", user);

        storeUserId(user.id);

        alert("Logged in.");
        authSection.style.display = "none";

      } catch (err) {
        console.error("LOGIN ERROR:", err);
        alert("Could not connect to server.");
      }
    };
  }

  // ───────── WARNING ENABLE / DISABLE ─────────

  function updateButtons(enabled) {
    enableBtn.disabled = enabled;
    disableBtn.disabled = !enabled;
  }

  chrome.storage.local.get("warningEnabled", (result) => {
    updateButtons(result.warningEnabled === true);
  });

  enableBtn.onclick = () => {
    chrome.storage.local.set({ warningEnabled: true }, () => updateButtons(true));
  };

  disableBtn.onclick = () => {
    chrome.storage.local.set({ warningEnabled: false }, () => updateButtons(false));
  };

  // ───────── GET ACTIVE DOMAIN ─────────

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || tab.url.startsWith("chrome://")) {
    domainAgeEl.textContent = "N/A";
    reportCountEl.textContent = "N/A";
    reportBtn.disabled = true;
    return;
  }

  const hostname = new URL(tab.url).hostname;
  const domain = getRegistrableDomain(hostname);

  // ───────── DOMAIN AGE ─────────

  if (isLocalDomain(domain)) {
    domainAgeEl.textContent = "Local / Development";
  } else {
    fetch(API_BASE+"/api/domains/age?domain="+domain)
      .then(res => res.text())
      .then(age => domainAgeEl.textContent = age)
      .catch(() => domainAgeEl.textContent = "Unknown");
  }

  // ───────── REPORT COUNT ─────────

  fetch(API_BASE+"/units/"+encodeURIComponent(domain))
    .then(res => res.ok ? res.json() : { reportCount: 0 })
    .then(unit => {
      reportCountEl.textContent =
        typeof unit.reportCount === "number" ? unit.reportCount : "0";
    })
    .catch(() => reportCountEl.textContent = "0");

  // ───────── REPORT SITE ─────────

  reportBtn.onclick = async () => {
    const userId = await getStoredUserId();

    if (!userId) {
      alert("Please log in to report sites.");
      return;
    }

    const res = await fetch(
      API_BASE+"/units/"+encodeURIComponent(domain)+"?userId="+userId,
      { method: "POST" }
    );

    if (res.status === 409) {
      alert("You have already reported this site.");
      reportBtn.disabled = true;
      reportBtn.textContent = "Already reported";
      return;
    }

    if (!res.ok) {
      alert("Report failed.");
      return;
    }

    const unit = await res.json();
    reportCountEl.textContent = unit.reportCount;
    reportBtn.disabled = true;
    reportBtn.textContent = "Reported";
  };
});