import { test, expect } from 'playwright-test-coverage'

import { setupTests, waitForMapRenderComplete } from '../../support/setupTests'
import { login } from '../../support/login'

import singleCollection from './__mocks__/single_collection.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import collectionFixture from './__mocks__/authenticated_collections.json'

const expectSpotlightMatchesTarget = async (spotlight, target) => {
  await expect(target).toBeVisible()
  await expect(spotlight).toBeVisible()

  await expect.poll(async () => {
    const targetBox = await target.boundingBox()
    const spotlightBox = await spotlight.boundingBox()
    if (!targetBox || !spotlightBox) return Infinity

    const padding = 10

    return Math.max(
      Math.abs(spotlightBox.x - (targetBox.x - padding)),
      Math.abs(spotlightBox.y - (targetBox.y - padding)),
      Math.abs(spotlightBox.width - (targetBox.width + padding * 2)),
      Math.abs(spotlightBox.height - (targetBox.height + padding * 2))
    )
  }, { message: 'The tour spotlight should align with its target' }).toBeLessThanOrEqual(10)
}

test.describe('When dontShowTour is set to false', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context,
      dontShowTour: false
    })

    await page.route(/collections\.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('search')

    // Wait for the map to load
    await waitForMapRenderComplete(page)
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

    await page.goto('search')

    // Wait for the map to load
    await waitForMapRenderComplete(page)
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

    await login(page, context)

    await page.route(/collections\.json/, async (route) => {
      await route.fulfill({
        json: collectionFixture.body,
        headers: collectionFixture.headers
      })
    })

    await page.route(/graphql.*\/api/, async (route) => {
      await route.fulfill({
        json: getSubscriptionsGraphQlBody,
        headers: graphQlHeaders
      })
    })

    await page.goto('search')

    // Wait for the map to load
    await waitForMapRenderComplete(page)
  })

  test('should see the additional tour steps for logged in users', async ({ page }) => {
    // Start the tour
    await page.getByRole('button', { name: 'Start Tour' }).click()

    // Wait a short time to ensure the tour animation shows the start of the tour
    await page.waitForTimeout(500)

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

    await page.goto('search')

    // Wait for the map to load
    await waitForMapRenderComplete(page)
  })

  test('should navigate through the Joyride tour highlighting the correct parts of the page', async ({ page }) => {
    // Start the tour by clicking the "Start Tour" button
    await page.getByRole('button', { name: 'Start Tour' }).click()

    // Start Tour View: Welcome to Earthdata Search
    await expect(page.getByRole('heading', { name: 'Welcome to Earthdata Search!' })).toBeVisible()
    await page.getByRole('button', { name: 'Take the tour' }).click()

    // Step 1: This area contains the filters
    await expect(page.getByRole('alertdialog', { name: 'This area contains the filters used when searching for collections' })).toBeVisible()

    // Check for the presence of the highlighted section
    const spotlight = page.locator('.react-joyride__spotlight')
    await expect(spotlight).toBeVisible()

    await expectSpotlightMatchesTarget(spotlight, page.locator('.sidebar__inner').filter({
      has: page.getByRole('heading', {
        name: 'Filter Collections',
        exact: true
      })
    }))

    // Testing arrow key navigation
    await page.keyboard.press('ArrowRight')

    // Verify we're on the next step
    await expect(page.getByRole('alertdialog', { name: 'Search for collections by topic (e.g., "Land Surface Temperature")' })).toBeVisible()

    // Now go back to the previous step using the left arrow key
    await page.keyboard.press('ArrowLeft')
    await expect(page.getByRole('alertdialog', { name: 'This area contains the filters used when searching for collections' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Testing "Previous" button
    await expect(page.getByRole('alertdialog', { name: 'Search for collections by topic (e.g., "Land Surface Temperature")' })).toBeVisible()
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('alertdialog', { name: 'This area contains the filters used when searching for collections' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 2: Search for collections
    await expect(page.getByRole('alertdialog', { name: 'Search for collections by topic (e.g., "Land Surface Temperature")' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.locator('.search-form__primary').filter({
      has: page.getByPlaceholder('Type to search for data', { exact: true })
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Step 3: Temporal filters
    await expect(page.getByRole('alertdialog', { name: 'Use the temporal filters to limit search results to a specific date' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.locator('.temporal-selection-dropdown').filter({
      has: page.getByRole('button', {
        name: 'Open temporal filters',
        exact: true
      })
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Step 4: Spatial filters
    await expect(page.getByRole('alertdialog', { name: 'Use the spatial filters to limit search results to the specified area of interest' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.locator('.spatial-selection-dropdown').filter({
      has: page.getByRole('button', {
        name: 'spatial-selection-dropdown',
        exact: true
      })
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Step 5: Advanced Search
    await expect(page.getByRole('alertdialog', { name: 'Use Advanced Search parameters to filter results' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.getByRole('button', {
      name: 'Show advanced search options',
      exact: true
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Step 6: Refine Search by Category
    await expect(page.getByRole('alertdialog', { name: 'Refine your search further using categories like Features, Keywords' })).toBeVisible()

    await expectSpotlightMatchesTarget(spotlight, page.locator('.sidebar-section-body').filter({
      has: page.getByRole('heading', {
        name: 'Filter Collections',
        exact: true
      })
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Step 7: High-level description for each search result
    await expect(page.getByRole('alertdialog', { name: 'A high-level description is displayed for each search result' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.locator('section.panel-section').filter({ visible: true }))
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 8: Resize Search Results Panel
    await expect(page.getByRole('alertdialog', { name: 'To make more room to view the map, the search results can be resized' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.getByRole('button', {
      name: 'Collapse panel (])',
      exact: true
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Step 9: Pan and zoom the map
    await expect(page.getByRole('alertdialog', { name: 'Pan the map by clicking and dragging, and zoom by using the scroll wheel' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.locator('.search-tour__target-overlay'))
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 10: Map tools
    await expect(page.getByRole('alertdialog', { name: 'Use the map tools to switch map projections, draw, edit, or remove spatial bounds' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.locator('.map-controls'))
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 11: Log in to set preferences, save projects, etc.
    await expect(page.getByRole('alertdialog', { name: 'Log in with Earthdata Login to set' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.getByRole('button', {
      name: 'Log In',
      exact: true
    }))

    await page.getByRole('button', { name: 'Next' }).click()

    // Testing "Previous" button on Step 13
    await expect(page.getByRole('alertdialog', { name: 'You can replay this tour anytime' })).toBeVisible()
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('alertdialog', { name: 'Log in with Earthdata Login' })).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    // Step 12: Replay info
    await expect(page.getByRole('alertdialog', { name: 'You can replay this tour anytime' })).toBeVisible()
    await expectSpotlightMatchesTarget(spotlight, page.getByRole('button', {
      name: 'Start tour',
      exact: true
    }))

    await page.getByRole('button', { name: 'Finish Tour' }).click()

    // Final step: Want to learn more?
    await expect(page.getByRole('heading', { name: 'Want to learn more?' })).toBeVisible()
  })
}, 60000)
