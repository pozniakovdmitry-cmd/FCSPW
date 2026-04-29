import { test as base, expect, type ConsoleMessage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';

type ConsoleEntry = { type: string; text: string; location?: string };

type Fixtures = {
  home: HomePage;
  contact: ContactPage;
  consoleErrors: ConsoleEntry[];
  axe: () => AxeBuilder;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  contact: async ({ page }, use) => {
    await use(new ContactPage(page));
  },

  consoleErrors: async ({ page }, use) => {
    const errors: ConsoleEntry[] = [];

    const onConsole = (msg: ConsoleMessage) => {
      if (msg.type() !== 'error') return;
      errors.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url,
      });
    };
    const onPageError = (err: Error) => {
      errors.push({ type: 'pageerror', text: err.message });
    };

    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    await use(errors);

    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  },

  axe: async ({ page }, use) => {
    await use(() => new AxeBuilder({ page }));
  },
});

export { expect };
