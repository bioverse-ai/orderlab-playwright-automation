import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test('searches and filters products @regression', async ({ page }) => {
  const email = process.env.CUSTOMER_EMAIL;
  const password = process.env.CUSTOMER_PASSWORD;

  if (!email || !password) {
    throw new Error('Customer credentials are missing from .env');
  }

  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  await loginPage.open();
  await loginPage.login(email, password);

  await expect(page).toHaveURL(/\/products$/);

  await productsPage.searchFor('classic');
  await expect(productsPage.productCard('Classic Burger')).toBeVisible();
  await expect(productsPage.productCard('Margherita Pizza')).toBeHidden();

  await productsPage.searchFor('');
  await productsPage.filterByCategory('Pizza');

  await expect(productsPage.productCard('Margherita Pizza')).toBeVisible();
  await expect(productsPage.productCard('Veggie Pizza')).toBeVisible();
  await expect(productsPage.productCard('Classic Burger')).toBeHidden();
});
