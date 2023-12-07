import { test, expect } from 'playwright-test-coverage'

import collectionsSearchBody from './__mocks__/collectionsSearch.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import getCollectionsGraphQlBody from './__mocks__/getCollectionsGraphql.body.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import getProjectCollectionGraphql from './__mocks__/getProjectCollectionsGraphql.body.json'
import granulesBody from './__mocks__/granules.body.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import timeline from './__mocks__/timeline.json'

import { graphQlGetSubscriptionsQuery } from '../../support/graphQlGetSubscriptionsQuery'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'
import { graphQlGetProjectCollections } from '../../support/graphQlProjectGetCollections'
import { login } from '../../support/login'

const conceptId = 'C1225776654-ASF'

const getGraphQlCalls = async (page) => {
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
        json: getCollectionsGraphQlBody,
        headers: graphQlHeaders
      })
    }

    if (query === JSON.parse(graphQlGetProjectCollections(conceptId)).query) {
      await route.fulfill({
        json: getProjectCollectionGraphql,
        headers: graphQlHeaders
      })
    }

    // If (query === JSON.parse(graphQlGetProjectCollections))
  })
}

test.describe('Project', () => {
  test.beforeEach(async ({ page, context }) => {
    const granuleHits = 20

    await page.route(/collections/, async (route) => {
      await route.fulfill({
        json: collectionsSearchBody,
        headers: {
          ...commonHeaders
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

    await page.route(/timeline/, async (route) => {
      await route.fulfill({
        json: timeline.body
      })
    })

    await getGraphQlCalls(page)

    await login(context)

    await page.goto('/')
  })

  test.describe('when pressing the back button', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(`collection-result-item_${conceptId}`).click()
      // Await page.pause()
      await expect(page.getByTestId('granule-results-actions__download-all-button')).toBeVisible()
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

  test.describe('continuing to try and download granules', () => {
    // Test.beforeEach(async ({ page }) => {
    //   await page.getByTestId(`collection-result-item_${conceptId}`).click()
    //   // Await page.pause()
    //   // await page.getByTestId('granule-results-actions__add-collection-to-project__action--add').click()
    //   await expect(page.getByTestId('granule-results-actions__download-all-button')).toBeVisible()
    //   await page.getByTestId('granule-results-actions__download-all-button').click()
    //   await getGraphQlCalls(page)
    //   await expect(page.getByTestId('project-download-data')).toBeVisible()
    // })

    test.describe('try and download the project data and fail', () => {
      test('show the refine search functionality', async ({ page }) => {
        await page.goto('/projects?p=C1225776654-ASF!C1225776654-ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][cd]=f&pg[1][ets]=t&pg[1][ess]=t&q=C1225&ff=Customizable&tl=1701711622!3!!&lat=-0.0703125')
        await page.getByTestId(`${conceptId}_access-method__harmony_harmony0`).click()

        await page.getByTestId('project-download-data').click()

        await expect(page.getByTestId('edsc-modal__title')).toBeVisible()

        await expect(page.getByTestId('chunked-order-modal__action')).toBeVisible()
        await page.getByTestId('chunked-order-modal__action').click()

        await expect(page.getByTestId(`collection-result-item_${conceptId}`)).toBeVisible()
      })
    })
  })
})
