import { expect, test } from '@playwright/test';
import { requiredEnv } from '../support/env';

test('reads the public product catalog @smoke', async ({ request }) => {
  const apiBaseUrl = requiredEnv('API_BASE_URL');

  const response = await request.get(`${apiBaseUrl}/products`);

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = (await response.json()) as {
    products: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
    }>;
  };

  expect(body.products).toHaveLength(6);

  const classicBurger = body.products.find(
    (product) => product.name === 'Classic Burger',
  );

  expect(classicBurger).toMatchObject({
    category: 'Burgers',
    price: 12.99,
  });
});
