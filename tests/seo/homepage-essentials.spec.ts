// spec: specs/plan.md#3.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('SEO', () => {
  test('Homepage has SEO essentials @seo @smoke', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. <title> is non-empty and within budget
    const title = (await page.title()).trim();
    expect.soft(title.length, 'title length').toBeGreaterThanOrEqual(20);
    expect.soft(title.length, 'title length').toBeLessThanOrEqual(70);

    // 3. meta description is non-empty and within budget
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description, 'description should exist').toBeTruthy();
    expect.soft((description ?? '').length, 'description length').toBeGreaterThanOrEqual(50);
    expect.soft((description ?? '').length, 'description length').toBeLessThanOrEqual(180);

    // 4. canonical link is an absolute https URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical, 'canonical href').toMatch(/^https:\/\//);
  });
});
