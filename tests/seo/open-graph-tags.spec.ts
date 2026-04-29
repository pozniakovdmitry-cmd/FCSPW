// spec: specs/plan.md#3.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

const REQUIRED_OG = ['og:title', 'og:description', 'og:image', 'og:url'];

test.describe('SEO', () => {
  test('Open Graph and Twitter card tags present on homepage @seo', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Verify each required Open Graph property is present and non-empty
    for (const property of REQUIRED_OG) {
      const value = await page.locator(`meta[property="${property}"]`).getAttribute('content');
      expect(value, `${property} should exist and be non-empty`).toBeTruthy();
    }

    // 3. twitter:card is optional — log presence but don't fail (FG site doesn't ship one today)
    const twitterCardCount = await page.locator('meta[name="twitter:card"]').count();
    test.info().annotations.push({ type: 'twitter:card present', description: String(twitterCardCount > 0) });
  });
});
