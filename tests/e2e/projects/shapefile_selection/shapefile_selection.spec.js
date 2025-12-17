import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../../support/setupTests'
import { getAuthHeaders } from '../../../support/getAuthHeaders'
import { login } from '../../../support/login'

import collectionsGraphQlBody from './__mocks__/collections_graphql_body.json'
import granules from './__mocks__/granules.body.json'
import shapefile from './__mocks__/shapefile.body.json'
import timeline from './__mocks__/timeline.body.json'

const screenshotClip = {
  x: 950,
  y: 290,
  width: 405,
  height: 220
}

test.describe('Shapefile Selection on Project Page', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })

    const authHeaders = getAuthHeaders()

    await page.route(/saved_access_configs/, async (route) => {
      await route.fulfill({
        json: {}
      })
    })

    await page.route(/shapefiles\/\d+/, async (route) => {
      await route.fulfill({
        json: shapefile
      })
    })

    await page.route(/timeline$/, async (route) => {
      await route.fulfill({
        json: timeline,
        headers: authHeaders
      })
    })

    await page.route(/graphql.*\/api/, async (route) => {
      await route.fulfill({
        json: collectionsGraphQlBody,
        headers: authHeaders
      })
    })

    await page.route(/granules\.json/, async (route) => {
      await route.fulfill({
        json: granules,
        headers: {
          ...authHeaders,
          'access-control-expose-headers': 'cmr-hits',
          'cmr-hits': '24'
        }
      })
    })

    await page.route(/collections\.json/, async (route) => {
      await route.fulfill({
        json: {
          feed: {
            entry: []
          }
        },
        headers: {
          ...authHeaders,
          'access-control-expose-headers': 'cmr-hits',
          'cmr-hits': '0'
        }
      })
    })

    await login(page, context)

    // Wait for the tiles at the right zoom level to load
    const tilesPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3\/3/)

    await page.goto('/projects?p=C1214470488-ASF!C1214470488-ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=download&pg[1][cd]=f&sf=9985410732&sfs[0]=1&tl=1571184917.049!5!!&lat=-8.296765&long=45.81184668989547&zoom=3.8885756982284363')

    // Wait for the base map to load to avoid bad screenshots
    await tilesPromise
  })

  test.describe('When on the project page with a shapefile that includes multiple shapes', () => {
    test('hovering over a shape does not highlight it @screenshot', async ({ page }) => {
      await page.locator('.map').hover({
        position: {
          x: 1200,
          y: 448
        }
      })

      await expect(page).toHaveScreenshot('shape-not-selected.png', {
        clip: screenshotClip,
        maxDiffPixelRatio: 0.01
      })
    })

    test('clicking on a shape does not select it @screenshot', async ({ page }) => {
      await page.locator('.map').click({
        position: {
          x: 1200,
          y: 448
        }
      })

      await expect(page).toHaveScreenshot('shape-not-selected.png', {
        clip: screenshotClip,
        maxDiffPixelRatio: 0.01
      })
    })
  })
})
