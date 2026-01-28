import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'

import commonHeaders from './__mocks__/common_collections.headers.json'
import nlpCollections from './__mocks__/nlp/nlp_collections.body.json'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

test.describe('Map: NLP spatial rendering', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })

    // Intercept NLP search endpoint
    await page.route(/nlp\/query\.json/, async (route) => {
      const request = route.request()

      // Match the request body to ensure it's the expected NLP query
      const requestBody = request.postData()

      expect(requestBody).toEqual('embedding=false&q=rainfall in DC&search_params[include_facets]=v2&search_params[include_granule_counts]=true&search_params[include_has_granules]=true&search_params[include_tags]=edsc.*,opensearch.granule.osdd&search_params[options][temporal][limit_to_granules]=true&search_params[page_size]=20&search_params[sort_key][]=has_granules_or_cwic&search_params[sort_key][]=-score&search_params[sort_key][]=-create-data-date&search_params[has_granules_or_cwic]=true&search_params[page_num]=1')

      await route.fulfill({
        json: nlpCollections,
        headers: {
          ...commonHeaders,
          'cmr-hits': '17'
        }
      })
    })

    await page.route(/shapefiles$/, async (route) => {
      await route.fulfill({
        json: { shapefile_id: '1' },
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    })

    await page.goto('/')
  })

  test('draws NLP geometry and moves the map @screenshot', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Wildfires in California' }).fill('rainfall in DC')

    const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/10/)

    await page.getByRole('button', {
      name: 'Search',
      exact: true
    }).click()

    // Wait for the map to load after navigation
    await initialMapPromise

    // Displays a modal
    await expect(page.getByTestId('edsc-modal__title')).toHaveText('Shape file has too many points')

    // Closes the modal
    await page.getByLabel('Close').click()

    // NLP label is shown in the Spatial section
    await expect(page.getByTestId('spatial-display_shapefile-name')).toContainText('"DC"')

    // Check collection results count
    await expect(page.getByText('Showing 17 of 17 matching collections')).toBeVisible()

    await expect(page).toHaveURL(/search\?q=rainfall&sf=1&sfs\[0\]=0&lat=38\.\d+&long=-77\.\d+&zoom=10\.\d+/)

    // Allow time for MOVEMAP and render
    await page.waitForTimeout(250)

    await expect(page).toHaveScreenshot('nlp-spatial-drawn.png', {
      clip: screenshotClip
    })
  })
})
