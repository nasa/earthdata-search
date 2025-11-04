import { test, expect } from 'playwright-test-coverage'
import { isGetCollectionQuery } from '../../support/isGetCollectionQuery'
import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { setupTests } from '../../support/setupTests'

import colormapCollectionGraphQlHeaders from './__mocks__/colormaps/graphql.headers.json'
import colormapCollectionOneGraphQlBody from './__mocks__/colormaps/collection_graphql_1.body.json'
import colormapCollectionsBody from './__mocks__/colormaps/collections.body.json'
import colormapCollectionTwoGraphQlBody from './__mocks__/colormaps/collection_graphql_2.body.json'
import colormapGranulesHeaders from './__mocks__/colormaps/granules.headers.json'
import colormapGranulesOneBody from './__mocks__/colormaps/granules_1.body.json'
import colormapGranulesTwoBody from './__mocks__/colormaps/granules_2.body.json'
import seaSurfaceTemperatureColormapBody from './__mocks__/colormaps/seaSurfaceTemperatureColormapBody.json'
import seaSurfaceTemperatureAnomaliesColormapBody from './__mocks__/colormaps/seaSurfaceTemperatureAnomaliesColormapBody.json'
import seaIceConcentrationColormapBody from './__mocks__/colormaps/seaIceConcentrationColormapBody.json'

import airsPrataSo2IndexDayColormapBody from './__mocks__/colormaps/airsPrataS02IndexDay.body.json'
import airsPrataSo2IndexNightColormapBody from './__mocks__/colormaps/airsPrataS02IndexNight.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'

test.describe('Map: Colormap interactions', () => {
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

  const colormapMock = {
    data: {
      colormaps: [
        {
          id: 1,
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_L4_MUR_Sea_Ice_Concentration.xml',
          product: 'GHRSST_L4_MUR_Sea_Ice_Concentration',
          jsondata: seaIceConcentrationColormapBody
        },
        {
          id: 2,
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_L4_MUR_Sea_Surface_Temperature.xml',
          product: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
          jsondata: seaSurfaceTemperatureColormapBody
        },
        {
          id: 3,
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies.xml',
          product: 'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies',
          jsondata: seaSurfaceTemperatureAnomaliesColormapBody
        },
        {
          id: 4,
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/AIRS_Prata_SO2_Index_Day.xml',
          product: 'AIRS_Prata_SO2_Index_Day',
          jsondata: airsPrataSo2IndexDayColormapBody
        },
        {
          id: 5,
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/AIRS_Prata_SO2_Index_Night.xml',
          product: 'AIRS_Prata_SO2_Index_Night',
          jsondata: airsPrataSo2IndexNightColormapBody
        }
      ]
    }
  }
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

      // Const MockColorMapRoute = async (route) => route.fulfill({
      //   json: colormapMock
      // })

      await page.route(/graphql$/, async (route) => {
        const { query } = JSON.parse(route.request().postData())

        console.log('🚀 ~ file: map_granules_colormaps.spec.js:90 ~ query:', query)

        if (query.includes('GetColorMaps')) {
          console.log('we are in the query')
          await route.fulfill({ json: colormapMock })
        }
      })

      // Await page.route(/colormaps\/GHRSST_L4_MUR_Sea_Ice_Concentration/, async (route) => {
      //   await route.fulfill({
      //     json: seaIceConcentrationColormapBody
      //   })
      // })

      // await page.route(/colormaps\/GHRSST_L4_MUR_Sea_Surface_Temperature/, async (route) => {
      //   await route.fulfill({
      //     json: seaSurfaceTemperatureColormapBody
      //   })
      // })

      // await page.route(/colormaps\/GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies/, async (route) => {
      //   await route.fulfill({
      //     json: seaSurfaceTemperatureAnomaliesColormapBody
      //   })
      // })

      // await page.route(/colormaps\/AIRS_Prata_SO2_Index_Day/, async (route) => {
      //   await route.fulfill({
      //     json: airsPrataSo2IndexDayColormapBody
      //   })
      // })

      // await page.route(/colormaps\/AIRS_Prata_SO2_Index_Night/, async (route) => {
      //   await route.fulfill({
      //     json: airsPrataSo2IndexNightColormapBody
      //   })
      // })

      const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
      await page.goto('search/granules?p=C1996881146-POCLOUD')

      // Wait for the map to load
      await initialMapPromise

      // Wait for the timeline to be visible
      await page.getByRole('button', { name: 'Hide Timeline' }).waitFor()
    })

    test('displays the color map on the page @screenshot', async ({ page }) => {
      const legend = page.getByTestId('legend')
      await legend.scrollIntoViewIfNeeded()
      // Await legend.scrollIntoViewIfNeeded()

      // Retrieve the colormaps for each layer and ensure they match the screenshot
      const firstCanvas = legend.locator('canvas').nth(0)
      await expect(firstCanvas).toHaveScreenshot('sea-ice-concentration-colormap.png', {
        maxDiffPixelRatio: 0.01
      })

      const secondCanvas = legend.locator('canvas').nth(1)
      await expect(secondCanvas).toHaveScreenshot('sea-surface-temperature-colormap.png', {
        maxDiffPixelRatio: 0.01
      })

      const thirdCanvas = legend.locator('canvas').nth(2)
      await expect(thirdCanvas).toHaveScreenshot('sea-surface-temperature-anomalies-colormap.png', {
        maxDiffPixelRatio: 0.01
      })

      await expect(page.getByTestId('legend-label-min').first()).toHaveText('0 – 1 %')
      await expect(page.getByTestId('legend-label-max').first()).toHaveText('100 %')
    })

    test.describe('when hovering over the colormap', () => {
      test('displays color map data to the user', async ({ page }) => {
        // Hover over the middle of the colorbar
        await page.locator('.colormap__bar').first().hover()

        await expect(page.getByTestId('legend-label')).toHaveText('50 – 51 %')
      })
    })

    test.describe('when returning to the search results page', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole('button', {
          name: 'Search Results (8,098 Collections)'
        })
          .first()
          .click()
      })

      test('does not show the colormap', async ({ page }) => {
        await expect(page.getByText('Visualization Layers')).not.toBeInViewport()
      })

      test.describe('when visiting another collection with a colormap', () => {
        test('displays a new colormap @screenshot', async ({ page }) => {
          await page.getByTestId('collection-result-item_C1243477369-GES_DISC').click()
          // Wait for the timeline to be visible as a proxy for the map being ready
          await page.getByRole('button', { name: 'Hide Timeline' }).waitFor()

          const legend = page.getByTestId('legend')

          const firstCanvas = legend.locator('canvas').nth(0)
          await expect(firstCanvas).toHaveScreenshot('sulfur-dioxide-day-colormap.png', {
            maxDiffPixelRatio: 0.01
          })

          const secondCanvas = legend.locator('canvas').nth(1)
          await expect(secondCanvas).toHaveScreenshot('sulfur-dioxide-night-colormap.png', {
            maxDiffPixelRatio: 0.01
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
        // The legend/Layer Picker should be removed if the imagery layers are empty
        // and the legend control is not on the collection focused page
        await expect(page.getByText('Visualization Layers')).not.toBeInViewport()
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
})
