import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../../support/setupTests'
import {
  interceptUnauthenticatedCollections
} from '../../../support/interceptUnauthenticatedCollections'

import commonBody from './__mocks__/common.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import keywordCollections from './__mocks__/keyword-collections.body.json'
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
      await page.route(/nlp\/query\.json/, async (route) => {
        const request = route.request()

        // Match the request body to ensure it's the expected NLP query
        const requestBody = request.postData()

        expect(requestBody).toEqual('embedding=false&q=rainfall in the spring of 2000&search_params[include_facets]=v2&search_params[include_granule_counts]=true&search_params[include_has_granules]=true&search_params[include_tags]=edsc.*,opensearch.granule.osdd&search_params[options][temporal][limit_to_granules]=true&search_params[page_size]=20&search_params[sort_key][]=has_granules_or_cwic&search_params[sort_key][]=-score&search_params[sort_key][]=-create-data-date&search_params[has_granules_or_cwic]=true&search_params[page_num]=1')

        await route.fulfill({
          json: keywordCollections,
          headers: {
            ...commonHeaders,
            'cmr-hits': '4'
          }
        })
      })

      await page.goto('/')
    })

    test('should navigate to the search page with the keyword parameter', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Wildfires in California' }).fill('rainfall in the spring of 2000')
      await page.getByRole('button', {
        name: 'Search',
        exact: 'true'
      }).click()

      await expect(page).toHaveURL('search?q=rainfall&qt=2000-03-20T00%3A00%3A00.000Z%2C2000-06-20T23%3A59%3A59.999Z')

      // Check keyword input
      await expect(page.getByRole('textbox', { name: /type to search for data/i })).toHaveValue('rainfall')

      // Check temporal inputs
      const temporalInputs = page.locator('.filter-stack-contents__body')
      await expect(temporalInputs.first()).toHaveText('2000-03-20 00:00:00')
      await expect(temporalInputs.last()).toHaveText('2000-06-20 23:59:59')

      // Check collection results count
      await expect(page.getByText('Showing 4 of 4 matching collections')).toBeVisible()
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
