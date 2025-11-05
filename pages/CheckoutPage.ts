import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  
  // Cart page elements
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  
  // Billing Address elements
  readonly countrySelect: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly zipInput: Locator;
  readonly phoneInput: Locator;
  
  // Continue buttons cho từng bước
  readonly billingContinueButton: Locator;
  readonly shippingContinueButton: Locator;
  readonly shippingMethodContinueButton: Locator;
  readonly paymentMethodContinueButton: Locator;
  readonly paymentInfoContinueButton: Locator;
  readonly confirmOrderButton: Locator;
  
  // Order confirmation elements
  readonly successMessage: Locator;
  readonly orderDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Cart page
    this.termsCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
    
    // Billing Address
    this.countrySelect = page.locator('#BillingNewAddress_CountryId');
    this.cityInput = page.locator('#BillingNewAddress_City');
    this.address1Input = page.locator('#BillingNewAddress_Address1');
    this.address2Input = page.locator('#BillingNewAddress_Address2');
    this.zipInput = page.locator('#BillingNewAddress_ZipPostalCode');
    this.phoneInput = page.locator('#BillingNewAddress_PhoneNumber');
    
    // Continue buttons
    this.billingContinueButton = page.locator('input[value="Continue"]').first();
    this.shippingContinueButton = page.locator('#shipping-buttons-container input[value="Continue"]');
    this.shippingMethodContinueButton = page.locator('#shipping-method-buttons-container input[value="Continue"]');
    this.paymentMethodContinueButton = page.locator('#payment-method-buttons-container input[value="Continue"]');
    this.paymentInfoContinueButton = page.locator('#payment-info-buttons-container input[value="Continue"]');
    this.confirmOrderButton = page.locator('#confirm-order-buttons-container input[value="Confirm"]');
    
    // Order confirmation
    this.successMessage = page.locator('.title strong');
    this.orderDetails = page.locator('.details');
  }

  /**
   * Đi đến trang giỏ hàng
   */
  async gotoCart() {
    await this.page.locator('a[href="/cart"]').first().click();
    await expect(this.page).toHaveURL(/.*cart/);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Chấp nhận Terms of Service và click Checkout
   */
  async acceptTermsAndCheckout() {
    // Kiểm tra giỏ hàng có sản phẩm không
    const emptyMessage = this.page.locator('.order-summary-content:has-text("Your Shopping Cart is empty!")');
    const isEmpty = await emptyMessage.isVisible().catch(() => false);
    
    if (isEmpty) {
      throw new Error('Giỏ hàng trống, không thể checkout');
    }
    
    await expect(this.termsCheckbox).toBeVisible({ timeout: 10000 });
    await this.termsCheckbox.check();
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
    await this.page.waitForURL(/.*checkout/, { timeout: 15000 });
  }

  /**
   * Điền thông tin địa chỉ thanh toán
   * @param address Object chứa thông tin địa chỉ
   */
  async fillBillingAddress(address: {
    country?: string;
    city?: string;
    address1?: string;
    address2?: string;
    zipCode?: string;
    phone?: string;
  }) {
    // Chọn quốc gia
    if (address.country && await this.countrySelect.isVisible()) {
      await this.countrySelect.selectOption({ label: address.country });
      await this.page.waitForTimeout(500); // Chờ form load sau khi chọn country
    }

    // Điền City
    if (address.city && await this.cityInput.isVisible()) {
      const currentValue = await this.cityInput.inputValue();
      if (currentValue === '') {
        await this.cityInput.fill(address.city);
      }
    }

    // Điền Address 1
    if (address.address1 && await this.address1Input.isVisible()) {
      const currentValue = await this.address1Input.inputValue();
      if (currentValue === '') {
        await this.address1Input.fill(address.address1);
      }
    }

    // Điền Address 2 (optional)
    if (address.address2 && await this.address2Input.isVisible()) {
      await this.address2Input.fill(address.address2);
    }

    // Điền Zip Code
    if (address.zipCode && await this.zipInput.isVisible()) {
      const currentValue = await this.zipInput.inputValue();
      if (currentValue === '') {
        await this.zipInput.fill(address.zipCode);
      }
    }

    // Điền Phone
    if (address.phone && await this.phoneInput.isVisible()) {
      const currentValue = await this.phoneInput.inputValue();
      if (currentValue === '') {
        await this.phoneInput.fill(address.phone);
      }
    }
  }

  /**
   * Click Continue ở bước Billing Address
   */
  async continueBillingAddress() {
    await this.billingContinueButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click Continue ở bước Shipping Address
   */
  async continueShippingAddress() {
    if (await this.shippingContinueButton.isVisible()) {
      await this.shippingContinueButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Click Continue ở bước Shipping Method
   */
  async continueShippingMethod() {
    if (await this.shippingMethodContinueButton.isVisible()) {
      await this.shippingMethodContinueButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Click Continue ở bước Payment Method
   */
  async continuePaymentMethod() {
    if (await this.paymentMethodContinueButton.isVisible()) {
      await this.paymentMethodContinueButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Click Continue ở bước Payment Information
   */
  async continuePaymentInfo() {
    if (await this.paymentInfoContinueButton.isVisible()) {
      await this.paymentInfoContinueButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Click Confirm để hoàn tất đơn hàng
   */
  async confirmOrder() {
    // Scroll đến nút Confirm để đảm bảo nó visible
    await this.confirmOrderButton.scrollIntoViewIfNeeded();
    await this.confirmOrderButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.confirmOrderButton.click();
    await this.page.waitForURL(/.*checkout\/completed/, { timeout: 15000 });
  }

  /**
   * Verify đơn hàng thành công
   */
  async verifyOrderSuccess() {
    await expect(this.successMessage).toContainText('Your order has been successfully processed!');
    await expect(this.orderDetails).toBeVisible();
  }

  /**
   * Thực hiện toàn bộ quy trình checkout với thông tin địa chỉ mặc định
   * @param billingAddress Thông tin địa chỉ thanh toán (optional)
   */
  async completeCheckout(billingAddress?: {
    country?: string;
    city?: string;
    address1?: string;
    address2?: string;
    zipCode?: string;
    phone?: string;
  }) {
    // Mặc định sử dụng thông tin địa chỉ Việt Nam
    const defaultAddress = {
      country: 'Viet Nam',
      city: 'Hanoi',
      address1: '123 Test Street',
      zipCode: '100000',
      phone: '0123456789',
      ...billingAddress
    };

    await this.acceptTermsAndCheckout();
    await this.fillBillingAddress(defaultAddress);
    await this.continueBillingAddress();
    await this.continueShippingAddress();
    await this.continueShippingMethod();
    await this.continuePaymentMethod();
    await this.continuePaymentInfo();
    await this.confirmOrder();
    await this.verifyOrderSuccess();
  }
}

export default CheckoutPage;
