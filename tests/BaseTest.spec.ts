import { test, BrowserContext, Page, expect } from '@playwright/test';
import { MainPage } from '../pages/main_age';
import { ProductPage } from '../pages/product_page';
const { takeScreenshot } = require('../utilities/utilities');

test.describe.serial('Main Wallet Functionality', () => {
  let context;
  let page;
  let mainPage;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    page = await context.newPage();
    mainPage = new MainPage(page);
  });

  test.afterEach(async () => {
    await context.close();
  });

    // TC_Ebay_000
    test('TC_Ebay_000: Verify there are more than 6 products in Wallet Category', async () => {
      await test.step('Navigate to eBay', async () => {
        await page.goto('https://www.ebay.com');
        await page.waitForTimeout(5000);
      });
      await test.step('Search for Wallet', async () => {
        await mainPage.searchFor('Wallet');
        await page.waitForTimeout(5000);
      });
      await test.step('Count products in Wallet category', async () => {
        // eBay search results use  for each product
        // const productCount = await page.locator("ul.srp-results > li.s-item h3").count();
        const allSimilarItems = await page.locator('//li[contains(@class, "s-item")]').count();
        console.log(`Search Results: ${allSimilarItems}`);
        expect(allSimilarItems).toBeGreaterThan(6);
      });
      await test.step('Take screenshot', async () => {
        await takeScreenshot(page, 'wallet-category-product-count');
      });
    });



  // TC_Ebay_001
  test('TC_Ebay_001: Verify up to 6 best-selling related products appear', async () => {
    // 1. Search for "wallet"
    await test.step('Navigate to eBay', async () => {
      await page.goto('https://www.ebay.com');
      await page.waitForTimeout(5000);
    });
    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor('Male Wallet');
      console.log('Searching for Male Wallet');
      await page.waitForTimeout(5000);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'male-wallet-search-completed');
    });
    // 2. Click on any main product from the result
    // 3. Scroll to "Similar Items" section
    // TODO: Implement logic
  });

  // TC_Ebay_002
  test('TC_Ebay_002: Validate same leaf category of related items', async () => {
    // 1. Search for "wallet"
    // 2. Open a product from the search result
    // TODO: Validate same leaf category of related items
  });

  // TC_Ebay_003
  test('TC_Ebay_003: Verify price range of related products', async () => {
    // 1. Search and open a product priced at $15
    // 2. Check prices of related products
    // TODO: Implement logic
  });

  // TC_Ebay_004
  test('TC_Ebay_004: Verify max 6 best seller products shown', async () => {
    // 1. Search for "wallet" with more than 6 related best sellers
    // 2. Open the main product
    // TODO: Implement logic
  });

  // TC_Ebay_005
  test('TC_Ebay_005: Verify behavior when fewer than 6 matches exist', async () => {
    // 1. Search for a wallet with fewer than 6 related best sellers
    // 2. Open the main product page
    // TODO: Implement logic
  });

  // TC_Ebay_006
  test('TC_Ebay_006: Verify behavior when no related products match', async () => {
    // 1. Search for a rare wallet (unique or handmade)
    // 2. Open the main product
    // TODO: Implement logic
  });

  // TC_Ebay_007
  test('TC_Ebay_007: Ensure no unrelated category products shown', async () => {
    // 1. Search for "wallet"
    // 2. Open product
    // 3. Inspect categories of related products
    // TODO: Implement logic
  });

  // TC_Ebay_008
  test('TC_Ebay_008: Exclude out-of-stock items from best sellers', async () => {
    // 1. Mark related wallet product as out-of-stock
    // 2. Search and open main product page
    // TODO: Implement logic
  });

  // TC_Ebay_009
  test('TC_Ebay_009: Ensure correct tab behavior on related product click', async () => {
    // 1. From wallet main product page, click a related best seller
    // TODO: Implement logic
  });

  // TC_Ebay_010
  test('TC_Ebay_010: Verify sponsored items are not included', async () => {
    // 1. Search "wallet"
    // 2. Open the Product
    // 3. Review best seller section (Similar items)
    // TODO: Implement logic
  });

  // TC_Ebay_011
  test('TC_Ebay_011: Ensure consistent price range logic', async () => {
    // 1. Search for wallet at boundary (e.g., $19)
    // 2. Click on one time
    // 3. Check related product prices
    // TODO: Implement logic
  });

  // TC_Ebay_012
  test('TC_Ebay_012: Validate image quality and dimension consistency', async () => {
    // 1. Search for "wallet"
    // 2. Open product page
    // 3. Inspect related product images
    // TODO: Implement logic
  });



  // TC_Ebay_13
  test('TC_Ebay_13: Ensure there is no "Female Purse" in "Male Purse" Search', async () => {
    await test.step('Navigate to eBay', async () => {
      await page.goto('https://www.ebay.com');
      await page.waitForTimeout(5000);
    });
    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor('Male Wallet');
      await page.waitForTimeout(5000);
    });
    await test.step('Check that no Female Wallet appears in results', async () => {
      // Check that no product title contains 'Female Purse'
      const titles = await page.locator('ul.srp-results > li.s-item h3').allTextContents();
      const hasFemalePurse = titles.some(title => title.toLowerCase().includes('female wallet'));
      expect(hasFemalePurse).toBeFalsy();
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'male-wallet-no-female-wallet');
    });
  });
});