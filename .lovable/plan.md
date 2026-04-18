

You want to run BlockOff on your phone as a real native app. Based on the prior conversation, **Capacitor** is the right choice — it wraps your existing web code into a native shell, so we don't rewrite anything.

## What Capacitor does
Takes your built web app (`dist/` folder), bundles it inside a native Android/iOS project, and runs it in a full-screen webview on your phone. You keep all current code (React, Tailwind, shadcn). The `document` error disappears because Capacitor's webview *is* a browser — unlike Expo.

## Plan

### Step 1 — I add Capacitor to this Lovable project
- Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`
- Create `capacitor.config.ts` with:
  - `appId: app.lovable.f4f82542-6503-4a9e-a02d-979df1839605`
  - `appName: BlockOff`
  - `server.url` pointing to your Lovable preview (enables hot-reload on phone)

### Step 2 — You pull the project to your PC
1. Click **GitHub → Export to GitHub** in Lovable (top right), or pull the latest commit from your existing `Peachy006/BlockOff` repo on the `App` branch.
2. In VS Code terminal:
   ```
   git pull
   npm install
   ```

### Step 3 — You add the Android platform (you're on Windows, so Android only — iOS needs a Mac)
```
npx cap add android
npx cap update android
npm run build
npx cap sync
```

### Step 4 — You install Android Studio (one-time, ~30 min)
- Download: https://developer.android.com/studio
- During setup, let it install the Android SDK and an emulator (pick "Pixel 7" with the latest system image).

### Step 5 — Run on your phone or emulator
```
npx cap run android
```
- **Emulator:** picks the Pixel 7 you installed automatically.
- **Physical phone:** enable Developer Options → USB Debugging on your Android, plug it in via USB, then run the same command and pick your device.

### Step 6 — Whenever you change code in Lovable
```
git pull
npm run build
npx cap sync
npx cap run android
```

## Important notes
- **iPhone:** Not possible from a Windows PC. iOS builds require macOS + Xcode. Android works fine from Windows.
- **Hot-reload:** Because we set `server.url` to your Lovable preview, edits in Lovable appear on your phone instantly without rebuilding — as long as the phone has internet.
- **For app store release later:** You'll remove the `server.url` line so the app runs the bundled offline code instead of the live preview.

## After approval
I'll set up Capacitor in this project (Step 1 only). Steps 2–6 happen on your machine. I'll point you to the official Lovable mobile blog post for the full walkthrough once it's installed.

