// spec: specs/plan.md#8.3
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

test.describe('Observability', () => {
  test('No mixed-content (http on https) requests on homepage @observability @regression', async ({ page, home }) => {
    // 1. Attach a request listener BEFORE navigation
    const insecure: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.startsWith('http://') && !url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
        insecure.push(`${req.method()} ${url}`);
      }
    });

    // 2. Navigate to /
    await home.goto();

    // 3. Wait for load
    await page.waitForLoadState('load');

    // 4. Assert no insecure subresource requests
    expect(insecure, `insecure (http://) requests on https page:\n${insecure.join('\n')}`).toEqual([]);
  });
});
