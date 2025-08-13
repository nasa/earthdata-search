import { test, expect } from 'playwright-test-coverage'

import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import uploadShapefile from '../../support/uploadShapefile'
import { setupTests } from '../../support/setupTests'

import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import multipleShapesShapefileBody from './__mocks__/multiple_shapes_shapefile_collections.body.json'
import simpleShapefileBody from './__mocks__/simple_shapefile_collections.body.json'
import tooManyPointsShapefileBody from './__mocks__/too_many_points_shapefile_collections.body.json'
import arcticShapefileBody from './__mocks__/arctic_shapefile_collections.body.json'
import antarcticShapefileBody from './__mocks__/antarctic_shapefile_collections.body.json'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

test.describe('Map: Shapefile interactions', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })

    await page.route('**/search/granules/timeline', (route) => {
      route.fulfill({
        body: JSON.stringify([])
      })
    })
  })

  test.describe('When uploading a shapefile', () => {
    test.describe('When the shapefile has a polygon shape', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/4/)
        await uploadShapefile(page, 'polygon.geojson')
        await shapefilePromise

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
        await page.waitForURL(/zoom=4/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('polygon.png', {
          clip: screenshotClip
        })

        // Updates the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=42.1875%2C-2.40647%2C42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647&sf=1&sfs\[0\]=0&lat=-9\.\d+&long=49\.\d+/)
      })
    })

    test.describe('When the shapefile has a line shape', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.line?.[0] === '-106,35,-105,36,-94,33,-95,30,-93,31,-92,30'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/4/)
        await uploadShapefile(page, 'line.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=4/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('line.png', {
          clip: screenshotClip
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL(/search\?line\[0\]=-106%2C35%2C-105%2C36%2C-94%2C33%2C-95%2C30%2C-93%2C31%2C-92%2C30&sf=1&sfs\[0\]=0&lat=33&long=-98\.\d+&zoom=4\.\d+/)
      })
    })

    test.describe('When the shapefile has a circle shape', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.circle?.[0] === '-77.0163,38.883,50000'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/7/)
        await uploadShapefile(page, 'circle.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=8/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('circle.png', {
          clip: screenshotClip
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL(/search\?circle\[0\]=-77.0163%2C38.883%2C50000&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-76\.\d+&zoom=8\.\d+/)
      })
    })

    test.describe('When the shapefile has a point shape', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0] === '-77.0163,38.883'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/20/)
        await uploadShapefile(page, 'point.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=21/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('point.png', {
          clip: screenshotClip
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL('search?sp[0]=-77.0163%2C38.883&sf=1&sfs[0]=0&lat=38.883&long=-77.01629161809683&zoom=21')
      })
    })

    test.describe('When the shapefile has multiple shapes', () => {
      test.beforeEach(async ({ page }) => {
        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
        await uploadShapefile(page, 'multiple_shapes.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=3/, { timeout: 3000 })
      })

      test('renders and selects correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647' && parsedQuery?.polygon?.[1] === '44.1875,0.40647,58.25,-14.46517,58.25,0.40647,44.1875,0.40647'
          }]
        })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multiple-shapes.png', {
          clip: screenshotClip
        })

        // Lower Polygon
        await page.locator('.map').click({
          position: {
            x: 1200,
            y: 448
          }
        })

        // Wait to avoid a double click
        await page.waitForTimeout(300)

        // Upper Polygon
        await page.locator('.map').click({
          position: {
            x: 1250,
            y: 350
          }
        })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multiple-shapes-selected.png', {
          clip: screenshotClip
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('2 shapes selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=42.1875%2C-2.40647%2C42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647&polygon\[1\]=44.1875%2C0.40647%2C58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647&sf=1&sfs\[0\]=0&sfs\[1\]=1&lat=-8\.\d+&long=46\.\d+&zoom=3\.\d+/)
      })

      test('deselects shapes correctly @screenshot', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [
            {
              body: multipleShapesShapefileBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647' && parsedQuery?.polygon?.[1] === '44.1875,0.40647,58.25,-14.46517,58.25,0.40647,44.1875,0.40647'
            },
            {
              body: multipleShapesShapefileBody,
              headers: {
                ...commonHeaders,
                'cmr-hits': '2'
              },
              paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '44.1875,0.40647,58.25,-14.46517,58.25,0.40647,44.1875,0.40647' && parsedQuery?.polygon?.length === 1
            }
          ]
        })

        // Select both polygons first
        await page.locator('.map').click({
          position: {
            x: 1200,
            y: 448
          }
        })

        await page.waitForTimeout(300)

        await page.locator('.map').click({
          position: {
            x: 1250,
            y: 350
          }
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('2 shapes selected')

        // Test deselection by clicking on the lower polygon again
        await page.locator('.map').click({
          position: {
            x: 1200,
            y: 448
          }
        })

        await page.waitForTimeout(300)

        // Should show only 1 shape selected now
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // URL should only contain the upper polygon now
        await expect(page).toHaveURL(/search\?polygon\[0\]=44.1875%2C0.40647%2C58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647&sf=1&sfs\[0\]=1&lat=-?\d+\.\d+&long=4\d\.\d+/)
        expect(0 === 1)
        // Verify the map shows only the selected shape
        await expect(page).toHaveScreenshot('multiple-shapes-deselected.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When the shapefile has a polygon with too many points', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '-114.0506,37.000396,-114.041723,41.99372,-119.999168,41.99454,-120.001014,38.999574,-118.714312,38.102185,-117.500117,37.22038,-115.852908,35.96966,-114.633013,35.002085,-114.636893,35.028367,-114.602908,35.068588,-114.646759,35.101872,-114.629934,35.118272,-114.578524,35.12875,-114.569238,35.18348,-114.604314,35.353584,-114.677643,35.489742,-114.677205,35.513491,-114.656905,35.534391,-114.666184,35.577576,-114.653406,35.610789,-114.689407,35.651412,-114.680607,35.685488,-114.705409,35.708287,-114.695709,35.755986,-114.71211,35.806185,-114.697767,35.854844,-114.67742,35.874728,-114.731159,35.943916,-114.743756,35.985095,-114.729707,36.028166,-114.755618,36.087166,-114.631716,36.142306,-114.616694,36.130101,-114.572031,36.15161,-114.511721,36.150956,-114.502172,36.128796,-114.463637,36.139695,-114.446605,36.12597,-114.405475,36.147371,-114.372106,36.143114,-114.30843,36.082443,-114.315557,36.059494,-114.252651,36.020193,-114.148191,36.028013,-114.114531,36.095217,-114.123144,36.111576,-114.09987,36.121654,-114.068027,36.180663,-114.046838,36.194069,-114.0506,37.000396'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/5/)
        await uploadShapefile(page, 'too_many_points.geojson')
        await shapefilePromise

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=5/, { timeout: 3000 })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Displays a modal
        await expect(page.getByTestId('edsc-modal__title')).toHaveText('Shape file has too many points')

        // Closes the modal
        await page.getByLabel('Close').click()

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('too-many-points.png', {
          clip: screenshotClip
        })

        // Updates the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=-114.0506%2C37.000396%2C-114.041723%2C41.99372%2C-119.999168%2C41.99454%2C-120.001014%2C38.999574%2C-118.714312%2C38.102185%2C-117.500117%2C37.22038%2C-115.852908%2C35.96966%2C-114.633013%2C35.002085%2C-114.636893%2C35.028367%2C-114.602908%2C35.068588%2C-114.646759%2C35.101872%2C-114.629934%2C35.118272%2C-114.578524%2C35.12875%2C-114.569238%2C35.18348%2C-114.604314%2C35.353584%2C-114.677643%2C35.489742%2C-114.677205%2C35.513491%2C-114.656905%2C35.534391%2C-114.666184%2C35.577576%2C-114.653406%2C35.610789%2C-114.689407%2C35.651412%2C-114.680607%2C35.685488%2C-114.705409%2C35.708287%2C-114.695709%2C35.755986%2C-114.71211%2C35.806185%2C-114.697767%2C35.854844%2C-114.67742%2C35.874728%2C-114.731159%2C35.943916%2C-114.743756%2C35.985095%2C-114.729707%2C36.028166%2C-114.755618%2C36.087166%2C-114.631716%2C36.142306%2C-114.616694%2C36.130101%2C-114.572031%2C36.15161%2C-114.511721%2C36.150956%2C-114.502172%2C36.128796%2C-114.463637%2C36.139695%2C-114.446605%2C36.12597%2C-114.405475%2C36.147371%2C-114.372106%2C36.143114%2C-114.30843%2C36.082443%2C-114.315557%2C36.059494%2C-114.252651%2C36.020193%2C-114.148191%2C36.028013%2C-114.114531%2C36.095217%2C-114.123144%2C36.111576%2C-114.09987%2C36.121654%2C-114.068027%2C36.180663%2C-114.046838%2C36.194069%2C-114.0506%2C37.000396&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-116\.\d+&zoom=5\.\d+/)
      })
    })

    test.describe('When the shapefile has a polygon with altitude in the coordinates', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '29.6312666109084,11.02035732582157,30.18903160266947,10.23921782354143,31.22854077295004,11.10230637746821,30.71143962083393,11.73679325255558,29.6312666109084,11.02035732582157'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/7/)
        await uploadShapefile(page, 'polygon_with_altitude.geojson')
        await shapefilePromise

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=7/, { timeout: 3000 })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('polygon_with_altitude.png', {
          clip: screenshotClip
        })

        // Updates the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=29.6312666109084%2C11.02035732582157%2C30.18903160266947%2C10.23921782354143%2C31.22854077295004%2C11.10230637746821%2C30.71143962083393%2C11.73679325255558%2C29.6312666109084%2C11.02035732582157&sf=1&sfs\[0\]=0&lat=10\.\d+&long=30\.\d+&zoom=7\.\d+/)
      })
    })

    test.describe('When the shapefile has only arctic latitudes', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,82.40647,42.1875,76.46517,56.25,76.46517,42.1875,82.40647'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/5/)
        await uploadShapefile(page, 'arctic.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=3/, { timeout: 3000 })

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('arctic.png', {
          clip: screenshotClip
        })

        // Updates the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=42.1875%2C82.40647%2C42.1875%2C76.46517%2C56.25%2C76.46517%2C42.1875%2C82.40647&sf=1&sfs\[0\]=0&lat=79\.\d+&long=50\.\d+&projection=EPSG%3A3413&zoom=3\.\d+/)
      })
    })

    test.describe('When the shapefile has only antarctic latitudes', () => {
      test('renders correctly @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '42.1875,-82.40647,56.25,-76.46517,42.1875,-76.46517,42.1875,-82.40647'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/5/)
        await uploadShapefile(page, 'antarctic.geojson')
        await shapefilePromise

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
        await page.waitForURL(/zoom=3/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('antarctic.png', {
          clip: screenshotClip
        })

        // Updates the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=42.1875%2C-82.40647%2C56.25%2C-76.46517%2C42.1875%2C-76.46517%2C42.1875%2C-82.40647&sf=1&sfs\[0\]=0&lat=-78\.\d+&long=47\.\d+&projection=EPSG%3A3031&zoom=3\.\d+/)
      })
    })

    test.describe('When the shapefile has a MultiPolygon shape', () => {
      test('renders correctly and filters collections @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.polygon?.[0] === '-109.6,38.81,-109.6,38.83,-109.62,38.83,-109.62,38.81,-109.6,38.81' && parsedQuery?.polygon?.[1] === '-109.55,38.75,-109.55,38.77,-109.57,38.77,-109.57,38.75,-109.55,38.75'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/11/)
        await uploadShapefile(page, 'multipolygon.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the successful paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=12/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multipolygon.png', {
          clip: screenshotClip
        })

        // Updates the URL - expect both polygons in the URL
        await expect(page).toHaveURL(/search\?polygon\[0\]=-109.6%2C38.81%2C-109.6%2C38.83%2C-109.62%2C38.83%2C-109.62%2C38.81%2C-109.6%2C38.81&polygon\[1\]=-109.55%2C38.75%2C-109.55%2C38.77%2C-109.57%2C38.77%2C-109.57%2C38.75%2C-109.55%2C38.75&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+&zoom=12\.\d+/)
      })
    })

    test.describe('When the shapefile has a MultiPoint shape', () => {
      test('renders correctly and filters collections @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0] === '-109.6,38.81' && parsedQuery?.point?.[1] === '-109.55,38.75' && parsedQuery?.point?.[2] === '-109.5,38.7'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/11/)
        await uploadShapefile(page, 'multipoint.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the successful paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing - flexible zoom
        await page.waitForURL(/zoom=11/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multipoint.png', {
          clip: screenshotClip,
          maxDiffPixelRatio: 0.005
        })

        // Updates the URL and expect all points in the URL
        await expect(page).toHaveURL(/search\?sp\[0\]=-109.6%2C38.81&sp\[1\]=-109.55%2C38.75&sp\[2\]=-109.5%2C38.7&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+/)
      })

      test('renders selected multipoint correctly @screenshot', async ({ page }) => {
        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        await uploadShapefile(page, 'multipoint.geojson')

        // Populates the spatial display field
        await expect(page.getByTestId('filter-stack__spatial').locator('.filter-stack-item__secondary-title')).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        await expect(page).toHaveScreenshot('multipoint-auto-selected.png', {
          clip: screenshotClip,
          maxDiffPixelRatio: 0.005
        })

        // URL should contain spatial parameters for the selected multipoint
        await expect(page).toHaveURL(/search\?sp\[0\]=-109.6%2C38.81&sp\[1\]=-109.55%2C38.75&sp\[2\]=-109.5%2C38.7&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+/)
      })
    })

    test.describe('When the shapefile has a MultiLineString shape', () => {
      test('renders correctly and filters collections @screenshot', async ({ page }) => {
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
            paramCheck: (parsedQuery) => parsedQuery?.line?.[0] === '-109.6,38.81,-109.62,38.83,-109.64,38.85' && parsedQuery?.line?.[1] === '-109.55,38.75,-109.57,38.77,-109.59,38.79'
          }]
        })

        await page.route(/shapefiles$/, async (route) => {
          await route.fulfill({
            json: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          })
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

        // Upload the shapefile
        const shapefilePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/11/)
        await uploadShapefile(page, 'multilinestring.geojson')
        await shapefilePromise

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the successful paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=11/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multilinestring.png', {
          clip: screenshotClip
        })

        // Updates the URL and expect both lines in the URL
        await expect(page).toHaveURL(/search\?line\[0\]=-109.6%2C38.81%2C-109.62%2C38.83%2C-109.64%2C38.85&line\[1\]=-109.55%2C38.75%2C-109.57%2C38.77%2C-109.59%2C38.79&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+&zoom=11\.\d+/)
      })
    })
  })
})
