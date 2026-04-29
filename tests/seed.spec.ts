// Seed file used by playwright-test-generator agent as the base template
// for new specs. Real tests live in domain folders under tests/<group>/*.spec.ts
// and import from "@fixtures/test".

import { test, expect } from '../fixtures/test';

test.describe('Seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Focus/i);
  });
});
