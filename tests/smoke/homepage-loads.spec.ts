// spec: specs/plan.md#1.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Smoke', () => {
  test('Homepage loads with key sections @smoke', async ({ page, home }) => {
    // 1. Navigate to /
    const response = await home.goto();

    // 2. Verify HTTP response is 200
    expect(response?.status(), 'homepage should respond 200').toBe(200);

    // 3. Verify the document <title> contains "Focus Group"
    await expect(page).toHaveTitle(/Focus Group/i);

    // 4. Verify the hero <h1> is visible and contains "AI solutions for growth"
    await expect(home.heroHeading).toBeVisible();
    await expect(home.heroHeading).toContainText(/AI solutions for growth/i);

    // 5. Verify primary navigation is visible
    await expect(home.mainNav).toBeVisible();

    // 6. Verify footer is visible (scroll into view first — lazy-rendered)
    await home.footer.scrollIntoViewIfNeeded();
    await expect(home.footer).toBeVisible();
  });
});
