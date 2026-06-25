import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartCount: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartCount = page.getByTestId('cart-count');
    this.emptyState = page.getByTestId('cart-empty-state');
  }

  async open(): Promise<void> {
    await this.page.goto('/cart');
  }

  productName(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }
}
