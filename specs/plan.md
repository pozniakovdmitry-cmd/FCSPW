# Focus Group — Test Plan

End-to-end test plan for **https://focusgroup.co.uk** covering smoke, navigation,
SEO, accessibility, forms, responsive, link-health and observability scenarios.

- **Seed:** `tests/seed.spec.ts`
- **Pages:** `pages/*` (Page Object Model)
- **Fixtures:** `fixtures/test.ts` (axe, console-error capture, cookie helper)
- **Tags:** `@smoke`, `@regression`, `@nav`, `@seo`, `@a11y`, `@forms`,
  `@responsive`, `@perf`, `@links`, `@observability`

Every scenario assumes a **fresh browser context** (cookies, storage, cache cleared)
and that the public site is reachable.

---

## 1. Smoke

**Seed:** `tests/seed.spec.ts`

### 1.1 Homepage loads with key sections @smoke
**Steps:**
1. Navigate to `/`
2. Verify HTTP response is 200
3. Verify the document `<title>` contains "Focus Group"
4. Verify the hero `<h1>` is visible and contains "AI solutions for growth"
5. Verify primary navigation is visible
6. Verify footer is visible

**Expected:** Page renders within navigation timeout, all top-level landmarks visible, no uncaught console errors.

### 1.2 Logo link returns to homepage @smoke @nav
**Steps:**
1. Open `/about/`
2. Click the Focus Group logo in the header
3. Verify URL is `/`
4. Verify hero `<h1>` is visible

**Expected:** Logo always points to homepage from any subpage.

### 1.3 Top phone number is a tel: link @smoke
**Steps:**
1. Navigate to `/`
2. Locate the header phone number `0330 024 2000`
3. Verify the anchor uses a `tel:` href

**Expected:** `href="tel:03300242000"` (or equivalent normalized number).

---

## 2. Navigation

**Seed:** `tests/seed.spec.ts`

### 2.1 Main menu opens all top-level dropdowns @nav @regression
**Steps:**
1. Navigate to `/`
2. For each top-level item (`Business type`, `Products & solutions`, `Resources`, `Company`), hover or click to open
3. Verify the corresponding mega-menu panel is visible and contains > 1 link

**Expected:** Each dropdown reveals a non-empty panel.

### 2.2 Products & solutions → Telecoms → VoIP navigates correctly @nav
**Steps:**
1. Open `Products & solutions` menu
2. Click `VoIP`
3. Verify URL contains `/voip`
4. Verify page `<h1>` is visible

**Expected:** Deep navigation through mega-menu lands on the matching product page.

### 2.3 Contact us link in header @nav @smoke
**Steps:**
1. Navigate to `/`
2. Click the header `Contact us` link
3. Verify URL is `/contact-us/`
4. Verify the four routing tiles (Sales, Support, Billing, Channel Partners) are visible

**Expected:** Header CTA always reaches `/contact-us/`.

### 2.4 Footer column links are reachable @links @regression
**Steps:**
1. Navigate to `/`
2. Collect all anchor `href`s in the footer (same-origin only)
3. For each unique URL, request via `request.head()` (fallback to GET)
4. Assert status `< 400`

**Expected:** No broken footer links. (Test allows up to 1 known external redirect.)

---

## 3. SEO & metadata

**Seed:** `tests/seed.spec.ts`

### 3.1 Homepage has SEO essentials @seo @smoke
**Steps:**
1. Navigate to `/`
2. Read `<title>` — assert non-empty, length 20-70
3. Read `meta[name="description"]` — assert non-empty, length 50-180
4. Read `link[rel="canonical"]` — assert points to absolute https URL

**Expected:** All three SEO essentials present and within recommended length budgets.

### 3.2 Open Graph and Twitter card tags are present on homepage @seo
**Steps:**
1. Navigate to `/`
2. Verify `meta[property="og:title"]`, `og:description`, `og:image`, `og:url` exist
3. Verify `meta[name="twitter:card"]` exists

**Expected:** Social-preview metadata is configured.

### 3.3 Sitemap.xml is valid and lists the homepage @seo @regression
**Steps:**
1. GET `/sitemap.xml`
2. Assert status 200 and `content-type` contains `xml`
3. Parse XML, assert `>= 50` `<loc>` entries
4. Assert the homepage URL is one of the entries

**Expected:** Sitemap is published and well-formed.

### 3.4 Page has structured data (JSON-LD) @seo
**Steps:**
1. Navigate to `/`
2. Collect all `<script type="application/ld+json">` blocks
3. Assert at least one parses as valid JSON
4. Assert at least one has `@context` containing `schema.org`

**Expected:** SEO structured data present and parseable.

---

## 4. Accessibility

**Seed:** `tests/seed.spec.ts`

### 4.1 Homepage passes axe-core (WCAG 2.1 AA) @a11y @smoke
**Steps:**
1. Navigate to `/`
2. Dismiss cookie banner if present
3. Run `@axe-core/playwright` with tags `wcag2a`, `wcag2aa`
4. Assert there are zero `critical` and zero `serious` violations

**Expected:** No critical/serious WCAG issues on the homepage.

### 4.2 Contact-us page passes axe-core @a11y
**Steps:**
1. Navigate to `/contact-us/`
2. Dismiss cookie banner if present
3. Run axe with `wcag2a`/`wcag2aa`
4. Assert zero critical violations

**Expected:** Routing page is accessible.

### 4.3 Skip-to-content link works for keyboard users @a11y
**Steps:**
1. Navigate to `/`
2. Press `Tab` once from the document body
3. Verify a focused element is visible whose accessible name matches `/skip|main/i`
4. Press `Enter` and verify focus / scroll has moved to the main content region

**Expected:** Keyboard users can skip past the navigation.

### 4.4 Every image in the hero/main has accessible alt text @a11y @regression
**Steps:**
1. Navigate to `/`
2. Locate all `<img>` inside `<main>` (excluding decorative `aria-hidden`)
3. Assert each has a non-empty `alt` attribute or `aria-label`

**Expected:** No images break screen-reader UX.

---

## 5. Forms / interactions

**Seed:** `tests/seed.spec.ts`

> Note: scenarios 5.1 and 5.2 (newsletter form validation) were removed —
> the homepage "Subscribe" button is a link to `/sign-up-to-marketing/`, not an
> inline form. The validation scenarios will be re-targeted at that page in a
> follow-up.

### 5.3 Contact-us routing tiles each link out @forms @nav
**Steps:**
1. Navigate to `/contact-us/`
2. For each routing tile (`Sales`, `Support`, `Billing & invoices`, `Channel Partners`)
3. Verify the tile is a link with non-empty `href`
4. Verify clicking the first tile navigates somewhere with status 200

**Expected:** All four routing options are wired up.

### 5.4 Cookie consent banner can be dismissed @forms @observability
**Steps:**
1. Navigate to `/` with a fresh context
2. Wait for the cookie banner to appear (skip test if absent after timeout)
3. Click the `Accept` (or equivalent) button
4. Reload the page
5. Verify the banner does not reappear and a consent cookie is set

**Expected:** Consent persists across reloads.

---

## 6. Responsive

**Seed:** `tests/seed.spec.ts`

### 6.1 Mobile menu opens on small viewport @responsive @nav
**Steps:**
1. Set viewport to 375x812 (iPhone size)
2. Navigate to `/`
3. Verify the desktop nav is hidden and a hamburger toggle is visible
4. Click the hamburger
5. Verify the mobile menu panel is visible and contains primary links

**Expected:** Mobile-only navigation works on small screens.

### 6.2 Layout has no horizontal scroll on mobile @responsive @regression
**Steps:**
1. Set viewport to 375x812
2. Navigate to `/`
3. Read `document.documentElement.scrollWidth` and compare to `window.innerWidth`
4. Assert no horizontal overflow (`scrollWidth <= innerWidth + 1`)

**Expected:** Mobile homepage fits the viewport horizontally.

---

## 7. Link health & error pages

**Seed:** `tests/seed.spec.ts`

### 7.1 404 page returns 404 status with branded UI @links @regression
**Steps:**
1. Navigate to `/this-page-definitely-does-not-exist-fcs`
2. Verify HTTP status is 404
3. Verify a "page not found" message is visible
4. Verify a CTA back to the homepage is present

**Expected:** Site returns proper 404 with helpful UI.

### 7.2 Homepage primary CTAs are reachable @links
**Steps:**
1. Navigate to `/`
2. Collect hrefs of every CTA matching `Learn more`, `Contact us`, `View customer stories`
3. For each unique href, perform a HEAD/GET and assert status `< 400`

**Expected:** No dead CTA links on the homepage.

---

## 8. Observability / robustness

**Seed:** `tests/seed.spec.ts`

### 8.1 No uncaught console errors on homepage @observability @smoke
**Steps:**
1. Attach `console` and `pageerror` listeners before navigation
2. Navigate to `/`
3. Wait for `load` event and brief settle
4. Assert no `console.error` or `pageerror` events with severity `error`

**Expected:** Clean browser console on the most-trafficked page.

### 8.2 Homepage Largest Contentful Paint is under budget @perf
**Steps:**
1. Navigate to `/`
2. Use `PerformanceObserver` (`largest-contentful-paint`) inside `page.evaluate`
3. Assert LCP < 4000ms (lab budget for marketing page)

**Expected:** Headline render is reasonably fast under default network.

### 8.3 No mixed-content (http on https) requests @observability @regression
**Steps:**
1. Attach a `request` listener
2. Navigate to `/`
3. Wait for load
4. Assert no requests have `http://` URLs (except `data:` / `blob:`)

**Expected:** Site does not load any insecure subresources.

---

## Coverage summary

| Group           | Count |
|-----------------|------:|
| Smoke           |     3 |
| Navigation      |     4 |
| SEO             |     4 |
| Accessibility   |     4 |
| Forms           |     2 |
| Responsive      |     2 |
| Link health     |     2 |
| Observability   |     3 |
| **Total**       |  **24** |
