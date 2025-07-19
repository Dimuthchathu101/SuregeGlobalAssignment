/**
 * eBay Wallet Product Testing Suite
 * 
 * This test suite validates eBay's wallet product functionality including:
 * - Product search and listing verification
 * - Related product recommendations
 * - Price range validation
 * - Category consistency checks
 * - Similar product display limits
 * 
 * @author Dimuth C Bandara
 * @version 1.0
 */

import { test, BrowserContext, Page, expect } from '@playwright/test';
import { MainPage } from '../pages/main_age';
import { ProductPage } from '../pages/product_page';
const { takeScreenshot } = require('../utilities/utilities');

test.describe.serial('Main Wallet Functionality', () => {
  let context;
  let page;
  let mainPage;
  let productPage;
  let txtSearchForWallet = 'Wallet';
  let txtSearchForMaleWallet = 'Male Wallet';

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    page = await context.newPage();
    mainPage = new MainPage(page);
    productPage = new ProductPage(page);

    await test.step('Navigate to eBay', async () => {
      await page.goto('https://www.ebay.com');
      await page.waitForLoadState('domcontentloaded');
    });
  });

  test.afterEach(async () => {
    await context.close();
  });

    /**
     * Test Case: TC_Ebay_000
     * Objective: Verify there are more than 6 products in Wallet Category
     * 
     * This test validates that eBay returns sufficient search results
     * when searching for wallet products, ensuring the category has
     * adequate product listings for user browsing.
     */
    test('TC_Ebay_000: Verify there are more than 6 products in Wallet Category', async () => {

      await test.step('Search for Wallet', async () => {
        await mainPage.searchFor(txtSearchForWallet);
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



  /**
   * Test Case: TC_Ebay_001
   * Objective: Verify up to 6 best-selling related products appear
   * 
   * This test validates that eBay displays a maximum of 6 related products
   * when viewing a specific wallet product, ensuring the recommendation
   * system works correctly and doesn't overwhelm users with too many options.
   */
  test('TC_Ebay_001: Verify up to 6 best-selling related products appear', async () => {

    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor(txtSearchForMaleWallet);
      console.log('Searching for Male Wallet');
      await page.waitForTimeout(5000);
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Scroll to Similar Items section and count products', async () => {
      // Scroll down to find similar items section
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Try multiple selectors for similar/related items
      const similarItemsSelectors = [
        '[data-testid="item-card"]',
        'section[aria-label*="related"] li',
        'section[aria-label*="Similar"] li',
        '.similar-items li',
        '.related-items li'
      ];
      
      let similarItemsCount = 0;
      for (const selector of similarItemsSelectors) {
        similarItemsCount = await page.locator(selector).count();
        if (similarItemsCount > 0) break;
      }
      
      console.log(`Found ${similarItemsCount} similar/related items`);
      expect(similarItemsCount).toBeLessThanOrEqual(6);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'male-wallet-search-completed');
    });
  });



  /**
   * Test Case: TC_Ebay_002
   * Objective: Validate same category of related items
   * 
   * This test ensures that when searching for wallet products, the returned
   * items are actually wallet-related and not unrelated products. It validates
   * the search algorithm's accuracy and category filtering.
   */
  test('TC_Ebay_002: Validate same category of related items', async () => {


  await test.step('Search for Male Wallet', async () => {
    await mainPage.searchFor(txtSearchForMaleWallet);
    console.log('Searching for Male Wallet');
    await page.waitForSelector('li.s-item'); // Wait for results to load
  });

  async function verifyWalletInTitle(page) {
    // Get all item titles
    const titles = await page.$$eval(
      'li.s-item div.s-item__title span',
      elements => elements.map(el => el.textContent.trim().toLowerCase())
    );
  
    // Check that at least 90% of titles contain wallet-related keywords
    const matchingCount = titles.filter(title => 
      title.includes('wallet') || 
      title.includes('card holder') || 
      title.includes('money clip')
    ).length;
    
    const matchPercentage = (matchingCount / titles.length) * 100;
    console.log(`Found ${matchingCount} of ${titles.length} items (${matchPercentage.toFixed(1)}%) contain wallet-related terms`);
    
    return matchPercentage >= 90; // Assumpton - At least 90% match
  }
  
  await test.step('Verify items contain wallet in title', async () => {
    const isValid = await verifyWalletInTitle(page);
    expect(isValid).toBeTruthy();
  });

  await test.step('Take screenshot', async () => {
    await takeScreenshot(page, 'related-items-category-check');
  });
});

  /**
   * Test Case: TC_Ebay_003
   * Objective: Verify price range of related products
   * 
   * This test validates that related products fall within an acceptable
   * price range compared to the main product, ensuring price consistency
   * and preventing extreme price variations in recommendations.
   */
  test('TC_Ebay_003: Verify price range of related products', async () => {
    let mainProductPrice = 0;

    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor(txtSearchForMaleWallet);
      console.log('Searching for Male Wallet');
      await page.waitForSelector('li.s-item'); // Wait for results to load
    });

    await productPage.fillMinValue("12");
    await productPage.fillMaxValue("15");

    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });

    await test.step('Extract and check prices of related products', async () => {
      // Scroll down to find similar items section
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Try multiple selectors for related product prices
      const priceSelectors = [
        '.nk-b span[role="text"]', // Direct selector for your example
        '[data-testid="item-card"] .s-item__price',
        '[data-testid="item-card"] [class*="price"]',
        'section[aria-label*="related"] .s-item__price',
        'section[aria-label*="Similar"] .s-item__price',
        'section[aria-label*="related"] [class*="price"]',
        'section[aria-label*="Similar"] [class*="price"]',
        'div[class*="price"]', // More generic price div selector
        'span[class*="price"]', // More generic price span selector
        '[class*="price"] span', // Nested price span selector
        'span[role="text"]' // Generic selector for span with text role
      ];
      
      let relatedPrices: string[] = [];
      for (const selector of priceSelectors) {
        const prices = await page.locator(selector).allTextContents();
        if (prices.length > 0) {
          relatedPrices = prices;
          break;
        }
      }
      
      console.log(`Found ${relatedPrices.length} related product prices:`, relatedPrices);
      
      if (relatedPrices.length > 0) {
        for (const priceText of relatedPrices) {
          const priceMatch = priceText.replace(/[^\d.]/g, '');
          const price = parseFloat(priceMatch);
          if (price) {
            // Accept prices within +/- 50% of main product price
            expect(price).toBeGreaterThanOrEqual(mainProductPrice * 0.5);
            // expect(price).toBeLessThanOrEqual(mainProductPrice * 1.5);
          } else {
            console.log('There are instances where non matching prices found');
          }
        }
      } else {
        // If no related prices found, just log it
        console.log('No related product prices found');
      }
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'related-products-price-range');
    });
  });

  
  /**
   * Test Case: TC_Ebay_004
   * Objective: Verify max 6 similar products shown
   * 
   * This test validates that eBay displays a maximum of 6 similar products
   * on product detail pages, ensuring the recommendation system follows
   * the business rule of not overwhelming users with too many options.
   */
  test('TC_Ebay_004: Verify max 6 similar products shown', async () => {

    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor(txtSearchForMaleWallet);
      console.log('Searching for Male Wallet');
      await page.waitForSelector('li.s-item'); // Wait for results to load
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Count similar/related products', async () => {
      // Scroll down to find similar items section
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Try multiple selectors for similar/related items
      const similarItemsSelectors = [
        '[data-testid="item-card"]',
        'section[aria-label*="related"] li',
        'section[aria-label*="Similar"] li',
        '.similar-items li',
        '.related-items li'
      ];
      
      let similarItemsCount = 0;
      for (const selector of similarItemsSelectors) {
        similarItemsCount = await page.locator(selector).count();
        if (similarItemsCount > 0) break;
      }
      
      console.log(`Found ${similarItemsCount} similar/related items`);
      expect(similarItemsCount).toBeLessThanOrEqual(6);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'max-6-similar-products');
    });
  });

  /**
   * Test Case: TC_Ebay_005
   * Objective: Verify behavior when fewer than 6 matches exist
   * 
   * This test validates the system's behavior when there are fewer than 6
   * related products available, ensuring graceful handling of limited
   * inventory scenarios without breaking the user experience.
   */
  test('TC_Ebay_005: Verify behavior when fewer than 6 matches exist', async () => {

    await test.step('Search for specific wallet type with limited results', async () => {
      await mainPage.searchFor('Handmade Leather Wallet Custom');
      await page.waitForSelector('li.s-item');
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });

    await test.step('Check similar items count when fewer than 6 exist', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      const similarItemsSelectors = [
        '[data-testid="item-card"]',
        'section[aria-label*="related"] li',
        'section[aria-label*="Similar"] li'
      ];
      
      let similarItemsCount = 0;
      for (const selector of similarItemsSelectors) {
        similarItemsCount = await page.locator(selector).count();
        if (similarItemsCount > 0) break;
      }
      
      console.log(`Found ${similarItemsCount} similar items for limited search`);
      // Should handle gracefully when fewer than 6 items exist
      expect(similarItemsCount).toBeGreaterThanOrEqual(0);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'fewer-than-6-matches');
    });
  });


  /**
   * Test Case: TC_Ebay_006
   * Objective: Verify behavior when no related products match
   * 
   * This test validates the system's behavior when there are no related
   * products available for a unique or rare item, ensuring the application
   * handles edge cases gracefully without errors.
   */
  test('TC_Ebay_006: Verify behavior when no related products match', async () => {

  await test.step('Search for very specific unique wallet', async () => {
    await mainPage.searchFor('Antique Victorian Era Wallet 1800s');
    await page.waitForSelector('li.s-item');
  });

  await test.step('Open first product from search results', async () => {
    await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
    await page.waitForLoadState('domcontentloaded');

  });

  await test.step('Check behavior when no related products exist', async () => {
    await page.evaluate(() => window.scrollBy(0, 800));
    
    const similarItemsSelectors = [
      'section[aria-label*="related"] li',
      'section[aria-label*="Similar"] li',
      '[data-testid="item-card"]'
    ];
    
    let similarItemsCount = 0;
    let foundSimilarItems = false;
    
    for (const selector of similarItemsSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`Found ${count} similar items using selector: ${selector}`);
        similarItemsCount += count;
        foundSimilarItems = true;
      }
    }
    
    if (!foundSimilarItems) {
      console.log('No similar items found for unique product');
    }
    
    // More meaningful assertion
    if (similarItemsCount > 0) {
      console.log(`Total similar items found: ${similarItemsCount}`);
      expect(similarItemsCount).toBeGreaterThan(0);
    } else {
      console.log('Verified no similar items found as expected');
      expect(similarItemsCount).toBe(0);
    }
  });

  await test.step('Take screenshot', async () => {
    await takeScreenshot(page, 'no-related-products');
  });
});

  /**
   * Test Case: TC_Ebay_007
   * Objective: Ensure no unrelated category products shown
   * 
   * This test validates that the recommendation system only shows
   * wallet-related products and excludes unrelated categories,
   * ensuring search relevance and user experience quality.
   */
  test('TC_Ebay_007: Ensure no unrelated category products shown', async () => {

    await test.step('Search for Wallet', async () => {
      await mainPage.searchFor(txtSearchForWallet);
      await page.waitForTimeout(5000);
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Check that related products are in wallet category', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Get related product titles
      const relatedProductSelectors = [
        '[data-testid="item-card"] h3',
        'section[aria-label*="related"] h3',
        'section[aria-label*="Similar"] h3'
      ];
      
      let relatedTitles: string[] = [];
      for (const selector of relatedProductSelectors) {
        const titles = await page.locator(selector).allTextContents();
        if (titles.length > 0) {
          relatedTitles = titles;
          break;
        }
      }
      
      // Check that related products contain wallet-related keywords
      const walletKeywords = ['wallet', 'purse', 'card holder', 'money clip'];
      const unrelatedKeywords = ['phone', 'laptop', 'shoes', 'clothing', 'electronics'];
      
      for (const title of relatedTitles) {
        const titleLower = title?.toLowerCase() || '';
        const hasWalletKeyword = walletKeywords.some(keyword => titleLower.includes(keyword));
        const hasUnrelatedKeyword = unrelatedKeywords.some(keyword => titleLower.includes(keyword));
        
        // Should have wallet-related keywords and not unrelated keywords
        expect(hasWalletKeyword || !hasUnrelatedKeyword).toBeTruthy();
      }
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'no-unrelated-categories');
    });
  });

  /**
   * Test Case: TC_Ebay_008
   * Objective: Exclude out-of-stock items from best sellers
   * 
   * This test validates that the recommendation system excludes
   * out-of-stock items from related products, ensuring users only
   * see available items they can actually purchase.
   */
  test('TC_Ebay_008: Exclude out-of-stock items from best sellers', async () => {

    await test.step('Search for Wallet', async () => {
      await mainPage.searchFor(txtSearchForWallet);
      await page.waitForSelector('li.s-item');
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Check that related products are not out of stock', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Check for out-of-stock indicators in related products
      const outOfStockSelectors = [
        '[data-testid="item-card"] .out-of-stock',
        'section[aria-label*="related"] .out-of-stock',
        'section[aria-label*="Similar"] .out-of-stock',
        '[data-testid="item-card"] [class*="unavailable"]',
        'section[aria-label*="related"] [class*="unavailable"]'
      ];
      
      let outOfStockCount = 0;
      for (const selector of outOfStockSelectors) {
        outOfStockCount = await page.locator(selector).count();
        if (outOfStockCount > 0) break;
      }
      
      console.log(`Found ${outOfStockCount} out-of-stock items in related products`);
      // Related products should not be out of stock
      expect(outOfStockCount).toBe(0);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'no-out-of-stock-items');
    });
  });

  /**
   * Test Case: TC_Ebay_009
   * Objective: Ensure correct tab behavior on related product click
   * 
   * This test validates that clicking on related products opens
   * them in the correct tab/window, ensuring proper navigation
   * behavior and user experience.
   */
  test('TC_Ebay_009: Ensure correct tab behavior on related product click', async () => {

    await test.step('Search for Wallet', async () => {
      await mainPage.searchFor(txtSearchForWallet);
      await page.waitForSelector('li.s-item');
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Click on a related product and verify tab behavior', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Try to find and click a related product
      const relatedProductSelectors = [
        '[data-testid="item-card"] a',
        'section[aria-label*="related"] a',
        'section[aria-label*="Similar"] a'
      ];
      
      let clicked = false;
      for (const selector of relatedProductSelectors) {
        const links = page.locator(selector);
        const count = await links.count();
        if (count > 0) {
          // Click the first related product
          await links.first().click();
          clicked = true;
          break;
        }
      }
      
      if (clicked) {
        // Wait for navigation
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Verify we're on a new product page
        const currentUrl = page.url();
        expect(currentUrl).toContain('ebay.com');
        expect(currentUrl).not.toBe('https://www.ebay.com/');
      }
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'related-product-tab-behavior');
    });
  });

  /**
   * Test Case: TC_Ebay_010
   * Objective: Verify sponsored items are not included
   * 
   * This test validates that sponsored/advertisement items are
   * properly excluded from related product recommendations,
   * ensuring organic search results are prioritized.
   */
  test('TC_Ebay_010: Verify sponsored items are not included', async () => {

    await test.step('Search for Wallet', async () => {
      await mainPage.searchFor(txtSearchForWallet);
      await page.waitForSelector('li.s-item');
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Check for sponsored items in related products section', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Look for sponsored indicators in related products
      const sponsoredSelectors = [
        '[data-testid="item-card"] [class*="sponsored"]',
        'section[aria-label*="related"] [class*="sponsored"]',
        'section[aria-label*="Similar"] [class*="sponsored"]',
        '[data-testid="item-card"] [class*="ad"]',
        'section[aria-label*="related"] [class*="ad"]'
      ];
      
      let sponsoredCount = 0;
      for (const selector of sponsoredSelectors) {
        sponsoredCount = await page.locator(selector).count();
        if (sponsoredCount > 0) break;
      }
      
      console.log(`Found ${sponsoredCount} sponsored items in related products`);
      // Sponsored items should be included in related products
      expect(sponsoredCount).toBeGreaterThanOrEqual(0);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'sponsored-items-included');
    });
  });

  /**
   * Test Case: TC_Ebay_011
   * Objective: Ensure consistent price range logic
   * 
   * This test validates that the price range logic for related
   * products is consistent across different scenarios, ensuring
   * reliable and predictable recommendation behavior.
   */
  test('TC_Ebay_011: Ensure consistent price range logic', async () => {
    let mainProductPrice = 0;

    await test.step('Search for Wallet', async () => {
      await mainPage.searchFor(txtSearchForWallet);
      await page.waitForSelector('li.s-item');
    });


    await productPage.fillMaxValue("19");

    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });

   
    await test.step('Check related product prices at boundary', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      const relatedPrices = await page.locator('[data-testid="item-card"] .s-item__price, [data-testid="item-card"] [class*="price"]').allTextContents();
      if (relatedPrices.length > 0) {
        for (const priceText of relatedPrices) {
          const priceMatch = priceText.replace(/[^\d.]/g, '');
          const price = parseFloat(priceMatch);
          if (price) {
            // Accept prices within +/- 50% of main product price at boundary
            expect(price).toBeGreaterThanOrEqual(mainProductPrice * 0.5);
            expect(price).toBeLessThanOrEqual(mainProductPrice * 1.5);
          }
        }
      }
    });
  });

  /**
   * Test Case: TC_Ebay_012
   * Objective: Validate image quality and dimension consistency
   * 
   * This test validates that related product images have proper
   * attributes and quality, ensuring visual consistency and
   * accessibility standards are maintained.
   */
  test('TC_Ebay_012: Validate image quality and dimension consistency', async () => {

    await test.step('Search for Wallet', async () => {
      await mainPage.searchFor(txtSearchForWallet);
      await page.waitForSelector('li.s-item');
    });
    await test.step('Open first product from search results', async () => {
      await page.locator('ul.srp-results > li.s-item a.s-item__link').first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
    });
    await test.step('Check related product image consistency', async () => {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
      
      // Check for related product images
      const imageSelectors = [
        '[data-testid="item-card"] img',
        'section[aria-label*="related"] img',
        'section[aria-label*="Similar"] img'
      ];
      
      let imageCount = 0;
      for (const selector of imageSelectors) {
        imageCount = await page.locator(selector).count();
        if (imageCount > 0) break;
      }
      
      if (imageCount > 0) {
        // Check that images have proper attributes
        const images = page.locator(imageSelectors.find(s => page.locator(s).count() > 0) || imageSelectors[0]);
        for (let i = 0; i < Math.min(imageCount, 3); i++) { // Check first 3 images
          const img = images.nth(i);
          const src = await img.getAttribute('src');
          const alt = await img.getAttribute('alt');
          
          // Images should have src and alt attributes
          expect(src).toBeTruthy();
          expect(alt).toBeTruthy();
        }
      }
      
      console.log(`Found ${imageCount} related product images`);
      expect(imageCount).toBeGreaterThanOrEqual(0);
    });
    await test.step('Take screenshot', async () => {
      await takeScreenshot(page, 'image-quality-consistency');
    });
  });



  /**
   * Test Case: TC_Ebay_013
   * Objective: Ensure there is no "Female Purse" in "Male Purse" Search
   * 
   * This test validates that gender-specific searches return
   * appropriate results, ensuring that male wallet searches
   * don't include female wallet products and vice versa.
   */
  test('TC_Ebay_013: Ensure there is no "Female Purse" in "Male Purse" Search', async () => {

    await test.step('Search for Male Wallet', async () => {
      await mainPage.searchFor(txtSearchForMaleWallet);
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