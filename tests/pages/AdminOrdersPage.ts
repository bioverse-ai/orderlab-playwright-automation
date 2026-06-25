import type { Locator, Page } from '@playwright/test';

export class AdminOrdersPage {
  readonly page: Page;
  readonly orderRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderRows = page.getByTestId('admin-order-row');
  }

  orderRow(orderId: string): Locator {
    return this.orderRows.filter({ hasText: orderId });
  }

  statusSelect(orderId: string): Locator {
    return this.orderRow(orderId).getByRole('combobox');
  }

  async updateStatus(orderId: string, status: string): Promise<void> {
    await this.statusSelect(orderId).selectOption({ label: status });
  }
}
