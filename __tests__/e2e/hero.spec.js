// __tests__/e2e/hero.spec.js
// Playwright integration regression net for Hero bio + title content.
//
// Captures the 3 visual regressions verified manually during PR #118
// (`feat(content): update Hero bio + title to Senior Frontend Engineer`)
// via browser-use against the Vercel preview-deploy URL.  After this PR
// lands, those manual checks are automated — a future bio+title revert
// surfaces as a CI failure on this spec without needing human-in-the-loop
// verification.
//
// Filter in this spec: ignores known-environmental console.error noise from
// `@vercel/analytics` injecting `/_vercel/insights/script.js`. See the
// page.on('console', ...) listener below for the rationale + future-extension guide.
//
// Three primary assertions:
//   1. bio 2-paragraph visibility — `whitespace-pre-line` + literal `\n\n`
//      in the template literal must render as a visible blank line AND both
//      paragraph starts ("Hi, I'm Yunior—a product-minded" +
//      "I care about creating accessible") MUST be present in textContent.
//   2. title-text content match — visible title MUST contain
//      "Senior Frontend Engineer" AND MUST NOT contain
//      "Senior Frontend Developer" anywhere INSIDE the hero section.
//   3. pageerror / console.error capture — zero uncaught exceptions OR
//      console.error messages during the full page lifecycle (catches
//      hydration mismatches + Next.js dev/prod drifts + 4xx/5xx network
//      errors on prerender payloads).
//      Note: known-environmental noise from `@vercel/analytics` is
//      filtered at the console-error listener below (the only error
//      observed on the first CI run was `/_vercel/insights/script.js`
//      404, see `page.on('console')`).  Vercel's edge rewrites that URL
//      only on Vercel deploys; on `npm run start` (local + GitHub Actions
//      runners) it 404s with text/html MIME type from Next.js's 404
//      fallback.  This is documented behavior of @vercel/analytics, NOT
//      a regression in our code.  Filter at the listener -- do NOT
//      disable the analytics package globally (that would silently
//      regress the prod observability surface).  Future contributors
//      adding new known-environmental noise (e.g., `/_vercel/speed-insights/*`)
//      should ADD to the filter, not remove it.
//
// Plus belt-and-suspenders sanity:
//   - hero-section testid visible
//   - profile image visible with the correct alt text
//   - resume link href unchanged (`/resume`)
//
// Selectors use stable testid anchors (data-testid="hero-title" +
// data-testid="hero-bio" + data-testid="hero-section" added to
// components/Hero.tsx) instead of Tailwind class dependencies, so a future
// Tailwind class rename or framer-motion de-tour doesn't silently break
// the regression net.
//
// ESM `import` syntax to match the existing __tests__/*.test.js jest specs in
// this repo (e.g., __tests__/Hero.test.js / __tests__/Home.test.js).  This
// file is excluded from eslint via `eslint.config.js`'s
// ignores['__tests__/e2e/'] entry because @playwright/test globals
// (`test` / `expect`) are not registered by eslint-config-next.

import { expect, test } from '@playwright/test';

test.describe('Hero section: bio + title regression net', () => {
  test('renders correctly with zero console errors', async ({ page }) => {
    // ---- 3. pageerror / console-error regression net ----
    // Capture every error during the entire page lifecycle.
    const errors = [];
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const locationUrl = msg.location()?.url ?? '';
        // Filter known-environmental noise from `@vercel/analytics`:
        // /_vercel/insights/script.js is rewritten by Vercel's edge to a
        // real CDN script in production deploys, but 404s (text/html MIME
        // type) on `npm run start` against any non-Vercel host = our local
        // + CI setup. Both `Failed to load resource` (Chrome resource
        // loader) AND `Refused to execute script ... MIME type` (Chrome
        // script loader) errors include `/_vercel/insights` as a substring,
        // so a single filter is sufficient. Real regressions on a future
        // PROD build (where /_vercel/insights is rewritten) would be
        // unaffected.
        if (
          text.includes('/_vercel/insights') ||
          locationUrl.includes('/_vercel/insights') ||
          locationUrl.endsWith('/favicon.ico')
        ) {
          return;
        }
        const detail = locationUrl ? `${text} (${locationUrl})` : text;
        errors.push(`console.error: ${detail}`);
      }
    });

    await page.goto('/');

    // Scope every assertion to the hero section so that other-page
    // content (footer / projects / contact form / future additions)
    // cannot spuriously break the regression net.
    const heroSection = page.locator("[data-testid='hero-section']");
    await expect(heroSection).toBeVisible();

    // ---- 2. title-text content match ----
    // Visible title anchored to data-testid="hero-title" (added to
    // components/Hero.tsx alongside the existing data-testid on the
    // outer section) — survives Tailwind class renames + framer-motion
    // wrapper changes.
    const title = heroSection.locator("[data-testid='hero-title']");
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/Senior Frontend Engineer/i);

    // Negative assertion: the pre-PR-#118 title MUST NOT appear in the
    // title element itself.  Scoped to `title` (not the whole heroSection,
    // not the whole page) so a future bio paragraph legitimately
    // referencing "Senior Frontend Developer" as historical career
    // context (e.g., "Previously: Senior Frontend Developer at X co.")
    // can't spuriously break this net.  Assertion target = the title
    // element's own text content.
    await expect(title).not.toHaveText(/Senior Frontend Developer/i);

    // ---- 1. bio 2-paragraph visibility ----
    // Bio `<p>` anchored to data-testid="hero-bio" (added to
    // components/Hero.tsx).  Framer Motion stagger has a delay: 2
    // (seconds) on the bio wrapper, so we wait up to 5s for it to be
    // visible before reading its textContent.
    const bio = heroSection.locator("[data-testid='hero-bio']");
    await expect(bio).toBeVisible({ timeout: 5 * 1000 });

    const text = (await bio.textContent()) ?? '';

    // Both paragraph starts MUST be present, proving the bio shipped the
    // 2-paragraph narrative (not a 1-paragraph revert).  Uses the literal
    // em-dash `—` (the actual character in components/Hero.tsx) rather
    // than a hyphen/en-dash/em-dash character class — so a future
    // dash-substitution typo in production copy breaks the spec loudly
    // instead of silently passing.
    expect(text).toMatch(/Hi, I'm Yunior\u2014a product-minded/);
    expect(text).toMatch(/I care about creating accessible/);

    // The bio must still apply the whitespace-pre-line rule that makes the
    // literal "\n\n" render as a visible blank line between paragraphs.
    // (Computed style check catches CSS class rename / Tailwind v4 / dark
    // mode overrides that would silently strip the rule.)
    const computedWhiteSpace = await bio.evaluate(
      (el) => window.getComputedStyle(el).whiteSpace
    );
    expect(computedWhiteSpace).toBe('pre-line');

    // ---- Layout sanity (belt-and-suspenders) ----
    const profileImg = heroSection.getByAltText(
      'Yunior Batista - Senior Frontend Engineer'
    );
    await expect(profileImg).toBeVisible();

    const resumeLink = heroSection.getByRole('link', { name: 'View Resume' });
    await expect(resumeLink).toHaveAttribute('href', '/resume');

    // ---- 3. assert zero captured errors ----
    expect(errors).toEqual([]);
  });
});
