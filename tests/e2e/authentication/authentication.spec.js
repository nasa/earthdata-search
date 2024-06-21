import { test, expect } from 'playwright-test-coverage'

import { login } from '../../support/login'
import { testJwtToken } from '../../support/getJwtToken'

import graphQlHeaders from './__mocks__/graphql.headers.json' with { type: 'json' }
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json' with { type: 'json' }
import collectionFixture from './__mocks__/authenticated_collections.json' with { type: 'json' }

// At the default size, react-window will render 6 items
const expectedCollectionCount = 6

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route(/collections$/, async (route) => {
      await route.fulfill({
        json: collectionFixture.body,
        headers: collectionFixture.headers
      })
    })

    await page.route(/graphql/, async (route) => {
      await route.fulfill({
        json: getSubscriptionsGraphQlBody,
        headers: graphQlHeaders
      })
    })
  })

  test.afterEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('logs the user in with the auth_callback endpoint and redirects the user', async ({ page }) => {
    await page.goto(`/auth_callback?jwt=${testJwtToken}&redirect=http://localhost:8080/`)
    await page.waitForSelector('[data-testid="collection-results-item"]')

    await expect(page.getByText('Earthdata Login')).not.toBeVisible()
    await expect(page.getByTestId('collection-results-list')).toBeVisible()
    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(expectedCollectionCount)
  })

  test('sets auth cookie', async ({ page, context }) => {
    await expect((await context.cookies()).length).toEqual(0)

    await login(context)

    await expect((await context.cookies())).toEqual([
      expect.objectContaining({
        name: 'authToken',
        value: testJwtToken
      })
    ])

    await page.goto('/')

    await expect(page.getByText('Earthdata Login')).not.toBeVisible()
    await expect(page.getByTestId('collection-results-list')).toBeVisible()
    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(expectedCollectionCount)
  })
})
