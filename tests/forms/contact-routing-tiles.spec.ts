// spec: specs/plan.md#5.3
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Forms', () => {
  test('Contact-us routing tiles each link to a real destination @forms @nav', async ({ page, contact, request }) => {
    // 1. Navigate to /contact-us/
    await contact.goto();
    await contact.dismissCookieBannerIfPresent();

    // 2. Each tile is a link with a non-empty href
    const tiles = contact.routingTiles();
    const hrefs: string[] = [];
    for (const tile of tiles) {
      await expect(tile).toBeVisible();
      const href = await tile.getAttribute('href');
      expect(href, 'tile should have href').toBeTruthy();
      hrefs.push(href as string);
    }

    // 3. Probe each tile destination — should respond < 400
    const origin = new URL(page.url()).origin;
    for (const href of hrefs) {
      const url = new URL(href, origin).toString();
      const res = await request.get(url, { maxRedirects: 5 });
      expect(res.status(), `${url} should respond < 400`).toBeLessThan(400);
    }
  });
});
