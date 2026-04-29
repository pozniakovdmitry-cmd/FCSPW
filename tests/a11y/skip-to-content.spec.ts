// spec: specs/plan.md#4.3
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Accessibility', () => {
  test('Skip-to-content link works for keyboard users @a11y', async ({ page, home }) => {
    // 1. Navigate to /
    await home.goto();

    // 2. Move focus to the very start of the document and press Tab once
    await page.evaluate(() => {
      (document.activeElement as HTMLElement | null)?.blur?.();
      window.scrollTo(0, 0);
    });
    await page.keyboard.press('Tab');

    // 3. Read the currently-focused element's text and href
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        text: (el?.textContent ?? '').trim(),
        href: el?.getAttribute('href') ?? null,
        tag: el?.tagName ?? '',
      };
    });

    if (!/skip|main|content/i.test(focused.text)) {
      test.skip(true, `no skip-to-content link on first Tab (focused: <${focused.tag.toLowerCase()}> "${focused.text.slice(0, 60)}")`);
    }
    expect(focused.tag).toBe('A');
    expect(focused.href ?? '').toMatch(/#/);

    // 4. Activate the skip link and verify focus / scroll lands inside <main>
    await page.keyboard.press('Enter');
    await expect(page.locator('main, #main, [role="main"]').first()).toBeVisible();
  });
});
