# Telenor Playwright Automation

## Overview

This project automates the Telenor broadband user journey using Playwright, Cucumber, and TypeScript.

The automated flow covers:

- Navigate to telenor.se
- Click Handla
- Select Bredband
- Enter broadband address
- Verify featured products are displayed

## Framework

Technology stack:

- Playwright - UI automation
- Cucumber - BDD framework
- TypeScript - Programming language
- Allure - Test reporting
- GitHub Actions - CI execution

## Project Structure
features
 └── Feature files

src
 ├── pages
 ├── step-definitions
 ├── support
 ├── test-data
 └── utils

.github
 └── workflows

 ## Local Execution

Install dependencies:

npm install


Install browsers:

npx playwright install


Run tests:

npm test

## Allure Report

Generate report:

npm run allure:generate


Open report:

npm run allure:open

## Assumptions

- The Telenor website is available during test execution.
- The broadband address search supports "Kungsgatan 103, Uppsala".
- The featured-product-grid is displayed after successful address selection.
- The test depends on the availability and behavior of the external Telenor website.
- No authentication is required for the tested journey.

## CI/CD

GitHub Actions executes tests on:

- Push events
- Pull requests

The pipeline:

1. Checks out code
2. Installs Node.js
3. Installs dependencies
4. Installs Playwright browsers
5. Executes tests
6. Generates Allure report
7. Uploads report artifact

