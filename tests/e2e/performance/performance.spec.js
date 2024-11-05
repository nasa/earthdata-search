import { test, expect } from 'playwright-test-coverage'

test.describe('Performance Benchmarking', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route('**/scale/**', (route) => route.abort())
  })

  test('Search page load time is less than 2 second', async ({ page, browserName }) => {
    if (['chromium'].includes(browserName)) {
      await page.goto('/')
      const requestFinishedPromise = page.waitForEvent('requestfinished')
      const request = await requestFinishedPromise

      const requestTime = request.timing().responseEnd
      console.log('Request time:', Math.round(requestTime), 'ms')
      expect(requestTime < 2000).toBe(true)
    }
  })

  test('Search page LCP start time is less than 2 second', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('/')
      const paintTimingJson = await page.evaluate(async () => new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const largestPaintEntry = entryList.getEntries().find(
            (entry) => entry.entryType === 'largest-contentful-paint'
          )
          resolve(largestPaintEntry.startTime)
        }).observe({
          type: 'largest-contentful-paint',
          buffered: true
        })
      }))

      const paintTiming = JSON.parse(paintTimingJson)
      console.log('LCP:', Math.round(paintTiming), 'ms')

      expect(paintTiming).toBeLessThan(2000)
    }
  })
})
