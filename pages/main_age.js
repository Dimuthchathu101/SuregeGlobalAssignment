// pages/loginPage.js
const { expect } = require('@playwright/test');

class MainPage {
  constructor(page) {
    this.page = page;
    // this.accoutingButton = page.locator("//a[@id='result_app_9']//img[@class='o_app_icon rounded-3']")
    // this.accountingHeader = page.locator("//span[@class='o_menu_brand d-flex ms-3 pe-0']");

  // customer Invoices
    // this.newCustomerInvocie = page.locator("//button[@class='btn btn-primary oe_kanban_action'][normalize-space()='New']");



  // Vendor Bills

  // Bank 

  // Miscelaneous Operations

  // Cash
  }

  async moveToAccountingPage() {
    await this.accoutingButton.click()
  }

  async verifyHeaderVisibility() {
    await expect(this.accountingHeader).toBeVisible();
  }

  async clickonNewCustomerInvoice(){
    await this.newCustomerInvocie.click()
  }

  async enterCustomerName() {
  await page.getByRole('combobox', { name: 'Customer' }).fill('Dimuth');
  await page.getByRole('option', { name: 'Dimuth C Bandara' }).click();
  }




}

module.exports = { MainPage };