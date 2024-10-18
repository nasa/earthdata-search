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

    // Start Tour View: Welcome to Earthdata Search
    await expect(page.locator('.search-tour__welcome')).toContainText('Welcome to Earthdata Search!')
    await page.click('button:has-text("Take the tour")')

    // Step 1: This area contains the filters
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('This area contains the filters used when searching for collections')

    // Check for the presence of the highlighted section
    const spotlight = page.locator('.react-joyride__spotlight')
    await expect(spotlight).toBeVisible()

    // Testing arrow key navigation
    await page.keyboard.press('ArrowRight')

    await page.waitForTimeout(500)

    // Verify we're on the next step
    await expect(page.locator('.search-tour__content').first()).toContainText('Search for collections by topic (e.g., "Land Surface Temperature")')

    // Now go back to the previous step using the left arrow key
    await page.keyboard.press('ArrowLeft')
    await page.getByRole('button', { name: 'Next' }).click()

    // Testing "Previous" button
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.locator('.search-tour__content').first()).toContainText('This area contains the filters used when searching for collections')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 2: Search for collections
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Search for collections by topic (e.g., "Land Surface Temperature")')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 3: Temporal filters
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the temporal filters to limit search results to a specific date')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 4: Spatial filters
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the spatial filters to limit search results to the specified area of interest')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 5: Advanced Search
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use Advanced Search parameters to filter results')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 6: Browse Portals
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Choose a portal to refine search results')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 7: Refine Search by Category
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Refine your search further using categories like Features, Keywords')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 8: High-level description for each search result
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('A high-level description is displayed for each search result')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 9: Resize Search Results Panel
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('To make more room to view the map, the search results can be resized')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 10: Pan and zoom the map
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Pan the map by clicking and dragging, and zoom by using the scroll wheel')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 11: Map tools
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the map tools to switch map projections, draw, edit, or remove spatial bounds')
    await page.getByRole('button', { name: 'Next' }).click()

    // Testing "Previous" button on Step 12
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the map tools to switch map projections, draw, edit, or remove spatial bounds')
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 12: Replay info
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content')).toContainText('You can replay this tour anytime')
    await page.locator('.search-tour__buttons button:has-text("Finish Tour")').click()

    // Final step: Want to learn more?
    await expect(page.locator('.search-tour__heading')).toContainText('Want to learn more?')
  })

  test('should close the tour when clicking "Skip for now"', async ({ page }) => {
    // Start the tour by clicking the "Start Tour" button
    await page.click('button:has-text("Start Tour")')

    // Expect the first step to show the "Take the tour" button
    await expect(page.locator('.search-tour__welcome')).toContainText('Welcome to Earthdata Search!')

    // Click the "Skip for now" button to close the tour
    await page.click('button:has-text("Skip for now")')

    // Ensure the tour is closed by checking that the tour container is no longer visible
    await expect(page.locator('.search-tour__container')).toBeHidden()
  })

  test('should automatically start the Joyride tour', async ({ page, context }) => {
    // Login first
    await login(context)

    // Override the TourContextProvider to force show the tour
    await context.addInitScript(() => {
      window.overrideLocalhost = true
    })

    // Navigate to the search page
    await page.goto('/search')

    // Wait for the tour to appear automatically
    await page.waitForSelector('.search-tour__welcome', {
      state: 'visible',
      timeout: 5000
    })

    // Verify that the tour has started automatically
    await expect(page.locator('.search-tour__welcome')).toContainText('Welcome to Earthdata Search!')
    await expect(page.locator('.search-tour__content').first()).toContainText('Get acquainted with Earthdata Search by taking our guided tour')
  })
})
