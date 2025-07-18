// pages/mainPage.js
const { expect } = require('@playwright/test');

class MainPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.searchInput = page.locator("//input[@id='gh-ac']");
    this.mainSearchButton = page.locator("//button[@id='gh-search-btn']");
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
}

module.exports = { MainPage };