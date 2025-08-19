import { test, expect } from 'playwright-test-coverage'
import { isGetCollectionQuery } from '../../support/isGetCollectionQuery'
import { isGetGranuleQuery } from '../../support/isGetGranuleQuery'
import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { setupTests } from '../../support/setupTests'

import cmrGranulesBody from './__mocks__/cmr_granules/granules.body.json'
import cmrGranulesCollectionBody from './__mocks__/cmr_granules/collections.body.json'
import cmrGranulesCollectionGraphQlBody from './__mocks__/cmr_granules/collection_graphql.body.json'
import cmrGranulesCollectionGraphQlHeaders from './__mocks__/cmr_granules/graphql.headers.json'
import cmrGranulesHeaders from './__mocks__/cmr_granules/granules.headers.json'
import colormapCollectionGraphQlHeaders from './__mocks__/colormaps/graphql.headers.json'
import colormapCollectionOneGraphQlBody from './__mocks__/colormaps/collection_graphql_1.body.json'
import colormapCollectionsBody from './__mocks__/colormaps/collections.body.json'
import colormapCollectionTwoGraphQlBody from './__mocks__/colormaps/collection_graphql_2.body.json'
import colormapGranulesHeaders from './__mocks__/colormaps/granules.headers.json'
import colormapGranulesOneBody from './__mocks__/colormaps/granules_1.body.json'
import colormapGranulesTwoBody from './__mocks__/colormaps/granules_2.body.json'
import colormapOneBody from './__mocks__/colormaps/colormap_1.body.json'
import colormapTwoBody from './__mocks__/colormaps/colormap_2.body.json'
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import gibsCollectionGraphQlBody from './__mocks__/gibs/collection_graphql.body.json'
import gibsCollectionGraphQlHeaders from './__mocks__/gibs/graphql.headers.json'
import gibsCollectionsBody from './__mocks__/gibs/collections.body.json'
import gibsGranuleGraphQlBody from './__mocks__/gibs/granule_graphql.body.json'
import gibsGranulesBody from './__mocks__/gibs/granules.body.json'
import gibsGranulesHeaders from './__mocks__/gibs/granules.headers.json'
import granuleCrossingCollectionBody from './__mocks__/cmr_granules/granule_crossing_collections.body.json'
import granuleCrossingCollectionGraphQlBody from './__mocks__/cmr_granules/granule_crossing_collection_graphql.body.json'
import granuleCrossingGranuleGraphQlBody from './__mocks__/cmr_granules/granule_crossing_granule_graphql.body.json'
import granuleCrossingGranulesBody from './__mocks__/cmr_granules/granule_crossing_granules.body.json'
import granuleCrossingGranulesHeaders from './__mocks__/cmr_granules/granule_crossing_granules.headers.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

const colormapScreenshotClip = {
  x: 1135,
  y: 92,
  width: 252,
  height: 47
}

const temporalLabelClass = '.map__focused-granule-overlay__granule-label-temporal'

const dragPanelToX = async (page, x) => {
  const handle = page.locator('[data-testid="panels__handle"]')
  await handle.hover()
  await handle.dispatchEvent('mousedown', { button: 0 })
  await handle.dispatchEvent('mousemove', { clientX: x })
  await handle.dispatchEvent('mouseup', { button: 0 })
}

test.describe('Map: Granule interactions', () => {
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

  test.describe('When viewing granule results', () => {
    test.describe('When viewing CMR granules', () => {
      test.beforeEach(async ({ page }) => {
        const conceptId = 'C1214470488-ASF'

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: cmrGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            paramCheck: (parsedQuery) => parsedQuery?.keyword === conceptId && parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647'
          }],
          includeDefault: false
        })

        await page.route(/search\/granules.json/, async (route) => {
          const query = route.request().postData()

          expect(query).toEqual('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&sort_key=-start_date')

          await route.fulfill({
            json: cmrGranulesBody,
            headers: cmrGranulesHeaders
          })
        })

        await page.route(/api$/, async (route) => {
          expect(isGetCollectionQuery(route, conceptId)).toEqual(true)

          await route.fulfill({
            json: cmrGranulesCollectionGraphQlBody,
            headers: cmrGranulesCollectionGraphQlHeaders
          })
        })

        await page.route(/autocomplete$/, async (route) => {
          await route.fulfill({
            json: { feed: { entry: [] } }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/5/)
        await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!&lat=-5.067707&long=44.91944336437247&zoom=5.714045446675903`)

        // Wait for the map to load
        await initialMapPromise
      })

      test.describe('When hovering over a granule', () => {
        test('highlights the granule in the granule results list', async ({ page }) => {
          await page.locator('.map').hover({
            force: true,
            position: {
              x: 1200,
              y: 350
            }
          })

          await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20210531T153052_20210531T153122_038133_04802B_C09D/ })).toHaveClass(/granule-results-item--active/)
        })
      })

      test.describe('When clicking on a granule', () => {
        test.beforeEach(async ({ page }) => {
          await page.route(/api$/, async (route) => {
            expect(isGetGranuleQuery(route, 'G2061166811-ASF')).toEqual(true)

            await route.fulfill({
              json: granuleGraphQlBody,
              headers: { 'content-type': 'application/json' }
            })
          })

          await page.locator('.map').click({
            force: true,
            position: {
              x: 1200,
              y: 350
            }
          })
        })

        test('shows the granule and a label on the map and updates the url @screenshot', async ({ page }) => {
          await expect(page.locator(temporalLabelClass)).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')

          // Updates the URL with the selected granule
          await expect(page).toHaveURL(/\/search\/granules.*g=G2061166811-ASF/)

          // Draws the granule on the map
          await expect(page).toHaveScreenshot('focused-granule.png', {
            clip: screenshotClip
          })
        })

        test.describe('when returning to the collections results list', () => {
          test('removes the granule label from the map', async ({ page }) => {
            await page.getByTestId('panel-group_granule-results')
              .getByTestId('breadcrumb-button')
              .click()

            await expect(page.locator(temporalLabelClass)).not.toBeInViewport()
          })
        })

        test.describe('when panning the map', () => {
          test('does not remove the focused granule @screenshot', async ({ page }) => {
            // Drag the map
            await page.mouse.move(1000, 500)
            await page.mouse.down()

            // Wait just a little before moving the mouse
            await page.waitForTimeout(100)
            await page.mouse.move(1000, 600, { steps: 3 })

            // Wait just a little before releasing the mouse
            await page.waitForTimeout(100)
            await page.mouse.up()

            await expect(page.locator(temporalLabelClass)).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')

            await expect(page).toHaveScreenshot('focused-granule-panned.png', {
              clip: screenshotClip
            })
          })
        })

        test.describe('when zooming the map', () => {
          test('does not remove the focused granule @screenshot', async ({ page }) => {
            const zoomPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/6/)

            // Zoom the map
            await page.getByRole('button', { name: 'Zoom In' }).click()

            await expect(page.locator(temporalLabelClass)).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')

            // Wait for the map animation to complete
            await page.waitForURL(/zoom=6/)
            await zoomPromise

            await expect(page).toHaveScreenshot('focused-granule-zoomed.png', {
              clip: screenshotClip
            })
          })
        })

        test.describe('when clicking on an empty spot on the map', () => {
          test('removes the focused granule', async ({ page }) => {
            await page.locator('.map').click({
              force: true,
              position: {
                x: 1300,
                y: 100
              }
            })

            await expect(page.locator(temporalLabelClass)).not.toBeInViewport()
          })
        })

        test.describe('when clicking the same granule again', () => {
          test('removes the focused granule', async ({ page }) => {
            await page.locator('.map').click({
              force: true,
              position: {
                x: 1200,
                y: 600
              }
            })

            await expect(page.locator(temporalLabelClass)).not.toBeInViewport()
          })
        })
      })
    })
  })

  test.describe('When viewing granules with colormap data', () => {
    test.beforeEach(async ({ page }) => {
      const conceptIdOne = 'C1996881146-POCLOUD'
      const conceptIdTwo = 'C1243477369-GES_DISC'

      await interceptUnauthenticatedCollections({
        page,
        body: colormapCollectionsBody,
        headers: commonHeaders
      })

      await page.route(/search\/granules.json/, async (route) => {
        const query = route.request().postData()

        if (query === `echo_collection_id=${conceptIdOne}&page_num=1&page_size=20&sort_key=-start_date`) {
          await route.fulfill({
            json: colormapGranulesOneBody,
            headers: colormapGranulesHeaders
          })
        }

        if (query === `echo_collection_id=${conceptIdTwo}&page_num=1&page_size=20&sort_key=-start_date`) {
          await route.fulfill({
            json: colormapGranulesTwoBody,
            headers: colormapGranulesHeaders
          })
        }
      })

      await page.route(/api$/, async (route) => {
        if (isGetCollectionQuery(route, conceptIdOne)) {
          await route.fulfill({
            json: colormapCollectionOneGraphQlBody,
            headers: colormapCollectionGraphQlHeaders
          })
        }

        if (isGetCollectionQuery(route, conceptIdTwo)) {
          await route.fulfill({
            json: colormapCollectionTwoGraphQlBody,
            headers: colormapCollectionGraphQlHeaders
          })
        }
      })

      await page.route(/autocomplete$/, async (route) => {
        await route.fulfill({
          json: { feed: { entry: [] } }
        })
      })

      await page.route(/colormaps\/GHRSST_L4_MUR_Sea_Ice_Concentration/, async (route) => {
        await route.fulfill({
          json: colormapOneBody
        })
      })

      await page.route(/colormaps\/AIRS_Prata_SO2_Index_Day/, async (route) => {
        await route.fulfill({
          json: colormapTwoBody
        })
      })

      const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
      await page.goto('search/granules?p=C1996881146-POCLOUD')

      // Wait for the map to load
      await initialMapPromise

      // Wait for the timeline to be visible
      await page.getByRole('button', { name: 'Hide Timeline' }).waitFor()
    })

    test('displays the color map on the page @screenshot', async ({ page }) => {
      await page.getByTestId('legend').scrollIntoViewIfNeeded()
      await expect(page).toHaveScreenshot('colormap-screenshot.png', {
        clip: colormapScreenshotClip
      })

      await expect(page.getByTestId('legend-label-min').first()).toHaveText('0 – 1 %')
      await expect(page.getByTestId('legend-label-max').first()).toHaveText('100 %')
    })

    test.describe('when hovering over the colormap', () => {
      test('displays color map data to the user', async ({ page }) => {
        // Hover over the middle of the colorbar
        await page.locator('.colormap__bar').first().hover()

        await expect(page.getByTestId('legend-label')).toHaveText('50 – 51 %')
        await expect(page.getByTestId('legend-label-color')).toHaveAttribute('style', 'background-color: rgb(0, 217, 142);')
      })
    })

    test.describe('when returning to the search results page', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('panel-group_granule-results')
          .getByTestId('breadcrumb-button')
          .click()
      })

      test('does not show the colormap', async ({ page }) => {
        await expect(page.getByTestId('legend')).not.toBeInViewport()
      })

      test.describe('when visiting another collection with a colormap', () => {
        test('displays a new colormap @screenshot', async ({ page }) => {
          await page.getByTestId('collection-result-item_C1243477369-GES_DISC').click()

          // Wait for the timeline to be visible
          await page.getByRole('button', { name: 'Hide Timeline' }).waitFor()

          await expect(page).toHaveScreenshot('colormap-2-screenshot.png', {
            clip: colormapScreenshotClip
          })

          await expect(page.getByTestId('legend-label-min').first()).toHaveText('0.00 – 0.12 DU')
          await expect(page.getByTestId('legend-label-max').first()).toHaveText('500.00 DU')
        })
      })
    })

    test.describe('when switching the projection', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByLabel('North Polar Stereographic').click()
      })

      test('does not show the colormap', async ({ page }) => {
        await expect(page.getByTestId('legend')).not.toBeInViewport()
      })

      test.describe('when switching back to the geographic projection', () => {
        test.beforeEach(async ({ page }) => {
          await page.getByLabel('Geographic (Equirectangular)').click()
        })

        test('displays the colormap', async ({ page }) => {
          await expect(page.getByTestId('legend')).toBeInViewport()
        })
      })
    })
  })

  test.describe('when viewing a granule that crosses the antimeridian twice', () => {
    test.beforeEach(async ({ page }) => {
      const conceptId = 'C1258816710-ASDC_DEV2'

      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: granuleCrossingCollectionBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': '1'
          },
          paramCheck: (parsedQuery) => parsedQuery?.keyword === conceptId && parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647'
        }],
        includeDefault: false
      })

      await page.route(/search\/granules.json/, async (route) => {
        const query = route.request().postData()

        expect(query).toEqual('echo_collection_id=C1258816710-ASDC_DEV2&options[readable_granule_name][pattern]=true&page_num=1&page_size=20&readable_granule_name[]=PREFIRE_SAT1_2B-ATM_S02_R00_20210101190614_00013.nc&sort_key=-start_date')

        await route.fulfill({
          json: granuleCrossingGranulesBody,
          headers: granuleCrossingGranulesHeaders
        })
      })

      await page.route(/api$/, async (route) => {
        if (isGetCollectionQuery(route, conceptId)) {
          await route.fulfill({
            json: granuleCrossingCollectionGraphQlBody,
            headers: cmrGranulesCollectionGraphQlHeaders
          })
        }

        if (isGetGranuleQuery(route, 'G1259235357-ASDC_DEV2')) {
          await route.fulfill({
            json: granuleCrossingGranuleGraphQlBody,
            headers: { 'content-type': 'application/json' }
          })
        }
      })

      const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/4/)
      await page.goto('/search/granules?p=C1258816710-ASDC_DEV2&pg[0][v]=f&pg[0][id]=PREFIRE_SAT1_2B-ATM_S02_R00_20210101190614_00013.nc&pg[0][gsk]=-start_date&ee=uat&g=G1259235357-ASDC_DEV2&q=C1258816710-ASDC_DEV&tl=1731348943!3!!&lat=58.66663295801644&long=169.857421875&zoom=5')

      // Wait for the map to load
      await initialMapPromise
    })

    test.describe('when hovering over the granule', () => {
      test.beforeEach(async ({ page }) => {
        await page.locator('body').hover({
          force: true,
          position: {
            x: 1300,
            y: 350
          }
        })
      })

      test('correctly draws the granule outline @screenshot', async ({ page }) => {
        // This takes a very narrow screenshot of one portion of the granule where it cross the antimeridian.
        // Before fixing a bug in the code (EDSC-3903), a horizontal line would be drawn through this
        // screenshot instead of correctly drawing the granule outline.
        await expect(page).toHaveScreenshot('granule-crosses-antimeridian.png', {
          clip: {
            x: 1140,
            y: 350,
            width: 300,
            height: 50
          },
          maxDiffPixelRatio: 0.03
        })
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

        test('toggles layer visibility when clicking the visibility button @screenshot', async ({ page }) => {
          await page.getByTestId('legend').waitFor()

          await dragPanelToX(page, -1500)

          // Find and click the visibility toggle button for the first layer
          const visibilityButton = page.locator('.layer-picker__layer-toggle').first()
          await visibilityButton.click()

          // Take a screenshot to verify the layer is no longer visible
          await expect(page).toHaveScreenshot('gibs-layer-hidden.png', {
            clip: screenshotClip
          })
        })

        test('updates layer opacity when adjusting the opacity slider @screenshot', async ({ page }) => {
          await page.getByTestId('legend').waitFor()
          await dragPanelToX(page, -1500)

          // Find and click the settings button for the first layer to open the opacity popover
          const settingsButton = page.locator('.layer-picker__layer-settings').first()
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

        test('turns on second layer visibility and drags it to the top @screenshot', async ({ page }) => {
          await page.getByTestId('legend').waitFor()
          await dragPanelToX(page, -1500)

          // Verify the the first layer product name
          const layerItems = page.locator('.layer-picker__layer-item')
          const firstLayerProductName = await layerItems.first().locator('.layer-picker__layer-name').textContent()
          expect(firstLayerProductName).toContain('Clouds (L3, Cloud Fraction Total, Subdaily) (PROVISIONAL)')

          const secondLayerVisibilityButton = page.locator('.layer-picker__layer-toggle').nth(1)
          await secondLayerVisibilityButton.click()

          // Find the second layer's drag handle
          const secondLayerDragHandle = page.getByRole('button', { name: 'Drag to reorder layer' }).nth(1)

          // Get the bounding box of the first layer to know where to drop
          const firstLayer = page.locator('.layer-picker__layer-item').first()
          const firstLayerBox = await firstLayer.boundingBox()

          // Drag the second layer to the top (above the first layer)
          await secondLayerDragHandle.hover()
          await page.mouse.down()
          await page.mouse.move(firstLayerBox.x + firstLayerBox.width / 2, firstLayerBox.y - 20)
          await page.mouse.up()

          // Wait a moment for the drag operation to complete
          await page.waitForTimeout(500)

          // Verify the second layer is now at the top
          const layerItemsUpdated = page.locator('.layer-picker__layer-item')
          const updatedFirstLayerProductName = await layerItemsUpdated.first().locator('.layer-picker__layer-name').textContent()

          // The second layer should now be first in the list "Cloud Pressure Total"
          expect(updatedFirstLayerProductName).toContain('Clouds (L3, Cloud Pressure Total, Subdaily) (PROVISIONAL)')
        })
      })
    })
  })
})
