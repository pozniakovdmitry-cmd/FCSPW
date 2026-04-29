// spec: specs/plan.md#4.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Accessibility', () => {
  test('Contact-us routing page passes axe-core — no critical violations @a11y', async ({ contact, axe }) => {
    // 1. Navigate to /contact-us/
    await contact.goto();

    // 2. Dismiss cookie banner if present
    await contact.dismissCookieBannerIfPresent();

    // 3. Run axe-core
    const results = await axe()
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('iframe')
      .analyze();

    // 4. Assert zero critical violations
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, JSON.stringify(critical.map((v) => v.id), null, 2)).toEqual([]);
  });
});
