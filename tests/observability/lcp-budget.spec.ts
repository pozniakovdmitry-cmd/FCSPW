// spec: specs/plan.md#8.2
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

const LCP_BUDGET_MS = 4000;

test.describe('Observability', () => {
  test('Homepage Largest Contentful Paint is under budget @perf', async ({ page, home }) => {
    // 1. Navigate to / and wait for the hero render
    await home.goto();
    await page.waitForLoadState('load');
    await expect(home.heroHeading).toBeVisible();

    // 2. Read LCP via PerformanceObserver (with a 5s collection window)
    const lcp = await page.evaluate<number>(
      () =>
        new Promise((resolve) => {
          let lastValue = 0;
          try {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                const value = (entry as PerformanceEntry & { startTime: number }).startTime;
                if (typeof value === 'number') lastValue = value;
              }
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
            setTimeout(() => {
              observer.disconnect();
              resolve(lastValue);
            }, 5000);
          } catch {
            resolve(0);
          }
        }),
    );

    // 3. Assert LCP under budget (skip if collector returned 0)
    if (lcp === 0) test.skip(true, 'LCP not reported by browser in this run');
    expect(lcp, `LCP ${Math.round(lcp)}ms exceeds ${LCP_BUDGET_MS}ms budget`).toBeLessThan(LCP_BUDGET_MS);
  });
});
