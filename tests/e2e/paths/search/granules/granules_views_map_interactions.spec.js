// Clicks as we expect
// Scrolls as we expect
// Visible to the user when clicked on the map

import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../../../support/graphQlGetCollection'
import {
  interceptUnauthenticatedCollections
} from '../../../../support/interceptUnauthenticatedCollections'

import commonBody from './__mocks__/cmr_granules/common_collections.body.json'
import commonHeaders from './__mocks__/cmr_granules/common_collections.headers.json'
import cmrGranulesCollectionBody from './__mocks__/cmr_granules/collections.body.json'
import cmrGranulesCollectionGraphQlBody from './__mocks__/cmr_granules/collection_graphql.body.json'
import cmrGranulesCollectionGraphQlHeaders from './__mocks__/cmr_granules/graphql.headers.json'
import cmrGranulesBody from './__mocks__/cmr_granules/granules.body.json'
import cmrGranulesHeaders from './__mocks__/cmr_granules/granules.headers.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'

// Make sure that the granule in the list is visible to the user

test.describe('When clicking on a granule on the map', () => {
  test.beforeEach(async ({ page }) => {
    const conceptId = 'C1214470488-ASF'
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
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

    await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&&tl=1729096169!3!!&lat=-7.592181130658659&long=-239.0625&zoom=0`)
  })

  test.beforeEach(async ({ page }) => {
    await page.route(/api$/, async (route) => {
      const query = route.request().postData()

      expect(query).toEqual('{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"G3271245196-ASF"}}}')

      await route.fulfill({
        json: granuleGraphQlBody,
        headers: { 'content-type': 'application/json' }
      })
    })
  })

  test.describe('when in list view', () => {
    test('scrolls to the selected granule in list view', async ({ page }) => {
      await page.waitForSelector('.map')

      await page.locator('.map').click({
        force: true,
        position: {
          x: 966,
          y: 375
        }
      })

      await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/ })).toHaveClass(/granule-results-item--active/)
      await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/ })).toBeInViewport()
    })
  })

  test.describe('when in table view', () => {
    test('scrolls to granule when granule clicked on map in table view', async ({ page }) => {
      // Click on the view button and select table
      await page.locator('.panel-group--is-active').getByRole('button', { name: /View/ }).click()
      await page.waitForTimeout(200)
      await page.getByRole('button', { name: /Table/ }).click()

      await page.waitForSelector('.map')

      // Click on the granule on the map
      await page.locator('.map').click({
        force: true,
        position: {
          x: 966,
          y: 375
        }
      })

      const highlightedRow = await page.getByRole('row', {
        name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/
      })

      // Check that the granule is highlighted
      await expect(highlightedRow).toHaveClass(/granule-results-table__tr--active/)

      // Check that it's scrolled to the granule
      await expect(highlightedRow).toBeInViewport()
    })
  })

  test.describe('when switching between views', () => {
    test('focuses the selected granule and then shows in center when changing to table view', async ({ page }) => {
      await page.waitForSelector('.map')

      await page.locator('.map').click({
        force: true,
        position: {
          x: 966,
          y: 375
        }
      })

      await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/ })).toBeInViewport()

      // This is better than using the nth button in an array.
      await page.locator('.panel-group--is-active').getByRole('button', { name: /View/ }).click()
      await page.waitForTimeout(200)
      await page.getByRole('button', { name: /Table/ }).click()

      const highlightedRow = await page.getByRole('row', {
        name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/
      })

      // Check that the granule is selected and is visible
      await expect(highlightedRow).toHaveClass(/granule-results-table__tr--active/)

      await expect(highlightedRow).toBeInViewport()
    })

    test('Switch to list view from table view and ensure the granule is highlighted and visible', async ({ page }) => {
      // Click on the view button and select table
      await page.locator('.panel-group--is-active').getByRole('button', { name: /View/ }).click()
      await page.waitForTimeout(200)
      await page.getByRole('button', { name: /Table/ }).click()

      await page.waitForSelector('.map')

      // Click on the granule on the map
      await page.locator('.map').click({
        force: true,
        position: {
          x: 966,
          y: 375
        }
      })

      const highlightedRow = await page.getByRole('row', {
        name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/
      })

      // Check that the granule is highlighted
      await expect(highlightedRow).toHaveClass(/granule-results-table__tr--active/)

      // Check that it's scrolled to the granule
      await expect(highlightedRow).toBeInViewport()

      await page.locator('.panel-group--is-active').getByRole('button', { name: /View/ }).click()
      await page.waitForTimeout(200)
      await page.getByRole('button', { name: /List/ }).click()

      await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/ })).toHaveClass(/granule-results-item--active/)
      await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20241021T114557_20241021T114624_056200_06E137_2922/ })).toBeInViewport()
    })
  })
})
