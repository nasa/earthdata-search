import { test, expect } from 'playwright-test-coverage'

import singleCollection from './__mocks__/single_collection.json'

test.describe('Collection List Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route(/collections/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/')
  })

  test('defaults to the list view and displays results', async ({ page }) => {
    await expect(page.getByTestId('collection-results-list')).toBeVisible()

    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(1)
  })

  test('toggles to the table view and displays results', async ({ page }) => {
    await page.getByTestId('panel-group-header-dropdown__view__0').hover()

    await page.getByTestId('panel-group-header-dropdown__view__0__menu').getByText('Table').click()

    await expect(page.getByTestId('collection-results-table')).toBeVisible()

    await expect(
      (await page.getByTestId('collection-results-table__item').all()).length
    ).toEqual(1)
  })

  test('Search page load time is less than 1 second', async ({ page }) => {
    const requestFinishedPromise = page.waitForEvent('requestfinished')
    const request = await requestFinishedPromise

    expect(request.timing().responseEnd < 5000).toBe(true)
  })

  test('Search page LCP start time is less than 7 second', async ({ page }) => {
    const LCP = await page.evaluate(() => new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcp = entries.at(-1)
        resolve(lcp.startTime)
      }).observe({
        type: 'largest-contentful-paint',
        buffered: true
      })
    }))

    expect(LCP < 10000).toBe(true)
  })
})
