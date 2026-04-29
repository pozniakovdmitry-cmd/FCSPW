// spec: specs/plan.md#2.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

const TOP_LEVEL = [/business type/i, /products?\s*&\s*solutions/i, /resources/i, /company/i] as const;

test.describe('Navigation', () => {
  test('Main menu opens all top-level dropdowns @nav @regression', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();
    await home.dismissCookieBannerIfPresent();

    for (const name of TOP_LEVEL) {
      // 2. Hover the top-level item to open its panel
      await home.openTopLevelMenu(name);

      // 3. Assert a panel-like region with multiple links became visible
      const panel = page
        .locator('[role="menu"], [role="region"], [class*="menu" i], [class*="dropdown" i], [class*="mega" i]')
        .filter({ has: page.locator('a') })
        .filter({ hasNot: page.locator(':scope:has(> footer)') })
        .first();

      await expect(panel, `panel for ${name} should be visible`).toBeVisible({ timeout: 5_000 });
      await expect(panel.locator('a')).not.toHaveCount(0);

      // close by hovering away to avoid bleed-over between iterations
      await page.mouse.move(0, 0);
    }
  });
});
