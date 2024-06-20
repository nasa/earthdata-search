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
    if (['chromium', 'webkit'].includes(browserName)) {
      await page.goto('/')
      const requestFinishedPromise = page.waitForEvent('requestfinished')
      const request = await requestFinishedPromise

      const requestTime = request.timing().responseEnd
      console.log('Request time:', Math.round(requestTime), 'ms')
      expect(requestTime < 1000).toBe(true)
    }
  })

  test('Search page FCP start time is less than 1 second', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('/search')
      const paintTimingJson = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByName('first-contentful-paint')))
      const paintTiming = JSON.parse(paintTimingJson)

      expect(paintTiming[0].startTime).toBeLessThan(1000)
    }
  })
})
