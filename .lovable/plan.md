

## BlockOff — Mobile App (Lovable scope)

Same scope and architecture as previously approved. Updating branding to **BlockOff** throughout.

### Branding updates
- App name: **BlockOff** (logo wordmark + splash, document title, share text, about screen).
- Tagline option: "Block scams before they reach you."
- Reusable warning popup header reads **BlockOff Alert**.
- Share text on My Reports: "⚠️ Flagged on BlockOff — avoid +47…"

### Design system
Rustic Charm palette via `index.css` HSL tokens:
- Background `--floral-white #fffcf2`, surfaces `--dust-grey #ccc5b9`
- Text `--carbon-black #252422` / `--charcoal-brown #403d39`
- Accent / danger `--spicy-paprika #eb5e28` (used sparingly for CTAs and warnings)
- Mobile-first, rounded cards, soft shadows, generous whitespace.

### First-run flow
1. Splash with BlockOff wordmark.
2. 3-line onboarding: detect · warn · report.
3. Permission-style screen "Allow BlockOff to protect this device?" → generates anonymous device ID in localStorage. No manual activate button — protection shown as Active on entry.

### Core screens
1. **Home** — Active status card, "Check a message" CTA, recent community alerts.
2. **Scan / Result** — paste field + type selector (SMS · Handle · URL); verdict card (Safe / Suspicious / Likely Scam) with severity bar, reasons, community match count; one-tap Report.
3. **Report** — type → identifier → optional excerpt → submit confirmation.
4. **My Reports** — list tied to device ID, share button per item.
5. **Community Alerts** — searchable list of top reported numbers, handles, URLs.
6. **Settings** — device ID (regenerate), include-in-community toggle, About BlockOff.

### Reusable warning popup
Centered `<Dialog>` "BlockOffAlert" with paprika header, excerpt, reasons, Report / Dismiss — used on Scan results and as the demo trigger so teammates can preview the exact UX the native app will render.

### Detection engine
Edge function `classify-message` → Lovable AI (`google/gemini-3-flash-preview`) with structured output `{ verdict, severity, reasons[], indicators[] }`, combined with a community lookup that boosts severity and returns match count.

### Data (Lovable Cloud)
- `reports` (id, device_id, type, identifier, platform?, message_excerpt, created_at)
- `community_index` (identifier, type, report_count, first_seen, last_seen) maintained by trigger
- RLS: public insert + read aggregated community data; own reports filtered by device_id header.

### Out of scope (teammates)
Native SMS/DM interception, browser extension, marketing site, auth.

### Deliverable
A polished mobile web app branded **BlockOff** in Rustic Charm styling, wired to Lovable Cloud + Lovable AI, demoing the full warn → report → community loop.

