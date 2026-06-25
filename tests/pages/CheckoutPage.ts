import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly customerNameInput: Locator;
  readonly deliveryAddressInput: Locator;
  readonly submitButton: Locator;
  readonly validationAlerts: Locator;
  readonly customerNameError: Locator;
  readonly deliveryAddressError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerNameInput = page.getByLabel('Customer name');
    this.deliveryAddressInput = page.getByLabel('Delivery address');
    this.submitButton = page.getByTestId('checkout-submit');
    this.validationAlerts = page.getByRole('alert');
    this.customerNameError = this.validationAlerts.filter({ hasText: /name/i });
    this.deliveryAddressError = this.validationAlerts.filter({
      hasText: /address/i,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async submitOrder(customerName: string, deliveryAddress: string): Promise<void> {
    await this.customerNameInput.fill(customerName);
    await this.deliveryAddressInput.fill(deliveryAddress);
    await this.submitButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.submitButton.click();
  }
}
