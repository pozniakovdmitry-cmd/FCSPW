# FCSPW — Playwright E2E Test Suite for focusgroup.co.uk

![Playwright](https://img.shields.io/badge/Playwright-1.49-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![axe-core](https://img.shields.io/badge/axe--core-WCAG%202.1%20AA-663399?logo=axe&logoColor=white)
![Target](https://img.shields.io/badge/target-focusgroup.co.uk-0057A8)

End-to-end test suite covering the live production site **https://focusgroup.co.uk** —
a UK-based telecom and IT solutions provider.

The suite is **plan-driven**: every test maps to a numbered scenario in
[`specs/plan.md`](specs/plan.md), written with the Page Object Model and
custom Playwright fixtures. No app server required — all tests run against
the live site.

---

## What is tested

24 scenarios across 8 quality dimensions:

| Group | Scenarios | Tags |
|---|:---:|---|
| Smoke — page loads, logo, phone link | 3 | `@smoke` |
| Navigation — mega-menu, header CTAs, footer links | 4 | `@nav` |
| SEO — title, description, canonical, OG, JSON-LD, sitemap | 4 | `@seo` |
| Accessibility — axe-core WCAG 2.1 AA, skip-link, image alts | 4 | `@a11y` |
| Forms — contact routing tiles, cookie consent | 2 | `@forms` |
| Responsive — mobile menu, horizontal overflow | 2 | `@responsive` |
| Link health — 404 page, primary CTAs | 2 | `@links` |
| Observability — console errors, LCP budget, mixed content | 3 | `@observability` / `@perf` |

---

## Tech stack

| Tool | Role |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation and test runner |
| TypeScript | Type-safe test authoring |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | WCAG accessibility scanning |
| Page Object Model | Encapsulates locators in `pages/` |
| Custom fixtures | `axe`, `consoleErrors`, `home`, `contact` wired in `fixtures/test.ts` |
| Playwright Agents | AI-assisted test planning, generation, and healing |

---

## Project structure

```
├── specs/
│   └── plan.md                  # Numbered test plan — single source of truth
├── pages/
│   ├── BasePage.ts              # Shared header / footer / cookie helpers
│   ├── HomePage.ts              # Homepage-specific locators
│   └── ContactPage.ts           # /contact-us/ routing page
├── fixtures/
│   └── test.ts                  # Extended `test` with POM + axe + consoleErrors
├── utils/
│   └── links.ts                 # Same-origin URL filtering + HEAD/GET probe
├── tests/
│   ├── seed.spec.ts             # Seed used by the playwright-test-generator agent
│   ├── smoke/                   # Must-pass on every build (≤30 s)
│   ├── navigation/              # Mega-menu, CTAs, footer
│   ├── seo/                     # Title, description, OG, JSON-LD, sitemap
│   ├── a11y/                    # axe-core scans, skip-link, image alts
│   ├── forms/                   # Contact routing, cookie consent
│   ├── responsive/              # Mobile menu, horizontal overflow
│   ├── links/                   # 404 page, primary CTA reachability
│   └── observability/           # Console errors, LCP budget, mixed content
├── .github/agents/              # Playwright agent definitions (planner / generator / healer)
├── .vscode/mcp.json             # Playwright MCP server config for VS Code
└── playwright.config.ts
```

---

## Quick start

```bash
npm install
npx playwright install chromium
npm test
```

> Runs against the live production site — no local server needed.

---

## Commands

| Goal | Command |
|---|---|
| Run all tests | `npm test` |
| Smoke only | `npm run test:smoke` |
| UI mode (interactive) | `npm run test:ui` |
| Headed browser (debug) | `npm run test:headed` |
| Open HTML report | `npm run report` |
| Single spec file | `npx playwright test tests/smoke/homepage-loads.spec.ts` |
| Filter by tag | `npx playwright test --grep @a11y` |
| Multiple tags | `npx playwright test --grep "@smoke\|@seo"` |
| Exclude tag | `npx playwright test --grep-invert @perf` |
| Type-check only | `npx tsc --noEmit` |

---

## Test tags

Every test is tagged so the suite can be sliced for different CI lanes:

- `@smoke` — must-pass on every build, runs in ~30 s
- `@regression` — full coverage, run nightly
- `@nav`, `@seo`, `@a11y`, `@forms`, `@responsive`, `@perf`, `@links`, `@observability` — slice by concern

---

## Architecture

### Page Object Model

Locators and page interactions live in `pages/`. Tests never contain raw
selectors — they call methods on `HomePage`, `ContactPage`, or `BasePage`.

### Custom fixtures (`fixtures/test.ts`)

The extended `test` object provides four built-in fixtures:

| Fixture | What it does |
|---|---|
| `home` | `HomePage` instance, navigated and ready |
| `contact` | `ContactPage` instance for `/contact-us/` |
| `consoleErrors` | Captures `console.error` / `pageerror` events per test |
| `axe` | Pre-configured `AxeBuilder` factory scoped to the page |

Tests that don't request a fixture pay nothing for it.

### Plan ↔ test traceability

Every spec has a header pointing back to its plan scenario:

```ts
// spec: specs/plan.md#1.1
// seed: tests/seed.spec.ts
```

Open `specs/plan.md`, search by section number, and the spec file is one grep away.

---

## Playwright agents

The suite was authored with the **playwright-test-** agent workflow:

| Agent | Job |
|---|---|
| `playwright-test-planner` | Explores the live site and writes `specs/plan.md` |
| `playwright-test-generator` | Turns each plan scenario into a `*.spec.ts` file |
| `playwright-test-healer` | Runs the suite and fixes broken selectors |

Agent definitions live in `.github/agents/`. They run via the VS Code Copilot
loop using the Playwright MCP server configured in `.vscode/mcp.json`.

