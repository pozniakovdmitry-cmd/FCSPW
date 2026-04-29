// spec: specs/plan.md#3.4
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('SEO', () => {
  test('Homepage exposes structured data (JSON-LD) @seo', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Collect all <script type="application/ld+json"> blocks
    const jsonLdBlocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => el.textContent ?? ''));

    expect(jsonLdBlocks.length, 'at least one JSON-LD block').toBeGreaterThan(0);

    // 3. At least one parses as valid JSON
    const parsed = jsonLdBlocks
      .map((raw) => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })
      .filter((p): p is unknown => p !== null);

    expect(parsed.length, 'at least one parseable JSON-LD').toBeGreaterThan(0);

    // 4. At least one has @context referencing schema.org
    const hasSchemaOrg = parsed.some((p) => {
      const arr = Array.isArray(p) ? p : [p];
      return arr.some((node) => /schema\.org/i.test(String((node as { '@context'?: unknown })['@context'] ?? '')));
    });
    expect(hasSchemaOrg, 'JSON-LD references schema.org').toBe(true);
  });
});
