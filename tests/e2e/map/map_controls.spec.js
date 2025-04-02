import { test, expect } from 'playwright-test-coverage'

import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { setupTests } from '../../support/setupTests'

import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'

const screenshotClip = {
  x: 950,
  y: 200,
  width: 400,
  height: 400
}

// When testing map values we don't need to test the exact values coming from leaflet. The inconsistencies
// with testing locally and in GitHub Actions make the tests unusable. By testing that the right type of spatial
// value is present in the URL and SpatialDisplay, with rounded numbers, we are verifying that we are getting the
// values we expect from leaflet and we are putting them into the store. The Jest tests verify that exact values
// from the store are being displayed correctly.

test.describe('Map: Control interactions', () => {
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

  test.describe('When moving the map', () => {
    test.describe('When dragging the map', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        // Drag the map
        await page.mouse.move(1000, 500)
        await page.mouse.down()
        await page.mouse.move(1000, 575, { steps: 5 })

        // Wait before releasing the mouse to stop the map from continuing to move
        await page.waitForTimeout(500)
        await page.mouse.up()

        await expect(page).toHaveURL(/lat=10.5\d+/)
      })
    })

    test.describe('When zooming the map with the zoom buttons', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Zoom the map
        await page.locator('.edsc-map-zoom-in').click()

        await expect(page).toHaveURL('search?zoom=4')
      })
    })
  })

  test.describe('When switching projections', () => {
    test.describe('When switching to the North Polar Stereographic projection', () => {
      test('updates the URL with the new map parameter and updates the map', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection
        await page.getByLabel('North Polar Stereographic').click()

        await expect(page).toHaveURL('search?lat=90&projection=EPSG%3A3413&zoom=2')

        await expect(page).toHaveScreenshot('north_polar_stereographic.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When loading the map with the North Polar Stereographic projection url parameter', () => {
      test('displays the map with the correct projection', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await expect(page).toHaveScreenshot('north_polar_stereographic.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When switching to the Geographic projection', () => {
      test('updates the URL with the new map parameter and updates the map', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection
        await page.getByLabel('North Polar Stereographic').click()
        // Switch back to Geographic
        await page.getByLabel('Geographic (Equirectangular)').click()

        // Removes the map parameter when it is centered
        await expect(page).toHaveURL('search')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await expect(page).toHaveScreenshot('geographic.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When loading the page with the Geographic projection url parameter', () => {
      test('displays the map with the correct projection', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/search')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await expect(page).toHaveScreenshot('geographic.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When switching to the South Polar Stereographic projection', () => {
      test('updates the URL with the new map parameter and updates the map', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection
        await page.getByLabel('South Polar Stereographic').click()

        await expect(page).toHaveURL('search?lat=-90&projection=EPSG%3A3031&zoom=2')

        await expect(page).toHaveScreenshot('south_polar_stereographic.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When loading the map with the South Polar Stereographic projection url parameter', () => {
      test('displays the map with the correct projection', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/search?lat=-90&projection=EPSG%3A3031&zoom=2')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await expect(page).toHaveScreenshot('south_polar_stereographic.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When switching from the North Polar Stereographic projection to the South Polar Stereographic projection', () => {
      test('updates the URL with the new map parameter and updates the map', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection to North Polar
        await page.getByLabel('North Polar Stereographic').click()

        await expect(page).toHaveURL('search?lat=90&projection=EPSG%3A3413&zoom=2')

        // Change the projection to South Polar
        await page.getByLabel('South Polar Stereographic').click()

        await expect(page).toHaveURL('search?lat=-90&projection=EPSG%3A3031&zoom=2')

        await expect(page).toHaveScreenshot('south_polar_stereographic.png', {
          clip: screenshotClip
        })
      })
    })
  })

  test.describe('When rotating the map', () => {
    test('updates the URL with the new map parameter and updates the map', async ({ page }) => {
      await interceptUnauthenticatedCollections({
        page,
        body: commonBody,
        headers: commonHeaders
      })

      await page.goto('/')

      // Change the projection
      await page.getByLabel('North Polar Stereographic').click()

      // Rotate the map
      await page.keyboard.down('Alt')
      await page.mouse.move(1000, 500)
      await page.mouse.down()
      await page.mouse.move(1000, 900, { steps: 5 })
      await page.mouse.up()
      await page.keyboard.up('Alt')

      await expect(page).toHaveURL(/rotation=32.\d+/)

      await expect(page).toHaveScreenshot('rotation.png', {
        clip: screenshotClip
      })
    })

    test.describe('When loading the map with a rotation url parameter', () => {
      test('displays the map with the correct rotation', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/search?lat=90&long=-45&projection=EPSG%3A3413&rotation=32.4&zoom=2')

        // Wait for the map to load
        await page.waitForSelector('.edsc-map-base-layer')

        await expect(page).toHaveScreenshot('rotation.png', {
          clip: screenshotClip,
          maxDiffPixelRatio: 0.1
        })
      })
    })
  })

  test.describe('When changing the map layers', () => {
    test.describe('When changing the base layer to World Imagery', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/search?base=trueColor')

        // Set up the response promise BEFORE interacting with the UI
        const responsePromise = page.waitForResponse((response) => response.url().includes('wi.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer'))

        // Look for the layer switcher button by its class and aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.edsc-map-layer-switcher__panel--visible')

        // Click the Land/Water Map radio button
        await page.locator('input#layer-worldImagery').click()
        await page.waitForTimeout(500)

        // Verify URL change
        await expect(page).toHaveURL('search')

        // Now wait for the response promise we set up earlier
        await responsePromise
      })
    })

    test.describe('When changing the base layer to Corrected Reflectance (True Color)', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Set up the response promise BEFORE interacting with the UI
        const responsePromise = page.waitForResponse((response) => response.url().includes('CorrectedReflectance_TrueColor'))

        // Look for the layer switcher button by its class and aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.edsc-map-layer-switcher__panel--visible')

        // Click the Land/Water Map radio button
        await page.locator('input#layer-correctedReflectance').click()
        await page.waitForTimeout(500)

        // Verify URL change
        await expect(page).toHaveURL('search?base=trueColor')

        // Now wait for the response promise we set up earlier
        await responsePromise
      })
    })

    test.describe('When changing the base layer to Land/Water Map', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        page.on('request', (request) => console.log('Request:', request.url()))
        page.on('response', (response) => console.log('Response:', response.url(), response.status()))

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Set up the response promise BEFORE interacting with the UI
        const responsePromise = page.waitForResponse((response) => response.url().includes('server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation'))

        // Look for the layer switcher button by its class and aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.edsc-map-layer-switcher__panel--visible')

        // Click the Land/Water Map radio button
        await page.locator('input#layer-landWaterMap').click()
        await page.waitForTimeout(500)

        // Verify URL change
        await expect(page).toHaveURL('search?base=landWaterMap')

        // Now wait for the response promise we set up earlier
        await responsePromise
      })
    })

    test.describe('When changing the Place Labels overlay layer', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        // Look for the layer switcher button by its class and aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.edsc-map-layer-switcher__panel--visible')

        // Click the checkbox for Place Labels
        await page.locator('input#layer-placeLabels').click()
        await page.waitForTimeout(500)

        // Verify URL is updated with the correct overlay parameter
        await expect(page).toHaveURL('search?overlays=referenceLabels')
      })
    })

    test.describe('When changing the Borders and Roads overlay layer', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        // Look for the layer switcher button by its class and aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.edsc-map-layer-switcher__panel--visible')

        // Click the checkbox for Borders and Roads
        await page.locator('input#layer-bordersRoads').click()
        await page.waitForTimeout(500)

        // Verify URL is updated with the correct overlay parameter
        await expect(page).toHaveURL('search?overlays=referenceFeatures')
      })
    })

    test.describe('When changing the Coastlines overlay layer', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        // Look for the layer switcher button by its class and aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.edsc-map-layer-switcher__panel--visible')

        // Click the checkbox for Coastlines
        await page.locator('input#layer-coastlines').click()
        await page.waitForTimeout(500)

        // Verify URL is updated with the correct overlay parameter
        await expect(page).toHaveURL('search?overlays=coastlines')
      })
    })
  })
})
