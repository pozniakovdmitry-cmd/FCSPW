// spec: specs/plan.md#2.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Navigation', () => {
  test('Products & solutions → VoIP navigates to product page @nav', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();
    await home.dismissCookieBannerIfPresent();

    // 2. Open the Products & solutions menu
    await home.openTopLevelMenu(/products?\s*&\s*solutions/i);

    // 3. Click the VoIP entry within the open mega-menu (link text: "VoIP phone systems")
    await page.getByRole('link', { name: /voip/i }).first().click();

    // 4. Verify URL points at the VoIP product page and the page H1 is visible
    await expect(page).toHaveURL(/\/voip/i);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });
});
