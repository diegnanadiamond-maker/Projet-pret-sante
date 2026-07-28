# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Prêt Santé — a healthcare micro-loan platform for Côte d'Ivoire. Clients get short-term loans from partner banks to pay for medical care; partner clinics get paid directly by the bank once a loan is approved. The repo is currently a **prototype/mockup stage** (mock data, mock auth via `localStorage`, no real backend) — there is no API layer yet.

The repo has three independent pieces, each with its own toolchain. There is no root `package.json` — always `cd` into `web/` or `mobile/` before running any npm command.

- `web/` — React 19 + Vite back-office (Tailwind v4). Used by three roles: **admin** (platform ops), **bank** (partner bank ops/risk), **clinique** (partner clinic payments/patients).
- `mobile/` — Expo Router (React Native 0.81 / RN Web) app for the end client: KYC, loan request wizard, loan tracking.
- `maquette/` — a static, standalone HTML mockup (`pret_sante_mockup.html`), not part of either build; kept for design reference only.
- `docs/` — product notes and the graphic charter/brand doc from the client.

## Commands

### web/
```
cd web
npm install
npm run dev       # Vite dev server
npm run build     # production build -> web/dist
npm run preview   # preview the production build
npm run lint      # ESLint (flat config, eslint.config.js)
```
No test runner is configured in `web/`.

### mobile/
```
cd mobile
npm install
npm start          # expo start — pick platform from the Expo CLI menu
npm run android    # expo start --android
npm run ios        # expo start --ios
npm run web        # expo start --web (RN Web build of the same app)
```
No test runner or lint script is configured in `mobile/` despite `react-test-renderer` being present as a devDependency. TypeScript is strict (`tsconfig.json`); there's no standalone `tsc` script, so type-check via the editor/Expo build output.

## Architecture

### web/ — single-file back-office
`web/src/App.jsx` is a ~2500-line monolith containing the entire application: all mock data, the `App` root component, `LoginView`, `Sidebar`, and every role-specific view (`AdminDashboard`, `UsersListView`, `BanksListView`, `BankOverviewView`, `BankRequestsView`, `BankRiskView`, `ClinicDashboard`, `ClinicPaymentsView`, `ClinicPatientsView`, `HelpCenterView`, `SettingsView`) as sibling top-level consts in the same file. There is no router and no `web/src/components/` usage yet (the directory exists but is empty) — navigation is done by an `activeTab` string in `App` state, and role gating (`admin` / `bank` / `clinique`) happens via `userRole` conditionals inline in JSX. Styling is a single global `App.css` (also ~2500 lines) plus Tailwind utility classes; icons come from the Tabler Icons font (`ti ti-*` classes), not from a React icon package.

Auth is fully mocked client-side:
- Bank/admin login checks against hardcoded `DEMO_CREDENTIALS` in `App.jsx`.
- Clinic accounts are self-registered and stored in `localStorage` under `pretSanteClinics`, hashed with a **non-cryptographic** `mockHash` (base64, explicitly commented as demo-only — never treat this as real password hashing).
- "Remember me" persists the logged-in clinic profile to `localStorage` under `pretSanteSession`.

When adding a new view/tab: add a case to the `activeTab === '...'` block in `App`'s render, add the corresponding `nav-item` button in `Sidebar` gated by `userRole`, and follow the existing pattern of a top-level `const XyzView = (props) => (...)` function rather than a new file, to stay consistent with the current file's structure (a future refactor to split this file is plausible but hasn't happened yet — don't do it unprompted).

### mobile/ — Expo Router file-based navigation
Routes live under `mobile/app/`, grouped into route groups:
- `(auth)` — login / register / OTP
- `(kyc)` — identity verification flow: intro → document → selfie → bank-info → success
- `(loan-request)` — 5-step loan wizard: care type → amount → documents → contract → success
- `(tabs)` — main authenticated tab bar (home, partners, profile)
- `loan-tracker.tsx` and root `index.tsx` — standalone screens outside any group

All cross-screen state (client identity, KYC progress, in-progress loan draft, bank account info, the list of submitted loans) lives in one React Context: `mobile/context/DataContext.tsx`, wrapping the whole app in `_layout.tsx`. There is no backend and no persistence — state resets on reload. Key domain rule baked into this context: **`BANK_OFFERS` is a fixed list of 3 partner banks, and a client can only be matched to the offer whose name contains their registered `bankName`** — i.e. a client can only get a loan from the bank they hold an account with, they cannot shop across banks (see `docs/remarques - 1.txt` point 1, and the matching logic in `selectedOffer` in `DataContext.tsx`).

Path alias `@/*` maps to the `mobile/` root (see `tsconfig.json`), e.g. `@/components/ui/Button`, `@/context/DataContext`. Reusable UI primitives live in `mobile/components/ui/` (`Button`, `Card`, `TextField`, `Badge`, `Screen`, `StepHeader`, `SignaturePad`, `OtpInput`, etc.) — prefer these over inline `StyleSheet` styling when building a new screen. Theme tokens (colors, fonts, spacing, radius) are in `mobile/constants/Colors.ts` and `mobile/constants/theme.ts`; fonts are Fraunces (display) + Manrope (body), loaded via `@expo-google-fonts/*` in `_layout.tsx`.

### Cross-cutting product rules (from `docs/remarques - 1.txt`)
These are client-provided requirements not yet (or only partly) reflected in code — check this file when working on loan/payment logic:
1. A client can only request a loan from their own bank (already enforced in mobile via `DataContext`'s `selectedOffer` matching).
2. Banks only pay clinics based on the *facture pro-forma* (cost quote) the client uploads to justify the loan amount — the loan amount should be driven by an uploaded document, not free client input.
3. The free-text "what amount do you need?" field is meant to be removed in favor of the quote-driven amount above.
4. Uploading the quote/invoice justifying the price still needs to be added.
5. Both clinics and partner banks need to be pre-registered in a shared database for invoicing/payment matching to work — the current per-role mock data (`MOCK_CLINIC_*`, `MOCK_BANKS` in `web/App.jsx`) is a stand-in for this.
