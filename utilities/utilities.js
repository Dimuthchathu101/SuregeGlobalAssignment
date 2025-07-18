const fs = require('fs');
const path = require('path');

/**
 * Takes a screenshot using Playwright's page object, ensuring the screenshots directory exists and filename is unique.
 * @param {import('playwright').Page} page - Playwright page object
 * @param {string} baseName - Base name for the screenshot file
 * @param {object} [options] - Additional Playwright screenshot options
 * @returns {Promise<string>} - The path to the saved screenshot
 */
async function takeScreenshot(page, baseName, options = {}) {
  const dir = path.resolve('screenshots');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${baseName}-${timestamp}.png`;
  const filePath = path.join(dir, filename);
  await page.screenshot({ path: filePath, fullPage: true, ...options });
  return filePath;
}

module.exports = { takeScreenshot };
