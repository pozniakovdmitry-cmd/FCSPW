// spec: specs/plan.md#6.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.use({ viewport: { width: 375, height: 812 } });

test.describe('Responsive', () => {
  test('No horizontal scroll on mobile homepage @responsive @regression', async ({ page, home }) => {
    // 1. Navigate to / on mobile viewport
    await home.goto();
    await home.dismissCookieBannerIfPresent();

    // 2. Wait for layout to stabilise
    await page.waitForLoadState('load');

    // 3. Read scrollWidth vs innerWidth from <html>
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));

    // 4. Allow 1px slack for sub-pixel rounding
    expect(
      overflow.scrollWidth,
      `horizontal overflow detected: scrollWidth=${overflow.scrollWidth}, innerWidth=${overflow.innerWidth}`,
    ).toBeLessThanOrEqual(overflow.innerWidth + 1);
  });
});
