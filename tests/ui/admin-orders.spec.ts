import { expect, test } from '../fixtures';
import { AdminOrdersPage } from '../pages/AdminOrdersPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';
import {
  orderStatuses,
  products,
} from '../support/testData';
import { createCheckoutDetails } from '../support/testDataFactory';

test('admin updates a created order status @smoke', async ({
  adminPage,
  customerPage,
}) => {
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);
  const ordersPage = new OrdersPage(customerPage);

  await productsPage.addProductToCart(products.classicBurger.name);
  await checkoutPage.open();
  const checkoutDetails = createCheckoutDetails('adminStatusCustomer');

  await checkoutPage.submitOrder(checkoutDetails.name, checkoutDetails.address);

  const orderId = (await ordersPage.orderNumber.textContent())?.trim();

  if (!orderId) {
    throw new Error('Order confirmation did not include an order ID');
  }

  const adminOrdersPage = new AdminOrdersPage(adminPage);

  await adminPage.reload();
  await expect(adminOrdersPage.orderRow(orderId)).toBeVisible();

  await adminOrdersPage.updateStatus(orderId, orderStatuses.preparing);
  await expect(adminOrdersPage.statusSelect(orderId)).toHaveValue(/preparing/i);

  await adminPage.reload();

  await expect(adminOrdersPage.orderRow(orderId)).toBeVisible();
  await expect(adminOrdersPage.statusSelect(orderId)).toHaveValue(/preparing/i);
});
