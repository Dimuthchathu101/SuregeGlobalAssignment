// pages/mainPage.js
const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.searchInput = page.locator("//input[@id='gh-ac']");
    this.mainSearchButton = page.locator("//button[@id='gh-search-btn']");

    // plus button
    this.plusButton = page.locator('//div[contains(@class, "x-refine-toggle")][.//*[contains(text(), "Price")]]');
    this.minValue = page.locator("//input[@id='s0-55-0-9-8-0-1-2-0-2-1-8[2]-@textrange-@beginParamValue-textbox']");
    this.maxValue = page.locator("//input[@id='s0-55-0-9-8-0-1-2-0-2-1-8[2]-@textrange-@endParamValue-textbox']");
  }


  // Click the plus button in the price section
  async clickPlusButton() {
    await this.plusButton.click();
  }

  // Fill the minimum value input
  async fillMinValue(value) {
    await this.minValue.fill(value);
  }

  // Fill the maximum value input
  async fillMaxValue(value) {
    await this.maxValue.fill(value);
  }
}

module.exports = { ProductPage };