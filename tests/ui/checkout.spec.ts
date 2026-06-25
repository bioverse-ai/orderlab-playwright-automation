import { expect, test } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';

test('completes checkout and shows order confirmation @smoke', async ({
  page,
}) => {
  const email = process.env.CUSTOMER_EMAIL;
  const password = process.env.CUSTOMER_PASSWORD;

  if (!email || !password) {
    throw new Error('Customer credentials are missing from .env');
  }

  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const checkoutPage = new CheckoutPage(page);
  const ordersPage = new OrdersPage(page);

  await loginPage.open();
  await loginPage.login(email, password);
  await productsPage.addProductToCart('Classic Burger');

  await checkoutPage.open();
  await checkoutPage.submitOrder(
    'Portfolio Test Customer',
    `123 Demo Street ${Date.now()}`,
  );

  await expect(page).toHaveURL(/\/orders(\?.*)?$/);
  await expect(ordersPage.orderNumber).toBeVisible();
  await expect(ordersPage.orderStatus).toContainText('Pending');
});
