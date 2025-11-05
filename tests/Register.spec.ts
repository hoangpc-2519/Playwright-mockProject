import { test, expect } from '@playwright/test';

test('Đăng ký tài khoản thành công', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/');
  await page.locator('a[href="/register"]').click();
  await page.locator('#gender-male').click();
  await page.locator('#FirstName').fill('hoang');
  await page.locator('#LastName').fill('hoang');
  await page.locator('#Email').fill('phan.chinh.hoang@sun-asterisk.com');
  await page.locator('#Password').fill('hoang1');
  await page.locator('#ConfirmPassword').fill('hoang1');
  await page.locator('#register-button').click();
  await expect(page.locator('.result')).toContainText('Your registration completed', { timeout: 5000 });
  await expect(page.locator('.account')).toContainText('phan.chinh.hoang@sun-asterisk.com');
});
