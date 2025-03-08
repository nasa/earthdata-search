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

  test.describe.skip('When changing the map layers', () => {
    test.describe('When changing the base layer to Blue Marble', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the base layer
        await page.getByRole('button', {
          name: 'Layers',
          exact: true
        }).hover({ force: true })

        await page.getByRole('radio', { name: 'Corrected Reflectance (True Color)' }).click()
        await page.getByRole('radio', { name: 'Blue Marble' }).click()

        await expect(page).toHaveURL('search')

        await expect(
          page
            .locator('.leaflet-tile-pane')
            .locator('.leaflet-layer')
            .last()
            .locator('img.leaflet-tile')
            .first()
        ).toHaveAttribute('src', /BlueMarble_ShadedRelief_Bathymetry/)
      })
    })

    test.describe('When changing the base layer to Corrected Reflectance', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the base layer
        await page.getByRole('button', {
          name: 'Layers',
          exact: true
        }).hover({ force: true })

        await page.getByRole('radio', { name: 'Corrected Reflectance (True Color)' }).click()

        await expect(page).toHaveURL('search?base=trueColor')

        await expect(
          page
            .locator('.leaflet-tile-pane')
            .locator('.leaflet-layer')
            .last()
            .locator('img.leaflet-tile')
            .first()
        ).toHaveAttribute('src', /VIIRS_SNPP_CorrectedReflectance_TrueColor/)
      })
    })

    test.describe('When changing the base layer to Land / Water Map', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the base layer
        await page.getByRole('button', {
          name: 'Layers',
          exact: true
        }).hover({ force: true })

        await page.getByRole('radio', { name: 'Land / Water Map' }).click()

        await expect(page).toHaveURL('search?base=landWaterMap')

        await expect(
          page
            .locator('.leaflet-tile-pane')
            .locator('.leaflet-layer')
            .last()
            .locator('img.leaflet-tile')
            .first()
        ).toHaveAttribute('src', /OSM_Land_Water_Map/)
      })
    })

    test.describe('When changing the Borders and Roads overlay layer', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        // Add the overlay layer
        await page.getByRole('button', {
          name: 'Layers',
          exact: true
        }).hover({ force: true })

        await page.getByRole('checkbox', { name: 'Borders and Roads' }).click()

        await expect(page).toHaveURL('search?overlays=referenceFeatures')

        await expect(
          page
            .locator('.leaflet-tile-pane')
            .locator('.leaflet-layer')
            .last()
            .locator('img.leaflet-tile')
            .first()
        ).toHaveAttribute('src', /Reference_Features/)
      })
    })

    test.describe('When changing the Coastlines overlay layer', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        // Add the overlay layer
        await page.getByRole('button', {
          name: 'Layers',
          exact: true
        }).hover({ force: true })

        await page.getByRole('checkbox', { name: 'Coastlines' }).click()

        await expect(page).toHaveURL('search?overlays=coastlines')

        await expect(
          page
            .locator('.leaflet-tile-pane')
            .locator('.leaflet-layer')
            .last()
            .locator('img.leaflet-tile')
            .first()
        ).toHaveAttribute('src', /Coastlines/)
      })
    })

    test.describe.skip('When changing the Place Labels overlay layer', () => {
      test('updates the URL with the new map  parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        // Visit with no overlays loaded
        await page.goto('/search?overlays=false')

        // Add the overlay layer
        await page.getByRole('button', {
          name: 'Layers',
          exact: true
        }).hover({ force: true })

        await page.getByRole('checkbox', { name: 'Place Labels' }).click()

        await expect(page).toHaveURL('search?overlays=referenceLabels')

        await expect(
          page
            .locator('.leaflet-tile-pane')
            .locator('.leaflet-layer')
            .last()
            .locator('img.leaflet-tile')
            .first()
        ).toHaveAttribute('src', /Reference_Labels/)
      })
    })
  })
})
