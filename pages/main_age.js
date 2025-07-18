// pages/mainPage.js
const { expect } = require('@playwright/test');

class MainPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.searchInput = page.locator("//input[@id='gh-ac']");
    this.mainSearchButton = page.locator("//button[@id='gh-search-btn']");

    // plus button
    this.plusButton = page.locator("//div[normalize-space()='Price']//div[@class='x-refine-toggle']");
    this.minValue = page.locator("/html[1]/body[1]/div[5]/div[3]/ul[1]/li[1]/ul[1]/li[3]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/span[1]/span[1]/input[1]");
    this.maxValue = page.locator("/html[1]/body[1]/div[5]/div[3]/ul[1]/li[1]/ul[1]/li[3]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]/div[1]/span[1]/span[1]/input[1]");
  }

  // Method to perform a search
  async searchFor(text) {
    await this.searchInput.fill(text);  // Fill the input field
    await this.mainSearchButton.click();  // Click the search button
  }

  // Optional: Separate method to click the button alone
  async clickOnSearchButton() {
    await this.mainSearchButton.click();
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

module.exports = { MainPage };