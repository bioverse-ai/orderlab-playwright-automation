import { checkoutCustomers } from './testData';

export function createOrderItem(productId: string, quantity = 1) {
  return {
    product_id: productId,
    quantity,
  };
}

export function createClassicBurgerOrderItems(productId: string) {
  return [createOrderItem(productId, 2)];
}

export function createCheckoutDetails(
  customer: keyof typeof checkoutCustomers,
) {
  const checkoutCustomer = checkoutCustomers[customer];

  return {
    name: checkoutCustomer.name,
    address: `${checkoutCustomer.addressPrefix} ${Date.now()}`,
  };
}

export const invalidOrderPayloads = {
  emptyItems: [],
  zeroQuantity: (productId: string) => [createOrderItem(productId, 0)],
} as const;
