import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly accountEmail: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator('a[href="/login"]');
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.loginButton = page.locator('input[value="Log in"]');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.accountEmail = page.locator('.account').first();
    this.errorMessage = page.locator('.validation-summary-errors');
  }

  async goto() {
    await this.page.goto('https://demowebshop.tricentis.com/');
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    
    await this.loginButton.click();
  }

  async navigateAndLogin(email: string, password: string, rememberMe: boolean = false) {
    await this.goto();
    await this.clickLoginLink();
    await this.login(email, password, rememberMe);
  }
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }
}
