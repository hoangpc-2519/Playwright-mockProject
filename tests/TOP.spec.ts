// Sử dụng custom fixtures thay vì import từ '@playwright/test'
import { test, expect } from '../fixtures/pageFixtures';

const VALID_EMAIL = 'phan.chinh.hoang@sun-asterisk.com';
// const VALID_PASSWORD = 'hoang1'; // Không cần password khi sử dụng auth.json
test.use({ storageState: 'auth.json' });

test('Thêm sản phẩm vào giỏ hàng thành công với trạng thái đã đăng nhập', async ({ page, productPage }) => {
  // productPage đã được tự động khởi tạo qua fixture

  await page.goto('https://demowebshop.tricentis.com/');
  
  // Không cần login thủ công khi sử dụng auth.json
  // await loginPage.clickLoginLink();
  // await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
  
  const accountEmail = page.locator('.account').first();
  await expect(accountEmail).toContainText(VALID_EMAIL);

  const { initialQty, newQty, successText } = await productPage.addFirstProductToCart();
  expect(successText).toMatch("added to your shopping cart");
  expect(newQty).toBe(initialQty + 1);
});

test('Logout tài khoản thành công', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/');
  
  // Không cần login thủ công khi sử dụng auth.json
  // await loginPage.clickLoginLink();
  // await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
  
  const accountEmail = page.locator('.account').first();
  await expect(accountEmail).toContainText(VALID_EMAIL);
  
  await page.click('a[href="/logout"]');
  await page.waitForURL(/.*\/$/);
  
  const loginLink = page.locator('a[href="/login"]');
  await expect(loginLink).toBeVisible();
  await expect(page.locator('a[href="/logout"]')).not.toBeVisible();
});

