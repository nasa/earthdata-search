import { test, expect } from 'playwright-test-coverage'

import { login } from '../../support/login'

test.describe('Joyride Tour Navigation', () => {
  test.beforeEach(async ({ page, context }) => {
    await login(context)
    await page.goto('/search')
  })

  test('should navigate through the Joyride tour', async ({ page }) => {
    // Start the tour by clicking the "Start Tour" button
    await page.click('button:has-text("Start Tour")')

    // Expect the first step to show the "Take the tour" button
    await expect(page.locator('.tour-heading')).toHaveText('Welcome to Earthdata Search!')

    // Click the "Take the tour" button to proceed
    await page.click('button:has-text("Take the tour")')

    await page.waitForTimeout(500)

    // Wait for the second step to load and ensure the text is visible
    await expect(page.locator('.tour-content').first()).toContainText('This area contains the filters used when searching for collections')

    await page.waitForTimeout(500)
    await page.locator('.tour-buttons button:has-text("Next")').click()

    await page.waitForTimeout(500)

    // Wait for the next step and verify its content
    await expect(page.locator('.tour-content').first()).toContainText('Search for collections by topic (e.g., "Land Surface Temperature")')

    // Click the "Next" button again within the ".tour-buttons" container
    await page.locator('.tour-buttons button:has-text("Next")').click()

    // Continue through the remaining intermediary steps
    for (let i = 0; i < 9; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.locator('.tour-buttons button:has-text("Next")').click()
    }

    await page.locator('.tour-buttons button:has-text("Finish Tour")').click()

    // Expect the final step to show the "Want to learn more?" heading
    await expect(page.locator('.tour-heading')).toContainText('Want to learn more?')
  })
})
