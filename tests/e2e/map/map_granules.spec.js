import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../support/graphQlGetCollection'
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
import granuleCrossingCollectionBody from './__mocks__/cmr_granules/granule_crossing_collections.body.json'
import granuleCrossingCollectionGraphQlBody from './__mocks__/cmr_granules/granule_crossing_collection_graphql.body.json'
import granuleCrossingGranuleGraphQlBody from './__mocks__/cmr_granules/granule_crossing_granule_graphql.body.json'
import granuleCrossingGranulesBody from './__mocks__/cmr_granules/granule_crossing_granules.body.json'
import granuleCrossingGranulesHeaders from './__mocks__/cmr_granules/granule_crossing_granules.headers.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'
import opensearchGranulesBody from './__mocks__/opensearch_granules/granules_body'
import opensearchGranulesCollectionBody from './__mocks__/opensearch_granules/collections.body.json'
import opensearchGranulesCollectionGraphQlBody from './__mocks__/opensearch_granules/graphql.body.json'
import opensearchGranulesCollectionGraphQlHeaders from './__mocks__/opensearch_granules/graphql.headers.json'
import opensearchGranulesHeaders from './__mocks__/opensearch_granules/granules.headers.json'
import opensearchGranulesTimelineBody from './__mocks__/opensearch_granules/timeline.body.json'
import opensearchGranulesTimelineHeaders from './__mocks__/opensearch_granules/timeline.headers.json'

test.describe('Map: Granule interactions', () => {
  test.beforeEach(async ({ page, context, browserName }) => {
    await setupTests({
      browserName,
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
          const query = route.request().postData()

          expect(query).toEqual(graphQlGetCollection(conceptId))

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

        await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!`)
      })

      test.describe('When hovering over a granule', () => {
        test('highlights the granule in the granule results list', async ({ page }) => {
          await page.getByTestId('panels__handle').click()
          await expect(page.getByTestId('panels-section')).toHaveClass(/panels--is-minimized/)

          await page.locator('g path.leaflet-interactive').hover({
            force: true,
            position: {
              x: 20,
              y: 20
            }
          })

          await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20210531T153052_20210531T153122_038133_04802B_C09D/ })).toHaveClass(/granule-results-item--active/)
        })
      })

      test.describe('When clicking on a granule', () => {
        test.beforeEach(async ({ page }) => {
          await page.route(/api$/, async (route) => {
            const query = route.request().postData()

            expect(query).toEqual('{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"G2061166811-ASF"}}}')

            await route.fulfill({
              json: granuleGraphQlBody,
              headers: { 'content-type': 'application/json' }
            })
          })

          await page.getByTestId('panels__handle').click()
          await expect(page.getByTestId('panels-section')).toHaveClass(/panels--is-minimized/)

          await page.locator('g path.leaflet-interactive').click({
            force: true,
            position: {
              x: 20,
              y: 20
            }
          })

          // Wait for any animations to complete
          await page.waitForTimeout(1000)
        })

        test('shows the granule and a label on the map and updates the url', async ({ page }) => {
          await expect(await page.locator('g path').all()).toHaveLength(5)
          await expect(page.locator('.granule-spatial-label-temporal')).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')

          // Now expand panel to check URL
          await page.getByTestId('panels__handle').click()
          await expect(page.getByTestId('panels-section')).not.toHaveClass(/panels--is-minimized/)

          // Updates the URL with the selected granule
          await expect(page).toHaveURL(/\/search\/granules.*g=G2061166811-ASF/)
        })

        test.describe('when returning to the collections results list', () => {
          test('removes the granule label from the map', async ({ page }) => {
            await page.getByTestId('panels__handle').click()
            await expect(page.getByTestId('panels-section')).not.toHaveClass(/panels--is-minimized/)
            await page.getByTestId('panel-group_granule-results')
              .getByTestId('breadcrumb-button')
              .click()

            await expect(page.locator('.granule-spatial-label-temporal')).not.toBeInViewport()
          })
        })

        test.describe('when panning the map', () => {
          test('does not remove the stickied granule', async ({ page }) => {
            await expect(await page.locator('g path').all()).toHaveLength(5)

            // Drag the map
            await page.mouse.move(1000, 500)
            await page.mouse.down()
            await page.mouse.move(1000, 600)
            await page.mouse.up()

            await expect(await page.locator('g path').all()).toHaveLength(3)
            await expect(page.locator('.granule-spatial-label-temporal')).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')
          })
        })

        test.describe('when zooming the map', () => {
          test('does not remove the stickied granule', async ({ page }) => {
            await expect(await page.locator('g path').all()).toHaveLength(5)

            // Zoom the map
            await page.locator('.leaflet-control-zoom-in').click()

            await expect(await page.locator('g path').all()).toHaveLength(3)
            await expect(page.locator('.granule-spatial-label-temporal')).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')
          })
        })

        test.describe('when clicking on an empty spot on the map', () => {
          test('removes the stickied granule', async ({ page }) => {
            await page.locator('.map').click({
              force: true,
              position: {
                x: 200,
                y: 720
              }
            })

            await expect(page.locator('.granule-spatial-label-temporal')).not.toBeInViewport()
          })
        })

        test.describe('when clicking the same granule again', () => {
          test('removes the stickied granule', async ({ page }) => {
            await page.locator('.map').click({
              force: true,
              position: {
                x: 1000,
                y: 720
              }
            })

            await expect(page.locator('.granule-spatial-label-temporal')).not.toBeInViewport()
          })
        })
      })
    })

    test.describe('When viewing OpenSearch granules with polygon spatial', () => {
      test.beforeEach(async ({ page }) => {
        const conceptId = 'C1972468359-SCIOPS'

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: opensearchGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            paramCheck: (parsedQuery) => parsedQuery?.keyword === conceptId && parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647'
          }],
          includeDefault: false
        })

        await page.route(/opensearch\/granules$/, async (route) => {
          const query = JSON.parse(route.request().postData()).params

          expect(query).toEqual({
            boundingBox: '42.18750000000001,-9.453289809825428,49.218749999999986,-2.4064699999999886',
            conceptId: [],
            echoCollectionId: 'C1972468359-SCIOPS',
            exclude: {},
            openSearchOsdd: 'http://47.90.244.40/glass/osdd/fapar_modis_0.05d.xml',
            options: {},
            pageNum: 1,
            pageSize: 20,
            sortKey: '-start_date',
            twoDCoordinateSystem: {}
          })

          await route.fulfill({
            json: opensearchGranulesBody,
            headers: opensearchGranulesHeaders
          })
        })

        await page.route(/search\/granules\/timeline$/, async (route) => {
          const query = route.request().postData()

          expect(query).toEqual('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1972468359-SCIOPS&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647')

          await route.fulfill({
            json: opensearchGranulesTimelineBody,
            headers: opensearchGranulesTimelineHeaders
          })
        })

        await page.route(/api$/, async (route) => {
          const query = route.request().postData()

          expect(query).toEqual(graphQlGetCollection(conceptId))

          await route.fulfill({
            json: opensearchGranulesCollectionGraphQlBody,
            headers: opensearchGranulesCollectionGraphQlHeaders
          })
        })

        await page.route(/autocomplete$/, async (route) => {
          await route.fulfill({
            json: { feed: { entry: [] } }
          })
        })

        await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!`)
      })

      test('displays a hint about using a bounding box instead of polygon and an MBR on the map', async ({ page }) => {
        await expect(page.getByText('Showing 20 of 42,706 matching granules')).toBeVisible()

        await expect(
          page.getByTestId('filter-stack__spatial').locator('.filter-stack-item__error')
        ).toHaveText('This collection does not support polygon search. Your polygon has been converted to a bounding box.')

        await page.getByTestId('panels__handle').click()
        await expect(page.getByTestId('panels-section')).not.toHaveClass(/panels--is-collapsed/)

        await expect(await page.locator('g path').first()).toBeVisible()
        await expect(await page.locator('g path').all()).toHaveLength(2)
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

        if (query === `echo_collection_id=${conceptIdOne}&page_num=1&page_size=20`) {
          await route.fulfill({
            json: colormapGranulesOneBody,
            headers: colormapGranulesHeaders
          })
        }

        if (query === `echo_collection_id=${conceptIdTwo}&page_num=1&page_size=20`) {
          await route.fulfill({
            json: colormapGranulesTwoBody,
            headers: colormapGranulesHeaders
          })
        }
      })

      await page.route(/api$/, async (route) => {
        const query = route.request().postData()

        if (query === graphQlGetCollection(conceptIdOne)) {
          await route.fulfill({
            json: colormapCollectionOneGraphQlBody,
            headers: colormapCollectionGraphQlHeaders
          })
        }

        if (query === graphQlGetCollection(conceptIdTwo)) {
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

      await page.goto('search/granules?p=C1996881146-POCLOUD')
    })

    test('displays the color map on the page', async ({ page }) => {
      await expect(page).toHaveScreenshot('colormap-screenshot.png', {
        clip: {
          x: 1138,
          y: 263,
          width: 252,
          height: 47
        }
      })

      await expect(page.getByTestId('legend-label-min')).toHaveText('0 – 1 %')
      await expect(page.getByTestId('legend-label-max')).toHaveText('100 %')
    })

    test.describe('when hovering over the colormap', () => {
      test('displays color map data to the user', async ({ page }) => {
        await page.getByTestId('legend').hover({
          position: {
            x: 113,
            y: 5
          }
        })

        await expect(page.getByTestId('legend-label')).toHaveText('44 – 45 %')
        await expect(page.getByTestId('legend-label-color')).toHaveAttribute('style', 'background-color: rgb(0, 250, 241);')
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
        test('displays a new colormap', async ({ page }) => {
          await page.getByTestId('collection-result-item_C1243477369-GES_DISC').click()
          await expect(page.getByTestId('timeline')).toBeInViewport()

          await expect(page).toHaveScreenshot('colormap-2-screenshot.png', {
            clip: {
              x: 1138,
              y: 260,
              width: 252,
              height: 47
            }
          })

          await expect(page.getByTestId('legend-label-min')).toHaveText('0.00 – 0.12 DU')
          await expect(page.getByTestId('legend-label-max')).toHaveText('500.00 DU')
        })
      })
    })

    test.describe('when switching the projection', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('projection-switcher__arctic').click()
      })

      test('does not show the colormap', async ({ page }) => {
        await expect(page.getByTestId('legend')).not.toBeInViewport()
      })

      test.describe('when switching back to the geographic projection', () => {
        test.beforeEach(async ({ page }) => {
          await page.getByTestId('projection-switcher__geo').click()
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
        const query = route.request().postData()

        if (query === graphQlGetCollection(conceptId)) {
          await route.fulfill({
            json: granuleCrossingCollectionGraphQlBody,
            headers: cmrGranulesCollectionGraphQlHeaders
          })
        }

        if (query === `{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"${conceptId}"}}}`) {
          await route.fulfill({
            json: granuleCrossingGranuleGraphQlBody,
            headers: { 'content-type': 'application/json' }
          })
        }
      })

      await page.goto('/search/granules?p=C1258816710-ASDC_DEV2&pg[0][v]=f&pg[0][id]=PREFIRE_SAT1_2B-ATM_S02_R00_20210101190614_00013.nc&pg[0][gsk]=-start_date&ee=uat&g=G1259235357-ASDC_DEV2&q=C1258816710-ASDC_DEV&tl=1731348943!3!!&lat=58.66663295801644&long=169.857421875&zoom=5')
    })

    test.describe('when hovering over the granule', () => {
      test.beforeEach(async ({ page }) => {
        await page.waitForTimeout(500)
        await page.locator('body').hover({
          force: true,
          position: {
            x: 1100,
            y: 200
          }
        })
      })

      test('correctly draws the granule outline', async ({ page }) => {
        // This takes a very narrow screenshot of one portion of the granule where it cross the antimeridian.
        // Before fixing a bug in the code (EDSC-3903), a horizontal line would be drawn through this
        // screenshot instead of correctly drawing the granule outline.
        await expect(page).toHaveScreenshot('granule-crosses-antimeridian.png', {
          clip: {
            x: 1000,
            y: 200,
            width: 300,
            height: 50
          },
          maxDiffPixelRatio: 0.03
        })
      })
    })
  })
})
