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

    // Move forward using the right arrow key
    await page.keyboard.press('ArrowRight')

    await page.waitForTimeout(500)

    // Verify we're on the next step
    await expect(page.locator('.tour-content').first()).toContainText('Search for collections by topic (e.g., "Land Surface Temperature")')

    // Now go back to the previous step using the left arrow key
    await page.keyboard.press('ArrowLeft')

    await page.waitForTimeout(500)

    // Ensure the content is back to the previous step
    await expect(page.locator('.tour-content').first()).toContainText('This area contains the filters used when searching for collections')

    // Proceed to the next steps as before
    await page.locator('.tour-buttons button:has-text("Next")').click()

    // Continue through the remaining intermediary steps
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.locator('.tour-buttons button:has-text("Next")').click()
    }

    await page.locator('.tour-buttons button:has-text("Finish Tour")').click()

    // Expect the final step to show the "Want to learn more?" heading
    await expect(page.locator('.tour-heading')).toContainText('Want to learn more?')
  })

  test('should close the tour when clicking outside the tour window', async ({ page }) => {
    // Start the tour by clicking the "Start Tour" button
    await page.click('button:has-text("Start Tour")')

    // Expect the first step to show the "Take the tour" button
    await expect(page.locator('.tour-heading')).toHaveText('Welcome to Earthdata Search!')

    // Click the "Take the tour" button to proceed
    await page.click('button:has-text("Take the tour")')

    await page.waitForTimeout(500)

    // Ensure we're on the second step
    await expect(page.locator('.tour-content').first()).toContainText('This area contains the filters used when searching for collections')

    // Simulate a click outside the tour window by clicking an area outside the overlay
    await page.mouse.click(10, 10) // Adjust this based on your layout, clicking near the top-left of the screen

    await page.waitForTimeout(500)

    // Ensure the tour is closed by checking the absence of the tour container
    await expect(page.locator('.tour-container')).toBeHidden()
  })
})
