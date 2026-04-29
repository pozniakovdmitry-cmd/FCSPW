// spec: specs/plan.md#1.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Smoke', () => {
  test('Logo link returns to homepage @smoke @nav', async ({ page, home }) => {
    // 1. Open /about/ (any subpage works; /about/ may redirect to /company/about/)
    await page.goto('/company/about/', { waitUntil: 'domcontentloaded' });

    // 2. Click the Focus Group logo in the header
    await home.logo.click();

    // 3. Verify URL is /
    await expect(page).toHaveURL(/\/$/);

    // 4. Verify hero <h1> is visible
    await expect(home.heroHeading).toBeVisible();
  });
});
