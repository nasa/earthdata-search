import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../../support/setupTests'
import {
  interceptUnauthenticatedCollections
} from '../../../support/interceptUnauthenticatedCollections'

import commonBody from './__mocks__/common.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import keywordCollections from './__mocks__/keyword-collections.body.json'
import keywordTemporalCollections from './__mocks__/keyword-temporal-collections.body.json'
import temporalCollections from './__mocks__/temporal-collections.body.json'
import topicCollections from './__mocks__/topic-collections.body.json'
import portalCollections from './__mocks__/portal-collections.body.json'
import whatIsThisImageCollections from './__mocks__/what-is-this-image-collections.body.json'
import whatIsThisImageGranules from './__mocks__/what-is-this-image-granules.body.json'
import whatIsThisImageGranulesHeaders from './__mocks__/what-is-this-image-granules.headers.json'
import whatIsThisImageGraphQlBody from './__mocks__/what-is-this-image-collections.graphql.body.json'

test.describe('Home Page', () => {
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

  test.describe('when performing a keyword search', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: keywordCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '1564'
          },
          paramCheck: (parsedQuery) => parsedQuery?.keyword === 'MODIS*'
        }],
        includeDefault: false
      })

      await page.goto('/')
    })

    test('should navigate to the search page with the keyword parameter', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Type to search for data' }).fill('MODIS')
      await page.getByRole('button', { name: 'Search' }).click()

      await expect(page).toHaveURL('search?q=MODIS')
    })
  })

  test.describe('when performing a temporal search', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: temporalCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '3078'
          },
          paramCheck: (parsedQuery) => parsedQuery?.temporal?.[0] === '2020-01-01T00:00:00.000Z,2020-02-01T23:59:59.999Z'
        }],
        includeDefault: false
      })

      await page.goto('/')
    })

    test('should navigate to the search page with the temporal parameter', async ({ page }) => {
      await page.getByRole('button', { name: 'Temporal' }).click()
      await page.getByRole('textbox', { name: 'Start Date' }).fill('2020-01-01 00:00:00')
      await page.getByRole('textbox', { name: 'End Date' }).fill('2020-02-01 23:59:59')
      await page.getByRole('button', { name: 'Apply' }).click()

      await expect(page).toHaveURL('/search?qt=2020-01-01T00%3A00%3A00.000Z%2C2020-02-01T23%3A59%3A59.999Z')
    })
  })

  test.describe('when performing a keyword and temporal search', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: keywordTemporalCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '805'
          },
          paramCheck: (parsedQuery) => parsedQuery?.keyword === 'MODIS*'
            && parsedQuery?.temporal?.[0] === '2020-01-01T00:00:00.000Z,2020-02-01T23:59:59.999Z'
        }],
        includeDefault: false
      })

      await page.goto('/')
    })

    test('should navigate to the search page with the keyword and temporal parameters', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Type to search for data' }).fill('MODIS')

      await page.getByRole('button', { name: 'Temporal' }).click()
      await page.getByRole('textbox', { name: 'Start Date' }).fill('2020-01-01 00:00:00')
      await page.getByRole('textbox', { name: 'End Date' }).fill('2020-02-01 23:59:59')
      await page.getByRole('button', { name: 'Apply' }).click()

      await expect(page).toHaveURL('/search?q=MODIS&qt=2020-01-01T00%3A00%3A00.000Z%2C2020-02-01T23%3A59%3A59.999Z')
    })
  })

  test.describe('when performing a spatial search', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders
      })

      await page.goto('/')
    })

    test('should navigate to the search page with the spatial search enabled', async ({ page }) => {
      await page.getByRole('button', { name: 'Spatial' }).click()
      await page.getByRole('button', { name: 'Point' }).click()

      await expect(page).toHaveURL('/search')
      await expect(page.getByRole('heading', { name: 'Spatial' })).toBeVisible()
    })
  })

  test.describe('when performing a keyword and spatial search', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: keywordCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '1564'
          },
          paramCheck: (parsedQuery) => parsedQuery?.keyword === 'MODIS*'
        }],
        includeDefault: false
      })

      await page.goto('/')
    })

    test('should navigate to the search page with the keyword parameter and spatial search enabled', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Type to search for data' }).fill('MODIS')

      await page.getByRole('button', { name: 'Spatial' }).click()
      await page.getByRole('button', { name: 'Point' }).click()

      await expect(page).toHaveURL('/search?q=MODIS')
      await expect(page.getByRole('heading', { name: 'Spatial' })).toBeVisible()
    })
  })

  test.describe('when following the `Browse All Earthdata Science Data` link', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders
      })

      await page.goto('/')
    })

    test('should navigate to `/search`', async ({ page }) => {
      await page.getByRole('button', { name: 'Browse all Earth Science Data' }).click()

      await expect(page).toHaveURL('/search')
    })
  })

  test.describe('when following the `What is this image?` link', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: whatIsThisImageCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '1'
          },
          paramCheck: (parsedQuery) => parsedQuery?.keyword === 'MOD02QKM*'
              && parsedQuery.bounding_box?.[0] === '-29.95172,11.43036,-16.57503,19.31775'
              && parsedQuery?.temporal === '2025-03-12T00:00:00.000Z,2025-03-12T23:59:59.999Z'
        }],
        includeDefault: false
      })

      await page.route(/search\/granules.json/, async (route) => {
        const query = route.request().postData()

        expect(query).toEqual('echo_collection_id=C1378579425-LAADS&page_num=1&page_size=20&temporal=2025-03-12T00:00:00.000Z,2025-03-12T23:59:59.999Z&bounding_box[]=-29.95172,11.43036,-16.57503,19.31775&sort_key=-start_date')

        await route.fulfill({
          json: whatIsThisImageGranules,
          headers: whatIsThisImageGranulesHeaders
        })
      })

      await page.route(/graphql.*\/api/, async (route) => {
        await route.fulfill({
          json: whatIsThisImageGraphQlBody,
          headers: {
            'content-type': 'application/json'
          }
        })
      })

      await page.goto('/')
    })

    test('should navigate to the correct collection', async ({ page }) => {
      await page.getByRole('button', { name: 'What is this image?' }).click()

      const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/5/)
      await page.getByRole('button', { name: 'Explore this data on the map' }).click()

      // Wait for the map to load
      await initialMapPromise

      // Wait for the timeline to be visible
      await page.getByRole('button', { name: 'Hide Timeline' }).waitFor()

      await expect(page).toHaveURL(/search\/granules\?p=C1378579425-LAADS&pg\[0\]\[v\]=f&pg\[0\]\[gsk\]=-start_date&q=MOD02QKM&sb\[0\]=-29\.95172%2C11\.43036%2C-16\.57503%2C19\.31775&qt=2025-03-12T00%3A00%3A00\.000Z%2C2025-03-12T23%3A59%3A59\.999Z&lat=15\.\d+&long=-22\.\d+&zoom=6/)
    })
  })

  test.describe('when following a topic link', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: topicCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '4436'
          },
          paramCheck: (parsedQuery) => parsedQuery?.science_keywords_h[0]?.topic === 'Atmosphere'
        }],
        includeDefault: false
      })

      await page.goto('/')
    })

    test('should navigate to the correct topic', async ({ page }) => {
      await page.getByRole('link', { name: 'Atmosphere' }).click()

      await expect(page).toHaveURL('search?fst0=Atmosphere')
    })
  })

  test.describe('when following a portal link', () => {
    test.beforeEach(async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: portalCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '259'
          },
          paramCheck: (parsedQuery) => parsedQuery?.project === 'ABoVE'
        }],
        includeDefault: false
      })

      await page.goto('/')
    })

    test('should navigate to the correct portal', async ({ page }) => {
      await page.getByRole('link', { name: 'A logo for ABoVE (Arctic-' }).click()

      await expect(page).toHaveURL('search?portal=above')
    })
  })
})
