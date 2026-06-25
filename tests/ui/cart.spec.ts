import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test('adds a product to the cart @smoke', async ({ page }) => {
  const email = process.env.CUSTOMER_EMAIL;
  const password = process.env.CUSTOMER_PASSWORD;

  if (!email || !password) {
    throw new Error('Customer credentials are missing from .env');
  }

  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  await loginPage.open();
  await loginPage.login(email, password);

  await expect(productsPage.cartCount).toContainText('0');

  await productsPage.addProductToCart('Classic Burger');

  await expect(productsPage.cartCount).toContainText('1');

  await cartPage.open();

  await expect(cartPage.emptyState).toBeHidden();
  await expect(cartPage.productName('Classic Burger')).toBeVisible();
});
