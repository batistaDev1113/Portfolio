# Portfolio Performance, UI/Accessibility, and Dead-Code Remediation Spec

## Purpose

This specification documents every dead-code removal, performance optimization,
and UI/accessibility fix identified in the Portfolio audit, along with exact
file paths, root causes, implementation instructions, test invariants, and
verification commands. It is written so any engineer or agent can execute,
resume, or verify the work independently.

## Constraints & Test Invariants

- **Runtime & packages**: Node.js 22.x (`.node-version`), `npm` with
  `package-lock.json` preserved, keep `legacy-peer-deps=true` in `.npmrc`.
- **Design tokens**: Use Tailwind v4 `@theme` tokens from
  `app/styles/variables.css`; avoid hardcoded colors.
- **No attribution**: Never add AI/assistant/co-author attribution to commits,
  PRs, or code comments.
- **Hero invariants** (`__tests__/Hero.test.js`, `__tests__/Home.test.js`,
  `__tests__/e2e/hero.spec.js`):
  - Keep `data-testid="hero-section"`, `data-testid="hero-title"`,
    `data-testid="hero-bio"`.
  - Keep the single `<Image>` with `alt="Yunior Batista - Senior Frontend Engineer"`,
    `width={120}`, `height={120}`, and `rounded-full` (do NOT render duplicate
    `<img>` elements with the same `alt`, as `getByAltText` enforces uniqueness).
  - Keep `"View Resume"` link pointing to `href="/resume"`.
  - Keep two-paragraph bio with `whitespace-pre-line` and em-dash `—`.
- **Project featured image invariant** (`__tests__/ProjectImagePriority.test.js`):
  - Featured card image must NOT set `priority` / `fetchpriority="high"` and must
    NOT inject `<link rel="preload" as="image">`. Update the test to expect
    `loading="lazy"` (below the fold).

---

## Track 1: Dead Code & Stray Files

### 1.1 Delete stray / unreferenced files
- Delete `.tmpcommit/commit-msg.txt` and `.tmpcommit/pr-body.md` (committed
  temporary scratch files from an earlier Tailwind v4 migration).
- Delete `test-pr-agent-note.md` (temporary smoke-test fixture).
- Delete `public/projects/portfolio-headshot.webp` (82 KB unreferenced asset).
- Delete `jsconfig.json` (superseded by `tsconfig.json`; defines unused path
  aliases).
- Delete `components/Skeleton.tsx` (unused in production; only referenced by a
  stale test in `__tests__/Hero.test.js`).
- Update `__tests__/Hero.test.js`: remove `Skeleton` import and the stale
  `renders skeleton when mounted is false` test, and remove the erroneous
  `import { afterEach } from 'node:test'` (use Jest's global `afterEach`). Also
  remove `import { afterEach } from 'node:test'` in `__tests__/Home.test.js` and
  `__tests__/ProjectImagePriority.test.js`.

### 1.2 Remove unused CSS classes and tokens
- In `app/styles/globals.css`, remove unused selectors:
  - `.image`
  - `.accent-top::before`
  - `.hero-card` and `.dark .hero-card`
  - `.rotate-x-12`, `.rotate-x-45`, `.rotate-x-35`, `.rotate-y-12`,
    `.translate-y-2`
  - `.perspective-1000`, `.envelope-3d`, `.envelope-3d:hover`,
    `.envelope-back`, `.envelope-body`, `.envelope-flap`,
    `.envelope-3d:hover .envelope-flap`
- In `app/styles/variables.css`, remove tokens that were only referenced by the
  removed `.hero-card`:
  - `--color-glass-fill`, `--color-glass-fill-dark`
  - `--color-glass-border-soft`, `--color-glass-border-dark`
  - `--shadow-hero-card`, `--shadow-hero-card-dark`

### 1.3 Consolidate `ThemeProvider` & clean config / data
- Merge `components/ThemeProviderWrapper.tsx` into `components/ThemeProvider.tsx`:
  - Mark `components/ThemeProvider.tsx` with `'use client'`.
  - Remove the duplicate `import '../app/styles/globals.css'` (already imported
    in `app/layout.tsx`).
  - Type props properly with `ComponentProps<typeof ThemeProvider>` (no `any`)
    and pass `attribute='class'` directly.
  - Delete `components/ThemeProviderWrapper.tsx` and update `app/layout.tsx` to
    import `ThemeProvider` directly (eliminates circular import with
    `RootLayoutProps`).
- In `tsconfig.json`: remove duplicate stale `"components/ThemeProvider.js"`
  entries and redundant `"app/**/*.ts"` / `"app/**/*.tsx"` globs.
- In `next.config.js`: remove commented-out `// const nextConfig = {}`.
- In `data/projects.json`: remove unused `features` arrays from both entries.
- In `components/ResumeChatbot.tsx`: remove unused second element of
  `ACCESSIBLE_PROMPTS` (replace array with a single string constant).
- In `components/Navigation.tsx`: remove ineffective `hover:border-spacing-4`
  from the three `<span>` nav links.
- In `components/ContactForm.tsx`: remove bogus `natural` class on the info
  panel `<section>`.

---

## Track 2: Performance Optimizations

### 2.1 Remove Sentry Session Replay and tune server/edge trace rates
- In `sentry.client.config.ts`: remove `replaysOnErrorSampleRate`,
  `replaysSessionSampleRate`, and `integrations: [Sentry.replayIntegration(...)]`
  so `rrweb` (~50–70 KB gzipped + DOM observers) is no longer bundled on every
  page load.
- In `sentry.server.config.ts` and `sentry.edge.config.ts`: lower
  `tracesSampleRate` from `1` to `0.1` to match client sampling.

### 2.2 Lazy-load the Resume Chatbot dialog on interaction
- Extract the chat dialog (`useChat`, `DefaultChatTransport`, message list,
  suggested prompts, input form) into `components/ResumeChatbotDialog.tsx`.
- Hoist `const chatTransport = new DefaultChatTransport({ api: '/api/chat' })`
  to module scope so it is not recreated on every render.
- Keep `components/ResumeChatbot.tsx` as a lightweight client shell rendering
  only the floating launcher button until clicked, then dynamically loading
  `ResumeChatbotDialog` via `next/dynamic(..., { ssr: false })`.
- Result: `@ai-sdk/react` and `ai` are excluded from the initial page load until
  a visitor opens the chatbot.

### 2.3 Scope `ScrollReveal`'s `MutationObserver` and release `will-change`
- In `components/ScrollReveal.tsx`:
  - Stop observing `document.body` forever: only run `MutationObserver` until
    all expected dynamic sections (e.g., `#contact .section-reveal`) are
    observed, or disconnect automatically once no new targets are needed (e.g.,
    when `#contact` has `.section-reveal` observed).
  - Clean up `document.documentElement.classList.remove('js')` only if needed —
    actually keep `.js` while mounted; ensure observers and animation frames are
    always disconnected on unmount.
- In `app/styles/globals.css`: add `will-change: auto;` to
  `.js .section-reveal.in-view, .js .project-reveal.in-view` so compositor
  layers are released after reveal completes.

### 2.4 Below-the-fold lazy image & hydration-safe theme images
- In `components/Project.tsx`:
  - Change featured `<Image>` from `loading='eager'` to `loading='lazy'`.
  - Guard `resolvedTheme` with a `mounted` check (`useSyncExternalStore`) so SSR
    and first client render agree on `imageUrl` (no hydration mismatch), then
    switch to `imageUrlLight` if light mode is active.
- In `components/Hero.tsx`:
  - Guard `resolvedTheme` with `useSyncExternalStore` (`mounted`) so SSR and
    initial hydration match before switching to `portraitLight` in light mode,
    while keeping a single `<Image>` to preserve Jest/Playwright `getByAltText`
    invariants.

### 2.5 Trim expensive CSS paint/compositing properties
- In `app/styles/globals.css`:
  - Remove `backdrop-filter: blur(10px)` from `.tech-tag` and `.button-about`.
  - Replace `transition: all 0.4s ...` on `.project-card` with
    `transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)`.
  - Replace `transition-all` on `.button-about` and `.button-quiet` with
    explicit property transitions.
- In `components/Navigation.tsx`: replace `transition-all` with
  `transition-[background-color,border-color,backdrop-filter]`.

---

## Track 3: UI, UX & Accessibility Fixes

### 3.1 Fix `/not-found` page (`app/not-found.tsx`)
- Replace `<section>` outer wrapper with `<main id='main-content' tabIndex={-1}>`
  using `bg-light-surface dark:bg-night`.
- Fix `wf-ull` typo -> `w-full`.
- Remove the external `https://merakiui.com/images/components/illustration.svg`
  `<Image>` (unconfigured external host throws at runtime) and replace it with
  an inline, theme-aware SVG / styled 404 graphic.
- Style CTA with the portfolio's `primary-600` -> `violet-a` tokens instead of
  `bg-info-500`.

### 3.2 Fix `ContactForm` (`components/ContactForm.tsx`)
- Replace nested `<main aria-label='Contact Form'>` with `<div aria-label='Contact Form'>`
  (single `<main>` per document).
- Separate `sending` (in-flight request) from `submitted` (HTTP 200 success):
  - While `sending === true`, keep the form visible with the disabled submit
    button showing the spinner + `"Sending..."` (making that branch reachable).
  - On HTTP 200, set `submitted = true` to show the `"Message Sent!"` state with
    a `"Send another message"` button so users can reset the form.
- Fix email regex from `/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i` to
  `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` so modern TLDs (`.studio`, `.digital`,
  `.engineering`, etc.) are accepted.
- Add `group` class to the submit `<button>` so `group-hover:translate-x-1` on
  `<FaRegPaperPlane>` works.
- Add `motion-reduce:animate-none` to `animate-bounce` / `animate-spin` where
  appropriate.

### 3.3 Fix `ModeToggle` (`components/ModeToggle.tsx`)
- Use `resolvedTheme` (not `theme`) to determine `isDarkMode` so toggling works
  when `theme === 'system'`.
- When `!mounted`, render a sized placeholder `<span className='inline-block h-9 w-9' aria-hidden='true' />`
  instead of `null` to prevent navbar CLS.
- Fix broken class `transition:ease-in-out` -> `transition-transform ease-in-out`.
- Increase hit target from `w-6 h-6` to `w-9 h-9` (`36×36px`).

### 3.4 Navigation & Subpage Consistency
- In `components/Navigation.tsx`:
  - When `isOpen && !scrolled`, apply a dark frosted surface
    (`bg-night/95 backdrop-blur-md border-b border-border`) so the expanded
    mobile menu is legible over the Hero.
  - Close the mobile menu on `Escape` key press.
- In `app/resume/page.tsx`:
  - Add `id='main-content' tabIndex={-1}` to `<main>` (fixes skip link) and
    `bg-light-surface dark:bg-night`.
  - Add a top bar with a `<Link href='/'>Back to portfolio</Link>`, a direct
    `<a href='/Yunior-Batista-Resume.pdf' download='Yunior-Batista-Resume.pdf'>Download PDF</a>`
    button, and `<ModeToggle />`.
  - Update the Portfolio Website stack text from `Framer Motion, SendGrid` to
    `Pure-CSS Motion, Mailjet` (matching the actual implementation).
- In `app/projects/[slug]/page.tsx`:
  - Add `id='main-content' tabIndex={-1}` to `<main>`.
  - Include `<ModeToggle />` in the top navigation bar alongside `"Back to work"`.
  - Change `SectionLabel` to render `<h2>` (with optional `as='p'` for the hero
    `// Project` eyebrow so `<h1>` remains the top heading).

### 3.5 Heading Hierarchy, Hero, Chatbot, Favicon & SocialLinks
- **Project cards** (`components/Project.tsx`):
  - Change standard card title from `<h4>` to `<h3>` (no skipped heading level
    under `<h2>Selected Projects</h2>`).
  - On featured card, render a single accessible `<h3>` or ensure mobile screen
    readers see the title (keep the mobile overlay heading accessible or use
    `sr-only` / single responsive layout). Specifically: remove `aria-hidden='true'`
    from the mobile caption `<h3>`? No — if both `<h3>` elements exist in DOM,
    use `<p aria-hidden='true'>` for the visual mobile overlay and render the
    real `<h3>` with `sr-only md:not-sr-only ...` in the text column so there is
    always **exactly one** accessible `<h3>` at every viewport width.
- **Hero** (`components/Hero.tsx`):
  - Remove conflicting `fluid-title` from `<h1>` (or apply font-display +
    tracking directly) so the responsive `text-4xl sm:text-5xl md:text-6xl xl:text-7xl`
    scale actually takes effect, and drop `whitespace-nowrap` on narrow screens
    (`sm:whitespace-nowrap`) to prevent mobile overflow.
  - Add `motion-reduce:animate-none` to the `animate-ping` availability dot.
  - Replace `<a href='/resume'>` with Next.js `<Link href='/resume'>`.
  - Replace the imperative `handleDownloadResume` `<button>` with a semantic
    `<a href='/Yunior-Batista-Resume.pdf' download='Yunior-Batista-Resume.pdf'>`.
  - Update `bg-gradient-to-b` -> `bg-linear-to-b` for Tailwind v4 consistency.
- **ResumeChatbotDialog** (`components/ResumeChatbotDialog.tsx`):
  - Replace `border-border` in light mode with `border-ink-200 dark:border-border`.
  - Replace hardcoded `bg-emerald-500` with `bg-live` and `bg-red-50` /
    `text-red-700` / `dark:bg-red-900/20` / `dark:text-red-300` with
    `danger-*` tokens.
  - Close dialog on `Escape` and focus the input when opened; return focus to
    the launcher button when closed.
- **Favicon** (`app/layout.tsx`):
  - Remove `<link rel='icon' href='data:,' />` so Next.js serves `app/favicon.ico`.
- **SocialLinks** (`components/SocialLinks.tsx`):
  - Use `label === 'Email' ? 'Email Yunior Batista' : `${label} profile`` for
    `aria-label`.

---

## Verification Gate

Run all checks after implementing all tracks:

```bash
npm run lint:check
npx tsc --noEmit
npm test -- --watchAll=false
npm run build
```

All commands must exit with code `0`.
