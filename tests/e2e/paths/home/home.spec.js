import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../../support/setupTests'
import {
  interceptUnauthenticatedCollections
} from '../../../support/interceptUnauthenticatedCollections'
import { createNlpHandlers, nlp } from '../../../support/nlpHandlers'
import { createNlpMockStreamChunks } from '../../../support/nlpStreamMock'

import commonBody from './__mocks__/common.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import keywordTemporalCollections from './__mocks__/keyword-temporal-collections.body.json'
import portalCollections from './__mocks__/portal-collections.body.json'
import topicCollections from './__mocks__/topic-collections.body.json'
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

  test.describe('when performing an NLP search', () => {
    test.describe.configure({ mode: 'serial' })

    let nlpHandlers

    test.beforeEach(async ({ page }) => {
      nlpHandlers = createNlpHandlers({ page })
      nlpHandlers.nlp.use(
        nlp.get('/nlp', () => nlp.stream({
          delayMs: 1200,
          chunks: createNlpMockStreamChunks()
        }))
      )

      await nlpHandlers.nlp.start()

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
          paramCheck: (parsedQuery) => parsedQuery?.keyword === 'average temp'
            && parsedQuery?.temporal?.[0] === '2026-04-01T00:00:00.000Z,2026-04-30T23:59:59.999Z'
            && parsedQuery?.bounding_box?.[0] === '-116.05,44.35821,-109.64514,49.00139'
        }]
      })

      await page.goto('/')
    })

    test.afterEach(async () => {
      await nlpHandlers.nlp.stop()
    })

    test('disables input, shows NLP status progress, and routes to search after stream completion', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Wildfires in California during summer 2023')
      const searchButton = page.getByRole('button', {
        name: 'Search',
        exact: true
      })
      const cancelButton = page.getByRole('button', {
        name: 'Cancel',
        exact: true
      })

      await searchInput.fill('average temp in western montana last april')
      await searchButton.click()

      await expect(searchInput, 'Search input should be disabled while NLP is running').toBeDisabled()
      await expect(cancelButton, 'Cancel button should be visible while NLP is running').toBeVisible()

      // Checks that status text progresses while NLP is running.
      await expect(page.getByText(/Extracted keyword of "average temp"\.?/i)).toBeVisible()

      await expect(
        page,
        'should navigate to the search route after /nlp completes'
      ).toHaveURL((url) => url.pathname === '/search')

      await expect(
        page,
        'should have keyword query param matching response from /nlp'
      ).toHaveURL((url) => (
        url.searchParams.get('q') === 'average temp'
      ))

      await expect(
        page,
        'should have temporal query param matching response from /nlp'
      ).toHaveURL((url) => (
        url.searchParams.get('qt') === '2026-04-01T00:00:00.000Z,2026-04-30T23:59:59.999Z'
      ))

      await expect(
        page,
        'should have spatial query param matching response from /nlp'
      ).toHaveURL((url) => (
        url.searchParams.get('sb[0]') === '-116.05,44.35821,-109.64514,49.00139'
      ))
    })

    test('cancel ends NLP streaming and restores the initial search controls', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Wildfires in California during summer 2023')
      const searchButton = page.getByRole('button', {
        name: 'Search',
        exact: true
      })
      const cancelButton = page.getByRole('button', {
        name: 'Cancel',
        exact: true
      })

      const searchPrompt = 'average temp in western montana last april'
      await searchInput.fill(searchPrompt)
      await searchButton.click()

      await expect(cancelButton, 'Cancel button should be visible while NLP is running').toBeVisible()

      await cancelButton.click()

      await expect(searchInput, 'Search input should be re-enabled after cancelling NLP').toBeEnabled()
      await expect(searchInput, 'search input should not be cleared after search cancelled').toHaveValue('average temp in western montana last april')
      await expect(searchButton, 'Search button should be visible after cancelling NLP').toBeVisible()

      await expect(page.locator('.nlp-search-chat'), 'NLP chat should be removed after cancelling NLP').toHaveCount(0)
      await expect(page, 'user should remain on the home page after cancelling NLP').toHaveURL('/')
    })

    test('navigates to search and loads collections when submitting an empty query', async ({ page }) => {
      const collectionsResponsePromise = page.waitForResponse((response) => (
        /search\/collections/.test(response.url())
        && response.request().method() === 'POST'
      ))

      await page.getByRole('button', {
        name: 'Search',
        exact: true
      }).click()

      await collectionsResponsePromise

      await expect(page, 'Empty NLP submit should navigate directly to Search').toHaveURL('/search')
      await expect.poll(
        () => nlpHandlers.nlp.getRequestedPrompts().length,
        'Empty NLP submit should not call the /nlp endpoint'
      ).toBe(0)
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
