import type { Locator, Page } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly confirmationBanner: Locator;
  readonly orderNumber: Locator;
  readonly orderStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmationBanner = page.getByRole('status');
    this.orderNumber = this.confirmationBanner.getByTestId('order-number');
    this.orderStatus = this.confirmationBanner.getByTestId('order-status');
  }
}
