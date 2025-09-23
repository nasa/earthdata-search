import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'
import { login } from '../../support/login'

/**
 * This test suite verifies that page titles are correct for each route.
 * Note: This suite will not pass unless you run the prod build with
 * npm run build && npm run preview
 */

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

const emptyRetrievalResponse = {
  id: 'mock-retrieval',
  jsondata: {
    source: ''
  },
  collections: {
    byId: {},
    download: [],
    opendap: [],
    echo_orders: [],
    esi: [],
    harmony: [],
    swodlr: []
  },
  links: []
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
    }
  })

  await respondWithEmptyTimeline(page)
}

const projectResponses = new Map()

const mockProjectsIndex = async (page) => {
  await page.route(/\/projects(?:\?.*)?$/, (route, request) => {
    if (request.resourceType() === 'document') {
      return
    }

    if (request.method() === 'GET') {
      route.fulfill({ json: [] })

      return
    }

    if (request.method() === 'POST') {
      const postBody = request.postData() ? JSON.parse(request.postData()) : {}
      const {
        path,
        projectId
      } = postBody

      let response = projectResponses.get(projectId)

      response = response ?? {
        project_id: projectId,
        path
      }

      route.fulfill({ json: response })

      return
    }

    route.fulfill({ json: {} })
  })
}

const mockRetrieval = async (page, { id }) => {
  const retrievalRegex = new RegExp(`/retrievals/${id}$`)

  await page.route(retrievalRegex, (route) => {
    route.fulfill({
      json: {
        ...emptyRetrievalResponse,
        id
      }
    })
  })
}

test.describe('page titles', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })
  })

  test.describe('when visiting the home page', () => {
    test('shows the default title', async ({ page }) => {
      await respondWithEmptyTimeline(page)

      await page.goto('/')

      await expect(page).toHaveTitle('Earthdata Search - Earthdata Search')
    })
  })

  test.describe('when viewing the search page', () => {
    test.beforeEach(async ({ page }) => {
      await mockSearchCollections(page)
    })

    test.describe('when no portal is active', () => {
      test('shows the default search title', async ({ page }) => {
        await page.goto('/search')

        await expect(page).toHaveTitle('Earthdata Search - Earthdata Search')
      })
    })

    test.describe('when a portal is active', () => {
      test('includes the portal name in the title', async ({ page }) => {
        await page.goto('/search?portal=amd')

        await expect(page).toHaveTitle('Earthdata Search - AMD Portal - Earthdata Search')
      })
    })
  })

  test.describe('when signed in', () => {
    test.beforeEach(async ({ context }) => {
      await login(context)
    })

    test.describe('when managing preferences', () => {
      test('shows the preferences title', async ({ page }) => {
        await page.goto('/preferences')

        await expect(page).toHaveTitle('Preferences - Earthdata Search')
      })
    })

    test.describe('when viewing saved projects', () => {
      test('shows the saved projects title', async ({ page }) => {
        await mockProjectsIndex(page)

        await page.goto('/projects')

        await expect(page).toHaveTitle('Saved Projects - Earthdata Search')
      })
    })

    test.describe('when reviewing a project', () => {
      test.beforeEach(async ({ page }) => {
        await mockProjectsIndex(page)
        await mockSearchCollections(page)
      })

      test.describe('when renaming an unnamed project', () => {
        test('shows the default title then updates to the saved name', async ({ page }) => {
          await page.goto('/projects?p=!C123456-EDSC')

          await expect(page).toHaveTitle('Untitled Project - Earthdata Search')

          await page.getByTestId('edit_button').click()

          const textField = page.getByRole('textbox', { value: 'Untitled Project' })

          await textField.fill('Test Project')

          await page.getByTestId('submit_button').click()

          await expect(page).toHaveTitle('Test Project - Earthdata Search')
        })
      })
    })

    test.describe('when viewing the download history', () => {
      test('shows the download status and history title', async ({ page }) => {
        await page.route('**/retrievals', (route, request) => {
          if (request.method() === 'GET') {
            route.fulfill({ json: [] })

            return
          }

          route.fulfill({ json: {} })
        })

        await page.goto('/downloads')

        await expect(page).toHaveTitle('Download Status & History - Earthdata Search')
      })
    })

    test.describe('when viewing a download status', () => {
      test('shows the download status title', async ({ page }) => {
        await mockRetrieval(page, { id: '1234' })

        await page.goto('/downloads/1234')

        await expect(page).toHaveTitle('Download Status - Earthdata Search')
      })
    })

    test.describe('when updating contact information', () => {
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

        await expect(page).toHaveTitle('Contact Information - Earthdata Search')
      })
    })

    test.describe('when managing subscriptions', () => {
      test('shows the subscriptions title', async ({ page }) => {
        await page.route(/graphql.*\/api/, (route) => {
          route.fulfill({
            json: subscriptionsResponse,
            headers: subscriptionsHeaders
          })
        })

        await page.goto('/subscriptions')

        await expect(page).toHaveTitle('Subscriptions - Earthdata Search')
      })
    })

    test.describe('when opening the Earthdata Download redirect', () => {
      test('shows the Earthdata Download redirect title', async ({ page }) => {
        // This prevents the Earthdata Download redirect page from actually fulfilling the reroute
        // so we can have time to validate the page title.
        await page.addInitScript(() => {
          window.location.replace = () => {}
        })

        const redirectParam = encodeURIComponent('earthdata-download://mock-redirect')

        await page.goto(`/auth_callback?eddRedirect=${redirectParam}`, { waitUntil: 'commit' })

        await expect(page).toHaveTitle('Earthdata Download Redirect - Earthdata Search')
      })
    })
  })
})
