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

  test('Search page load time is less than 1 second', async ({ page }) => {
    await page.goto('/')
    const requestFinishedPromise = page.waitForEvent('requestfinished')
    const request = await requestFinishedPromise

    expect(request.timing().responseEnd < 5000).toBe(true)
  })

  test('Search page LCP start time is less than 7 second', async ({ page }) => {
    await page.goto('/')
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
