import { test, expect } from 'playwright-test-coverage'

import { login, sitePreferences } from '../../support/login'
import { testJwtToken } from '../../support/getJwtToken'
import { setupTests } from '../../support/setupTests'

import graphQlHeaders from './__mocks__/graphql.headers.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import collectionFixture from './__mocks__/authenticated_collections.json'

// At the default size, react-window will render 6 items
const expectedCollectionCount = 6

test.describe('Authentication', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context
    })

    await page.setViewportSize({
      width: 1400,
      // At the default height of 900, the results here are flaky returning 6 or 7 items.
      // Shorten the window height to ensure we always get 6 items.
      height: 850
    })

    await page.route(/collections\.json/, async (route) => {
      await route.fulfill({
        json: collectionFixture.body,
        headers: collectionFixture.headers
      })
    })

    await page.route(/graphql/, async (route) => {
      const request = JSON.parse(route.request().postData())

      // Apollo Client calls have the query here
      let { query } = request

      if (!query) {
        // Axios GraphQL calls have the query here
        const { data } = request;
        ({ query } = data)
      }

      if (query.includes('query GetUser')) {
        await route.fulfill({
          json: {
            data: {
              user: {
                id: '1',
                sitePreferences,
                ursId: 'testuser',
                ursProfile: {
                  affiliation: 'OTHER',
                  country: 'United States',
                  emailAddress: 'test@example.com',
                  firstName: 'test',
                  lastName: 'user',
                  organization: null,
                  studyArea: 'Other',
                  uid: 'testuser',
                  userType: 'Public User'
                }
              }
            }
          },
          headers: graphQlHeaders
        })
      }

      if (query.includes('query GetSubscriptions')) {
        await route.fulfill({
          json: getSubscriptionsGraphQlBody,
          headers: graphQlHeaders
        })
      }
    })
  })

  test.afterEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('logs the user in with the auth_callback endpoint and redirects the user', async ({ page }) => {
    await page.goto(`/auth_callback?edlToken=${testJwtToken}&redirect=http://localhost:8080/search`)
    await page.waitForSelector('[data-testid="collection-results-item"]')

    await expect(page.getByText('Earthdata Login')).not.toBeVisible()
    await expect(page.getByTestId('collection-results-list')).toBeVisible()
    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(expectedCollectionCount)
  })

  test('sets auth cookie', async ({ page, context }) => {
    await expect((await context.cookies()).length).toEqual(0)

    await login(page, context)

    await expect((await context.cookies())).toEqual([
      expect.objectContaining({
        name: 'edlToken',
        value: testJwtToken
      })
    ])

    await page.goto('/search')

    await expect(page.getByText('Earthdata Login')).not.toBeVisible()
    await expect(page.getByTestId('collection-results-list')).toBeVisible()
    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(expectedCollectionCount)
  })
})
