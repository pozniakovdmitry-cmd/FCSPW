import type { Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  static readonly path = '/';

  readonly heroHeading;
  readonly heroLearnMoreCta;
  readonly newsletterEmail;
  readonly newsletterSubmit;
  readonly partnerLogosSection;
  readonly testimonialCards;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.getByRole('heading', { level: 1 }).first();
    this.heroLearnMoreCta = page.getByRole('link', { name: /^learn more$/i }).first();

    const newsletterScope = page.locator('form').filter({ hasText: /subscribe|stay up to date/i }).first();
    this.newsletterEmail = newsletterScope.getByRole('textbox', { name: /email/i }).first();
    this.newsletterSubmit = newsletterScope.getByRole('button', { name: /subscribe|sign up/i }).first();

    this.partnerLogosSection = page.locator('section, div').filter({ hasText: /partners|microsoft/i }).first();
    this.testimonialCards = page.locator('[class*="case-study" i], [class*="testimonial" i]');
  }

  async goto(): Promise<Response | null> {
    return this.page.goto(HomePage.path, { waitUntil: 'domcontentloaded' });
  }
}
