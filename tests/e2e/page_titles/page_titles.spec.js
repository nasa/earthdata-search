import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'
import { MockGetUserRoute, login } from '../../support/login'
import { getAuthHeaders } from '../../support/getAuthHeaders'

import collectionsGraphQlJson from './__mocks__/collections_graphql.json'
import granules from './__mocks__/granules.json'

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

test.describe('page titles', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })
  })

  test.describe('when visiting the home page', () => {
    test('shows the default title', async ({ page }) => {
      await page.route('**/search/granules/timeline', (route) => {
        route.fulfill({ json: [] })
      })

      await page.goto('/')

      await expect(page).toHaveTitle('Earthdata Search - Earthdata Search')
    })
  })

  test.describe('when viewing the search page', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/search/collections.json', (route) => {
        route.fulfill({
          headers: collectionsHeaders,
          json: collectionsResponse
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        route.fulfill({ json: [] })
      })
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
    test.beforeEach(async ({ context, page }) => {
      await login(page, context)
    })

    test.describe('when managing preferences', () => {
      test('shows the preferences title', async ({ page }) => {
        await page.goto('/preferences')

        await expect(page).toHaveTitle('Preferences - Earthdata Search')
      })
    })

    test.describe('when viewing saved projects', () => {
      test('shows the saved projects title', async ({ page }) => {
        await page.route('**/projects', (route, request) => {
          if (request.resourceType() === 'document') {
            route.continue()

            return
          }

          route.fulfill({ json: [] })
        })

        await page.goto('/projects')

        await expect(page).toHaveTitle('Saved Projects - Earthdata Search')
      })
    })

    test.describe('when reviewing a project', () => {
      test.beforeEach(async ({ page }) => {
        const authHeaders = getAuthHeaders()

        await page.route('**/graphql', async (route) => {
          const request = JSON.parse(route.request().postData())

          // Apollo Client calls have the query here
          let { query } = request

          if (!query) {
            // Axios GraphQL calls have the query here
            const { data } = request;
            ({ query } = data)
          }

          if (query.includes('query GetUser')) {
            await MockGetUserRoute(route)
          }

          if (query.includes('createProject')) {
            await route.fulfill({
              json: {
                data: {
                  createProject: {
                    createdAt: '2025-01-01T00:00:00Z',
                    name: 'Test Project',
                    obfuscatedId: '1234',
                    path: '/projects',
                    updatedAt: '2025-01-01T00:00:00Z'
                  }
                }
              }
            })
          }
        })

        await page.route(/saved_access_configs/, async (route) => {
          await route.fulfill({
            json: {}
          })
        })

        await page.route(/cmr-graphql-proxy$/, async (route) => {
          route.fulfill({
            headers: authHeaders,
            json: collectionsGraphQlJson.body
          })
        })

        await page.route(/granules\.json/, async (route) => {
          await route.fulfill({
            json: granules.body,
            headers: {
              ...authHeaders,
              'access-control-expose-headers': 'cmr-hits',
              'cmr-hits': '42'
            }
          })
        })

        await page.route(/timeline$/, (route) => {
          route.fulfill({
            json: [],
            headers: authHeaders
          })
        })
      })

      test.describe('when renaming an unnamed project', () => {
        test('shows the default title then updates to the saved name', async ({ page }) => {
          await page.goto('/project?p=!C1443528505-LAADS')

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
        await page.route('**/retrievals', (route) => {
          route.fulfill({ json: [] })
        })

        await page.goto('/downloads')

        await expect(page).toHaveTitle('Download Status & History - Earthdata Search')
      })
    })

    test.describe('when viewing a download status', () => {
      test('shows the download status title', async ({ page }) => {
        await page.route(/\/retrievals\/1234$/, (route) => {
          route.fulfill({
            json: {
              id: 1234,
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
          })
        })

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
            await MockGetUserRoute(route)
          }

          if (query.includes('getSubscriptions')) {
            await route.fulfill({
              json: subscriptionsResponse,
              headers: subscriptionsHeaders
            })
          }
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
