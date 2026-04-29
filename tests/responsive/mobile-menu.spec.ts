// spec: specs/plan.md#6.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.use({ viewport: { width: 375, height: 812 } });

test.describe('Responsive', () => {
  test('Mobile menu opens on small viewport @responsive @nav', async ({ page, home }) => {
    // 1. Navigate to / on a 375x812 viewport
    await home.goto();
    await home.dismissCookieBannerIfPresent();

    // 2. The hamburger toggle (Bootstrap navbar-toggler) is the mobile nav affordance
    const hamburger = page
      .getByRole('button', { name: /toggle navigation|menu/i })
      .or(page.locator('button.navbar-toggler, button.hamburger'))
      .first();
    await expect(hamburger).toBeVisible();

    // 3. Click the hamburger
    await hamburger.click();

    // 4. The expanding nav region (#navbarSupportedContent) reveals primary links.
    //    Use raw <a> selector — Bootstrap dropdown triggers carry aria-haspopup
    //    and don't always resolve to role=link.
    const mobileNav = page.locator('#navbarSupportedContent, nav .navbar-collapse').first();
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.locator('a')).not.toHaveCount(0);
  });
});
