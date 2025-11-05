// Sử dụng custom fixtures thay vì import từ '@playwright/test'
import { test, expect } from '../fixtures/pageFixtures';

const VALID_EMAIL = 'phan.chinh.hoang@sun-asterisk.com';
test.use({ storageState: 'auth.json' });

// Sử dụng test.describe.serial() để chạy các test theo thứ tự, tránh xung đột cart
test.describe.serial('Shopping Cart Tests', () => {

test('Tăng số lượng mua của 1 sản phẩm trong giỏ hàng thành công với trạng thái đã đăng nhập', async ({ page, productPage }) => {
  // productPage đã được tự động khởi tạo qua fixture

  await page.goto('https://demowebshop.tricentis.com/');
  const accountEmail = page.locator('.account').first();
  await expect(accountEmail).toContainText(VALID_EMAIL);

  // Luôn thêm sản phẩm mới để đảm bảo test độc lập
  await productPage.addFirstProductToCart();
  await page.waitForTimeout(1500);

  // Vào trang giỏ hàng
  await page.locator('a[href="/cart"]').first().click();
  await expect(page).toHaveURL(/.*cart/);
  await page.waitForLoadState('networkidle');

  // Lấy thông tin sản phẩm đầu tiên
  const qtyInput = page.locator('.cart input.qty-input').first();
  const unitPriceLocator = page.locator('.cart .product-unit-price').first();
  
  await expect(qtyInput).toBeVisible();
  await expect(unitPriceLocator).toBeVisible();
  
  // Lấy giá hiện tại
  const unitPriceText = (await unitPriceLocator.textContent())?.trim() || '';
  const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]/g, ''));
  
  // Nhập số lượng mới cụ thể (khác 0)
  const newQty = 5; // Có thể thay đổi số lượng tùy ý
  await qtyInput.clear();
  await qtyInput.fill(String(newQty));

  // Click nút Update shopping cart
  const updateButton = page.locator('input[value="Update shopping cart"]');
  await expect(updateButton).toBeVisible();
  await updateButton.click();
  
  // Chờ trang reload và cập nhật
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Verify số lượng đã được cập nhật
  const updatedQtyInput = page.locator('.cart input.qty-input').first();
  await expect(updatedQtyInput).toBeVisible();
  const updatedQtyText = await updatedQtyInput.inputValue();
  const updatedQty = parseInt(updatedQtyText, 10);
  
  // Kiểm tra số lượng đã tăng đúng
  expect(updatedQty).toBe(newQty);
  
  // Verify giá subtotal đã được cập nhật đúng
  const updatedSubtotalLocator = page.locator('.cart .product-subtotal').first();
  await expect(updatedSubtotalLocator).toBeVisible();
  const updatedSubtotalText = (await updatedSubtotalLocator.textContent())?.trim() || '';
  const updatedSubtotal = parseFloat(updatedSubtotalText.replace(/[^0-9.]/g, ''));
  
  const expectedSubtotal = unitPrice * newQty;
  expect(updatedSubtotal).toBe(expectedSubtotal);
});


test('Mua hàng thành công với trạng thái đã đăng nhập', async ({ page, productPage, checkoutPage }) => {
  // productPage và checkoutPage đã được tự động khởi tạo qua fixture

  await page.goto('https://demowebshop.tricentis.com/');
  
  // Kiểm tra đã đăng nhập
  const accountEmail = page.locator('.account').first();
  await expect(accountEmail).toContainText(VALID_EMAIL);

  // Luôn thêm sản phẩm mới để test độc lập
  await productPage.addFirstProductToCart();
  await page.waitForTimeout(1500);
  
  // Verify giỏ hàng có sản phẩm
  const currentQty = await productPage.getCartQuantity();
  expect(currentQty).toBeGreaterThan(0);

  // Vào trang giỏ hàng
  await checkoutPage.gotoCart();

  // Thực hiện checkout với thông tin địa chỉ mặc định
  await checkoutPage.completeCheckout();
});


test('Xóa 1 sản phẩm trong giỏ hàng thành công với trạng thái đã đăng nhập', async ({ page, productPage }) => {
  // productPage đã được tự động khởi tạo qua fixture

  await page.goto('https://demowebshop.tricentis.com/');
  
  const accountEmail = page.locator('.account').first();
  await expect(accountEmail).toContainText(VALID_EMAIL);

  // Kiểm tra và thêm sản phẩm nếu cart trống (vì test trước đó đã checkout)
  const initialQty = await productPage.getCartQuantity();
  if (initialQty === 0) {
    await productPage.addFirstProductToCart();
    await page.waitForTimeout(1500);
  }

  // Vào trang giỏ hàng
  await page.locator('a[href="/cart"]').first().click();
  await expect(page).toHaveURL(/.*cart/);
  await page.waitForLoadState('networkidle');

  // Lấy thông tin sản phẩm đầu tiên
  const firstRowLocator = page.locator('.cart tbody tr').first();
  const qtyInput = firstRowLocator.locator('input.qty-input');
  await expect(qtyInput).toBeVisible();

  const productNameLocator = firstRowLocator.locator('.product-name');
  const productName = await productNameLocator.textContent();

  // Đặt số lượng = 0 để xóa sản phẩm
  await qtyInput.fill('0');

  // Click nút Update shopping cart
  const updateButton = page.locator('input[value="Update shopping cart"]');
  await expect(updateButton).toBeVisible();
  await updateButton.click();

  // Chờ trang cập nhật
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Kiểm tra xem giỏ hàng có trống không
  const emptyCartMessage = page.locator('.order-summary-content:has-text("Your Shopping Cart is empty!")');
  const isCartEmpty = await emptyCartMessage.isVisible();

  if (isCartEmpty) {
    // Giỏ hàng đã trống - sản phẩm đã bị xóa thành công
    expect(isCartEmpty).toBe(true);
  } else {
    // Kiểm tra sản phẩm cụ thể đã bị xóa chưa
    const rowsAfterUpdate = page.locator('.cart tbody tr');
    const rowCount = await rowsAfterUpdate.count();

    let itemStillExists = false;
    for (let i = 0; i < rowCount; i++) {
      const nameInRow = await rowsAfterUpdate.nth(i).locator('.product-name').textContent();
      if (nameInRow?.includes(productName?.trim() || '')) {
        itemStillExists = true;
        break;
      }
    }
    expect(itemStillExists).toBe(false);
  }
});

}); // Kết thúc test.describe.serial()