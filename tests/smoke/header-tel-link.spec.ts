// spec: specs/plan.md#1.3
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Smoke', () => {
  test('Site phone number is exposed as a tel: link @smoke', async ({ home }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Scroll to the footer where the tel: link lives
    await home.footer.scrollIntoViewIfNeeded();

    // 3. Locate the tel: anchor anywhere on the page
    await expect(home.headerPhoneLink).toBeVisible();

    // 4. Verify it uses tel: scheme and contains the public number 0330 024 2000
    const href = await home.headerPhoneLink.getAttribute('href');
    expect(href).toMatch(/^tel:/);
    expect((href ?? '').replace(/[^\d]/g, '')).toContain('03300242000');
  });
});
