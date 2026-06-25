import type { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly productCards: Locator;
  readonly emptyState: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('product-search');
    this.categoryFilter = page.getByLabel('Filter by category');
    this.productCards = page.getByTestId('product-card');
    this.emptyState = page.getByTestId('product-empty-state');
    this.cartCount = page.getByTestId('cart-count');
  }

  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async searchFor(text: string): Promise<void> {
    await this.searchInput.fill(text);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption({ label: category });
  }

  async addProductToCart(name: string): Promise<void> {
    await this.page
      .getByRole('button', { name: `Add ${name} to cart` })
      .click();
  }
}
