import { test, expect } from 'playwright-test-coverage'

import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'

import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import multipleShapesShapefileBody from './__mocks__/multiple_shapes_shapefile_collections.body.json'
import simpleShapefileBody from './__mocks__/simple_shapefile_collections.body.json'
import tooManyPointsShapefileBody from './__mocks__/too_many_points_shapefile_collections.body.json'
import arcticShapefileBody from './__mocks__/arctic_shapefile_collections.body.json'
import antarcticShapefileBody from './__mocks__/antarctic_shapefile_collections.body.json'
import uploadShapefile from '../../support/uploadShapefile'

test.describe('Map: Shapefile interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
    await page.route('**/scale/**', (route) => route.abort())

    await page.route('**/search/granules/timeline', (route) => {
      route.fulfill({
        body: JSON.stringify([])
      })
    })
  })

  test.describe('When uploading a shapefile', () => {
    test.describe('When the shapefile has a single polygon shape', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: simpleShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647,42.1875,-16.46517'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'simple.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=5/, { timeout: 3000 })

        // The shapefile has 1 svg shapes that is auto selected, so 2 path elements
        await expect(await page.locator('g path').all()).toHaveLength(2)

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&sf=1&sfs[0]=0&lat=-9.435819999999993&long=49.21875&zoom=5')
      })
    })

    test.describe('When the shapefile has a line shape', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.line?.[0] === '31,-15,36,-17,41,-15'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'multiple_shapes.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=4/, { timeout: 3000 })

        // The shapefile has 4 svg shapes, so 4 path elements
        await expect(await page.locator('g path').all()).toHaveLength(4)

        // Select the line
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.locator('g path').nth(2).dispatchEvent('click')

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // After clicking a shape the map will have 5 path elements
        await expect(await page.locator('g path').all()).toHaveLength(5)

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL('search?line[0]=31%2C-15%2C36%2C-17%2C41%2C-15&sf=1&sfs[0]=2&lat=-8.296765000000008&long=44.625&zoom=4')
      })
    })

    test.describe('When the shapefile has a circle shape', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.circle?.[0] === '35,-5,50000'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'multiple_shapes.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=4/, { timeout: 3000 })

        // The shapefile has 4 svg shapes, so 4 path elements
        await expect(await page.locator('g path').all()).toHaveLength(4)

        // Select the circle
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.locator('g path').nth(3).dispatchEvent('click')

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // After clicking a shape the map will have 5 path elements
        await expect(await page.locator('g path').all()).toHaveLength(5)

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL('search?circle[0]=35%2C-5%2C50000&sf=1&sfs[0]=3&lat=-8.296765000000008&long=44.625&zoom=4')
      })
    })

    test.describe('When the shapefile has a point shape', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0] === '35,0'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'multiple_shapes.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=4/, { timeout: 3000 })

        // The shapefile has 1 point shapes, so 1 Marker button
        await expect(await page.getByRole('button', { name: 'Marker' }).all()).toHaveLength(1)

        // Select the point
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.getByRole('button', { name: 'Marker' }).dispatchEvent('click')

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // After clicking a shape the map will have 2 Marker buttons
        await expect(await page.getByRole('button', { name: 'Marker' }).all()).toHaveLength(2)

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL('search?sp[0]=35%2C0&sf=1&sfs[0]=4&lat=-8.296765000000008&long=44.625&zoom=4')
      })
    })

    test.describe('When the shapefile has multiple shapes selected', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647,42.1875,-16.46517' && parsedQuery?.polygon?.[1] === '58.25,-14.46517,58.25,0.40647,44.1875,0.40647,58.25,-14.46517'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'multiple_shapes.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=4/, { timeout: 3000 })

        // The shapefile has 4 svg shapes, so 4 path elements
        await expect(await page.locator('g path').all()).toHaveLength(4)

        // Select the two polygons
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.locator('g path').nth(0).dispatchEvent('click')
        await page.locator('g path').nth(1).dispatchEvent('click')

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('2 shapes selected')

        // After clicking two shapes the map will have 6 path elements
        await expect(await page.locator('g path').all()).toHaveLength(6)

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&polygon[1]=58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647%2C58.25%2C-14.46517&sf=1&sfs[0]=0&sfs[1]=1&lat=-8.296765000000008&long=44.625&zoom=4')
      })
    })

    test.describe('When the shapefile has a polygon with too many points', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: tooManyPointsShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '-114.04999,36.95777,-114.0506,37.0004,-114.04826,41.99381,-119.99917,41.99454,-120.00101,38.99957,-118.71431,38.10218,-117.50012,37.22038,-116.0936,36.15581,-114.63667,35.00881,-114.63689,35.02837,-114.60362,35.06423,-114.64435,35.1059,-114.57852,35.12875,-114.56924,35.18348,-114.60431,35.35358,-114.67764,35.48974,-114.65431,35.59759,-114.68941,35.65141,-114.68321,35.68939,-114.70531,35.71159,-114.69571,35.75599,-114.71211,35.80618,-114.67742,35.87473,-114.73116,35.94392,-114.74376,35.9851,-114.73043,36.03132,-114.75562,36.08717,-114.57203,36.15161,-114.51172,36.15096,-114.50217,36.1288,-114.45837,36.13859,-114.44661,36.12597,-114.40547,36.14737,-114.37211,36.14311,-114.30843,36.08244,-114.31403,36.05817,-114.25265,36.02019,-114.14819,36.02801,-114.11416,36.09698,-114.12086,36.1146,-114.09987,36.12165,-114.04684,36.19407,-114.04999,36.95777'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'too_many_points.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=6/, { timeout: 3000 })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // The shapefile has 1 svg shapes that is auto selected, so 2 path elements
        await expect(await page.locator('g path').all()).toHaveLength(2)

        // Displays a modal
        await expect(page.getByTestId('edsc-modal__title')).toHaveText('Shape file has too many points')

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=-114.04999%2C36.95777%2C-114.0506%2C37.0004%2C-114.04826%2C41.99381%2C-119.99917%2C41.99454%2C-120.00101%2C38.99957%2C-118.71431%2C38.10218%2C-117.50012%2C37.22038%2C-116.0936%2C36.15581%2C-114.63667%2C35.00881%2C-114.63689%2C35.02837%2C-114.60362%2C35.06423%2C-114.64435%2C35.1059%2C-114.57852%2C35.12875%2C-114.56924%2C35.18348%2C-114.60431%2C35.35358%2C-114.67764%2C35.48974%2C-114.65431%2C35.59759%2C-114.68941%2C35.65141%2C-114.68321%2C35.68939%2C-114.70531%2C35.71159%2C-114.69571%2C35.75599%2C-114.71211%2C35.80618%2C-114.67742%2C35.87473%2C-114.73116%2C35.94392%2C-114.74376%2C35.9851%2C-114.73043%2C36.03132%2C-114.75562%2C36.08717%2C-114.57203%2C36.15161%2C-114.51172%2C36.15096%2C-114.50217%2C36.1288%2C-114.45837%2C36.13859%2C-114.44661%2C36.12597%2C-114.40547%2C36.14737%2C-114.37211%2C36.14311%2C-114.30843%2C36.08244%2C-114.31403%2C36.05817%2C-114.25265%2C36.02019%2C-114.14819%2C36.02801%2C-114.11416%2C36.09698%2C-114.12086%2C36.1146%2C-114.09987%2C36.12165%2C-114.04684%2C36.19407%2C-114.04999%2C36.95777&sf=1&sfs[0]=0&lat=38.502146&long=-117.02269700000001&zoom=6')
      })
    })

    test.describe('When the shapefile has only arctic latitudes', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: arcticShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,76.46517,56.25,76.46517,42.1875,82.40647,42.1875,76.46517'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'arctic.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=0/, { timeout: 3000 })

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // The shapefile has 1 svg shapes that is auto selected, so 2 path elements
        await expect(await page.locator('g path').all()).toHaveLength(2)

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C76.46517%2C56.25%2C76.46517%2C42.1875%2C82.40647%2C42.1875%2C76.46517&sf=1&sfs[0]=0&lat=90&projection=EPSG%3A3413&zoom=0')
      })
    })

    test.describe('When the shapefile has only antarctic latitudes', () => {
      test('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: antarcticShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2'
            },
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-76.46517,42.1875,-82.40647,56.25,-76.46517,42.1875,-76.46517'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        await page.goto('/')

        // Upload the shapefile
        await uploadShapefile(page, 'antarctic.geojson')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=0/, { timeout: 3000 })

        // The shapefile has 1 svg shapes that is auto selected, so 2 path elements
        await expect(await page.locator('g path').all()).toHaveLength(2)

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C-76.46517%2C42.1875%2C-82.40647%2C56.25%2C-76.46517%2C42.1875%2C-76.46517&sf=1&sfs[0]=0&lat=-90&projection=EPSG%3A3031&zoom=0')
      })
    })
  })
})
