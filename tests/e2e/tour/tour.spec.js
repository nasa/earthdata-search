import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'

import singleCollection from './__mocks__/single_collection.json'

const expectWithinMargin = async (actual, expected, margin) => {
  Object.keys(expected).forEach((key) => {
    const diff = Math.abs(actual[key] - expected[key])
    expect.soft(diff).toBeLessThanOrEqual(margin)
  })
}

test.describe('When clicking the "Skip for now" button', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests(page, context, false)

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/search')
  })

  test('should close the tour', async ({ page }) => {
    // Expect the first step to show the "Take the tour" button
    await expect(page.locator('.search-tour__welcome')).toContainText('Welcome to Earthdata Search!')

    // Click the "Skip for now" button to close the tour
    await page.click('button:has-text("Skip for now")')

    // Ensure the tour is closed by checking that the tour container is no longer visible
    await expect(page.locator('.search-tour__container')).toBeHidden()
  })

  test.describe('When refreshing the page', () => {
    test('should show the tour again', async ({ page }) => {
      // Expect the tour to run on page load
      await expect(page.locator('.search-tour__welcome')).toContainText('Welcome to Earthdata Search!')
    })
  })
})

test.describe('When checking the "Don\'t show again" checkbox', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests(page, context, false)

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/search')
  })

  test('should not see the tour when the page reloads if the checkbox is checked', async ({ page }) => {
    // Verify the tour is open
    await expect(page.locator('.search-tour__welcome')).toContainText('Welcome to Earthdata Search!')

    // Verify the checkbox is unchecked
    const checkbox = page.getByRole('checkbox', { name: 'Don\'t show the tour next time I visit Earthdata Search' })
    await expect(checkbox).not.toBeChecked()

    // Check the checkbox and verify it is checked
    await checkbox.click()
    await expect(checkbox).toBeChecked()

    await page.goto('/search')

    await expect(page.locator('.search-tour__container')).toBeHidden()
  })
})

test.describe('When loading the page with dontShowTour preference set to true', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests(page, context, false)

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/search')
  })

  test('should not see the tour when the page loads', async ({ page }) => {
    await expect(page.locator('.search-tour__container')).toBeHidden()
  })
})

test.describe('Joyride Tour Navigation', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests(page, context)

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

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

    // Get and verify the position and size of the highlighted section
    let rect = await spotlight.boundingBox()
    let spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: -10,
      top: 22,
      width: 330,
      height: 844
    }, 10)

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

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: -10,
      top: 72,
      width: 60,
      height: 69
    }, 10)

    // Step 3: Temporal filters
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the temporal filters to limit search results to a specific date')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 30,
      top: 72,
      width: 60,
      height: 69
    }, 10)

    // Step 4: Spatial filters
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the spatial filters to limit search results to the specified area of interest')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 69,
      top: 72,
      width: 60,
      height: 69
    }, 10)

    // Step 5: Advanced Search
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use Advanced Search parameters to filter results')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 3,
      top: 136,
      width: 303,
      height: 56
    }, 10)

    // Step 6: Browse Portals
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Choose a portal to refine search results')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: -10,
      top: 185,
      width: 329,
      height: 697
    }, 10)

    // Step 7: Refine Search by Category
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Refine your search further using categories like Features, Keywords')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 300,
      top: 22,
      width: 620,
      height: 844
    }, 10)

    // Step 8: High-level description for each search result
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('A high-level description is displayed for each search result')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 900,
      top: 39,
      width: 40,
      height: 85
    }, 10)

    // Step 9: Resize Search Results Panel
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('To make more room to view the map, the search results can be resized')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 900,
      top: 22,
      width: 510,
      height: 844
    }, 10)

    // Step 10: Pan and zoom the map
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Pan the map by clicking and dragging, and zoom by using the scroll wheel')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 1316,
      top: 323,
      width: 94,
      height: 533
    }, 10)

    // Step 11: Map tools
    await page.waitForTimeout(500)
    await expect(page.locator('.search-tour__content').first()).toContainText('Use the map tools to switch map projections, draw, edit, or remove spatial bounds')
    await page.getByRole('button', { name: 'Next' }).click()

    // Get and verify the position and size of the highlighted section
    rect = await spotlight.boundingBox()
    spotlightRect = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    }

    expectWithinMargin(spotlightRect, {
      left: 1172,
      top: 34,
      width: 133,
      height: 56
    }, 10)

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
})
