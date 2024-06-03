import { test, expect } from 'playwright-test-coverage'

test('Search page load time is less than 1 second', async ({ page }) => {
  const requestFinishedPromise = page.waitForEvent('requestfinished')
  await page.goto('/search')
  const request = await requestFinishedPromise

  expect(request.timing().responseEnd < 1000).toBe(true)
})

test('Search page LCP start time is less than 1 second', async ({ page }) => {
  await page.goto('/search')

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

  expect(LCP < 1000).toBe(true)
})
