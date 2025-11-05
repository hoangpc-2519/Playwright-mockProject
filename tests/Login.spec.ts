import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test('Đăng nhập tài khoản thành công', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.clickLoginLink();
  await expect(page).toHaveURL(/.*login/);
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await loginPage.login('phan.chinh.hoang@sun-asterisk.com', 'hoang1');
  await expect(loginPage.accountEmail).toContainText('phan.chinh.hoang@sun-asterisk.com');
});
