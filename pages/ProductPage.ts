import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly cartQty: Locator; 
  readonly globalAddToCartButtons: Locator; 
  readonly recipientNameInput: Locator; 
  readonly recipientEmailInput: Locator; 
  readonly detailAddToCartButton: Locator; 
  readonly successNotification: Locator; 

  constructor(page: Page) {
    this.page = page;
    this.cartQty = page.locator('span.cart-qty');
    this.globalAddToCartButtons = page.locator('input[value="Add to cart"]');
    this.recipientNameInput = page.locator('input[id*="RecipientName"]');
    this.recipientEmailInput = page.locator('input[id*="RecipientEmail"]');
    this.detailAddToCartButton = page.locator('.product-essential input[value="Add to cart"]');
    this.successNotification = page.locator('.bar-notification.success');
  }

  /**
   * Lấy số lượng sản phẩm hiện tại trong giỏ hàng
   * @returns Số lượng sản phẩm, trả về 0 nếu giỏ hàng trống
   */
  async getCartQuantity(): Promise<number> {
    if (!(await this.cartQty.isVisible())) return 0;
    const txt = (await this.cartQty.textContent()) || '';
    const match = txt.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Click vào nút "Add to cart" đầu tiên trên trang danh sách sản phẩm
   */
  async clickFirstGlobalAddToCart() {
    const firstBtn = this.globalAddToCartButtons.first();
    await expect(firstBtn).toBeVisible();
    await firstBtn.click();
  }

  /**
   * Điền thông tin người nhận cho sản phẩm gift card
   * @param name Tên người nhận
   * @param email Email người nhận
   */
  async fillGiftCardRecipient(name: string, email: string) {
    if (await this.recipientNameInput.isVisible()) {
      await this.recipientNameInput.fill(name);
    }
    if (await this.recipientEmailInput.isVisible()) {
      await this.recipientEmailInput.fill(email);
    }
  }

  /**
   * Click nút "Add to cart" trên trang chi tiết sản phẩm nếu có
   */
  async clickDetailAddToCartIfVisible() {
    const count = await this.detailAddToCartButton.count();
    if (count > 0) {
      await this.detailAddToCartButton.first().click();
    }
  }

  /**
   * Chờ và lấy nội dung thông báo thành công
   * @returns Nội dung thông báo thành công
   */
  async waitForSuccessNotification(): Promise<string> {
    await expect(this.successNotification).toBeVisible({ timeout: 5000 });
    return (await this.successNotification.textContent())?.trim() || '';
  }

  /**
   * Thêm sản phẩm đầu tiên vào giỏ hàng
   * Xử lý cả sản phẩm thường và gift card (cần điền thông tin người nhận)
   * @param options Tùy chọn cho gift card (tên và email người nhận)
   * @returns Object chứa số lượng ban đầu, số lượng mới và thông báo thành công
   */
  async addFirstProductToCart(options?: { giftRecipientName?: string; giftRecipientEmail?: string }): Promise<{ initialQty: number; newQty: number; successText: string; }> {
    // Lấy số lượng sản phẩm ban đầu trong giỏ hàng
    const initialQty = await this.getCartQuantity();

    // Click vào nút "Add to cart" đầu tiên
    await this.clickFirstGlobalAddToCart();
    await this.page.waitForLoadState('networkidle');

    // Kiểm tra xem có phải sản phẩm gift card không (có trường recipient)
    const recipientNameExists = await this.recipientNameInput.count() > 0;
    if (recipientNameExists) {
      await this.recipientNameInput.waitFor({ state: 'visible', timeout: 3000 });
      await this.recipientNameInput.fill(options?.giftRecipientName || 'Tester');
      
      const recipientEmailExists = await this.recipientEmailInput.count() > 0;
      if (recipientEmailExists) {
        await this.recipientEmailInput.waitFor({ state: 'visible', timeout: 3000 });
        await this.recipientEmailInput.fill(options?.giftRecipientEmail || 'tester@example.com');
      }
    }

    // Chờ và click nút "Add to cart" trên trang chi tiết sản phẩm
    const btnExists = await this.detailAddToCartButton.count() > 0;
    if (btnExists) {
      const detailBtn = this.detailAddToCartButton.first();
      await detailBtn.waitFor({ state: 'visible', timeout: 3000 });
      await detailBtn.scrollIntoViewIfNeeded();
      await detailBtn.click();
      
      // Chờ request AJAX hoàn thành
      await this.page.waitForTimeout(500);
    }

    // Lấy thông báo thành công (với try-catch để xử lý trường hợp không có notification)
    let successText = '';
    try {
      successText = await this.waitForSuccessNotification();
    } catch (error) {
      // Notification không xuất hiện, kiểm tra xem cart đã tăng chưa
      console.log('Success notification not found, checking cart quantity instead');
    }

    // Chờ giỏ hàng cập nhật
    await this.page.waitForTimeout(1000);
    const newQty = await this.getCartQuantity();

    return { initialQty, newQty, successText };
  }
}

export default ProductPage;
