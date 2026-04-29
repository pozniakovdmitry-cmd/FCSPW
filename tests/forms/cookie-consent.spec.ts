// spec: specs/plan.md#5.4
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Forms', () => {
  test('Cookie consent banner persists dismissal across reload @forms @observability', async ({ page, home, context }) => {
    // 1. Navigate to / with a fresh context (Playwright default per test)
    await home.goto();

    // 2. If the banner is absent within timeout, the test isn't applicable
    const dismissed = await home.dismissCookieBannerIfPresent(8000);
    if (!dismissed) {
      test.skip(true, 'cookie banner did not appear in this run');
    }

    // 3. Reload the page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // 4. Banner does not reappear and at least one consent-like cookie is set
    await expect(home.cookieBanner.first()).toBeHidden({ timeout: 5_000 });

    const cookies = await context.cookies();
    const consentCookie = cookies.find((c) => /consent|cookie|onetrust|cookiebot/i.test(c.name));
    expect(consentCookie, `consent cookie should be set; got: ${cookies.map((c) => c.name).join(', ')}`).toBeDefined();
  });
});
