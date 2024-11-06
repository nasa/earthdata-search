import { test, expect } from 'playwright-test-coverage'

import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'

import boundingBoxBody from './__mocks__/bounding_box_collections.body.json'
import boundingBoxBodyEdited from './__mocks__/bounding_box_collections_edited.body.json'
import circleBody from './__mocks__/circle_collections.body.json'
import circleBodyEdited from './__mocks__/circle_collections_edited.body.json'
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import pointBody from './__mocks__/point_collections.body.json'
import pointBodyEdited from './__mocks__/point_collections_edited.body.json'
import polygonBody from './__mocks__/polygon_collections.body.json'
import polygonBodyEdited from './__mocks__/polygon_collections_edited.body.json'

test.describe('Map: Spatial interactions', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route('**/scale/**', (route) => route.abort())

    await page.route('**/search/granules/timeline', (route) => {
      route.fulfill({
        body: JSON.stringify([])
      })
    })

    // eslint-disable-next-line no-param-reassign
    testInfo.snapshotPath = (name) => `${testInfo.file}-snapshots/${testInfo.project.name}/${name}`
  })

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
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,-7\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the point spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Point' }).click()

        // Add the point to the map
        await page.mouse.click(1000, 500)

        // Updates the URL
        await expect(page).toHaveURL(/search\?sp\[0\]=42\.\d+%2C-7\.\d+/)

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_point')).toHaveValue(/-7\.\d+,42\.\d+/)

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()
      })
    })

    test.describe('When drawing a new point from the leaflet controls', () => {
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
          }]
        })

        await page.goto('/')

        // Select the point spatial type
        await page.getByRole('link', { name: 'Search by spatial coordinate' }).click()

        // Add the point to the map
        await page.mouse.click(1000, 500)

        // Updates the URL
        await expect(page).toHaveURL(/search\?sp\[0\]=42\.\d+%2C-7\.\d+/)

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_point')).toHaveValue(/-7\.\d+,42\.\d+/)

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()
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

        // Select the point spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Point' }).click()

        // Enter the spatial point
        await page.getByTestId('spatial-display_point').focus()
        await page.keyboard.type('4.5297,42.1875')
        await page.keyboard.up('Enter')

        // Updates the URL
        await expect(page).toHaveURL('search?sp[0]=42.1875%2C4.5297&lat=4.5297&long=42.1875&zoom=7')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_point')).toHaveValue('4.5297,42.1875')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()
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

        // Select the point spatial type
        await page.getByRole('link', { name: 'Search by spatial coordinate' }).click()

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
            paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,-7\.\d+,156\d+/)
          }]
        })

        await page.goto('/')

        // Select the circle spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Circle' }).click()

        // Add the circle to the map
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
      })
    })

    test.describe('When drawing a new circle from the leaflet controls', () => {
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
          }]
        })

        await page.goto('/')

        // Select the circle spatial type
        await page.getByRole('link', { name: 'Search by spatial circle' }).click()

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

        // Select the circle spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Circle' }).click()

        // Enter the circle values
        await page.getByTestId('spatial-display_circle-center').focus()
        await page.keyboard.type('4.5297,42.1875')
        await page.getByTestId('spatial-display_circle-radius').focus()
        await page.keyboard.type('156444')
        await page.keyboard.up('Enter')

        // Updates the URL
        await expect(page).toHaveURL('search?circle[0]=42.1875%2C4.5297%2C156444&lat=4.529699999999991&long=42.187500000000014&zoom=6')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue('4.5297,42.1875')
        await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue('156444')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()
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
        await page.getByRole('link', { name: 'Search by spatial circle' }).click()

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
              ?.match(/42\.\d+,-21\.\d+,56\.\d+,-7\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the bounding box spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Rectangle' }).click()

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
      })
    })

    test.describe('When drawing a new bounding box from the leaflet controls', () => {
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
          }]
        })

        await page.goto('/')

        // Select the bounding box spatial type
        await page.locator('.leaflet-draw-draw-rectangle').click()

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

        // Select the bounding box spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Rectangle' }).click()

        // Enter the bounding box values
        await page.getByTestId('spatial-display_southwest-point').focus()
        await page.keyboard.type('-9.53964,42.1875')
        await page.getByTestId('spatial-display_northeast-point').focus()
        await page.keyboard.type('4.5297,56.25')
        await page.keyboard.up('Enter')

        // Updates the URL
        await expect(page).toHaveURL('search?sb[0]=42.1875%2C-9.53964%2C56.25%2C4.5297&lat=-2.50497&long=49.21875&zoom=4')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue('-9.53964,42.1875')
        await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue('4.5297,56.25')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()
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
        await page.getByRole('button', { name: 'Select Rectangle' }).click()

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
              ?.match(/42\.\d+,-7\.\d+,42\.\d+,-21\.\d+,56\.\d+,-21\.\d+,42\.\d+,-7\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the polygon spatial type
        await page.getByRole('button', { name: 'spatial-selection-dropdown' }).click()
        await page.getByRole('button', { name: 'Select Polygon' }).click()

        // Add the polygon to the map
        await page.mouse.click(1000, 500)

        await page.waitForTimeout(200)
        await page.mouse.click(1100, 600)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 600)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 500)

        // Updates the URL
        // eslint-disable-next-line max-len
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
      })
    })

    test.describe('When drawing a new polygon from the leaflet controls', () => {
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
          }]
        })

        await page.goto('/')

        // Select the polygon spatial type
        await page.locator('.leaflet-draw-draw-polygon').click()

        // Add the polygon to the map
        await page.mouse.click(1000, 500)

        await page.waitForTimeout(200)
        await page.mouse.click(1100, 600)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 600)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 500)

        // Updates the URL
        // eslint-disable-next-line max-len
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
        await page.getByRole('button', { name: 'Select Polygon' }).click()

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
})
