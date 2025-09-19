import { test, expect } from 'playwright-test-coverage'

import { login } from '../../support/login'
import { testJwtToken } from '../../support/getJwtToken'
import { setupTests } from '../../support/setupTests'

import graphQlHeaders from './__mocks__/graphql.headers.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import collectionFixture from './__mocks__/authenticated_collections.json'

const expectTitle = async (page, title) => {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  await expect(page).toHaveTitle(new RegExp(`(?:\\[[A-Z]+\\] )?${escaped}$`))
}

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

    await page.route(/collections$/, async (route) => {
      await route.fulfill({
        json: collectionFixture.body,
        headers: collectionFixture.headers
      })
    })

    await page.route(/graphql.*\/api/, async (route) => {
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
    await page.goto(`/auth_callback?jwt=${testJwtToken}&redirect=http://localhost:8080/search`)
    await page.waitForSelector('[data-testid="collection-results-item"]')

    await expect(page.getByText('Earthdata Login')).not.toBeVisible()
    await expect(page.getByTestId('collection-results-list')).toBeVisible()
    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(expectedCollectionCount)

    await expectTitle(page, 'Earthdata Search - Earthdata Search')
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

    await page.goto('/search')

    await expect(page.getByText('Earthdata Login')).not.toBeVisible()
    await expect(page.getByTestId('collection-results-list')).toBeVisible()
    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(expectedCollectionCount)

    await expectTitle(page, 'Earthdata Search - Earthdata Search')
  })

  test('shows the preferences page title for authenticated users', async ({ page, context }) => {
    await login(context)

    await page.goto('/preferences')

    await expectTitle(page, 'Preferences - Earthdata Search')
  })

  test('shows the saved projects page title for authenticated users', async ({ page, context }) => {
    await login(context)

    await page.route('**/projects', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ json: [] })
      } else {
        route.fulfill({ json: {} })
      }
    })

    await page.goto('/projects')
  })

  test('shows the download history page title for authenticated users', async ({ page, context }) => {
    await login(context)

    await page.route('**/retrievals', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ json: [] })
      } else {
        route.fulfill({ json: {} })
      }
    })

    await page.goto('/downloads')

    await expectTitle(page, 'Download Status & History - Earthdata Search')
  })

  test('shows the contact information page title for authenticated users', async ({ page, context }) => {
    await login(context)

    await page.route('**/contact_info', (route) => {
      route.fulfill({
        json: {
          cmr_preferences: {},
          urs_profile: {}
        }
      })
    })

    await page.goto('/contact-info')

    await expectTitle(page, 'Contact Information - Earthdata Search')
  })

  test('shows the subscriptions page title for authenticated users', async ({ page, context }) => {
    await login(context)

    await page.goto('/subscriptions')

    await expectTitle(page, 'Subscriptions - Earthdata Search')
  })
})
