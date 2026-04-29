import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  readonly header: Locator;
  readonly footer: Locator;
  readonly logo: Locator;
  readonly mainNav: Locator;
  readonly contactUsHeaderLink: Locator;
  readonly headerPhoneLink: Locator;
  readonly cookieBanner: Locator;
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header').first();
    this.footer = page.locator('footer').first();
    this.logo = page.locator('a.navbar-brand, a[aria-label="logo"]').first();
    this.mainNav = page.getByRole('navigation').first();
    this.contactUsHeaderLink = page
      .getByRole('link', { name: /^contact us$/i })
      .or(page.getByRole('button', { name: /^contact us$/i }))
      .first();
    this.headerPhoneLink = page.locator('a[href^="tel:"]').first();

    this.cookieBanner = page.locator(
      '#onetrust-banner-sdk, [id*="cookie" i][role="dialog"], [class*="cookie" i][role="dialog"]',
    );
    this.cookieAcceptButton = page.getByRole('button', {
      name: /^(accept(\s+all)?|allow all|i agree|got it)$/i,
    });
  }

  async dismissCookieBannerIfPresent(timeoutMs = 4000): Promise<boolean> {
    const banner = this.cookieBanner.first();
    try {
      await banner.waitFor({ state: 'visible', timeout: timeoutMs });
    } catch {
      return false;
    }

    const acceptInBanner = banner.getByRole('button', {
      name: /^(accept(\s+all)?|allow all|i agree|got it)$/i,
    });
    const button = (await acceptInBanner.count()) > 0 ? acceptInBanner.first() : this.cookieAcceptButton.first();
    if ((await button.count()) === 0) return false;

    await button.click();
    await banner.waitFor({ state: 'hidden', timeout: timeoutMs }).catch(() => undefined);
    return true;
  }

  async openTopLevelMenu(name: RegExp | string): Promise<Locator> {
    const trigger = this.mainNav.getByRole('button', { name }).or(this.mainNav.getByRole('link', { name })).first();
    await trigger.hover();
    return trigger;
  }
}
