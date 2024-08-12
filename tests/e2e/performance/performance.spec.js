import { test, expect } from 'playwright-test-coverage'
import twentyCollections from './__mocks__/twenty_collections.json'

test.describe('Performance Benchmarking', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route(/collections\.json/, async (route) => {
      await route.fulfill({
        json: twentyCollections.body,
        headers: twentyCollections.headers
      })
    })
  })

  test('Search page load time is less than 2 second', async ({ page, browserName, browser }) => {
    if (browserName === 'chromium') {
      const requestFinishedPromise = page.waitForEvent('requestfinished')
      await page.goto('/')
      const request = await requestFinishedPromise

      const browserVersion = browser.version()
      const requestTime = request.timing().responseEnd
      console.log(
        ['[performance] Request time',
          Math.round(requestTime),
          browserName,
          'v'.concat(browserVersion)
        ].join(', ')
      )

      expect(requestTime < 2000).toBe(true)
    }
  })

  test('Search page LCP start time is less than 2 second', async ({ page, browserName, browser }) => {
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

      const browserVersion = browser.version()
      const paintTiming = JSON.parse(paintTimingJson)
      console.log(
        ['[performance] LCP',
          Math.round(paintTiming),
          browserName,
          'v'.concat(browserVersion)
        ].join(', ')
      )

      expect(paintTiming).toBeLessThan(2000)
    }
  })

  // These tests run the performance metrics in the CI environment.
  // They do not have performance-related failure conditions.
  test.describe('Performance metrics logging', () => {
    test('Run the collections load timer', async ({ page, browserName, browser }) => {
      const logs = []
      page.on('console', (msg) => logs.push(msg.text()))
      await page.goto('/')

      await expect(page.getByTestId('collection-results-item').first()).toBeVisible()

      const browserVersion = browser.version()
      const filteredLogs = logs.filter((value) => /^\[performance] Collections load time/.test(value))
      const collectionsLoadTime = Number(filteredLogs.at(-1).split(': ')[1])
      console.log(
        ['[performance] Collections load time',
          collectionsLoadTime,
          browserName,
          'v'.concat(browserVersion)
        ].join(', ')
      )
    })
  })
})
