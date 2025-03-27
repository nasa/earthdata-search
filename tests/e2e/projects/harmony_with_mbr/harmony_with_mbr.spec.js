import { test, expect } from 'playwright-test-coverage'

import { login } from '../../../support/login'
import { setupTests } from '../../../support/setupTests'
import { getAuthHeaders } from '../../../support/getAuthHeaders'

import timeline from './__mocks__/timeline.json'
import granules from './__mocks__/granules.json'
import shapefile from './__mocks__/shapefile.json'
import collectionsGraphQlBody from './__mocks__/collections_graphql_body.json'

const screenshotClip = {
  x: 930,
  y: 90,
  width: 425,
  height: 700
}

const mbrWarning = 'Only bounding boxes are supported. If this option is enabled, your line will be automatically converted into the bounding box shown above and outlined on the map.'

test.describe('Harmony with MBR', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context
    })
  })

  test.describe('when a harmony service supports bounding box subsetting and not shapefile subsetting', () => {
    test.describe('when the user provides point spatial', () => {
      test.beforeEach(async ({ page, context }) => {
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

        await page.route(/graphql/, async (route) => {
          await route.fulfill({
            json: collectionsGraphQlBody,
            headers: authHeaders
          })
        })

        await page.route(/granules$/, async (route) => {
          await route.fulfill({
            json: granules,
            headers: {
              ...authHeaders,
              'cmr-hits': '24'
            }
          })
        })

        await login(context)
      })

      test.describe('when Enable Spatial Subsetting is selected on load', () => {
        test.beforeEach(async ({ page }) => {
          await page.goto('/projects?p=C2930725014-LARC_CLOUD!C2930725014-LARC_CLOUD&pg[1][v]=t&pg[1][m]=harmony0&pg[1][cd]=t&pg[1][ets]=t&pg[1][ess]=t&q=TEMPO_NO2_L2&line[0]=-106%2C35%2C-105%2C36%2C-94%2C33%2C-95%2C30%2C-93%2C31%2C-92%2C30&qt=2024-10-30T23%3A55%3A54.901Z%2C2024-10-31T20%3A05%3A11.675Z&ff=Customizable&sf=0648513294&sfs[0]=0&lat=32.90825001027622&long=-113.4140625')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')
          await page.waitForTimeout(500)
        })

        test('displays a mbr on the map', async ({ page }) => {
          // Expect the mbrWarning to be displayed
          await expect(page.getByRole('alert')).toHaveText(mbrWarning)

          await expect(page).toHaveScreenshot('mbr.png', {
            clip: screenshotClip
          })
        })

        test.describe('when deselecting Enable Spatial Subsetting', () => {
          test.beforeEach(async ({ page }) => {
            await page.getByLabel('Trim output granules to the selected spatial constraint').uncheck()
            await page.waitForTimeout(500)
          })

          test('removes the mbr from the map', async ({ page }) => {
            // Expect the mbrWarning not to be displayed
            await expect(page.getByRole('alert')).toHaveCount(0)

            await expect(page).toHaveScreenshot('mbr-removed.png', {
              clip: screenshotClip
            })
          })
        })
      })

      test.describe('when Enable Spatial Subsetting is unselected on load', () => {
        test.beforeEach(async ({ page }) => {
          await page.goto('/projects?p=C2930725014-LARC_CLOUD!C2930725014-LARC_CLOUD&pg[1][v]=t&pg[1][m]=harmony0&pg[1][cd]=t&pg[1][ets]=t&pg[1][ess]=f&q=TEMPO_NO2_L2&line[0]=-106%2C35%2C-105%2C36%2C-94%2C33%2C-95%2C30%2C-93%2C31%2C-92%2C30&qt=2024-10-30T23%3A55%3A54.901Z%2C2024-10-31T20%3A05%3A11.675Z&ff=Customizable&sf=0648513294&sfs[0]=0&lat=32.90825001027622&long=-113.4140625')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')
          await page.waitForTimeout(500)
        })

        test('does not display a mbr on the map', async ({ page }) => {
          // Expect the mbrWarning not to be displayed
          await expect(page.getByRole('alert')).toHaveCount(0)

          await expect(page).toHaveScreenshot('mbr-removed.png', {
            clip: screenshotClip
          })
        })

        test.describe('when selecting Enable Spatial Subsetting', () => {
          test.beforeEach(async ({ page }) => {
            await page.getByLabel('Trim output granules to the selected spatial constraint').check()
            await page.waitForTimeout(500)
          })

          test('adds the mbr to the map', async ({ page }) => {
            // Expect the mbrWarning to be displayed
            await expect(page.getByRole('alert')).toHaveText(mbrWarning)

            await expect(page).toHaveScreenshot('mbr.png', {
              clip: screenshotClip
            })
          })
        })
      })
    })
  })
})
