import type { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  static readonly path = '/contact-us/';

  readonly salesTile: Locator;
  readonly supportTile: Locator;
  readonly billingTile: Locator;
  readonly partnersTile: Locator;

  constructor(page: Page) {
    super(page);
    const main = page.locator('main');
    this.salesTile = main.getByRole('link', { name: /sales/i }).first();
    this.supportTile = main.getByRole('link', { name: /support/i }).first();
    this.billingTile = main.getByRole('link', { name: /billing/i }).first();
    this.partnersTile = main.getByRole('link', { name: /(channel\s*)?partners?/i }).first();
  }

  routingTiles(): Locator[] {
    return [this.salesTile, this.supportTile, this.billingTile, this.partnersTile];
  }

  async goto(): Promise<Response | null> {
    return this.page.goto(ContactPage.path, { waitUntil: 'domcontentloaded' });
  }
}
