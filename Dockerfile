# Use official Node.js LTS image
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Install Playwright browsers (already present in base image, but safe to re-run for updates)
RUN npx playwright install --with-deps

# Expose Allure report port (optional, for allure:serve)
EXPOSE 5000

# Default command: run tests and generate Allure report
CMD ["sh", "-c", "npm test && npm run allure:serve"] 