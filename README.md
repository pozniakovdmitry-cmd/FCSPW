# FCSPW — Playwright autotests for focusgroup.co.uk

End-to-end Playwright + TypeScript test suite targeting the live public site
**https://focusgroup.co.uk**. The suite is plan-driven (every test is traceable
to a numbered scenario in `specs/plan.md`) and uses the Page Object Model plus
custom fixtures for accessibility scans and console-error capture.

## Layout

```
specs/plan.md              Numbered, tagged test plan (single source of truth)
pages/                     Page Object Model
  BasePage.ts              Shared header/footer/cookie helpers
  HomePage.ts              Homepage-specific locators
  ContactPage.ts           /contact-us/ routing page
fixtures/test.ts           Extended Playwright `test` with:
                              • home, contact (Page Objects)
                              • consoleErrors  (captured per-test)
                              • axe            (AxeBuilder factory)
utils/links.ts             Same-origin URL filtering + HEAD/GET probe
tests/
  seed.spec.ts             Seed used by the playwright-test-generator agent
  smoke/                   Smoke (≤30 s, must always pass)
  navigation/              Mega-menu, header CTAs, footer links
  seo/                     Title, description, canonical, OG, JSON-LD, sitemap
  a11y/                    axe-core (WCAG 2.1 A/AA), skip-link, image alts
  forms/                   Contact routing, cookie consent
  responsive/              Mobile menu, horizontal-overflow guard
  links/                   404 page, primary CTA reachability
  observability/           Console errors, LCP budget, mixed content
.github/agents/            Playwright agent definitions (planner / generator / healer)
.vscode/mcp.json           Playwright MCP server config for VS Code
```

## Getting started

```bash
npm install
npx playwright install chromium
npm test
```

The suite hits the live production site, so no app server is needed. All tests
run against the `baseURL` configured in `playwright.config.ts`.

## Useful commands

| Goal                              | Command                             |
|-----------------------------------|-------------------------------------|
| Run everything                    | `npm test`                          |
| Smoke only                        | `npm run test:smoke`                |
| HTML report                       | `npm run report`                    |
| UI mode                           | `npm run test:ui`                   |
| Headed (debug)                    | `npm run test:headed`               |
| Single file                       | `npx playwright test tests/smoke/homepage-loads.spec.ts` |
| By tag                            | `npx playwright test --grep @a11y`  |
| Type-check only                   | `npx tsc --noEmit`                  |

## Tags

Every test is tagged so the suite can be sliced for different CI lanes:

- `@smoke` — must-pass on every build (≈30 s)
- `@regression` — full coverage, run nightly
- `@nav`, `@seo`, `@a11y`, `@forms`, `@responsive`, `@perf`, `@links`,
  `@observability` — slice by concern

Filter examples:

```bash
npx playwright test --grep "@smoke|@a11y"
npx playwright test --grep-invert "@perf"
```

## Plan ↔ test traceability

Every spec file has a header pair pointing back to its scenario in the plan and
to the seed it was generated from:

```ts
// spec: specs/plan.md#1.1
// seed: tests/seed.spec.ts
```

This makes a test plan review trivial: open `specs/plan.md`, search for the
section number, and the exact spec file is one ripgrep away.

## Best-practice notes

- **Web-first assertions** (`expect(locator).toBeVisible()`) over manual waits.
- **Role-based locators** (`getByRole`, `getByLabel`) where possible, with
  CSS/attribute fallbacks scoped through Page Objects.
- **No `networkidle`** — every test waits on a meaningful DOM state instead.
- **Per-test fresh context** — Playwright default; cookies/storage isolated.
- **Console error capture** is opt-in via the `consoleErrors` fixture; tests
  that don't request it pay nothing for it.
- **Third-party noise filtering** — `@observability` tests filter known
  patterns (Trustpilot, Vimeo, OneTrust, GA, etc.) so the assertion targets
  first-party errors only.
- **Soft skips** — when the site genuinely lacks a feature in this run
  (skip-to-content link, cookie banner not yet shown), tests `test.skip(...)`
  with a clear reason rather than throwing flake.
- **Known production issues** — `tests/navigation/footer-links.spec.ts` allow-lists
  `/site-map/` (currently HTTP 500 in production) via `KNOWN_BROKEN`; the
  annotation surfaces it in the report.
- **Accessibility budget** — `@a11y` tests hard-fail on `critical` violations
  only and annotate `serious`/`moderate`. This matches what a marketing site
  reasonably ships and keeps the test useful as a regression gate without
  becoming red-on-arrival.

## Playwright agents

The suite was authored using the **playwright-test-** agent workflow installed
by `npx playwright init-agents --loop=vscode`:

1. **playwright-test-planner** — explores the live site, writes `specs/plan.md`
2. **playwright-test-generator** — turns each plan scenario into a `*.spec.ts`
3. **playwright-test-healer** — runs the suite, fixes failing selectors

The agent definitions live in `.github/agents/`. They're configured for the
VS Code Copilot loop; the Playwright MCP server they call is in
`.vscode/mcp.json`.

## Configuration highlights (`playwright.config.ts`)

- `baseURL: https://focusgroup.co.uk`
- `locale: en-GB`, `timezoneId: Europe/London`
- `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`,
  `video: 'retain-on-failure'` — enough forensics on failure, no overhead on success
- `retries: 2` in CI / `0` locally
- `forbidOnly: true` in CI — prevents accidentally landing `.only`

## Open follow-ups

- Re-target the dropped newsletter scenarios at `/sign-up-to-marketing/` once
  that page's form is inspected (see `specs/plan.md` §5).
- Add cross-browser project (`webkit`, `firefox`) once Chromium baseline is
  trusted in CI.
- Wire `@a11y` tests into PR checks with the HTML report uploaded as an
  artifact, so reviewers can read serious-but-non-blocking findings.
