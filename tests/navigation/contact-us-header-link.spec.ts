// spec: specs/plan.md#2.3
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Navigation', () => {
  test('Header Contact us link reaches the routing page @nav @smoke', async ({ page, home, contact }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Click the header Contact us link
    await home.contactUsHeaderLink.click();

    // 3. Verify URL is /contact-us/
    await expect(page).toHaveURL(/\/contact-us\/?$/);

    // 4. Verify the four routing tiles are present
    for (const tile of contact.routingTiles()) {
      await expect(tile).toBeVisible();
    }
  });
});
