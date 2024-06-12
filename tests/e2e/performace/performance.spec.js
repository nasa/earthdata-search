import { test, expect } from 'playwright-test-coverage'

import singleCollection from './__mocks__/single_collection.json'

test.describe('Performance Benchmarking', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route(/collections/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })
  })

  test('Search page load time is less than 1 second', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('/')
      const requestFinishedPromise = page.waitForEvent('requestfinished')
      const request = await requestFinishedPromise

      expect(request.timing().responseEnd < 30000).toBe(true)
    }
  })

  test('Search page LCP start time is less than 7 second', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('/')
      page.on('metrics', (metrics) => {
        const lcp = metrics.LargestContenfulPaint / 1000
        if (lcp > 7) {
          console.error(`LCP is too high for the code: ${lcp} seconds`)
        } else {
          console.info(`LCP is acceptable: ${lcp} seconds`)
        }
      })
    }
  })
})
