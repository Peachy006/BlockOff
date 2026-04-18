

## Plan B — Paste-ready code for every missing file

I'll switch to default mode and print the full contents of each file you need, in copy-paste blocks. You'll create each file at the exact path shown and paste the code in.

### Files I'll provide

**1. Path alias sanity check** (so `@/...` imports resolve)
- `tsconfig.json` — confirm `paths: { "@/*": ["./src/*"] }`
- `vite.config.ts` — confirm `resolve.alias` for `@`

**2. Core helper** (required by every UI component)
- `src/lib/utils.ts` — the `cn` function

**3. Shadcn UI components** (`src/components/ui/`)
- `button.tsx`
- `card.tsx`
- `switch.tsx`
- `label.tsx`
- `sonner.tsx`
- `dialog.tsx`
- `input.tsx`
- `textarea.tsx`
- `tooltip.tsx`

**4. BlockOff logic** (`src/lib/`)
- `types.ts`
- `device.ts`
- `storage.ts`
- `detect.ts`

**5. BlockOff components** (`src/components/`)
- `BlockOffLogo.tsx`
- `BlockOffAlert.tsx`
- `MobileShell.tsx`

**6. One extra npm install** (for the dialog + tooltip components)
```
npm install @radix-ui/react-dialog @radix-ui/react-tooltip next-themes
```

### Order to follow on your side
1. Run the extra `npm install` above.
2. Paste `src/lib/utils.ts` first (everything else imports it).
3. Paste each `src/components/ui/*.tsx` file.
4. Paste the `src/lib/*.ts` files.
5. Paste the `src/components/*.tsx` files.
6. Reload VS Code's TypeScript server (Ctrl+Shift+P → "TypeScript: Restart TS Server") to clear any stale errors.

After this, every import in `SettingsPage.tsx` (and the other pages) will resolve.

