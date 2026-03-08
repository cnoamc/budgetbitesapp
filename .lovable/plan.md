

# Revamped Welcome & Onboarding Flow with i18n, Auth, and Animations

## Overview
Complete overhaul of the app entry flow: animated splash → language selection → welcome → sign up (Apple/Google) → multi-step onboarding (name, age, food preferences) → celebration animation → home.

---

## New Flow

```text
Splash Screen (animated chef icon + vibration)
  → Language Selection (English / Hebrew)
    → Welcome Page (branded, animated)
      → Auth Page (Apple + Google sign-in, or continue as guest)
        → Onboarding Steps:
          1. Name
          2. Age (with haptic on selection)
          3. Food preferences (multi-select)
        → Celebration Animation (confetti + chef animation)
          → Home
```

---

## What Will Be Built

### 1. Internationalization (i18n) System
- **New file: `src/contexts/LanguageContext.tsx`** — React context providing `locale` ('he' | 'en'), `t()` translation function, `setLocale()`, and `dir` ('rtl' | 'ltr').
- **New file: `src/lib/translations.ts`** — All UI strings in Hebrew and English (welcome text, onboarding labels, button text, auth prompts, navigation labels, etc.).
- Wrap `App` in `<LanguageProvider>`. All pages/components switch to using `t('key')` instead of hardcoded Hebrew strings.
- Language choice persisted in localStorage (`chefi_lang`).

### 2. Splash Screen (New Page: `/splash`)
- **New file: `src/pages/Splash.tsx`**
- Shows the chef icon with a pulsing/bouncing animation using framer-motion.
- Auto-navigates to language selection after ~2 seconds.
- Haptic feedback on load (medium vibration).

### 3. Language Selection Screen
- **New file: `src/pages/LanguageSelect.tsx`**
- Two large buttons: "עברית" and "English" with flag emojis.
- Sets language context + localStorage, navigates to Welcome.
- Only shown on first visit (skip if language already chosen).

### 4. Updated Welcome Page (`src/pages/Welcome.tsx`)
- Animated chef icon (scale + bounce via framer-motion).
- All text pulled from `t()` translations.
- CTA button leads to new Auth screen instead of Create Profile.

### 5. Auth Screen (New Page: `/auth`)
- **New file: `src/pages/Auth.tsx`**
- Google Sign-In button using `lovable.auth.signInWithOAuth("google", ...)`.
- Apple Sign-In button using `lovable.auth.signInWithOAuth("apple", ...)`.
- "Continue as guest" option.
- Terms checkbox (existing pattern from AuthBottomSheet).
- All text bilingual via `t()`.
- After successful auth or guest selection → navigate to onboarding.
- PWA: Add `/~oauth` to `navigateFallbackDenylist` in vite.config.ts.

### 6. Revamped Onboarding (Replace `CreateProfile`)
- **Update: `src/pages/CreateProfile.tsx`** → Multi-step flow:
  - **Step 1: Name** — Text input asking for name.
  - **Step 2: Age** — Age range selector (e.g., "Under 18", "18-25", "26-35", "36-45", "46-55", "55+"). Haptic vibration triggers on each selection.
  - **Step 3: Food Preferences** — Multi-select grid (existing food options from Onboarding.tsx).
- Progress dots at top.
- All labels bilingual.
- `LocalProfile` interface updated to include `age` field.

### 7. Celebration Animation (New Page: `/welcome-done`)
- **New file: `src/pages/WelcomeDone.tsx`**
- Confetti burst (using existing `canvas-confetti` dependency).
- Animated chef icon (framer-motion scale + rotate).
- Personalized greeting: "Welcome, {name}!" / "!ברוך הבא, {name}".
- Auto-redirect to `/home` after 3 seconds, or tap to skip.

### 8. Route Updates (`src/App.tsx`)
- Add routes: `/splash`, `/lang`, `/auth`, `/welcome-done`.
- Entry point changes from `/` (Welcome) to `/splash`.
- Welcome redirects appropriately based on language/profile state.

---

## Files Changed

| File | Action |
|------|--------|
| `src/lib/translations.ts` | Create — all i18n strings |
| `src/contexts/LanguageContext.tsx` | Create — language context + provider |
| `src/pages/Splash.tsx` | Create — animated splash |
| `src/pages/LanguageSelect.tsx` | Create — language picker |
| `src/pages/Auth.tsx` | Create — Google + Apple auth |
| `src/pages/WelcomeDone.tsx` | Create — celebration screen |
| `src/pages/Welcome.tsx` | Update — use translations, animated chef, navigate to /auth |
| `src/pages/CreateProfile.tsx` | Update — add age step with haptics, food prefs, bilingual |
| `src/contexts/LocalProfileContext.tsx` | Update — add `age` field to profile |
| `src/App.tsx` | Update — new routes, LanguageProvider wrapper |
| `vite.config.ts` | Update — add `/~oauth` to navigateFallbackDenylist |
| `src/components/BottomNav.tsx` | Update — use translations |
| `src/components/auth/AuthBottomSheet.tsx` | Update — add Google button, use translations |

---

## Technical Notes

- **Google OAuth**: Uses existing `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` — managed by Lovable Cloud, no extra config needed.
- **Apple OAuth**: Already implemented, reuse existing pattern.
- **Haptics on age selection**: Uses existing `useHaptics` hook — `impact('medium')` on each age range tap.
- **Chef animation**: framer-motion `motion.div` with `animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0] }}` on the app icon.
- **Confetti**: `canvas-confetti` already installed — fire on WelcomeDone mount.
- **i18n approach**: Simple context + object lookup (no heavy library). Existing strings converted incrementally — start with welcome/auth/onboarding flow, other pages can be migrated later.
- **Post-auth redirect**: After OAuth callback, check if profile exists → if yes, go to `/home`; if no, go to `/create-profile`.

