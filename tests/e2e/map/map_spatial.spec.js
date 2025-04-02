import { test, expect } from 'playwright-test-coverage'

import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { setupTests } from '../../support/setupTests'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'

import arcticHucProjectBody from './__mocks__/arctic_huc_project.body.json'
import arcticReachProjectBody from './__mocks__/arctic_reach_project.body.json'
import boundingBoxBody from './__mocks__/bounding_box_collections.body.json'
import boundingBoxBodyEdited from './__mocks__/bounding_box_collections_edited.body.json'
import circleBody from './__mocks__/circle_collections.body.json'
import circleBodyEdited from './__mocks__/circle_collections_edited.body.json'
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import geographicHucProjectBody from './__mocks__/geographic_huc_project.body.json'
import geographicReachProjectBody from './__mocks__/geographic_reach_project.body.json'
import hucSearchBody from './__mocks__/huc_search.body.json'
import opensearchGranulesBody from './__mocks__/opensearch_granules/granules_body'
import opensearchGranulesCollectionBody from './__mocks__/opensearch_granules/collections.body.json'
import opensearchGranulesCollectionGraphQlBody from './__mocks__/opensearch_granules/graphql.body.json'
import opensearchGranulesCollectionGraphQlHeaders from './__mocks__/opensearch_granules/graphql.headers.json'
import opensearchGranulesHeaders from './__mocks__/opensearch_granules/granules.headers.json'
import opensearchGranulesTimelineBody from './__mocks__/opensearch_granules/timeline.body.json'
import opensearchGranulesTimelineHeaders from './__mocks__/opensearch_granules/timeline.headers.json'
import pointBody from './__mocks__/point_collections.body.json'
import pointBodyEdited from './__mocks__/point_collections_edited.body.json'
import polygonBody from './__mocks__/polygon_collections.body.json'
import polygonBodyEdited from './__mocks__/polygon_collections_edited.body.json'
import reachSearchBody from './__mocks__/reach_search.body.json'

const screenshotClip = {
  x: 930,
  y: 90,
  width: 425,
  height: 700
}

test.describe('Map: Spatial interactions', () => {
  test.beforeEach(async ({ page, context, browserName }) => {
    await setupTests({
      browserName,
      context,
      page
    })

    await page.route('**/search/granules/timeline', (route) => {
      route.fulfill({
        body: JSON.stringify([])
      })
    })
  })

  test.describe('when drawing spatial in the geographic projection', () => {
    test.describe('When drawing point spatial', () => {
      test.describe('When drawing a new point from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/-28\.\d+,-9\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Point' }).click()

          // Add the point to the map
          await page.mouse.click(1000, 500)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sp\[0\]=-28\.\d+%2C-9\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue(/-9\.\d+,-28\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-point-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new point from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/-28\.\d+,-9\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('button', { name: 'Search by spatial coordinate' }).click()

          // Add the point to the map
          await page.mouse.click(1000, 500)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sp\[0\]=-28\.\d+%2C-9\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue(/-9\.\d+,-28\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-point-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When typing a new point in the spatial display', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,4\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Point' }).click()

          // Enter the spatial point
          await page.getByTestId('spatial-display_point').focus()
          await page.keyboard.type('4.5297,42.1875')
          await page.keyboard.up('Enter')

          // Updates the URL
          await expect(page).toHaveURL('search?sp[0]=42.1875%2C4.5297&lat=4.5297&long=42.1875&zoom=21')

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue('4.5297,42.1875')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Wait for the map to update
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-point-spatial-typed.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When editing a point', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,-7\.\d+/)
            },
            {
              body: pointBodyEdited,
              headers: {
                ...commonHeaders,
                'cmr-hits': '3'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,-24\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('link', { name: 'Draw a coordinate on the map to select a spatial extent' }).click()

          // Add the point to the map
          await page.mouse.click(1000, 500)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sp\[0\]=42\.\d+%2C-7\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue(/-7\.\d+,42\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Edit the point
          await page.getByRole('link', { name: 'Edit Layers' }).click()

          // Drag point to new location
          await page.getByRole('button', { name: 'Marker' }).hover()
          await page.mouse.down()
          await page.mouse.move(1000, 600)
          await page.mouse.up()

          // Save the point
          await page.getByRole('link', { name: 'Save' }).click()

          // Updates the URL
          await expect(page).toHaveURL(/search\?sp\[0\]=42\.\d+%2C-24\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue(/-24\.\d+,42\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 3 of 3 matching collections')).toBeVisible()
        })
      })
    })

    test.describe('When drawing circle spatial', () => {
      test.describe('When drawing a new circle from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/-28\.\d+,-9\.\d+,195\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the circle spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', {
            name: 'Circle',
            exact: true
          }).click()

          // Add the circle to the map
          await page.mouse.click(1000, 500)
          await page.mouse.click(1000, 510)

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=-28\.\d+%2C-9\.\d+%2C195\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/-9\.\d+,-28\.\d+/)
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/195\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-circle-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new circle from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/-28\.\d+,-9\.\d+,195\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the circle spatial type
          await page.getByRole('button', { name: 'Search by spatial circle' }).click()

          // Add the circle to the map
          await page.mouse.click(1000, 500)
          await page.mouse.click(1000, 510)

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=-28\.\d+%2C-9\.\d+%2C195\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/-9\.\d+,-28\.\d+/)
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/195\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-circle-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When typing a new circle in the spatial display', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,4\.\d+,156\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the circle spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', {
            name: 'Circle',
            exact: true
          }).click()

          // Enter the circle values
          await page.getByTestId('spatial-display_circle-center').focus()
          await page.keyboard.type('4.5297,42.1875')
          await page.getByTestId('spatial-display_circle-radius').focus()
          await page.keyboard.type('156444')
          await page.keyboard.up('Enter')

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=42.1875%2C4.5297%2C156444&lat=4\.\d+&long=42\.\d+&zoom=7\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue('4.5297,42.1875')
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue('156444')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-circle-spatial-typed.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When editing a circle', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,-7\.\d+,156\d+/)
            },
            {
              body: circleBodyEdited,
              headers: {
                ...commonHeaders,
                'cmr-hits': '3'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,-14\.\d+,156\d+/)
            }]
          })

          await page.goto('/')

          // Select the circle spatial type
          await page.getByRole('link', { name: 'Draw a circle on the map to select a spatial extent' }).click()

          // Add the point to the map
          await page.mouse.move(1000, 500)
          await page.mouse.down()
          await page.mouse.move(1000, 510)
          await page.mouse.up()

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=42\.\d+%2C-7\.\d+%2C156\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/-7\.\d+,42\.\d+/)
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/156\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Edit the circle
          await page.getByRole('link', { name: 'Edit Layers' }).click()

          // Drag circle to new location
          await page.mouse.move(1000, 500)
          await page.mouse.down()
          await page.mouse.move(1000, 550)
          await page.mouse.up()

          // Save the circle
          await page.getByRole('link', { name: 'Save' }).click()

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=42\.\d+%2C-14\.\d+%2C156\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/-14\.\d+,42\.\d+/)
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/156\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 3 of 3 matching collections')).toBeVisible()
        })
      })
    })

    test.describe('When drawing bounding box spatial', () => {
      test.describe('When drawing a new bounding box from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/-28\.\d+,-44\.\d+,-10\.\d+,-9\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Rectangle' }).first().click()

          // Add the bounding box to the map
          await page.mouse.click(1000, 500)
          await page.mouse.click(1100, 700)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=-28\.\d+%2C-44\.\d+%2C-10\.\d+%2C-9\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/-44\.\d+,-28\.\d+/)
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/-9\.\d+,-10\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-box-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new bounding box from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/-28\.\d+,-44\.\d+,-10\.\d+,-9\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'Search by spatial rectangle' }).click()

          // Add the bounding box to the map
          await page.mouse.click(1000, 500)
          await page.mouse.click(1100, 700)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=-28\.\d+%2C-44\.\d+%2C-10\.\d+%2C-9\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/-44\.\d+,-28\.\d+/)
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/-9\.\d+,-10\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-box-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When typing a new bounding box in the spatial display', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/42\.\d+,-9\.\d+,56\.\d+,4\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Rectangle' }).first().click()

          // Enter the bounding box values
          await page.getByTestId('spatial-display_southwest-point').focus()
          await page.keyboard.type('-9.53964,42.1875')
          await page.getByTestId('spatial-display_northeast-point').focus()
          await page.keyboard.type('4.5297,56.25')
          await page.keyboard.up('Enter')

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=42.1875%2C-9.53964%2C56.25%2C4.5297&lat=-2\.\d+&long=49\.\d+&zoom=5\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue('-9.53964,42.1875')
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue('4.5297,56.25')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-box-spatial-typed.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When editing a bounding box', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/42\.\d+,-21\.\d+,56\.\d+,-7\.\d+/)
            },
            {
              body: boundingBoxBodyEdited,
              headers: {
                ...commonHeaders,
                'cmr-hits': '3'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/42\.\d+,-21\.\d+,56\.\d+,6\.\d+/)
            }]
          })

          await page.goto('/')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Rectangle' }).click()

          // Add the bounding box to the map
          await page.mouse.click(1000, 500)
          await page.mouse.click(1100, 600)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=42\.\d+%2C-21\.\d+%2C56\.\d+%2C-7\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/-21\.\d+,42\.\d+/)
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/-7\.\d+,56\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Edit the bounding box
          await page.getByRole('link', { name: 'Edit Layers' }).click()

          // Drag bounding box to new location
          await page.mouse.move(1000, 500)
          await page.mouse.down()
          await page.mouse.move(1000, 400)
          await page.mouse.up()

          // Save the bounding box
          await page.getByRole('link', { name: 'Save' }).click()

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=42\.\d+%2C-21\.\d+%2C56\.\d+%2C6\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/-21\.\d+,42\.\d+/)
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/6\.\d+,56\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 3 of 3 matching collections')).toBeVisible()
        })
      })
    })

    test.describe('When drawing polygon spatial', () => {
      test.describe('When drawing a new polygon from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: polygonBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]
                ?.match(/-28\.\d+,-9\.\d+,-28\.\d+,-44\.\d+,-10\.\d+,-44\.\d+,-28\.\d+,-9\.\d+/)
            }]
          })

          await page.goto('/')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the polygon spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Polygon' }).first().click()

          // Add the polygon to the map
          await page.mouse.click(1000, 500)

          await page.waitForTimeout(200)
          await page.mouse.click(1100, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 500)

          // Updates the URL
          // eslint-disable-next-line max-len
          await expect(page).toHaveURL(/search\?polygon\[0\]=-28\.\d+%2C-9\.\d+%2C-28\.\d+%2C-44\.\d+%2C-10\.\d+%2C-44\.\d+%2C-28\.\d+%2C-9\.\d+/)

          // Populates the spatial display field
          await expect(
            page.getByTestId('filter-stack__spatial')
              .locator('.filter-stack-item__secondary-title')
          ).toHaveText('Polygon')

          await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-polygon-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new polygon from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: polygonBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]
                ?.match(/-28\.\d+,-9\.\d+,-28\.\d+,-44\.\d+,-10\.\d+,-44\.\d+,-28\.\d+,-9\.\d+/)
            }]
          })

          await page.goto('/')

          // Select the polygon spatial type
          await page.getByRole('button', { name: 'Search by spatial polygon' }).click()

          // Add the polygon to the map
          await page.mouse.click(1000, 500)

          await page.waitForTimeout(200)
          await page.mouse.click(1100, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 500)

          // Updates the URL
          // eslint-disable-next-line max-len
          await expect(page).toHaveURL(/search\?polygon\[0\]=-28\.\d+%2C-9\.\d+%2C-28\.\d+%2C-44\.\d+%2C-10\.\d+%2C-44\.\d+%2C-28\.\d+%2C-9\.\d+/)

          // Populates the spatial display field
          await expect(
            page.getByTestId('filter-stack__spatial')
              .locator('.filter-stack-item__secondary-title')
          ).toHaveText('Polygon')

          await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-box-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When editing a polygon', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: polygonBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]
                ?.match(/42\.\d+,-7\.\d+,42\.\d+,-21\.\d+,56\.\d+,-21\.\d+,42\.\d+,-7\.\d+/)
            },
            {
              body: polygonBodyEdited,
              headers: {
                ...commonHeaders,
                'cmr-hits': '3'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]
                ?.match(/42\.\d+,-7\.\d+,42\.\d+,-21\.\d+,63\.\d+,-28\.\d+,42\.\d+,-7\.\d+/)
            }]
          })

          await page.goto('/')

          // Select the polygon spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Polygon' }).click()

          // Add the polygon to the map
          await page.mouse.click(1000, 500)

          await page.waitForTimeout(200)
          await page.mouse.click(1100, 600)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 600)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 500)

          // Updates the URL
          await expect(page).toHaveURL(/search\?polygon\[0\]=42\.\d+%2C-7\.\d+%2C42\.\d+%2C-21\.\d+%2C56\.\d+%2C-21\.\d+%2C42\.\d+%2C-7\.\d+/)

          // Populates the spatial display field
          await expect(
            page.getByTestId('filter-stack__spatial')
              .locator('.filter-stack-item__secondary-title')
          ).toHaveText('Polygon')

          await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Edit the polygon
          await page.getByRole('link', { name: 'Edit Layers' }).click()

          // Drag polygon to new location
          await page.mouse.move(1100, 600)
          await page.mouse.down()
          await page.mouse.move(1150, 650)
          await page.mouse.up()

          // Save the polygon
          await page.getByRole('link', { name: 'Save' }).click()

          // Updates the URL
          await expect(page).toHaveURL(/search\?polygon\[0\]=42\.\d+%2C-7\.\d+%2C42\.\d+%2C-21\.\d+%2C63\.\d+%2C-28\.\d+%2C42\.\d+%2C-7\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 3 of 3 matching collections')).toBeVisible()
        })
      })
    })

    test.describe('when drawing advanced search spatial', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/search')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await page.getByRole('button', { name: 'Advanced search' }).click()
      })

      test.describe('when drawing a river reach', () => {
        test.beforeEach(async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody, // `body` doesn't matter for this test, we just want to mock a result
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.line?.[0]?.match(/-90\.\d+/)
            }]
          })

          await page.route('**/regions?endpoint=rivers%2Freach&exact=true&query=86300600011', async (route) => {
            await route.fulfill({
              json: reachSearchBody,
              headers: {}
            })
          })

          await page.route('**/projects', async (route) => {
            await route.fulfill({
              json: geographicReachProjectBody,
              headers: {}
            })
          })
        })

        test('renders the spatial correctly', async ({ page }) => {
          const dialog = await page.getByRole('dialog')

          const select = await dialog.getByRole('combobox')
          await select.selectOption('River Reach')

          await dialog.getByRole('textbox', { value: 'keyword' }).type('86300600011')

          await dialog.getByRole('checkbox', { name: 'Exact match' }).check()

          await dialog.getByRole('button', { name: 'Search' }).click()

          await dialog.getByRole('button', { name: '86300600011' }).click()

          await dialog.getByRole('button', { name: 'Apply' }).click()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-reach-spatial.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('when drawing a huc', () => {
        test.beforeEach(async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody, // `body` doesn't matter for this test, we just want to mock a result
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]?.match(/-89.\d+/)
            }]
          })

          await page.route('**/regions?endpoint=huc&exact=true&query=04010101', async (route) => {
            await route.fulfill({
              json: hucSearchBody,
              headers: {}
            })
          })

          await page.route('**/projects', async (route) => {
            await route.fulfill({
              json: geographicHucProjectBody,
              headers: {}
            })
          })
        })

        test('renders the spatial correctly', async ({ page }) => {
          const dialog = await page.getByRole('dialog')

          await dialog.getByRole('textbox', { value: 'keyword' }).type('04010101')

          await dialog.getByRole('checkbox', { name: 'Exact match' }).check()

          await dialog.getByRole('button', { name: 'Search' }).click()

          await dialog.getByRole('button', { name: '04010101' }).click()

          await dialog.getByRole('button', { name: 'Apply' }).click()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('4326-huc-spatial.png', {
            clip: screenshotClip
          })
        })
      })
    })
  })

  // All of the code is the same with Arctic vs Antarctic, so we only need to test one
  test.describe('when drawing spatial in the arctic projection', () => {
    test.describe('When drawing point spatial', () => {
      test.describe('When drawing a new point from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/-108\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Point' }).click()

          // Add the point to the map
          await page.mouse.click(1000, 525)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sp\[0\]=-108\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue(/76\.\d+,-108\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-point-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new point from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/-108\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('button', { name: 'Search by spatial coordinate' }).click()

          // Add the point to the map
          await page.mouse.click(1000, 525)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sp\[0\]=-108\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue(/76\.\d+,-108\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-point-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When typing a new point in the spatial display', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/-108\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the point spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Point' }).click()

          // Enter the spatial point
          await page.getByTestId('spatial-display_point').focus()
          await page.keyboard.type('76.61639,-108.80547')
          await page.keyboard.up('Enter')

          // Updates the URL
          await expect(page).toHaveURL('search?sp[0]=-108.80547%2C76.61639&lat=76.61639&long=-108.80547&projection=EPSG%3A3413&zoom=12')

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_point')).toHaveValue('76.61639,-108.80547')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Wait for the map to update
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-point-spatial-typed.png', {
            clip: screenshotClip
          })
        })
      })
    })

    test.describe('When drawing circle spatial', () => {
      test.describe('When drawing a new circle from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/-108\.\d+,76\.\d+,166\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the circle spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', {
            name: 'Circle',
            exact: true
          }).click()

          // Add the circle to the map
          await page.mouse.click(1000, 525)
          await page.mouse.click(1000, 545)

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=-108\.\d+%2C76\.\d+%2C166\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/76\.\d+,-108\.\d+/)
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/166\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-circle-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new circle from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/-108\.\d+,76\.\d+,166\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the circle spatial type
          await page.getByRole('button', { name: 'Search by spatial circle' }).click()

          // Add the circle to the map
          await page.mouse.click(1000, 525)
          await page.mouse.click(1000, 545)

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=-108\.\d+%2C76\.\d+%2C166\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/76\.\d+,-108\.\d+/)
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/166\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-circle-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When typing a new circle in the spatial display', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: circleBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/-108\.\d+,76\.\d+,166\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the circle spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', {
            name: 'Circle',
            exact: true
          }).click()

          // Enter the circle values
          await page.getByTestId('spatial-display_circle-center').focus()
          await page.keyboard.type('76.61639,-108.80547')
          await page.getByTestId('spatial-display_circle-radius').focus()
          await page.keyboard.type('166091')
          await page.keyboard.up('Enter')

          // Updates the URL
          await expect(page).toHaveURL(/search\?circle\[0\]=-108.80547%2C76.61639%2C166091&lat=76\.\d+&long=-109\.\d+&projection=EPSG%3A3413&zoom=5\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue('76.61639,-108.80547')
          await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue('166091')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-circle-spatial-typed.png', {
            clip: screenshotClip
          })
        })
      })
    })

    test.describe('When drawing bounding box spatial', () => {
      test.describe('When drawing a new bounding box from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/-108\.\d+,70\.\d+,-58\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Rectangle' }).first().click()

          // Add the bounding box to the map
          await page.mouse.click(1000, 525)
          await page.mouse.click(1100, 700)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=-108\.\d+%2C70\.\d+%2C-58\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/70\.\d+,-108\.\d+/)
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/76\.\d+,-58\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-box-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new bounding box from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/-108\.\d+,70\.\d+,-58\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'Search by spatial rectangle' }).click()

          // Add the bounding box to the map
          await page.mouse.click(1000, 525)
          await page.mouse.click(1100, 700)

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=-108\.\d+%2C70\.\d+%2C-58\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/70\.\d+,-108\.\d+/)
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/76\.\d+,-58\.\d+/)

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-box-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When typing a new bounding box in the spatial display', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: boundingBoxBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
                ?.match(/-108\.\d+,70\.\d+,-58\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the bounding box spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Rectangle' }).first().click()

          // Enter the bounding box values
          await page.getByTestId('spatial-display_southwest-point').focus()
          await page.keyboard.type('70.50112,-108.80547')
          await page.getByTestId('spatial-display_northeast-point').focus()
          await page.keyboard.type('76.61639,-58.21561')
          await page.keyboard.up('Enter')

          // Updates the URL
          await expect(page).toHaveURL(/search\?sb\[0\]=-108\.\d+%2C70\.\d+%2C-58\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue('70.50112,-108.80547')
          await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue('76.61639,-58.21561')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-box-spatial-typed.png', {
            clip: screenshotClip
          })
        })
      })
    })

    test.describe('When drawing polygon spatial', () => {
      test.describe('When drawing a new polygon from the spatial selection', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: polygonBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]
                ?.match(/-108\.\d+,76\.\d+,-77\.\d+,67\.\d+,-58\.\d+,70\.\d+,-108\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Wait for the map to load
          await page.waitForSelector('.edsc-map-base-layer')

          // Select the polygon spatial type
          await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
          await page.getByRole('button', { name: 'Polygon' }).first().click()

          // Add the polygon to the map
          await page.mouse.click(1000, 525)

          await page.waitForTimeout(200)
          await page.mouse.click(1100, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 525)

          // Updates the URL
          // eslint-disable-next-line max-len
          await expect(page).toHaveURL(/search\?polygon\[0\]=-108\.\d+%2C76\.\d+%2C-77\.\d+%2C67\.\d+%2C-58\.\d+%2C70\.\d+%2C-108\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(
            page.getByTestId('filter-stack__spatial')
              .locator('.filter-stack-item__secondary-title')
          ).toHaveText('Polygon')

          await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-polygon-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('When drawing a new polygon from the map controls', () => {
        test('renders correctly', async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: polygonBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]
                ?.match(/-108\.\d+,76\.\d+,-77\.\d+,67\.\d+,-58\.\d+,70\.\d+,-108\.\d+,76\.\d+/)
            }]
          })

          await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

          // Select the polygon spatial type
          await page.getByRole('button', { name: 'Search by spatial polygon' }).click()

          // Add the polygon to the map
          await page.mouse.click(1000, 525)

          await page.waitForTimeout(200)
          await page.mouse.click(1100, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 700)

          await page.waitForTimeout(200)
          await page.mouse.click(1000, 525)

          // Updates the URL
          // eslint-disable-next-line max-len
          await expect(page).toHaveURL(/search\?polygon\[0\]=-108\.\d+%2C76\.\d+%2C-77\.\d+%2C67\.\d+%2C-58\.\d+%2C70\.\d+%2C-108\.\d+%2C76\.\d+/)

          // Populates the spatial display field
          await expect(
            page.getByTestId('filter-stack__spatial')
              .locator('.filter-stack-item__secondary-title')
          ).toHaveText('Polygon')

          await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-box-spatial-drawn.png', {
            clip: screenshotClip
          })
        })
      })
    })

    test.describe('when drawing advanced search spatial', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await page.getByRole('button', { name: 'Advanced search' }).click()
      })

      test.describe('when drawing a river reach', () => {
        test.beforeEach(async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody, // `body` doesn't matter for this test, we just want to mock a result
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.line?.[0]?.match(/-90\.\d+/)
            }]
          })

          await page.route('**/regions?endpoint=rivers%2Freach&exact=true&query=86300600011', async (route) => {
            await route.fulfill({
              json: reachSearchBody,
              headers: {}
            })
          })

          await page.route('**/projects', async (route) => {
            await route.fulfill({
              json: arcticReachProjectBody,
              headers: {}
            })
          })
        })

        test('renders the spatial correctly', async ({ page }) => {
          const dialog = await page.getByRole('dialog')

          const select = await dialog.getByRole('combobox')
          await select.selectOption('River Reach')

          await dialog.getByRole('textbox', { value: 'keyword' }).type('86300600011')

          await dialog.getByRole('checkbox', { name: 'Exact match' }).check()

          await dialog.getByRole('button', { name: 'Search' }).click()

          await dialog.getByRole('button', { name: '86300600011' }).click()

          await dialog.getByRole('button', { name: 'Apply' }).click()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-reach-spatial.png', {
            clip: screenshotClip
          })
        })
      })

      test.describe('when drawing a huc', () => {
        test.beforeEach(async ({ page }) => {
          await interceptUnauthenticatedCollections({
            page,
            body: commonBody,
            headers: commonHeaders,
            additionalRequests: [{
              body: pointBody, // `body` doesn't matter for this test, we just want to mock a result
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0]?.match(/-89.\d+/)
            }]
          })

          await page.route('**/regions?endpoint=huc&exact=true&query=04010101', async (route) => {
            await route.fulfill({
              json: hucSearchBody,
              headers: {}
            })
          })

          await page.route('**/projects', async (route) => {
            await route.fulfill({
              json: arcticHucProjectBody,
              headers: {}
            })
          })
        })

        test('renders the spatial correctly', async ({ page }) => {
          const dialog = await page.getByRole('dialog')

          await dialog.getByRole('textbox', { value: 'keyword' }).type('04010101')

          await dialog.getByRole('checkbox', { name: 'Exact match' }).check()

          await dialog.getByRole('button', { name: 'Search' }).click()

          await dialog.getByRole('button', { name: '04010101' }).click()

          await dialog.getByRole('button', { name: 'Apply' }).click()

          // Wait for map animation to complete
          await page.waitForTimeout(250)

          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('3413-huc-spatial.png', {
            clip: screenshotClip
          })
        })
      })
    })
  })

  test.describe('When viewing OpenSearch granules with polygon spatial', () => {
    test.beforeEach(async ({ page }) => {
      const conceptId = 'C1972468359-SCIOPS'

      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders,
        additionalRequests: [{
          body: opensearchGranulesCollectionBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': '1'
          },
          paramCheck: (parsedQuery) => parsedQuery?.keyword === conceptId && parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647'
        }],
        includeDefault: false
      })

      await page.route(/opensearch\/granules$/, async (route) => {
        const query = JSON.parse(route.request().postData()).params

        expect(query).toEqual({
          boundingBox: '42.18750000000001,-9.453289809825428,49.218749999999986,-2.4064699999999886',
          conceptId: [],
          echoCollectionId: conceptId,
          exclude: {},
          openSearchOsdd: 'http://47.90.244.40/glass/osdd/fapar_modis_0.05d.xml',
          options: {},
          pageNum: 1,
          pageSize: 20,
          sortKey: '-start_date',
          twoDCoordinateSystem: {}
        })

        await route.fulfill({
          json: opensearchGranulesBody,
          headers: opensearchGranulesHeaders
        })
      })

      await page.route(/search\/granules\/timeline$/, async (route) => {
        const query = route.request().postData()

        expect(query).toEqual('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1972468359-SCIOPS&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647')

        await route.fulfill({
          json: opensearchGranulesTimelineBody,
          headers: opensearchGranulesTimelineHeaders
        })
      })

      await page.route(/api$/, async (route) => {
        const query = route.request().postData()

        expect(query).toEqual(graphQlGetCollection(conceptId))

        await route.fulfill({
          json: opensearchGranulesCollectionGraphQlBody,
          headers: opensearchGranulesCollectionGraphQlHeaders
        })
      })

      await page.route(/autocomplete$/, async (route) => {
        await route.fulfill({
          json: { feed: { entry: [] } }
        })
      })

      await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&lat=-6.300790127755789&long=45.26748690488419&zoom=5.925373594462485&tl=1622520000!3!!`)

      // Wait for the map to load
      await page.waitForSelector('.edsc-map-base-layer')
    })

    test('displays a hint about using a bounding box instead of polygon and an MBR on the map', async ({ page }) => {
      await expect(page.getByText('Showing 20 of 42,706 matching granules')).toBeVisible()

      await expect(
        page.getByTestId('filter-stack__spatial').locator('.filter-stack-item__error')
      ).toHaveText('This collection does not support polygon search. Your polygon has been converted to a bounding box.')

      // Draws the spatial on the map
      await expect(page).toHaveScreenshot('opensearch-warning.png', {
        clip: screenshotClip
      })
    })
  })
})
