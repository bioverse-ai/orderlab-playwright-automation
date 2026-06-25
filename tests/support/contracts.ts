import { expect } from '@playwright/test';
import type { OrderItem, OrderResponse } from './api/ordersApi';
import type { Product, ProductsResponse } from './api/productsApi';

export function expectProductContract(product: Product): void {
  expect(product.id).toEqual(expect.any(String));
  expect(product.name).toEqual(expect.any(String));
  expect(product.category).toEqual(expect.any(String));
  expect(product.price).toEqual(expect.any(Number));
  expect(product.price).toBeGreaterThan(0);
}

export function expectProductsResponseContract(
  body: ProductsResponse,
): void {
  expect(Array.isArray(body.products)).toBe(true);

  for (const product of body.products) {
    expectProductContract(product);
  }
}

export function expectOrderContract(order: OrderResponse): void {
  expect(order.id).toEqual(expect.any(String));
  expect(order.status).toEqual(expect.any(String));
  expect(order.subtotal).toEqual(expect.any(Number));
  expect(order.subtotal).toBeGreaterThanOrEqual(0);
  expect(Array.isArray(order.items)).toBe(true);

  for (const item of order.items) {
    expectOrderItemContract(item);
  }
}

function expectOrderItemContract(item: OrderItem): void {
  const productId = item.productId ?? item.product_id;
  const unitPrice = item.unitPrice ?? item.unit_price;

  expect(productId).toEqual(expect.any(String));
  expect(item.quantity).toEqual(expect.any(Number));
  expect(item.quantity).toBeGreaterThan(0);
  expect(unitPrice).toEqual(expect.any(Number));
  expect(unitPrice).toBeGreaterThan(0);
}
