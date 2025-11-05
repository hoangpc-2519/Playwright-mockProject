import { test as base } from '@playwright/test';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';

/**
 * Extend Playwright test với custom fixtures cho Page Objects
 * Giúp tự động khởi tạo page objects trong mỗi test
 */
type PageFixtures = {
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
  /**
   * ProductPage fixture - tự động khởi tạo ProductPage với page hiện tại
   */
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  /**
   * CheckoutPage fixture - tự động khởi tạo CheckoutPage với page hiện tại
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';
