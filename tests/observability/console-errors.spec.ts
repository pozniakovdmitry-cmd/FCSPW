// spec: specs/plan.md#8.1
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test';

// Marketing sites typically embed many third-party scripts. Filter known noisy
// patterns so the assertion targets first-party errors only.
const THIRD_PARTY_NOISE = [
  /googletagmanager|google-analytics|doubleclick|googleadservices/i,
  /facebook\.net|fbevents|fbq/i,
  /linkedin\.com\/(li|dsi|insight)/i,
  /hotjar|hsforms|hubspot/i,
  /clarity\.ms|bing\.com/i,
  /trustpilot/i,
  /vimeo\.com|player\.vimeo/i,
  /youtube\.com|youtu\.be/i,
  /third[-_ ]?party cookie/i,
  // Known noise from a third-party embed — TrustBox/Trustpilot widget throws this
  // when its anchor element is not yet in the DOM at script init.
  /You must pass either a valid element or a valid id\./i,
];

test.describe('Observability', () => {
  test('No first-party console errors on homepage @observability @smoke', async ({ home, consoleErrors, page }) => {
    // 1. Listeners attached by the consoleErrors fixture before this point

    // 2. Navigate to / — domcontentloaded is sufficient; some third-party
    //    scripts keep "load" pending well past our budget.
    await home.goto();

    // 3. Wait for the hero to render and let scripts settle briefly
    await page.waitForLoadState('domcontentloaded');
    await home.heroHeading.waitFor({ state: 'visible', timeout: 10_000 });
    await page.waitForTimeout(1500);

    // 4. Filter out third-party noise and assert the remainder is empty
    const firstParty = consoleErrors.filter(
      (e) => !THIRD_PARTY_NOISE.some((rx) => rx.test(e.location ?? '') || rx.test(e.text)),
    );
    expect(
      firstParty,
      `first-party console errors found:\n${JSON.stringify(firstParty, null, 2)}`,
    ).toEqual([]);
  });
});
