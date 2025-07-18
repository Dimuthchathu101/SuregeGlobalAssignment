import { test, BrowserContext, Page, expect } from '@playwright/test';
import { MainPage } from '../pages/main_age';
import { ProductPage } from '../pages/product_page';
const { takeScreenshot } = require('../utilities/utilities');

test.describe('Main Wallet Functionality', () => {
  test('should search for Male Wallet and take a screenshot', async ({ browser }) => {
    // Create isolated context and page for this E2E test
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    const mainPage = new MainPage(page);
    const productPage = new ProductPage(page);

    await test.step('Navigate to eBay', async () => {
      await page.goto('https://www.ebay.com');
      await page.waitForTimeout(5000); // Wait for page to load
    });

    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor('Male Wallet');
      console.log('Searching for Male Wallet');
      await page.waitForTimeout(5000); // Wait for results
    });

    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'male-wallet-search');
    });

    await test.step('Set Price Value', async () => {
      // await productPage.clickPlusButton();
      await page.waitForTimeout(5000);
      await productPage.fillMinValue("12");
      await productPage.fillMaxValue("20");
    });

    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'Setting Price');
    });

    await context.close();
  });

});