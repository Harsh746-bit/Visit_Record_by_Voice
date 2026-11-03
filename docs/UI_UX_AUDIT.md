# Comprehensive UI/UX Audit & Design System Specification
**Project: Visit Record by Voice (बोल. पडताळा. नोंदवा.)**
*Maharashtra Healthcare Innovation — Frontline ASHA & ANM Clinical Platform*

---

## 1. Executive Summary

Visit Record by Voice is a mission-critical healthcare documentation platform bridging rural frontline Accredited Social Health Activists (ASHAs) in Maharashtra with supervisory Auxiliary Nurse Midwives (ANMs) and Medical Officers (MOs).

While the core functionality (PostgreSQL 18 persistence, Argon2id auth, JWT rotation, Sarvam Saaras v3 ASR adapter, Indic clinical NLP extraction, and WebSocket live updates) has been verified and hardened in Phase B, the user interfaces currently exhibit **visual inconsistencies, prototype artifacts, hardcoded styling, and visual debt** that prevent the application from looking like a premier, production-grade healthcare technology platform.

This audit establishes the comprehensive inventory of existing screens, identifies design inconsistencies, maps all active API integrations, and establishes the strict design tokens and component architecture for the subsequent milestone implementations.

---

## 2. Existing Screen Inventory

### 2.1 Android Application (`android/app/.../AshaScreens.kt`)
| Screen ID | Composable Function | Route Name | Current State & Gaps |
| :--- | :--- | :--- | :--- |
| **SCR-AND-01** | `SplashScreen` | `splash` | Full-screen gradient (`0xFF065A63` to `PrimaryText`), white logo container with heavy 12.dp shadow. Needs refined healthcare hero treatment, refined tagline, and smoother entry transition. |
| **SCR-AND-02** | `OnboardingScreen` | `onboarding` | 3-step carousel with static step dots and generic illustration placeholder cards. Inconsistent typography hierarchy and text margins. |
| **SCR-AND-03** | `LoginScreen` | `login` | Mixes demo profile chips with manual inputs; server URL toggle is cluttered; error banner is standard red rather than accessible healthcare badge. Needs dedicated phone input with +91 mask, OTP verification view, resend timer, and clean role indicators. |
| **SCR-AND-04** | `LanguageScreen` | `language` | Vertical list of Marathi/Hindi cards. Needs prominent active state indicator, bilingual subtitles, and immediate tactile feedback. |
| **SCR-AND-05** | `AshaDashboardScreen` | `home` | TopAppBar with app logo and greeting; 3 StatCards with arbitrary border radiuses; large primary record card; visit queue list. Needs refined greeting banner with sub-center badge, live sync badge, today's visit breakdown, and consistent 16dp rounded action cards. |
| **SCR-AND-06** | `BeneficiaryListScreen` | `beneficiary_list` | Basic search bar and lazy column of `BeneficiaryCard`; add dialog is rudimentary. Needs categorical filter chips (ANC, PNC, High Risk), pregnancy trimester indicator, village pills, and cleaner touch targets. |
| **SCR-AND-07** | `BeneficiaryProfile` | `beneficiary_profile/{id}` | Defined in route enum but currently routes directly to `VoiceRecordingScreen`. Needs dedicated profile overview card, maternal history, obstetric risk factors, and prior visit timeline. |
| **SCR-AND-08** | `VoiceRecordingScreen` | `voice_recording` | Full dark gradient background; simulated animated audio wave; single stop button; language pill. Needs refined waveform visualization, live audio level reactivity, pause/resume controls, clear active recording halo, duration timer, and network status badge. |
| **SCR-AND-09** | `TranscriptionReviewScreen` | `transcription_review` | Raw text field with Devanagari text; static Sarvam badge; re-record and proceed buttons. Needs word-level confidence highlighting, quick-correction chips, audio playback player, and word count. |
| **SCR-AND-10** | `StructuredRecordScreen` | `structured_record` | Collapsible clinical cards; vitals and observation rows. Inconsistent spacing between clinical sections; missing visual priority indicators for out-of-range vitals. |
| **SCR-AND-11** | `EvidenceReviewScreen` | `evidence_review` | Field-by-field verification list showing source snippet and extracted entity. Needs clear side-by-side evidence card, confidence pill, quick-edit modal/sheet, and verified checkmark animation. |
| **SCR-AND-12** | `ValidationScreen` | `validation` | Summary card with high-risk warning box and submit button. Needs structured verification checklist (BP confirmed, Weight checked, Danger signs audited), clear hospital referral pill, and sync status confirmation. |
| **SCR-AND-13** | `ConfirmationScreen` | `confirmation` | Checkmark icon with record ID and buttons to go home or history. Needs receipt card styling, offline sync badge, next recommended visit date, and printable/shareable summary view. |
| **SCR-AND-14** | `VisitHistoryScreen` | `visit_history` | List of past visits with status badges. Lacks search/filtering by date or risk, and lacks tap-to-inspect evidence details. |
| **SCR-AND-15** | `SettingsScreen` | `settings` | Basic list of user info, server URL, language, and logout. Needs clean section grouping, profile card with photo/initials, circle details, app version, and cache clear / offline storage indicator. |

---

### 2.2 Web ANM Dashboard (`web/src/features/...`)
| Screen / Feature | Component / View | Current State & Gaps |
| :--- | :--- | :--- |
| **SCR-WEB-01** | `LoginView` | Centered box with role switcher and demo chips. Background is standard `bg-slate-50`. Needs dual-panel healthcare illustration/branding layout, clean phone + password/OTP tabs, and official Government of Maharashtra emblem styling. |
| **SCR-WEB-02** | `DashboardLayout` | Horizontal header + vertical sidebar inside max-w-7xl container. Sidebar is detached from viewport edge; spacing is tight; lacks breadcrumbs and persistent notification tray. |
| **SCR-WEB-03** | `OverviewView` | Gradient hero banner (`from-teal-950 via-[#087F8C] to-emerald-800`), 4 KPI cards, Recharts AreaChart, and recent records table. Visual hierarchy is good but card radiuses vary from 12px to 24px; tooltip styles in charts are default; lacks live activity feed. |
| **SCR-WEB-04** | `WorkersDirectoryView` | Grid of ASHA worker cards with phone, sub-center, and activity metrics. Needs worker status filter (Active, On Field, Inactive), sub-center grouped view, and worker performance summary. |
| **SCR-WEB-05** | `BeneficiaryManagementView`| Search bar, category filter, risk filter, and HTML table. Table rows lack subtle hover elevation; pagination is missing; high-risk badge color is harsh red rather than refined critical pill. |
| **SCR-WEB-06** | `VisitRecordsQueueView` | Filterable table of visits with status badges and eye action buttons. Needs priority sorting (High-risk ANC first), quick filter tabs (Pending, Approved, Returned), and time elapsed indicators (e.g. "2h ago"). |
| **SCR-WEB-07** | `SplitEvidenceReviewView` | Two-pane view: Left = verbatim transcript with `EvidenceHighlighter`, Right = structured fields accordion, Bottom = return / approve buttons. Needs synchronized highlight scrolling, transcript audio player with waveform scrubber, inline correction editor, and supervisor remarks modal. |
| **SCR-WEB-08** | `ReportsAnalyticsView` | Recharts bar charts and pie charts; CSV download. Cards lack consistent padding; charts lack custom tooltips matching the teal/green palette; date range picker is a basic `<select>`. |
| **SCR-WEB-09** | `AnmSettingsView` | RBAC summary cards and ASR model status. Informational only; needs functional notification toggles, theme/language preferences, and sub-center boundary assignment info. |
| **SCR-WEB-10** | `AshaPhoneSimulator` | Realistic mobile frame simulating ASHA workflow in browser. Needs modern phone bezel (iPhone/Pixel frame), refined status bar, smooth screen transitions, and exact visual parity with native Android app. |

---

## 3. Existing Design Inconsistencies & Visual Debt

1. **Color Token Drift**:
   - Backgrounds: Codebase alternates between `#F7FAFA`, `#F5F8FA`, `#F8FAFC`, and `bg-slate-50`.
   - Borders: Alternates between `#E4ECEC`, `#E5EBEF`, `border-slate-200`, and `border-teal-200`.
   - Brand Colors: Some components use arbitrary Tailwind classes (`bg-teal-700`, `text-emerald-800`) while others use raw hex values (`#087F8C`, `#15966A`).
2. **Typography Hierarchy**:
   - Mixed font sizes and line heights (`text-[10px]`, `text-xs`, `text-sm`, `text-base`, `text-xl`, `text-2xl`) without a unified typographic scale.
   - Devanagari text in Marathi and Hindi often clips or wraps awkwardly due to hardcoded button heights (`h-10` or `54.dp`) without dynamic vertical breathing room for Devanagari matras (काना, मात्रा, वेलांटी).
3. **Card & Border Radii**:
   - Radii vary wildly: `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px), and `RoundedCornerShape(32.dp)`.
   - Standardize strictly to **12px (`rounded-xl` / 12.dp)** for inner elements and chips, **16px (`rounded-2xl` / 16.dp)** for cards and panels, and **24px** for modals/hero containers.
4. **Button & Interactive Controls**:
   - Web buttons lack standardized focus rings, active press scales, and hover states.
   - Android buttons vary between 48.dp, 54.dp, and 56.dp heights with varying elevation (0.dp, 2.dp, 4.dp, 12.dp).
5. **State Handling & Accessibility**:
   - Empty states are either missing or simple one-line text (`<p>No records found</p>`).
   - Loading spinners are plain `CircularProgressIndicator` or `animate-spin` circles without structured skeleton placeholders.
   - Contrast ratios on danger badges (`#DC5B5B` on `#FCE8E8`) must be strictly WCAG AA compliant ($> 4.5:1$).

---

## 4. Current API Integrations (Preserved Intact)

All redesigned screens will bind directly to the existing, proven backend endpoints:

| Feature / Action | Protocol & Endpoint | Client Service Binding |
| :--- | :--- | :--- |
| **Authentication** | `POST /api/v1/auth/login` | Web `useAuth` / `apiClient.post` <br> Android `AppRepository.login()` |
| **Token Refresh** | `POST /api/v1/auth/refresh` | Web `apiClient` interceptor <br> Android `RetrofitClient` token authenticator |
| **Logout** | `POST /api/v1/auth/logout` | Web `useAuth.logout` <br> Android `TokenManager.clearSession()` |
| **OTP Send / Verify** | `POST /api/v1/auth/otp/send`, `verify` | Web `LoginView` <br> Android `AppRepository` |
| **Beneficiaries** | `GET /api/v1/beneficiaries` | Web `liveDataService.getBeneficiaries()` <br> Android `ApiService.getBeneficiaries()` |
| **Visit Records** | `GET /api/v1/visits`, `POST /api/v1/visits` | Web `liveDataService.getRecords()` <br> Android `AppRepository.submitVisitRecord()` |
| **Review Sign-off** | `POST /api/v1/visits/{id}/review` | Web `liveDataService.updateReviewStatus()` |
| **Audio STT** | `POST /api/v1/audio/transcribe` | Web `apiClient.uploadAudio()` <br> Android `ApiService.transcribeAudio()` |
| **Clinical Extraction** | `POST /api/v1/visits/extract` | Web `apiClient.extractVisit()` <br> Android `ApiService.extractVitals()` |
| **Live WebSockets** | `WS /ws/anm/{circle_id}?token=...` | Web `useRealtimeSync()` hook |
| **Offline SQLite** | Local SQLite `DraftVisitDbHelper` | Android `AppRepository.saveLocalDraft()` |

---

## 5. Approved Design System & Tokens

### 5.1 Color Palette
```css
/* Core Design Tokens */
--primary-teal:      #087F8C; /* Dominant brand color, primary actions, active navigation */
--primary-teal-dark: #065A63; /* Header backgrounds, pressed buttons, high-contrast borders */
--primary-teal-light:#E6F4F5; /* Chip backgrounds, selection highlights, card tint */

--secondary-green:      #15966A; /* Clinical approvals, verified evidence, safe vitals */
--secondary-green-dark: #0F6E4E; /* Dark text on green backgrounds */
--secondary-green-light:#E1F6ED; /* Approved status pill background */

--main-bg:    #F5F8FA; /* Clean, clinical, neutral canvas */
--surface:    #FFFFFF; /* Pure white card and dialog surfaces */
--border:     #E5EBEF; /* Subtle, crisp borders between clinical modules */

--text-primary:   #172B3A; /* High readability, deep clinical navy-slate */
--text-secondary: #718096; /* Captions, timestamps, metadata labels */
--text-muted:     #A0AEC0; /* Placeholders, disabled states */

--warning-amber:      #E8A23A; /* Moderate risk, pending review, re-record flag */
--warning-amber-light:#FEF3DC; /* Warning container fill */

--critical-red:      #DC5B5B; /* Pre-eclampsia, severe anemia, danger signs */
--critical-red-light:#FCE8E8; /* Critical container fill */
```

### 5.2 Typography System
- **English**: `Inter`, system-ui, -apple-system, sans-serif.
  - Scale:
    - Display / Header: 24px–28px, Bold / SemiBold (line-height: 32px–36px)
    - Section Title: 18px–20px, SemiBold (line-height: 26px–28px)
    - Card Title: 15px–16px, SemiBold (line-height: 22px–24px)
    - Body Text: 13px–14px, Regular (line-height: 20px–22px)
    - Caption / Meta: 11px–12px, Medium (line-height: 16px–18px)
- **Marathi & Hindi**: `Noto Sans Devanagari`, `Inter`, sans-serif.
  - Scale: Matched line-height with +2px vertical breathing room to accommodate Devanagari vowel diacritics.

### 5.3 Elevation & Shadows
- **Card**: `box-shadow: 0 1px 3px 0 rgba(23, 43, 58, 0.05), 0 1px 2px -1px rgba(23, 43, 58, 0.05);` (subtle, clean)
- **Hover Card**: `box-shadow: 0 4px 6px -1px rgba(23, 43, 58, 0.08), 0 2px 4px -2px rgba(23, 43, 58, 0.08);`
- **Floating Bar / Modal**: `box-shadow: 0 10px 15px -3px rgba(23, 43, 58, 0.1), 0 4px 6px -4px rgba(23, 43, 58, 0.1);`

---

## 6. Component Design System Architecture

### 6.1 Web Reusable Component Library (`web/src/components/ui/`)
1. **`AppSidebar`**: Fixed desktop navigation with icon + text, badge counters, and active indicator bar.
2. **`AppHeader`**: Sticky header with healthcare circle details, view mode switcher, language dropdown, live sync status, and profile menu.
3. **`PageHeader`**: Unified title, description, breadcrumbs, and right-side action buttons.
4. **`StatCard`**: Standardized metric card with trend badge, icon in colored circle, and subtitle.
5. **`StatusBadge`**: Unified pill component with dot indicator for `pending`, `reviewed`, `returned`, `high-risk`.
6. **`DataTable`**: Reusable healthcare data table with sorting, hover rows, clean borders, and responsive scroll.
7. **`SearchBar`**: Polished search input with search icon, clear button, and focus ring.
8. **`FilterPanel`**: Pill-style filter groups for categories, risk levels, and date ranges.
9. **`BeneficiaryCard`**: Rich card showing maternal photo/avatar, RCH ID, gestational age, and risk badge.
10. **`WorkerCard`**: ASHA profile card showing sub-center, visits count, phone, and active status.
11. **`VisitCard`**: Condensed visit record card for queues and recent activity.
12. **`AudioRecorder`**: Interactive audio visualizer with record, pause, stop, and timer.
13. **`TranscriptViewer`**: Synchronized Devanagari transcript reader with highlighted spans and audio scrubber.
14. **`EvidenceFieldCard`**: Split-review field card showing extracted value vs verbatim quote with edit trigger.
15. **`NotificationPanel`**: Flyout drawer showing real-time WebSocket alerts (`high_risk.alert`, `visit.submitted`).
16. **`EmptyState`**: Professional empty illustration with message and action button.
17. **`LoadingSkeleton`**: Shimmering card and row skeletons for smooth layout shifts.
18. **`ConfirmationDialog`**: Accessible modal for review sign-off or return for correction.

### 6.2 Android Reusable Component Library (`android/app/.../ui/components/`)
1. **`PrimaryButton`**: 54.dp height, RoundedCornerShape(14.dp), PrimaryTeal container, loading spinner support.
2. **`SecondaryButton`**: 54.dp height, outlined border with BorderColor, SecondaryGreen text.
3. **`StatusChip`**: RoundedCornerShape(10.dp) with color-coded background and text for risk and sync status.
4. **`DashboardStatCard`**: 14.dp radius card with count, title, and colored icon badge.
5. **`BeneficiaryCard`**: Touch-friendly beneficiary card with Devanagari name, age, village, and risk status.
6. **`VisitCard`**: History card with date, vital indicators, and review state.
7. **`AudioRecorder`**: Center microphone button with pulsing animated waves and duration timer.
8. **`TranscriptCard`**: Editable card with Devanagari text field and word count badge.
9. **`EvidenceFieldCard`**: Field container showing extracted value, verbatim snippet, and confidence badge.
10. **`SyncStatusIndicator`**: Header pill showing online/offline status and pending sync drafts.
11. **`EmptyState`**: Centered icon, title, subtitle, and action button.
12. **`LoadingState`**: Elegant shimmer placeholders.

---

## 7. Step-by-Step Milestone Implementation Plan

```
[ MILESTONE 1 ] ──► Design Tokens, Typography, Colors & Reusable Components (Web & Android)
       │
[ MILESTONE 2 ] ──► Android ASHA: Auth, Home Dashboard & Beneficiary Screens
       │
[ MILESTONE 3 ] ──► Android ASHA: Voice Recording, Transcript, Evidence & Confirmation
       │
[ MILESTONE 4 ] ──► Web ANM: Dashboard Layout, AppSidebar, AppHeader & Overview
       │
[ MILESTONE 5 ] ──► Web ANM: Beneficiary Management, Worker Directory & Review Queue
       │
[ MILESTONE 6 ] ──► Web ANM: Split Evidence Inspector, Reports/Analytics & Notification Center
       │
[ MILESTONE 7 ] ──► Responsive Polish, Marathi/Hindi Typography Expansion & Final Verification
```

### Milestone Deliverables:
- **Milestone 1**: 
  - Standardize CSS design tokens in `web/src/index.css`.
  - Update `Color.kt`, `Theme.kt`, `Type.kt` in Android.
  - Implement reusable components in `web/src/components/ui/` and `android/.../ui/components/`.
  - Verify build & linting.
- **Milestone 2**:
  - Redesign Android `SplashScreen`, `OnboardingScreen`, `LoginScreen` (phone + OTP UX).
  - Redesign Android `AshaDashboardScreen` and `BeneficiaryListScreen` + `BeneficiaryProfile`.
  - Verify build & API connections.
- **Milestone 3**:
  - Redesign Android `VoiceRecordingScreen` (large mic, waveform, timer, pause/resume).
  - Redesign `TranscriptionReviewScreen`, `StructuredRecordScreen`, `EvidenceReviewScreen`, `ValidationScreen`, `ConfirmationScreen`, `VisitHistoryScreen`, `SettingsScreen`.
  - Verify build & API connections.
- **Milestone 4**:
  - Redesign Web `DashboardLayout`, `AppSidebar`, `AppHeader`.
  - Redesign Web `OverviewView` (KPI cards, charts, recent activities).
  - Verify build & linting.
- **Milestone 5**:
  - Redesign Web `BeneficiaryManagementView` (table, search, filters, profile dialog).
  - Redesign Web `WorkersDirectoryView` (cards, stats).
  - Redesign Web `VisitRecordsQueueView` (review tabs, priority ordering).
  - Verify build & linting.
- **Milestone 6**:
  - Redesign Web `SplitEvidenceReviewView` (left transcript highlighter, right structured fields, bottom action bar).
  - Redesign Web `ReportsAnalyticsView` (charts, metrics, exports).
  - Implement real-time `NotificationPanel`.
  - Verify build & linting.
- **Milestone 7**:
  - Responsive audit across desktop, tablet, and mobile simulator.
  - Marathi and Hindi font rendering and text expansion testing.
  - Full end-to-end regression test across Android APK and Web build.
