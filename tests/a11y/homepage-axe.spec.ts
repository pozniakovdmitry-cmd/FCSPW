// spec: specs/plan.md#4.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Accessibility', () => {
  test('Homepage passes axe-core (WCAG 2.1 A/AA) — no critical violations @a11y @smoke', async ({ home, axe }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Dismiss cookie banner if present (cookie banners commonly violate a11y of underlying page)
    await home.dismissCookieBannerIfPresent();

    // 3. Run axe-core with WCAG 2.1 A/AA tags. Exclude third-party widgets we don't own
    //    (OneTrust cookie banner, Trustpilot widget, embedded iframes).
    const results = await axe()
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('iframe')
      .exclude('#onetrust-banner-sdk')
      .exclude('#onetrust-consent-sdk')
      .exclude('[id*="trustpilot" i]')
      .analyze();

    // 4. Hard-fail on critical violations only; serious/moderate issues are
    //    annotated for the report. Marketing sites commonly ship some "serious"
    //    issues (e.g. color-contrast on hero overlays); for an interview demo
    //    we surface them without blocking CI on a third-party-driven baseline.
    const summary = results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    test.info().annotations.push({ type: 'axe-violations', description: JSON.stringify(summary) });

    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, `critical WCAG issues:\n${JSON.stringify(critical.map((v) => ({ id: v.id, nodes: v.nodes.length })), null, 2)}`).toEqual([]);
  });
});
