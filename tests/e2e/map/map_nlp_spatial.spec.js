import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

test.describe('Map: NLP spatial rendering', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })

    // Intercept NLP search endpoint
    await page.route('**/search/nlp/query.json**', (route) => {
      const response = {
        data: {
          queryInfo: {
            spatial: {
              geoJson: {
                type: 'Polygon',
                coordinates: [[
                  [-107, 25],
                  [-93, 25],
                  [-93, 37],
                  [-107, 37],
                  [-107, 25]
                ]]
              },
              geoLocation: 'Texas'
            }
          },
          metadata: {
            feed: {
              entry: []
            }
          }
        }
      }

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock timeline call
    await page.route('**/search/granules/timeline', (route) => {
      route.fulfill({
        body: JSON.stringify([])
      })
    })
  })

  test('draws NLP geometry and moves the map @screenshot', async ({ page }) => {
    const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/\d+/)

    await page.goto('/search?nlp=texas')

    await initialMapPromise

    // NLP label is shown in the Spatial section
    await expect(page.getByText('Texas', { exact: true })).toBeVisible()

    // Allow time for MOVEMAP and render
    await page.waitForTimeout(250)

    await expect(page).toHaveScreenshot('nlp-spatial-drawn.png', {
      clip: screenshotClip
    })
  })
})
