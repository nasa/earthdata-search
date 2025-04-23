import { test, expect } from 'playwright-test-coverage'

import collectionsSearchBody from './__mocks__/collectionsSearch.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import getCollectionsGraphQlBody from './__mocks__/getCollectionsGraphql.body.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import granulesBody from './__mocks__/granules.body.json'
import granulesGraphQlBody from './__mocks__/granulesGraphql.body.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import retrieval from './__mocks__/retrieval.json'
import retrievals from './__mocks__/retrievals.json'
import timeline from './__mocks__/timeline.json'

import { setupTests } from '../../support/setupTests'
import { getAuthHeaders } from '../../support/getAuthHeaders'
import { graphQlGetSubscriptionsQuery } from '../../support/graphQlGetSubscriptionsQuery'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'
import { graphQlGetProjectCollections } from '../../support/graphQlProjectGetCollections'
import { login } from '../../support/login'

const conceptId = 'C1214470488-ASF'

const authHeaders = getAuthHeaders()

const downloadLinks = [
  'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/006/MYD04_3K.A2020006.1720.061.2020008170450.hdf'
]

test.describe('History', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context
    })

    const granuleHits = 1

    await page.route(/collections$/, async (route) => {
      await route.fulfill({
        json: collectionsSearchBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': '7648'
        }
      })
    })

    await page.route(/granules$/, async (route) => {
      await route.fulfill({
        json: granulesBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': granuleHits.toString()
        }
      })
    })

    await page.route(/timeline$/, async (route) => {
      await route.fulfill({
        json: timeline.body
      })
    })

    await page.route(/graphql/, async (route) => {
      const { query } = JSON.parse(route.request().postData()).data

      if (query === graphQlGetSubscriptionsQuery) {
        await route.fulfill({
          json: getSubscriptionsGraphQlBody,
          headers: graphQlHeaders
        })
      }

      if (query === JSON.parse(graphQlGetCollection(conceptId)).query) {
        await route.fulfill({
          json: granulesGraphQlBody,
          headers: graphQlHeaders
        })
      }

      if (query === JSON.parse(graphQlGetProjectCollections(conceptId)).query) {
        await route.fulfill({
          json: getCollectionsGraphQlBody,
          headers: graphQlHeaders
        })
      }
    })

    await page.route(/saved_access_configs/, async (route) => {
      await route.fulfill({
        json: {}
      })
    })

    await login(context)

    await page.goto('/search')
  })

  test.describe('when pressing the back button', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(`collection-result-item_${conceptId}`).click()

      await page.getByRole('button', { name: 'Download All' }).click()

      await expect(page.getByRole('button', { name: 'Download project data' })).toBeVisible()

      await page.goBack()
    })

    test('loads the correct context', async ({ page }) => {
      await expect(page.getByTestId('granule-results-actions__download-all-button')).toBeVisible()
    })

    test.describe('when pressing the forward button', () => {
      test.beforeEach(async ({ page }) => {
        await page.goForward()
      })

      test('loads the correct context', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Download project data' })).toBeVisible()
      })
    })
  })

  // TODO fix this dude
  test.describe('when pressing the back button from the downloads page', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(/saved_access_configs/, async (route) => {
        await route.fulfill({
          json: {}
        })
      })

      await page.route(/projects$/, async (route) => {
        await route.fulfill({
          json: {
            name: 'Test Project',
            path: '/projects?p=C1214470488-ASF!C1214470488-ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=download&pg[1][cd]=f&tl=1721757043!3!!&lat=0&long=0&zoom=2',
            project_id: '9452013926'
          }
        })
      })

      await page.route(/projects\/9452013926/, async (route) => {
        await route.fulfill({
          json: {
            name: 'Test Project',
            path: '/projects?p=C1214470488-ASF!C1214470488-ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=download&pg[1][cd]=f&tl=1721757043!3!!&lat=0&long=0&zoom=2'
          }
        })
      })

      await page.route(/retrievals/, async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            json: retrieval.body,
            headers: retrieval.headers
          })
        } else {
          await route.fulfill({
            json: retrievals.body,
            headers: retrievals.headers
          })
        }
      })

      await page.route(/granule_links/, async (route) => {
        if (route.request().url().includes('pageNum=1')) {
          await route.fulfill({
            json: {
              cursor: 'mock-cursor',
              links: {
                browse: [],
                download: downloadLinks,
                s3: []
              }
            },
            headers: authHeaders
          })
        } else {
          await route.fulfill({
            json: {
              cursor: null,
              links: {
                browse: [],
                download: [],
                s3: []
              }
            }
          })
        }
      })
    })

    test('loads the correct context', async ({ page }) => {
      await page.getByTestId(`collection-result-item_${conceptId}`).click()

      await page.getByRole('button', { name: 'Download All' }).click()

      // Name the project
      await page.getByTestId('edit_button').click()
      const textField = page.getByRole('textbox', { value: 'Untitled Project' })
      await textField.fill('Test Project')
      await page.getByTestId('submit_button').click()

      await expect(page).toHaveURL(/projectId=9452013926/)

      // Download the data
      await page.getByRole('button', { name: 'Download project data' }).click()

      // Expect the link to be on the download page
      await expect(page.getByRole('link', { name: downloadLinks[0] })).toBeVisible()

      // Click the Back to Project button
      await page.getByRole('button', { name: 'Back to Project' }).click()

      // Expect the download button to be enabled (everything was reloaded)
      await expect(page.getByRole('button', { name: 'Download project data' })).toBeEnabled()

      // We want to make sure that the project is not updated when the back button is pressed
      await page.route(/projects$/, async () => {
        expect('This route should not be called again').toEqual(true)
      })

      // Use the browser back button to go back to the downloads
      await page.goBack()
      await expect(page.getByRole('link', { name: downloadLinks[0] })).toBeVisible()
    })
  })
})
