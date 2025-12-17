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
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import granuleCrossingCollectionBody from './__mocks__/cmr_granules/granule_crossing_collections.body.json'
import granuleCrossingCollectionGraphQlBody from './__mocks__/cmr_granules/granule_crossing_collection_graphql.body.json'
import granuleCrossingGranuleGraphQlBody from './__mocks__/cmr_granules/granule_crossing_granule_graphql.body.json'
import granuleCrossingGranulesBody from './__mocks__/cmr_granules/granule_crossing_granules.body.json'
import granuleCrossingGranulesHeaders from './__mocks__/cmr_granules/granule_crossing_granules.headers.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'
import { defaultCollectionFormData, matchesFormData } from '../../support/matchesFormData'

const temporalLabelClass = '.map__focused-granule-overlay__granule-label-temporal'
const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
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
            paramCheck: async (request) => matchesFormData(request, {
              ...defaultCollectionFormData,
              keyword: 'C1214470488-ASF*',
              'polygon[]': '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647'
            })
          }],
          includeDefault: false
        })

        await page.route(/search\/granules.json/, async (route) => {
          const granulesFormData = {
            echo_collection_id: 'C1214470488-ASF',
            page_num: '1',
            page_size: '20',
            'polygon[]': '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647',
            sort_key: '-start_date'
          }

          expect(await matchesFormData(route.request(), granulesFormData)).toEqual(true)

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
          paramCheck: async (request) => matchesFormData(request, {
            ...defaultCollectionFormData,
            keyword: 'C1258816710-ASDC_DEV*'
          })
        }],
        includeDefault: false
      })

      await page.route(/search\/granules.json/, async (route) => {
        const granulesFormData = {
          echo_collection_id: 'C1258816710-ASDC_DEV2',
          'options[readable_granule_name][pattern]': 'true',
          page_num: '1',
          page_size: '20',
          'readable_granule_name[]': 'PREFIRE_SAT1_2B-ATM_S02_R00_20210101190614_00013.nc',
          sort_key: '-start_date'
        }

        expect(await matchesFormData(route.request(), granulesFormData)).toEqual(true)

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
})
