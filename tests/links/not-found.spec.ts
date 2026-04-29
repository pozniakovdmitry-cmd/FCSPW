// spec: specs/plan.md#7.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Link health', () => {
  test('Unknown URL returns a branded 404 page @links @regression', async ({ page }) => {
    // 1. Navigate to a URL that should not exist
    const response = await page.goto('/this-page-definitely-does-not-exist-fcs', { waitUntil: 'domcontentloaded' });

    // 2. Verify HTTP status is 404
    expect(response?.status(), '404 status code').toBe(404);

    // 3. Verify a "page not found" message is visible
    await expect(page.getByText(/(page\s+not\s+found|can(?:not|'t)\s+find|404)/i).first()).toBeVisible();

    // 4. Verify a CTA back to the homepage exists (header logo or explicit link)
    const homeLinks = page.getByRole('link', { name: /home|focus group/i });
    await expect(homeLinks.first()).toBeVisible();
  });
});
