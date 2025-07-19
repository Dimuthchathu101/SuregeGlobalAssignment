# SuregeGlobalAssignment - eBay Wallet Product Testing

A comprehensive Playwright-based automation testing framework for validating eBay's wallet product functionality and related product recommendations.

## 🎯 Project Overview

This project implements automated test scenarios to validate eBay's wallet category functionality, including:
- Product search and listing verification
- Related product recommendations
- Price range validation
- Category consistency checks
- Similar product display limits

## 🏗️ Project Structure

```
SuregeGlobalAssignment/
├── tests/
│   └── BaseTest.spec.ts          # Main test suite with all test scenarios
├── pages/
│   ├── main_age.js               # Page Object Model for main eBay page
│   └── product_page.js           # Page Object Model for product pages
├── utilities/
│   └── utilities.js              # Utility functions (screenshots, etc.)
├── screenshots/                  # Test execution screenshots
├── allure-results/              # Allure test results
├── playwright-report/           # Playwright HTML reports
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies and scripts
└── Dockerfile                   # Docker configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dimuthchathu101/SuregeGlobalAssignment.git
cd SuregeGlobalAssignment
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Allure Report Generation
```bash
npm run test
npm run allure:serve
```

### Run Tests in Sequential Mode
The tests are configured to run sequentially (not in parallel) as per project requirements.

## 📋 Test Scenarios

The test suite includes the following scenarios:

### TC_Ebay_000: Product Count Verification
- **Objective**: Verify there are more than 6 products in Wallet Category
- **Steps**: Navigate to eBay → Search for "Wallet" → Count products

### TC_Ebay_001: Best-Selling Products Display
- **Objective**: Verify up to 6 best-selling related products appear
- **Steps**: Search for "Male Wallet" → Validate related product display

### TC_Ebay_002: Category Consistency
- **Objective**: Validate same category of related items
- **Steps**: Search wallet → Open product → Check related item categories

### TC_Ebay_003: Price Range Validation
- **Objective**: Verify price range of related products
- **Steps**: Find product around $15 → Validate related product prices within ±50% range

### TC_Ebay_004: Similar Products Limit
- **Objective**: Verify max 6 similar products shown
- **Steps**: Open product page → Count similar products → Ensure ≤6 items

### Additional Test Cases (TC_Ebay_005 to TC_Ebay_013)
- Edge case handling for fewer than 6 matches
- No related products scenarios
- Category exclusion validation
- Out-of-stock item handling
- Tab behavior verification
- Sponsored items inclusion
- Price range boundary testing

## 🛠️ Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Browser**: Chromium (headless: false for debugging)
- **Viewport**: 1920x1080
- **Reporters**: Allure and HTML
- **Test Directory**: `./tests`
- **Screenshots**: Enabled on failure

### Test Execution Settings
- **Parallel Execution**: Disabled (sequential execution)
- **Retries**: 2 on CI, 0 locally
- **Workers**: 1 on CI for stability

## 📊 Reporting

### Allure Reports
Generate and view detailed test reports:
```bash
npm run allure:serve
```

### Screenshots
- Automatic screenshots taken during test execution
- Stored in `screenshots/` directory with timestamps
- Full-page screenshots for debugging

## 🏗️ Page Object Model

### MainPage (`pages/main_age.js`)
- Search functionality
- Price filter controls
- Navigation elements

### ProductPage (`pages/product_page.js`)
- Product-specific interactions
- Related product handling
- Price range controls

## 🛠️ Utilities

### Screenshot Utility (`utilities/utilities.js`)
- Automatic screenshot capture
- Timestamp-based naming
- Full-page screenshots
- Directory management

## 🐳 Docker Support

```

## 📝 Test Data

- **Search Terms**: "Wallet", "Male Wallet"
- **Price Range**: Around $15 (±$2 tolerance)
- **Product Count**: >6 products in category
- **Similar Products**: ≤6 items in recommendations

## 🔧 Troubleshooting

### Common Issues

1. **Browser Installation**: If Playwright browsers aren't installed:
   ```bash
   npx playwright install
   ```

2. **Screenshot Directory**: If screenshots fail to save:
   ```bash
   mkdir -p screenshots
   ```

3. **Allure Report Issues**: If Allure reports don't generate:
   ```bash
   npm install -g allure-commandline
   ```

## 📈 CI/CD Integration

The project is configured for CI/CD environments:
- Sequential test execution for stability
- Retry mechanism for flaky tests
- Allure report generation
- Screenshot capture for debugging


## 👥 Authors

- **DimuthCBandara(dimuthchathu101/dimuthcbandara97)** - Initial work

## 🔗 Repository

- **GitHub**: https://github.com/Dimuthchathu101/SuregeGlobalAssignment
- **Issues**: https://github.com/Dimuthchathu101/SuregeGlobalAssignment/issues
