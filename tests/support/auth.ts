import type { Browser } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { requiredEnv } from './env';

export async function getCustomerAccessToken(browser: Browser): Promise<string> {
  const baseURL = requiredEnv('BASE_URL');
  const email = requiredEnv('CUSTOMER_EMAIL');
  const password = requiredEnv('CUSTOMER_PASSWORD');
  const context = await browser.newContext({ baseURL });

  try {
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(email, password);
    await page.getByTestId('product-search').waitFor({ state: 'visible' });

    const token = await page.evaluate(() => {
      const findAccessToken = (
        value: unknown,
        depth = 0,
      ): string | undefined => {
        if (!value || typeof value !== 'object' || depth > 4) {
          return undefined;
        }

        const record = value as Record<string, unknown>;

        if (typeof record.access_token === 'string') {
          return record.access_token;
        }

        for (const child of Object.values(record)) {
          const nestedToken = findAccessToken(child, depth + 1);

          if (nestedToken) {
            return nestedToken;
          }
        }

        return undefined;
      };

      for (const storage of [window.localStorage, window.sessionStorage]) {
        for (let index = 0; index < storage.length; index += 1) {
          const key = storage.key(index);
          const rawValue = key ? storage.getItem(key) : null;

          if (!rawValue) {
            continue;
          }

          try {
            const parsedValue = JSON.parse(rawValue) as unknown;
            const token = findAccessToken(parsedValue);

            if (token) {
              return token;
            }
          } catch {
            // Ignore non-JSON storage values.
          }
        }
      }

      return undefined;
    });

    if (!token) {
      throw new Error('Could not find a customer access token after login');
    }

    return token;
  } finally {
    await context.close();
  }
}
