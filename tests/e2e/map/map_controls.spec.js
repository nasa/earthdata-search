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

// When testing map values we don't need to test the exact values coming from the map. The inconsistencies
// with testing locally and in GitHub Actions make the tests unusable. By testing that the right type of spatial
// value is present in the URL and SpatialDisplay, with rounded numbers, we are verifying that we are getting the
// values we expect from the map and we are putting them into the store. The Jest tests verify that exact values
// from the store are being displayed correctly.

test.describe('Map: Control interactions', () => {
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

  test.describe('When moving the map', () => {
    test.describe('When dragging the map', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/')

        // Wait for the map to load
        await initialMapPromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/')

        await initialMapPromise

        // Zoom the map
        await page.getByRole('button', { name: 'Zoom In' }).click()

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/')

        // Wait for the map to load
        await initialMapPromise

        const projectionChangePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
        // Change the projection
        await page.getByLabel('North Polar Stereographic').click()

        await expect(page).toHaveURL('search?lat=90&projection=EPSG%3A3413&zoom=2')
        await projectionChangePromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)

        await page.goto('/search?lat=90&projection=EPSG%3A3413&zoom=2')

        // Wait for the map to load
        await initialMapPromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)

        await page.goto('/search?projection=EPSG%3A3413&zoom=2')

        // Wait for the map to load
        await initialMapPromise

        // Change the projection
        const projectionChangePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.getByLabel('Geographic (Equirectangular)').click()
        await projectionChangePromise

        // Removes the map parameter when it is centered
        await expect(page).toHaveURL('search')

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/search')

        // Wait for the map to load
        await initialMapPromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/')

        // Wait for the map to load
        await initialMapPromise

        // Change the projection
        const projectionChangePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
        await page.getByLabel('South Polar Stereographic').click()
        await projectionChangePromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)

        await page.goto('/search?lat=-90&projection=EPSG%3A3031&zoom=2')

        // Wait for the map to load
        await initialMapPromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/')

        // Wait for the map to load
        await initialMapPromise

        // Change the projection to North Polar
        await page.getByLabel('North Polar Stereographic').click()

        await expect(page).toHaveURL('search?lat=90&projection=EPSG%3A3413&zoom=2')

        // Change the projection to South Polar
        const projectionChangePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
        await page.getByLabel('South Polar Stereographic').click()
        await projectionChangePromise

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

      const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

      await page.goto('/')

      // Wait for the map to load
      await initialMapPromise

      // Change the projection
      const projectionChangePromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)
      await page.getByLabel('North Polar Stereographic').click()
      await projectionChangePromise

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

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)

        await page.goto('/search?lat=90&long=-45&projection=EPSG%3A3413&rotation=32.4&zoom=2')

        // Wait for the map to load
        await initialMapPromise

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

        const trueColorPromise = page.waitForResponse(/CorrectedReflectance_TrueColor/)

        await page.goto('/search?base=trueColor')

        await trueColorPromise

        // Zoom in to force new tiles to load
        await page.getByRole('button', { name: 'Zoom In' }).click()

        // Look for the layer switcher button by its aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.layer-switcher-control__panel--visible')

        // Set up the response promise BEFORE interacting with the UI
        const worldImageryPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/3/)

        // Click the World Imagery radio button by its label
        await page.getByLabel('World Imagery').click()

        // Now wait for the response promise we set up earlier
        await worldImageryPromise

        // Verify URL change
        await expect(page).toHaveURL('search?zoom=4')
      })
    })

    test.describe('When changing the base layer to Corrected Reflectance (True Color)', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        const worldImageryPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/')

        await worldImageryPromise

        // Set up the response promise BEFORE interacting with the UI
        const trueColorPromise = page.waitForResponse(/CorrectedReflectance_TrueColor/)

        // Look for the layer switcher button by its aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.layer-switcher-control__panel--visible')

        // Click the Corrected Reflectance radio button by its label
        await page.getByLabel('Corrected Reflectance (True Color)').click()

        // Now wait for the response promise we set up earlier
        await trueColorPromise

        // Verify URL change
        await expect(page).toHaveURL('search?base=trueColor')
      })
    })

    test.describe('When changing the base layer to Land/Water Map', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        const worldImageryPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        await page.goto('/search?overlays=coastlines')

        await worldImageryPromise

        // Look for the layer switcher button by its aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.layer-switcher-control__panel--visible')

        // Land water uses the same vector files as worldImagery but, we apply a style
        const responsePromise = page.waitForResponse(/World_Basemap_GCS_v2/)

        // Click the Land/Water Map radio button by its label
        await page.getByLabel('Land / Water Map *').click()

        // Now wait for the response promise we set up earlier
        await responsePromise

        // Verify URL change
        await expect(page).toHaveURL('/search?base=landWaterMap&overlays=coastlines')
      })
    })

    test.describe('When changing the Place Labels overlay layer', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        const worldImageryPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        await worldImageryPromise

        // Look for the layer switcher button by its aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.layer-switcher-control__panel--visible')

        // Wait for the correct layer to load
        const responsePromise = page.waitForResponse(/World_Basemap_GCS_v2/)

        // Click the checkbox for Place Labels by its label
        await page.getByLabel('Place Labels *').click()

        // Wait for the correct layer to load
        await responsePromise

        // Verify URL is updated with the correct overlay parameter
        await expect(page).toHaveURL('search?overlays=placeLabels')
      })
    })

    test.describe('When changing the Borders and Roads overlay layer', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        const worldImageryPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        await worldImageryPromise

        // Look for the layer switcher button by its aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.layer-switcher-control__panel--visible')

        // Wait for the correct layer to load
        const responsePromise = page.waitForResponse(/Reference_Features_15m/)

        // Click the checkbox for Borders and Roads by its label
        await page.getByLabel('Borders and Roads *').click()

        // Wait for the correct layer to load
        await responsePromise

        // Verify URL is updated with the correct overlay parameter
        await expect(page).toHaveURL('search?overlays=bordersRoads')
      })
    })

    test.describe('When changing the Coastlines overlay layer', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        const worldImageryPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        await worldImageryPromise

        // Look for the layer switcher button by its aria-label
        await page.locator('button[aria-label="Layer Options"]').hover({ force: true })

        // Wait for the panel to become visible
        await page.waitForSelector('.layer-switcher-control__panel--visible')

        // Wait for the correct layer to load
        const responsePromise = page.waitForResponse(/Coastlines_15m/)

        // Click the checkbox for Coastlines by its label
        await page.getByLabel('Coastlines *').click()

        // Wait for the correct layer to load
        await responsePromise

        // Verify URL is updated with the correct overlay parameter
        await expect(page).toHaveURL('search?overlays=coastlines')
      })
    })
  })
})
