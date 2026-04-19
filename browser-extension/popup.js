
document.addEventListener("DOMContentLoaded", async () => {

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
    if (isLocalDomain(hostname)) {
      return hostname;
    }

    const parts = hostname.split(".");
    return parts.length >= 2 ? parts.slice(-2).join(".") : hostname;
  }

  // ───────── DOM ELEMENTS ─────────
  const enableBtn  = document.getElementById("enable");
  const disableBtn = document.getElementById("disable");
  const reportBtn  = document.getElementById("report");

  const domainAgeEl   = document.getElementById("domain-age");
  const reportCountEl = document.getElementById("report-count");

  // ───────── ENSURE ANONYMOUS USER ID ─────────
  chrome.storage.local.get("userId", (res) => {
    if (!res.userId) {
      chrome.storage.local.set({ userId: crypto.randomUUID() });
    }
  });

  // ───────── WARNING ENABLE / DISABLE ─────────
  function updateButtons(enabled) {
    enableBtn.disabled  = enabled;
    disableBtn.disabled = !enabled;
  }

  chrome.storage.local.get("warningEnabled", (result) => {
    updateButtons(result.warningEnabled === true);
  });

  enableBtn.onclick = () => {
    chrome.storage.local.set({ warningEnabled: true }, () => {
      updateButtons(true);
    });
  };

  disableBtn.onclick = () => {
    chrome.storage.local.set({ warningEnabled: false }, () => {
      updateButtons(false);
    });
  };

  // ───────── GET ACTIVE DOMAIN ─────────
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.url || tab.url.startsWith("chrome://")) {
    domainAgeEl.textContent   = "N/A";
    reportCountEl.textContent = "N/A";
    reportBtn.disabled = true;
    return;
  }

  const hostname = new URL(tab.url).hostname;
  const domain   = getRegistrableDomain(hostname);

  // ───────── DOMAIN AGE ─────────
  if (isLocalDomain(domain)) {
    domainAgeEl.textContent = "Local / Development";
  } else {
    fetch("http://localhost:8080/api/domains/age?domain=" + domain)
      .then(res => res.text())
      .then(age => domainAgeEl.textContent = age)
      .catch(() => domainAgeEl.textContent = "Unknown");
  }

  // ───────── REPORT COUNT ─────────
    fetch("http://localhost:8080/units/" + encodeURIComponent(domain))
      .then(res => {
        if (!res.ok) {
          // Domain not in DB yet → zero reports
          return { reportCount: 0 };
        }
        return res.json();
      })
      .then(unit => {
        reportCountEl.textContent =
          typeof unit.reportCount === "number" ? unit.reportCount : "0";
      })
      .catch(() => {
        reportCountEl.textContent = "0";
      });

    // ───────── REPORT SITE ─────────
    reportBtn.onclick = () => {
      chrome.storage.local.get("userId", async ({ userId }) => {

        const reportUrl =
          "http://localhost:8080/units/" + encodeURIComponent(domain) +
          "?userId=" + userId;

        // Helper: attempt reporting once
        async function tryReport() {
          const res = await fetch(reportUrl, { method: "POST" });
          if (!res.ok) throw res;
          return res.json();
        }

        try {
          // 1️⃣ First attempt
          const unit = await tryReport();
          reportCountEl.textContent = unit.reportCount;
          reportBtn.disabled = true;
          reportBtn.textContent = "Reported";
          return;
        } catch (firstError) {
          // 2️⃣ Force lazy unit creation
          try {
            await fetch("http://localhost:8080/units/" + encodeURIComponent(domain));
          } catch {
            // ignore – this call exists only to trigger backend creation
          }

          // 3️⃣ Retry report ONCE
          try {
            const unit = await tryReport();
            reportCountEl.textContent = unit.reportCount;
            reportBtn.disabled = true;
            reportBtn.textContent = "Reported";
            return;
          } catch (secondError) {
            // 4️⃣ Only now is it genuinely "already reported"
            alert("You have already reported this site.");
            reportBtn.disabled = true;
            reportBtn.textContent = "Already reported";
          }
        }
      });
    };
});
