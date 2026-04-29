// spec: specs/plan.md#3.3
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('SEO', () => {
  test('sitemap.xml is valid and lists the homepage @seo @regression', async ({ request, baseURL }) => {
    // 1. GET /sitemap.xml
    const response = await request.get('/sitemap.xml');

    // 2. Status 200 and Content-Type contains xml
    expect(response.status(), 'sitemap status').toBe(200);
    expect(response.headers()['content-type'] ?? '').toMatch(/xml/i);

    // 3. Body parses and has >= 50 <loc> entries
    const body = await response.text();
    const locs = Array.from(body.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]?.trim()).filter(Boolean);
    expect(locs.length, 'sitemap entries').toBeGreaterThanOrEqual(50);

    // 4. Homepage URL is in the sitemap
    const homepage = `${baseURL?.replace(/\/$/, '')}/`;
    expect(locs).toContain(homepage);
  });
});
