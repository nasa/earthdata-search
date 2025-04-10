import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../../../support/graphQlGetCollection'
import {
  interceptUnauthenticatedCollections
} from '../../../../support/interceptUnauthenticatedCollections'
import { setupTests } from '../../../../support/setupTests'

import commonBody from './__mocks__/cmr_granules/common_collections.body.json'
import commonHeaders from './__mocks__/cmr_granules/common_collections.headers.json'
import cmrGranulesCollectionBody from './__mocks__/cmr_granules/collections.body.json'
import cmrGranulesCollectionGraphQlBody from './__mocks__/cmr_granules/collection_graphql.body.json'
import cmrGranulesCollectionGraphQlHeaders from './__mocks__/cmr_granules/graphql.headers.json'
import cmrGranulesBody from './__mocks__/cmr_granules/granules.body.json'
import cmrGranulesHeaders from './__mocks__/cmr_granules/granules.headers.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'
import colormapBody from './__mocks__/cmr_granules/colormap.body.json'

const granuleName = 'VJ102IMG_NRT.A2024299.1448.021.2024299184114.nc'

test.describe('When clicking on a granule on the map', () => {
  test.beforeEach(async ({ page, context }) => {
    const conceptId = 'C2208779826-LANCEMODIS'

    await setupTests({
      page,
      context
    })

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
        paramCheck: (parsedQuery) => parsedQuery?.keyword === conceptId && parsedQuery?.zoom?.[0] === '0'
      }],
      includeDefault: false
    })

    await page.route(/search\/granules.json/, async (route) => {
      await route.fulfill({
        json: cmrGranulesBody,
        headers: cmrGranulesHeaders
      })
    })

    await page.route(/api$/, async (route) => {
      const query = route.request().postData()

      if (query === graphQlGetCollection(conceptId)) {
        await route.fulfill({
          json: cmrGranulesCollectionGraphQlBody,
          headers: cmrGranulesCollectionGraphQlHeaders
        })
      }

      if (query === `{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"${conceptId}"}}}`) {
        await route.fulfill({
          json: granuleGraphQlBody,
          headers: { 'content-type': 'application/json' }
        })
      }
    })

    await page.route(/autocomplete$/, async (route) => {
      await route.fulfill({
        json: { feed: { entry: [] } }
      })
    })

    await page.route(/colormaps\/VIIRS_NOAA20_Brightness_Temp_BandI5_Day/, async (route) => {
      await route.fulfill({
        json: colormapBody
      })
    })

    const baseTilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)

    await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&q=${conceptId}&tl=1730131646!3!!&lat=35.35040540820201&long=150.140625&zoom=4`)

    // Wait for the map to load
    await baseTilePromise
  })

  test.describe('When clicking on a map granule while in the granule list view', () => {
    test.beforeEach(async ({ page }) => {
      const zoomedOutTilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/0/)

      await page.locator('.map').click({
        force: true,
        position: {
          x: 1200,
          y: 150
        }
      })

      await zoomedOutTilePromise
    })

    test('scrolls to the highlighted granule', async ({ page }) => {
      const highlightedCard = await page.getByRole('button', {
        name: granuleName
      })

      // Check that the granule is highlighted
      await expect(highlightedCard).toHaveClass(/granule-results-item--active/)

      // Check that it's scrolled to the granule
      await expect(highlightedCard).toBeInViewport()
    })

    test.describe('when switching from the list view to the table view', () => {
      test('the granule remains highlighted and visible', async ({ page }) => {
        // Switch to the table view

        // "View: List" button
        await page.getByTestId('panel-group-header-dropdown__view__1').hover()

        await page.getByRole('button', {
          name: 'Table',
          exact: true
        }).click({ force: true })

        // Wait a little bit for the item to scroll into view
        await page.waitForTimeout(100)

        // Ensure the row is highlighted
        const highlightedRow = await page.getByRole('row').filter({ hasText: granuleName })

        // Check that the granule is highlighted
        await expect(highlightedRow).toHaveClass(/granule-results-table__tr--active/)

        // Check that it's scrolled to the granule
        await expect(highlightedRow).toBeInViewport()
      })
    })
  })

  test.describe('When clicking on a map granule while in the granule table view', () => {
    test.beforeEach(async ({ page }) => {
      // Click on the view button and select table
      // "View: List" button
      await page.getByTestId('panel-group-header-dropdown__view__1').hover()

      await page.getByRole('button', {
        name: 'Table',
        exact: true
      }).click({ force: true })

      // Click on the granule on the map
      const tilesPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/0/)

      await page.locator('.map').click({
        force: true,
        position: {
          x: 1200,
          y: 150
        }
      })

      await tilesPromise
    })

    test('scrolls to the highlighted granule', async ({ page }) => {
      const highlightedRow = await page.getByRole('row').filter({ hasText: granuleName })

      // Check that the granule is highlighted
      await expect(highlightedRow).toHaveClass(/granule-results-table__tr--active/)

      // Check that it's scrolled to the granule
      await expect(highlightedRow).toBeInViewport()
    })

    test.describe('when switching from the table view to the list view', () => {
      test('the granule remains highlighted and visible', async ({ page }) => {
        // Switch to the table view
        // await page.locator('.panel-group--is-active').getByRole('button', { name: 'View: Table' }).click()
        // "View: Table" button
        await page.getByTestId('panel-group-header-dropdown__view__1').hover()

        // Grab the drop-down menu item not the panel header
        await page.getByRole('button', {
          name: 'List',
          exact: true
        }).click({ force: true })

        // Wait a little bit for the item to scroll into view
        await page.waitForTimeout(100)

        const highlightedCard = await page.getByRole('button', {
          name: granuleName
        })

        // Check that the granule is highlighted
        await expect(highlightedCard).toHaveClass(/granule-results-item--active/)

        // Check that it's scrolled to the granule
        await expect(highlightedCard).toBeInViewport()
      })
    })
  })
})
