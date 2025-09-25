import { test, expect } from 'playwright-test-coverage'
import { isGetCollectionQuery } from '../../support/isGetCollectionQuery'
import { isGetGranuleQuery } from '../../support/isGetGranuleQuery'
import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { setupTests } from '../../support/setupTests'

import commonHeaders from './__mocks__/common_collections.headers.json'
import gibsCollectionGraphQlBody from './__mocks__/gibs/collection_graphql.body.json'
import gibsCollectionGraphQlHeaders from './__mocks__/gibs/graphql.headers.json'
import gibsCollectionsBody from './__mocks__/gibs/collections.body.json'
import gibsGranuleGraphQlBody from './__mocks__/gibs/granule_graphql.body.json'
import gibsGranulesBody from './__mocks__/gibs/granules.body.json'
import gibsGranulesHeaders from './__mocks__/gibs/granules.headers.json'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

const temporalLabelClass = '.map__focused-granule-overlay__granule-label-temporal'

test.describe('Map: imagery and layer-picker interactions', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })

    await page.route('**/search/granules/timeline', (route) => {
      route.fulfill({
        body: JSON.stringify([])
      })
    })
  })

  test.describe('when viewing granules with gibs imagery', () => {
    test.describe('when the top granule has transparent imagery', () => {
      test.beforeEach(async ({ page }) => {
        const conceptId = 'C2930727817-LARC_CLOUD'

        await interceptUnauthenticatedCollections({
          page,
          body: gibsCollectionsBody,
          headers: commonHeaders
        })

        await page.route(/search\/granules.json/, async (route) => {
          const query = route.request().postData()

          if (query === `echo_collection_id=${conceptId}&options[readable_granule_name][pattern]=true&page_num=1&page_size=20&readable_granule_name[]=TEMPO_CLDO4_L3_V03_20250318T123644Z_S003.nc&readable_granule_name[]=TEMPO_CLDO4_L3_V03_20250317T181710Z_S009.nc&sort_key=-start_date`) {
            await route.fulfill({
              json: gibsGranulesBody,
              headers: gibsGranulesHeaders
            })
          }
        })

        await page.route(/api$/, async (route) => {
          if (isGetCollectionQuery(route, conceptId)) {
            await route.fulfill({
              json: gibsCollectionGraphQlBody,
              headers: gibsCollectionGraphQlHeaders
            })
          }

          if (isGetGranuleQuery(route, 'G3453056435-LARC_CLOUD')) {
            await route.fulfill({
              json: gibsGranuleGraphQlBody,
              headers: { 'content-type': 'application/json' }
            })
          }
        })

        await page.route(/autocomplete$/, async (route) => {
          await route.fulfill({
            json: { feed: { entry: [] } }
          })
        })

        await page.route(/colormaps\/TEMPO_L3_Cloud_Cloud_Fraction_Total/, async (route) => {
          await route.fulfill({
            json: {}
          })
        })

        await page.route(/colormaps\/TEMPO_L3_Cloud_Cloud_Pressure_Total/, async (route) => {
          await route.fulfill({
            json: {}
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('search/granules?p=C2930727817-LARC_CLOUD&pg[0][id]=TEMPO_CLDO4_L3_V03_20250318T123644Z_S003.nc!TEMPO_CLDO4_L3_V03_20250317T181710Z_S009.nc&pg[0][gsk]=-start_date&lat=40&long=-100')

        // Wait for the map to load
        await initialMapPromise
      })

      test('does not draw the lower granule\'s imagery through the transparent pieces of the top granule @screenshot', async ({ page }) => {
        await expect(page).toHaveScreenshot('gibs-transparent.png', {
          clip: screenshotClip
        })
      })

      test.describe('when focusing on the lower granule', () => {
        test.beforeEach(async ({ page }) => {
          const tilesPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/0/)

          await page.getByText('TEMPO_CLDO4_L3_V03_20250317T181710Z_S009.nc').click()

          await tilesPromise
        })

        test('draws the imagery of the focused granule above the previous top granule @screenshot', async ({ page }) => {
          await expect(page.locator(temporalLabelClass)).toHaveText('2025-03-17 18:17:102025-03-17 19:16:51')

          await expect(page).toHaveScreenshot('gibs-focused.png', {
            clip: screenshotClip
          })
        })
      })
    })

    test.describe('when using the layer picker', () => {
      test.beforeEach(async ({ page }) => {
        const conceptId = 'C2930727817-LARC_CLOUD'

        await interceptUnauthenticatedCollections({
          page,
          body: gibsCollectionsBody,
          headers: commonHeaders
        })

        await page.route(/search\/granules.json/, async (route) => {
          const query = route.request().postData()

          if (query === `echo_collection_id=${conceptId}&options[readable_granule_name][pattern]=true&page_num=1&page_size=20&readable_granule_name[]=TEMPO_CLDO4_L3_V03_20250318T123644Z_S003.nc&readable_granule_name[]=TEMPO_CLDO4_L3_V03_20250317T181710Z_S009.nc&sort_key=-start_date`) {
            await route.fulfill({
              json: gibsGranulesBody,
              headers: gibsGranulesHeaders
            })
          }
        })

        await page.route(/api$/, async (route) => {
          if (isGetCollectionQuery(route, conceptId)) {
            await route.fulfill({
              json: gibsCollectionGraphQlBody,
              headers: gibsCollectionGraphQlHeaders
            })
          }

          if (isGetGranuleQuery(route, 'G3453056435-LARC_CLOUD')) {
            await route.fulfill({
              json: gibsGranuleGraphQlBody,
              headers: { 'content-type': 'application/json' }
            })
          }
        })

        await page.route(/autocomplete$/, async (route) => {
          await route.fulfill({
            json: { feed: { entry: [] } }
          })
        })

        await page.route(/colormaps\/TEMPO_L3_Cloud_Cloud_Fraction_Total/, async (route) => {
          await route.fulfill({
            json: {}
          })
        })

        await page.route(/colormaps\/TEMPO_L3_Cloud_Cloud_Pressure_Total/, async (route) => {
          await route.fulfill({
            json: {}
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('search/granules?p=C2930727817-LARC_CLOUD&pg[0][id]=TEMPO_CLDO4_L3_V03_20250318T123644Z_S003.nc!TEMPO_CLDO4_L3_V03_20250317T181710Z_S009.nc&pg[0][gsk]=-start_date&lat=40&long=-100')

        // Wait for the map to load
        await initialMapPromise

        // Close the panel to work with the map easier
        await page.keyboard.press(']')
      })

      test.describe('when updating the layer visibility', () => {
        test('toggles layer visibility when clicking the visibility button @screenshot', async ({ page }) => {
          // Find and click the visibility toggle button for the first layer
          const visibilityButton = page.getByRole('button', { name: 'Hide Clouds (L3, Cloud Fraction Total, Subdaily) (PROVISIONAL)' }).first()
          await visibilityButton.click()

          // Take a screenshot to verify the layer is no longer visible
          await expect(page).toHaveScreenshot('gibs-layer-hidden.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('when updating the layer opacity', () => {
        test('updates the specified layer opacity on the map @screenshot', async ({ page }) => {
          // Find and click the settings button for the first layer to open the opacity popover
          const settingsButton = page.getByRole('button', { name: 'Adjust settings for Clouds (L3, Cloud Fraction Total, Subdaily) (PROVISIONAL)' })
          await settingsButton.click()

          // Wait for the opacity popover to be visible
          await page.getByRole('slider').waitFor()

          // Find the opacity slider and adjust it to 50%
          const opacitySlider = page.getByRole('slider')
          await opacitySlider.fill('0.5')

          // Trigger the onMouseUp event to apply the opacity change
          await opacitySlider.dispatchEvent('mouseup')

          // Wait a moment for the opacity change to be applied
          await page.waitForTimeout(500)

          // Take a screenshot to verify the layer opacity has changed
          await expect(page).toHaveScreenshot('gibs-layer-opacity-adjusted.png', {
            clip: screenshotClip
          })

          // Check the actual slider value (0.5 for 50%)
          expect(await opacitySlider.getAttribute('value')).toBe('0.5')
          // Check the displayed percentage
          expect(page.locator('div:has-text("50 %")').first()).toBeVisible()

          // Close the popover by clicking outside
          await page.locator('body').click()
        })
      })

      test.describe('when reordering layers', () => {
        test('turns on second layer visibility and drags it to the top @screenshot', async ({ page }) => {
          const layer2VisibilityButton = page.getByRole('button', { name: 'Show Clouds (L3, Cloud Pressure Total, Subdaily) (PROVISIONAL)' }).first()
          await layer2VisibilityButton.click()

          // Zoom in to make the layers more visible
          const zoomedMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
          await page.getByRole('button', { name: 'Zoom In' }).click()

          // Wait for the map to load
          await zoomedMapPromise

          // Take a screenshot to verify the layer is visible
          // In this one both are visible the bottom one is difficult to see
          await expect(page).toHaveScreenshot('gibs-second-layer-visible.png', {
            clip: screenshotClip
          })

          // Grab the layer items
          const firstLayerTitle = page.getByText('Clouds (L3, Cloud Fraction Total, Subdaily) (PROVISIONAL)')
          const secondLayerTitle = page.getByText('Clouds (L3, Cloud Pressure Total, Subdaily) (PROVISIONAL)')

          // Drag the second layer to the top (above the first layer)
          await secondLayerTitle.dragTo(firstLayerTitle)

          // Verify the layers have been reordered by checking the layer titles
          const layerItems = page.locator('.layer-picker__layers')
          const firstLayerHeader = await layerItems.first().locator('h3').first().textContent()

          // The second layer (Cloud Pressure Total) should now be first in the list
          expect(firstLayerHeader).toContain('Clouds (L3, Cloud Pressure Total, Subdaily) (PROVISIONAL)')

          // Take a screenshot to verify the reordering
          // that will update the layer we see on top
          await expect(page).toHaveScreenshot('gibs-layers-reordered.png', {
            clip: screenshotClip
          })

          // Make the first layer invisible so we can test the screenshot
          const layer1VisibilityButton = page.getByRole('button', { name: 'Hide Clouds (L3, Cloud Fraction Total, Subdaily) (PROVISIONAL)' }).first()
          await layer1VisibilityButton.click()

          await expect(page).toHaveScreenshot('gibs-layers-reordered-second-layer-hidden.png', {
            clip: screenshotClip,
            maxDiffPixelRatio: 0.1
          })
        })
      })
    })
  })
})
