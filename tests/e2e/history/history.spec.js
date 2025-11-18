import { test, expect } from 'playwright-test-coverage'

import collectionsSearchBody from './__mocks__/collectionsSearch.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import getCollectionsGraphQlBody from './__mocks__/getCollectionsGraphql.body.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import granulesBody from './__mocks__/granules.body.json'
import granulesGraphQlBody from './__mocks__/granulesGraphql.body.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import retrieval from './__mocks__/retrieval.json'
import retrievalCollection from './__mocks__/retrievalCollection.json'
import timeline from './__mocks__/timeline.json'

import { isGetCollectionQuery } from '../../support/isGetCollectionQuery'
import { login } from '../../support/login'
import { setupTests } from '../../support/setupTests'
import { isGetProjectQuery } from '../../support/isGetProjectQuery'

const conceptId = 'C1214470488-ASF'

const downloadLinks = [
  'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/006/MYD04_3K.A2020006.1720.061.2020008170450.hdf'
]

test.describe('History', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context
    })

    await page.route(/collections\.json/, async (route) => {
      await route.fulfill({
        json: collectionsSearchBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': '7648'
        }
      })
    })

    await page.route(/granules\.json/, async (route) => {
      await route.fulfill({
        json: granulesBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': '1'
        }
      })
    })

    await page.route(/timeline$/, async (route) => {
      await route.fulfill({
        json: timeline.body
      })
    })

    await page.route(/graphql.*\/api/, async (route) => {
      const { query } = JSON.parse(route.request().postData())

      if (query.includes('query GetSubscriptions')) {
        await route.fulfill({
          json: getSubscriptionsGraphQlBody,
          headers: graphQlHeaders
        })
      }

      if (isGetCollectionQuery(route, conceptId)) {
        await route.fulfill({
          json: granulesGraphQlBody,
          headers: graphQlHeaders
        })
      }

      if (query.includes('query GetProjectCollections')) {
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

    await login(page, context)

    const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
    await page.goto('/search')
    await initialMapPromise
  })

  test.describe('when pressing the back button', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(`collection-result-item_${conceptId}`).click()

      await page.getByRole('button', { name: 'Download All' }).click()

      await expect(page.getByRole('button', { name: 'Download project data' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Download project data' })).toBeEnabled()

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

  test.describe('when pressing the back button from the downloads page', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(/saved_access_configs/, async (route) => {
        await route.fulfill({
          json: {}
        })
      })

      await page.route('**/graphql', async (route) => {
        const { query, variables } = JSON.parse(route.request().postData())

        if (isGetProjectQuery(route, '9452013926')) {
          await route.fulfill({
            json: {
              data: {
                project: {
                  name: 'Test Project',
                  obfuscatedId: '9452013926',
                  path: '/project?p=C1214470488-ASF!C1214470488-ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=download&pg[1][cd]=f'
                }
              }
            }
          })
        }

        if (query.includes('mutation CreateProject')) {
          await route.fulfill({
            json: {
              data: {
                createProject: {
                  name: 'Test Project',
                  obfuscatedId: '9452013926',
                  path: '/project?p=C1214470488-ASF!C1214470488-ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=download&pg[1][cd]=f'
                }
              }
            }
          })
        }

        if (query.includes('mutation CreateRetrieval')) {
          await route.fulfill({
            json: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '2058954173'
                }
              }
            },
            headers: {
              'content-type': 'application/json'
            }
          })
        }

        if (query.includes('query GetRetrieval(')) {
          await route.fulfill({
            json: retrieval,
            headers: {
              'content-type': 'application/json'
            }
          })
        }

        if (query.includes('query GetRetrievalCollection')) {
          await route.fulfill({
            json: retrievalCollection,
            headers: {
              'content-type': 'application/json'
            }
          })
        }

        if (query.includes('query GetRetrievalGranuleLinks')) {
          if (variables.cursor === null) {
            await route.fulfill({
              json: {
                data: {
                  retrieveGranuleLinks: {
                    cursor: 'mock-cursor',
                    done: null,
                    links: {
                      browse: [],
                      download: downloadLinks,
                      s3: []
                    }
                  }
                }
              },
              headers: {
                'content-type': 'application/json'
              }
            })
          } else {
            await route.fulfill({
              json: {
                data: {
                  retrieveGranuleLinks: {
                    cursor: null,
                    done: null,
                    links: {
                      browse: [],
                      download: [],
                      s3: []
                    }
                  }
                }
              },
              headers: {
                'content-type': 'application/json'
              }
            })
          }
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
      await page.route('**/graphql', async () => {
        expect('This route should not be called again').toEqual(true)
      })

      // Use the browser back button to go back to the downloads
      await page.goBack()
      await expect(page.getByRole('link', { name: downloadLinks[0] })).toBeVisible()
    })
  })
})
