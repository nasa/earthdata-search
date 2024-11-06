import { test, expect } from 'playwright-test-coverage'

import { login } from '../../support/login'
import { getAuthHeaders } from '../../support/getAuthHeaders'

import collectionsGraphJson from './__mocks__/collections_graph.json'
import timeline from './__mocks__/timeline.json'
import granules from './__mocks__/granules.json'
import providers from './__mocks__/providers.json'
import accessMethods from './__mocks__/access_methods.json'
import collectionFixture from './__mocks__/authenticated_collections.json'

test.describe('Timeline spec', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route('**/scale/**', (route) => route.abort())

    // eslint-disable-next-line no-param-reassign
    testInfo.snapshotPath = (name) => `${testInfo.file}-snapshots/${name}`
  })

  test('should resize the leaflet controls', async ({ page, context }) => {
    login(context)

    const authHeaders = getAuthHeaders()

    await page.route(/collections$/, async (route) => {
      await route.fulfill({
        json: collectionFixture.body,
        headers: collectionFixture.headers
      })
    })

    await page.route(/graphql/, async (route) => {
      await route.fulfill({
        json: collectionsGraphJson.body,
        headers: authHeaders
      })
    })

    await page.route(/timeline$/, async (route) => {
      await route.fulfill({
        json: timeline.body,
        headers: authHeaders
      })
    })

    await page.route(/dqs/, async (route) => {
      await route.fulfill({
        json: []
      })
    })

    await page.route(/providers/, async (route) => {
      await route.fulfill({
        json: providers.body
      })
    })

    await page.route(/access_methods/, async (route) => {
      await route.fulfill({
        json: accessMethods.body
      })
    })

    await page.route(/saved_access_configs/, async (route) => {
      await route.fulfill({
        json: {}
      })
    })

    await page.route(/granules$/, async (route) => {
      await route.fulfill({
        json: granules.body,
        headers: {
          ...authHeaders,
          'cmr-hits': '42'
        }
      })
    })

    await page.goto('/projects?p=!C1443528505-LAADS&sb=-77.15071%2C38.78817%2C-76.89801%2C38.99784&lat=37.64643&long=-77.40747&zoom=7qt=2020-01-06T04%3A15%3A27.310Z%2C2020-01-13T07%3A32%3A50.962Z&ff=Map%20Imagery&tl=1563377338!4!!')

    // Click the back to search button
    await page.getByTestId('back-to-search-button').click()

    await page.waitForSelector('[data-testid="collection-result-item_C1443528505-LAADS"]')

    // Confirm the leaflet tools are in the correct location
    await expect(page).toHaveScreenshot('search-screenshot.png', {
      clip: {
        x: 1200,
        y: 700,
        width: 200,
        height: 200
      }
    })

    // Click a collection that exists in the project
    await page.getByTestId('collection-result-item_C1443528505-LAADS').click()

    // Wait for the timeline to be visible
    await expect(page.getByTestId('timeline')).toBeInViewport()

    // Confirm the leaflet tools are in the correct location
    await expect(page).toHaveScreenshot('granules-screenshot.png', {
      clip: {
        x: 1200,
        y: 700,
        width: 200,
        height: 200
      }
    })
  })
})
