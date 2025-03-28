import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'
import { login } from '../../support/login'

import singleCollection from './__mocks__/single_collection.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import collectionFixture from './__mocks__/authenticated_collections.json'

const expectWithinMargin = async (actual, expected, margin, step) => {
  Object.keys(expected).forEach((key) => {
    const diff = Math.abs(actual[key] - expected[key])
    if (diff >= margin) {
      console.log(`Step: ${step} - Expected: ${expected[key]} - Actual: ${actual[key]} - Delta: ${diff}`)
    }

    expect.soft(diff).toBeLessThanOrEqual(margin)
  })
}

test.describe('When dontShowTour is set to false', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context,
      dontShowTour: false
    })

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/search')
  })

  test.describe('When clicking the "Skip for now" button', () => {
    test.beforeEach(async ({ page }) => {
      // Expect the first step to show the "Take the tour" button
      await expect(page.getByRole('heading', { name: 'Welcome to Earthdata Search!' })).toBeVisible()

      // Click the "Skip for now" button to close the tour
      await page.getByRole('button', { name: 'Skip for now' }).click()
    })

    test('should close the tour', async ({ page }) => {
      // Ensure the tour is closed by checking that the tour container is no longer visible
      await expect(page.getByRole('dialog', { name: /search tour/i })).toBeHidden()
    })

    test.describe('When refreshing the page', () => {
      test('should show the tour again', async ({ page }) => {
        // Refresh the page
        await page.reload()

        // Expect the tour to run on page load
        await expect(page.getByRole('heading', { name: 'Welcome to Earthdata Search!' })).toBeVisible()
      })
    })
  })

  test.describe('When checking the "Don\'t show again" checkbox', () => {
    test.beforeEach(async ({ page }) => {
      // Verify the tour is open
      await expect(page.getByRole('heading', { name: 'Welcome to Earthdata Search!' })).toBeVisible()

      // Verify the checkbox is unchecked
      const checkbox = page.getByRole('checkbox', { name: 'Don\'t show the tour next time I visit Earthdata Search' })
      await expect(checkbox).not.toBeChecked()

      // Check the checkbox and verify it is checked
      await checkbox.click()
      await expect(checkbox).toBeChecked()
    })

    test('should not see the tour when the page reloads if the checkbox is checked', async ({ page }) => {
      await page.reload()

      await page.getByRole('heading', { name: 'Filter Collections' }).waitFor()

      await expect(page.getByRole('alertdialog', { name: /Welcome to Earthdata Search/ })).toBeHidden()
    })
  })
})

test.describe('When loading the page with dontShowTour preference set to true', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context,
      dontShowTour: true
    })

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/search')
  })

  test('should not see the tour when the page loads', async ({ page }) => {
    await page.getByRole('heading', { name: 'Filter Collections' }).waitFor()

    await expect(page.getByRole('alertdialog', { name: /Welcome to Earthdata Search/ })).toBeHidden()
  })
})

test.describe('When logged in', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context,
      dontShowTour: true
    })

    await login(context)

    await page.route(/collections$/, async (route) => {
      await route.fulfill({
        json: collectionFixture.body,
        headers: collectionFixture.headers
      })
    })

    await page.route(/graphql/, async (route) => {
      await route.fulfill({
        json: getSubscriptionsGraphQlBody,
        headers: graphQlHeaders
      })
    })

    await page.goto('/search')
  })

  test('should see the additional tour steps for logged in users', async ({ page }) => {
    // Start the tour
    await page.getByRole('button', { name: 'Start Tour' }).click()

    // Welcome screen
    await expect(page.getByRole('heading', { name: 'Welcome to Earthdata Search!' })).toBeVisible()
    await page.getByRole('button', { name: 'Take the tour' }).click()

    // Navigating through the tour steps
    await expect(page.getByRole('alertdialog', { name: 'This area contains the filters used when searching for collections' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Search for collections by topic (e.g., "Land Surface Temperature"), by collection name, or by CMR Concept ID.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Use the temporal filters to limit search results to a specific date and time range.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Use the spatial filters to limit search results to the specified area of interest.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Use Advanced Search parameters to filter results using features like Hydrologic Unit Code (HUC) or SWORD River Reach.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Choose a portal to refine search results to a particular area of study, project, or organization.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Refine your search further using categories like Features, Keywords, Platforms, Organizations, etc.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'A high-level description is displayed for each search result to help you find the right data' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'To make more room to view the map, the search results can be resized by clicking or dragging the bar above.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Pan the map by clicking and dragging, and zoom by using the scroll wheel or map tools.' })).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Use the map tools to switch map projections, draw, edit, or remove spatial bounds, zoom the map, or select the base map.' })).toBeVisible()

    // Logged-in specific steps
    // Step 12: Save Project Button
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Click to save a project using your current search criteria.' })).toBeVisible()

    // Step 13: User Menu Dropdown
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('alertdialog', { name: 'Use this menu to set preferences, view saved projects, manage subscriptions, view download status and history, or log out.' })).toBeVisible()
  })
})

test.describe('When not logged in', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context,
      dontShowTour: true
    })

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/search')
  })

  test('should navigate through the Joyride tour highlighting the correct parts of the page', async ({ page }) => {
    // Start the tour by clicking the "Start Tour" button
    await page.getByRole('button', { name: 'Start tour' }).click()

    // Start Tour View: Welcome to Earthdata Search
    await expect(page.getByRole('heading', { name: 'Welcome to Earthdata Search!' })).toBeVisible()
    await page.getByRole('button', { name: 'Take the tour' }).click()

    // Step 1: This area contains the filters
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'This area contains the filters used when searching for collections' })).toBeVisible()

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
    }, 10, 1)

    // Testing arrow key navigation
    await page.keyboard.press('ArrowRight')

    await page.waitForTimeout(500)

    // Verify we're on the next step
    await expect(page.getByRole('alertdialog', { name: 'Search for collections by topic (e.g., "Land Surface Temperature")' })).toBeVisible()

    // Now go back to the previous step using the left arrow key
    await page.keyboard.press('ArrowLeft')
    await page.getByRole('button', { name: 'Next' }).click()

    // Testing "Previous" button
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('alertdialog', { name: 'This area contains the filters used when searching for collections' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 2: Search for collections
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Search for collections by topic (e.g., "Land Surface Temperature")' })).toBeVisible()
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
    }, 10, 2)

    // Step 3: Temporal filters
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Use the temporal filters to limit search results to a specific date' })).toBeVisible()
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
    }, 10, 3)

    // Step 4: Spatial filters
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Use the spatial filters to limit search results to the specified area of interest' })).toBeVisible()
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
    }, 10, 4)

    // Step 5: Advanced Search
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Use Advanced Search parameters to filter results' })).toBeVisible()
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
    }, 10, 5)

    // Step 6: Browse Portals
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Choose a portal to refine search results' })).toBeVisible()
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
      top: 189,
      width: 338,
      height: 720
    }, 10, 6)

    // Step 7: Refine Search by Category
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Refine your search further using categories like Features, Keywords' })).toBeVisible()
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
    }, 10, 7)

    // Step 8: High-level description for each search result
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'A high-level description is displayed for each search result' })).toBeVisible()
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
    }, 10, 8)

    // Step 9: Resize Search Results Panel
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'To make more room to view the map, the search results can be resized' })).toBeVisible()
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
    }, 10, 9)

    // Step 10: Pan and zoom the map
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Pan the map by clicking and dragging, and zoom by using the scroll wheel' })).toBeVisible()
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
      left: 1348,
      top: 400,
      width: 49,
      height: 377
    }, 10, 10)

    // Step 11: Map tools
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Use the map tools to switch map projections, draw, edit, or remove spatial bounds' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 12: Log in to set preferences, save projects, etc.
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'Log in with Earthdata Login to set' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Testing "Previous" button on Step 13
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('alertdialog', { name: 'Log in with Earthdata Login' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 13: Replay info
    await page.waitForTimeout(500)
    await expect(page.getByRole('alertdialog', { name: 'You can replay this tour anytime' })).toBeVisible()
    await page.getByRole('button', { name: 'Finish Tour' }).click()

    // Final step: Want to learn more?
    await expect(page.getByRole('heading', { name: 'Want to learn more?' })).toBeVisible()
  })
}, 60000)
