// spec: specs/plan.md#7.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';
import { isSameOrigin, normalize, probe } from '../../utils/links';

test.describe('Link health', () => {
  test('Homepage primary CTAs are reachable @links', async ({ page, home, request }) => {
    test.slow();

    // 1. Navigate to /
    await home.goto();
    await home.dismissCookieBannerIfPresent();

    // 2. Collect hrefs of primary CTAs (Learn more / Contact us / View customer stories / Read more)
    const ctaSelector = page.getByRole('link', {
      name: /^(learn more|contact us|view customer stories|read more|find out more|get a quote)$/i,
    });
    const hrefs = await ctaSelector.evaluateAll((els) =>
      Array.from(new Set(els.map((a) => (a as HTMLAnchorElement).href))),
    );
    expect(hrefs.length, 'expected at least one primary CTA on the homepage').toBeGreaterThanOrEqual(2);

    // 3. Probe each unique URL — assert status < 400
    const origin = new URL(page.url()).origin;
    const broken: { url: string; status: number }[] = [];
    for (const url of hrefs.map((h) => normalize(h, origin)).filter((h): h is string => !!h && isSameOrigin(h, origin))) {
      const status = await probe(request, url);
      if (status >= 400) broken.push({ url, status });
    }
    expect(broken).toEqual([]);
  });
});
