// spec: specs/plan.md#4.4
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Accessibility', () => {
  test('Every <img> in <main> has accessible alt text @a11y @regression', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Collect all visible <img> in <main> excluding aria-hidden / decorative
    const offenders = await page.locator('main img:not([aria-hidden="true"])').evaluateAll((imgs) =>
      imgs
        .filter((img) => {
          const cs = window.getComputedStyle(img);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          if ((img as HTMLImageElement).getAttribute('role') === 'presentation') return false;
          return true;
        })
        .filter((img) => {
          const alt = (img as HTMLImageElement).getAttribute('alt');
          const ariaLabel = (img as HTMLImageElement).getAttribute('aria-label');
          return alt === null && !ariaLabel;
        })
        .map((img) => (img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src),
    );

    // 3. Assert no offenders (alt="" is allowed for purely decorative images)
    expect(offenders, `images missing alt: ${JSON.stringify(offenders, null, 2)}`).toEqual([]);
  });
});
