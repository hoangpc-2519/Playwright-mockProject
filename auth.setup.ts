import { chromium } from '@playwright/test';
export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://demowebshop.tricentis.com/');
  await page.click('a[href="/login"]');
  await page.fill('#Email', 'phan.chinh.hoang@sun-asterisk.com');
  await page.fill('#Password', 'hoang1');
  await page.click('input[value="Log in"]');
  await page.waitForSelector('.account:has-text("phan.chinh.hoang@sun-asterisk.com")', { timeout: 10000 });
  await context.storageState({ path: 'auth.json' });
  await browser.close();
}
