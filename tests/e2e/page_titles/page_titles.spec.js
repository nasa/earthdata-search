import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'
import { login } from '../../support/login'

const expectTitle = async (page, title) => {
  await expect(page).toHaveTitle(title)
}

const collectionsResponse = {
  feed: {
    entry: []
  }
}

const collectionsHeaders = {
  'access-control-expose-headers': 'cmr-hits',
  'cmr-hits': '0',
  'content-type': 'application/json'
}

const subscriptionsResponse = {
  data: {
    subscriptions: {
      items: []
    }
  }
}

const subscriptionsHeaders = {
  'content-type': 'application/json'
}

const respondWithEmptyTimeline = async (page) => {
  await page.route('**/search/granules/timeline', (route) => {
    route.fulfill({ body: JSON.stringify([]) })
  })
}

const mockSearchCollections = async (page) => {
  await page.route('**/search/collections.json', (route, request) => {
    if (request.method() === 'POST') {
      route.fulfill({
        body: JSON.stringify(collectionsResponse),
        headers: collectionsHeaders
      })

      return
    }

    route.continue()
  })

  await respondWithEmptyTimeline(page)
}

test.describe('Page titles', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })
  })

  test('displays the default title on the home page', async ({ page }) => {
    await respondWithEmptyTimeline(page)

    await page.goto('/')

    await expectTitle(page, 'Earthdata Search - Earthdata Search')
  })

  test.describe('search', () => {
    test('uses the default title when no portal is active', async ({ page }) => {
      await mockSearchCollections(page)

      await page.goto('/search')

      await expectTitle(page, 'Earthdata Search - Earthdata Search')
    })

    test('includes the portal name when a portal is active', async ({ page }) => {
      await mockSearchCollections(page)

      await page.goto('/search?portal=amd')

      await expectTitle(page, 'Earthdata Search - AMD Portal - Earthdata Search')
    })
  })

  test.describe('authenticated routes', () => {
    test.beforeEach(async ({ context }) => {
      await login(context)
    })

    test('shows the preferences title', async ({ page }) => {
      await page.goto('/preferences')

      await expectTitle(page, 'Preferences - Earthdata Search')
    })

    test('shows the saved projects title', async ({ page }) => {
      await page.route('**/projects', (route, request) => {
        if (request.resourceType() === 'document') {
          route.continue()

          return
        }

        if (request.method() === 'GET') {
          route.fulfill({ json: [] })

          return
        }

        route.fulfill({ json: {} })
      })

      await page.goto('/projects')

      await expectTitle(page, 'Saved Projects - Earthdata Search')
    })

    test('shows the download history title', async ({ page }) => {
      await page.route('**/retrievals', (route, request) => {
        if (request.method() === 'GET') {
          route.fulfill({ json: [] })

          return
        }

        route.fulfill({ json: {} })
      })

      await page.goto('/downloads')

      await expectTitle(page, 'Download Status & History - Earthdata Search')
    })

    test('shows the contact information title', async ({ page }) => {
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

    test('shows the subscriptions title', async ({ page }) => {
      await page.route(/graphql.*\/api/, (route) => {
        route.fulfill({
          json: subscriptionsResponse,
          headers: subscriptionsHeaders
        })
      })

      await page.goto('/subscriptions')

      await expectTitle(page, 'Subscriptions - Earthdata Search')
    })
  })
})
