import { test, expect } from 'playwright-test-coverage'

import collectionsSearchBody from './__mocks__/collectionsSearch.body.json' with { type: 'json' }
import commonHeaders from './__mocks__/common.headers.json' with { type: 'json' }
import getCollectionsGraphQlBody from './__mocks__/getCollectionsGraphql.body.json' with { type: 'json' }
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json' with { type: 'json' }
import granulesBody from './__mocks__/granules.body.json' with { type: 'json' }
import granulesGraphQlBody from './__mocks__/granulesGraphql.body.json' with { type: 'json' }
import graphQlHeaders from './__mocks__/graphql.headers.json' with { type: 'json' }
import timeline from './__mocks__/timeline.json' with { type: 'json' }

import { graphQlGetSubscriptionsQuery } from '../../support/graphQlGetSubscriptionsQuery'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'
import { graphQlGetProjectCollections } from '../../support/graphQlProjectGetCollections'
import { login } from '../../support/login'

const conceptId = 'C1214470488-ASF'

test.describe('History', () => {
  test.beforeEach(async ({ page, context }) => {
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

    await login(context)

    await page.goto('/')
  })

  test.describe('when pressing the back button', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(`collection-result-item_${conceptId}`).click()

      await page.getByTestId('granule-results-actions__download-all-button').click()

      await expect(page.getByTestId('project-download-data')).toBeVisible()

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
        await expect(page.getByTestId('project-download-data')).toBeVisible()
      })
    })
  })
})
