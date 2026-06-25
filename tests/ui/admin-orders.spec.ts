import { expect, test } from '@playwright/test';
import { AdminOrdersPage } from '../pages/AdminOrdersPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';

test('admin updates a created order status @smoke', async ({ browser }) => {
  const baseURL =
    process.env.BASE_URL ?? 'https://orderlab-playwright-target.lovable.app';
  const customerEmail = process.env.CUSTOMER_EMAIL;
  const customerPassword = process.env.CUSTOMER_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!customerEmail || !customerPassword || !adminEmail || !adminPassword) {
    throw new Error('Demo credentials are missing from .env');
  }

  const customerContext = await browser.newContext({ baseURL });
  const customerPage = await customerContext.newPage();
  const customerLoginPage = new LoginPage(customerPage);
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);
  const ordersPage = new OrdersPage(customerPage);

  await customerLoginPage.open();
  await customerLoginPage.login(customerEmail, customerPassword);
  await productsPage.addProductToCart('Classic Burger');
  await checkoutPage.open();
  await checkoutPage.submitOrder(
    'Admin Status Test Customer',
    `456 Admin Test Street ${Date.now()}`,
  );

  const orderId = (await ordersPage.orderNumber.textContent())?.trim();

  if (!orderId) {
    throw new Error('Order confirmation did not include an order ID');
  }

  await customerContext.close();

  const adminContext = await browser.newContext({ baseURL });
  const adminPage = await adminContext.newPage();
  const adminLoginPage = new LoginPage(adminPage);
  const adminOrdersPage = new AdminOrdersPage(adminPage);

  await adminLoginPage.open();
  await adminLoginPage.login(adminEmail, adminPassword);

  await expect(adminPage).toHaveURL(/\/admin\/orders$/);
  await expect(adminOrdersPage.orderRow(orderId)).toBeVisible();

  await adminOrdersPage.updateStatus(orderId, 'Preparing');
  await expect(adminOrdersPage.statusSelect(orderId)).toHaveValue(/preparing/i);

  await adminPage.reload();

  await expect(adminOrdersPage.orderRow(orderId)).toBeVisible();
  await expect(adminOrdersPage.statusSelect(orderId)).toHaveValue(/preparing/i);

  await adminContext.close();
});
