import { test, expect } from 'playwright-test-coverage'

import { commafy } from '../../../../static/src/js/util/commafy'
import { pluralize } from '../../../../static/src/js/util/pluralize'

import { setupTests } from '../../../support/setupTests'

import awsCloudBody from './__mocks__/aws_cloud.body.json'
import commonBody from './__mocks__/common.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import customizableBody from './__mocks__/customizable.body.json'
import dataFormatBody from './__mocks__/data_format.body.json'
import eeBody from './__mocks__/ee.body.json'
import horizontalDataResolutionBody from './__mocks__/horizontal_data_resolution.body.json'
import instrumentsBody from './__mocks__/instruments.body.json'
import keywordBody from './__mocks__/keyword.body.json'
import keywordsBody from './__mocks__/keywords.body.json'
import latencyBody from './__mocks__/latency.body.json'
import mapImageryBody from './__mocks__/map_imagery.body.json'
import noGranulesBody from './__mocks__/no_granules.body.json'
import nonEosdisBody from './__mocks__/non_eosdis.body.json'
import organizationsBody from './__mocks__/organizations.body.json'
import platformsBody from './__mocks__/platforms.body.json'
import processingLevelsBody from './__mocks__/processing_levels.body.json'
import projectsBody from './__mocks__/projects.body.json'
import spatialBoundingBoxBody from './__mocks__/spatial_bounding_box.body.json'
import spatialCircleBody from './__mocks__/spatial_circle.body.json'
import spatialPointBody from './__mocks__/spatial_point.body.json'
import spatialPolygonBody from './__mocks__/spatial_polygon.body.json'
import temporalBody from './__mocks__/temporal.body.json'
import temporalRecurringBody from './__mocks__/temporal_recurring.body.json'
import tilingSystemBody from './__mocks__/tiling_system.body.json'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

const defaultCmrPageSize = 20

const keywordInputPlaceholderText = /type to search for data/i

/**
 * Test that the provided facet group is expanded and the others not
 * @param {String} facetGroup Name of the facet that should be expanded
 */
const testFacetGroupExistence = async (page, facetGroup) => {
  await expect(page.getByTestId(`facet-${facetGroup}`)).toBeVisible()

  const facetGroups = [
    'features',
    'keywords',
    'platforms',
    'instruments',
    'organizations',
    'projects',
    'processing-levels',
    'data-format',
    'tiling-system',
    'horizontal-data-resolution'
  ]

  await Promise.all(
    facetGroups
      .filter((group) => group !== facetGroup)
      .map((group) => expect(page.getByTestId(`facet-${group}`)).not.toBeVisible())
  )
}

/**
 * Test that the provided facet group is displaying the correct number of selected elements
 * @param {String} facetGroup Name of the facet that should have selected elements
 * @param {Number} selectedCount How many elements are selected within the facet group
 */
const testFacetGroupSelectedCount = async (page, facetGroup, selectedCount) => {
  await expect(page.getByTestId(`facet_group-${facetGroup}`).locator('.facets-group__selected-count')).toHaveText(`${selectedCount} Selected`)
}

/**
 * Tests the search panel header and meta text for results size
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testResultsSize = async (page, cmrHits) => {
  const expectedSize = Math.min(defaultCmrPageSize, cmrHits)

  await expect(page.getByTestId('panel-group_collection-results').getByTestId('panel-group-header__heading-meta-text')).toHaveText(`Showing ${expectedSize} of ${commafy(cmrHits)} matching ${pluralize('collection', cmrHits)}`)
  await expect(page.getByTestId('panel-group_collection-results').getByTestId('panel-group-header__heading-primary')).toHaveText(`${commafy(cmrHits)} Matching ${pluralize('Collection', cmrHits)}`)
}

test.describe('Path /search', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })
  })

  test.describe('When the path is loaded without any url params', () => {
    test('loads correctly', async ({ page }) => {
      const cmrHits = 8098

      await page.route('**/search/collections.json', (route, request) => {
        if (request.method() === 'POST') {
          const body = request.postData()
          expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

          route.fulfill({
            body: JSON.stringify(commonBody),
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits
            }
          })
        }
      })

      await page.goto('/search')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Keyword input is empty
      await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

      // Ensure facet group bodies are shown correctly
      await testFacetGroupExistence(page, 'features')
    })
  })

  test.describe('When the path is loaded with a keyword query', () => {
    test('loads with the keyword query populated', async ({ page }) => {
      const cmrHits = 1248

      await page.route('**/search/collections.json', (route, request) => {
        if (request.method() === 'POST') {
          const body = request.postData()
          expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&keyword=modis*&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

          route.fulfill({
            body: JSON.stringify(keywordBody),
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits
            }
          })
        }
      })

      await page.goto('/search?q=modis')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Keyword input is populated
      await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('modis')

      // Ensure facet group bodies are shown correctly
      await testFacetGroupExistence(page, 'features')
    })
  })

  test.describe('When the path is loaded with a temporal query', () => {
    test.describe('When the temporal range is not recurring', () => {
      test('loads with the temporal query applied', async ({ page }) => {
        const cmrHits = 2434

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&temporal=2020-01-01T00:00:00.000Z,2021-01-01T23:59:59.999Z&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(temporalBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?qt=2020-01-01T00%3A00%3A00.000Z%2C2021-01-01T23%3A59%3A59.999Z')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        const temporalInputs = page.locator('.filter-stack-contents__body')
        await expect(temporalInputs.first()).toHaveText('2020-01-01 00:00:00')
        await expect(temporalInputs.last()).toHaveText('2021-01-01 23:59:59')
      })
    })

    test.describe('When the temporal range is recurring', () => {
      test('loads with the temporal query applied', async ({ page }) => {
        const cmrHits = 5521

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&temporal=2000-01-01T00:00:00.000Z,2021-01-31T23:59:59.999Z,1,31&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(temporalRecurringBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?qt=2000-01-01T00%3A00%3A00.000Z%2C2021-01-31T23%3A59%3A59.999Z%2C1%2C31')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        const temporalInputs = page.locator('.filter-stack-contents__body')
        await expect(temporalInputs.first()).toHaveText('01-01 00:00:00')
        await expect(temporalInputs.nth(1)).toHaveText('01-31 23:59:59')
        await expect(temporalInputs.last()).toHaveText('2000 - 2021')
      })
    })
  })

  test.describe('When the path is loaded with a spatial query', () => {
    test.describe('When the spatial query is a point', () => {
      test('loads with the spatial query applied @screenshot', async ({ page }) => {
        const cmrHits = 5079

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=65.44171,4.33676&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(spatialPointBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search?sp[0]=65.44171%2C4.33676&long=65.44171')

        // Wait for the map to load
        await initialMapPromise

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        await expect(page.getByTestId('spatial-display_point')).toHaveValue('4.33676,65.44171')

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('point.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When the spatial query is a polygon', () => {
      test('loads with the spatial query applied @screenshot', async ({ page }) => {
        const cmrHits = 5133

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=64.87748,1.3704,59.34354,-9.21839,78.35163,-11.89902,64.87748,1.3704&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(spatialPolygonBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search?polygon[0]=64.87748%2C1.3704%2C59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704&long=66')

        // Wait for the map to load
        await initialMapPromise

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('polygon.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When the spatial query is a circle', () => {
      test('loads with the spatial query applied @screenshot', async ({ page }) => {
        const cmrHits = 5080

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&circle[]=62.18209,2.22154,100000&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(spatialCircleBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search?circle[0]=62.18209%2C2.22154%2C100000&long=62')

        // Wait for the map to load
        await initialMapPromise

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue('2.22154,62.18209')
        await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue('100000')

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('circle.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When the spatial query is a bounding box', () => {
      test('loads with the spatial query applied @screenshot', async ({ page }) => {
        const cmrHits = 5209

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&bounding_box[]=5.02679,0.99949,32.8678,26.17555&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(spatialBoundingBoxBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search?sb[0]=5.02679%2C0.99949%2C32.8678%2C26.17555&long=19')

        // Wait for the map to load
        await initialMapPromise

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue('0.99949,5.02679')
        await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue('26.17555,32.8678')

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('box.png', {
          clip: screenshotClip
        })
      })
    })

    test.describe('When the spatial query is a shapefile', () => {
      test('loads with the spatial query applied @screenshot', async ({ page }) => {
        const cmrHits = 5133

        // Retrieve the shapefile from lambda
        await page.route('**/shapefiles/123', (route) => {
          route.fulfill({
            body: JSON.stringify({
              file: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  id: 'simple-id',
                  properties: {
                    id: 'simple-id',
                    prop0: 'value0',
                    prop1: { this: 'that' }
                  },
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [64.87748, 1.3704],
                        [59.34354, -9.21839],
                        [78.35163, -11.89902],
                        [64.87748, 1.3704]
                      ]
                    ]
                  }
                }]
              },
              shapefileName: 'test.geojson'
            })
          })
        })

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            // TODO: This intercept is called twice, the first time is cancelled because a new request is launched after the shapefile polygon is added. How do we only run this expect on the second run?
            // const body = request.postData()
            // expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=59.34354,-9.21839,78.35163,-11.89902,64.87748,1.3704,59.34354,-9.21839&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(spatialPolygonBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        const initialMapPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/2/)
        await page.goto('/search?polygon[0]=64.87748%2C1.3704%2C59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704&sf=123&sfs[0]=0&long=60')

        // Wait for the map to load
        await initialMapPromise

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // URL has the polygon added from the shapefile
        await expect(page).toHaveURL('search?polygon[0]=64.87748%2C1.3704%2C59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704&sf=123&sfs[0]=0&long=60')

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('shapefile.png', {
          clip: screenshotClip
        })
      })
    })
  })

  test.describe('Feature Facets Group', () => {
    test.describe('When the path is loaded with the `Available in Earthdata Cloud` feature facet param', () => {
      test('loads with the feature facet applied', async ({ page }) => {
        const cmrHits = 720

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('cloud_hosted=true&has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(awsCloudBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?ff=Available%20in%20Earthdata%20Cloud')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')
      })
    })

    test.describe('When the path is loaded with the `Customizable` feature facet param', () => {
      test('loads with the feature facet applied', async ({ page }) => {
        const cmrHits = 233

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&service_type[]=esi&service_type[]=opendap&service_type[]=harmony&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            route.fulfill({
              body: JSON.stringify(customizableBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?ff=Customizable')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')
      })
    })

    test.describe('When the path is loaded with the `Map Imagery` feature facet param', () => {
      test('loads with the feature facet applied', async ({ page }) => {
        const cmrHits = 394

        await page.route('**/search/collections.json', (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date&tag_key[]=edsc.extra.serverless.gibs')

            route.fulfill({
              body: JSON.stringify(mapImageryBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?ff=Map%20Imagery')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')
      })
    })
  })

  test.describe('Keywords Facets Group', () => {
    test.describe('When the path is loaded with the `Aerosols` keywords param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 1

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&science_keywords_h[0][topic]=Aerosols&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(keywordsBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?fst0=Aerosols')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'keywords', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-keywords').click()
        await expect(page.locator('label[title="Aerosols"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Platforms Facets Group', () => {
    test.describe('When the path is loaded with the `AIRCRAFT` platforms param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 108

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&platforms_h[0][basis]=Aircraft&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(platformsBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?fpb0=Aircraft')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'platforms', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-platforms').click()
        await expect(page.locator('label[title="AIRCRAFT"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Instruments Facets Group', () => {
    test.describe('When the path is loaded with the `AIRS` instruments param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 104

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(instrumentsBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?ffi=AIRS')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'instruments', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-instruments').click()
        await expect(page.locator('label[title="AIRS"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Organizations Facets Group', () => {
    test.describe('When the path is loaded with the `Alaska Satellite Facility` organizations param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 128

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&data_center_h[]=Alaska Satellite Facility&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(organizationsBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?fdc=Alaska%20Satellite%20Facility')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'organizations', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-organizations').click()
        await expect(page.locator('label[title="Alaska Satellite Facility"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Projects Facets Group', () => {
    test.describe('When the path is loaded with the `ABoVE` projects param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 175

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&project_h[]=ABoVE&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(projectsBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?fpj=ABoVE')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'projects', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-projects').click()
        await expect(page.locator('label[title="ABoVE"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Processing Levels Facets Group', () => {
    test.describe('When the path is loaded with the `0 - Raw Data` processing levels param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 50

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&processing_level_id_h[]=0 - Raw Data&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(processingLevelsBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?fl=0%20-%20Raw%20Data')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'processing-levels', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-processing-levels').click()
        await expect(page.locator('label[title="0 - Raw Data"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Data Format Facets Group', () => {
    test.describe('When the path is loaded with the `ArcGIS` data format param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 5

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&granule_data_format_h[]=ArcGIS&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(dataFormatBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?gdf=ArcGIS')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'data-format', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-data-format').click()
        await expect(page.locator('label[title="ArcGIS"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Tiling System Facets Group', () => {
    test.describe('When the path is loaded with the `CALIPSO` tiling system param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 69

        await page.route('**/search/collections.json', async (route, request) => {
          if (request.method() === 'POST') {
            const body = request.postData()
            expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date&two_d_coordinate_system_name[]=CALIPSO')

            // Delay the response to be more realistic to CMR
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            route.fulfill({
              body: JSON.stringify(tilingSystemBody),
              headers: {
                ...commonHeaders,
                'cmr-hits': cmrHits.toString()
              }
            })
          }
        })

        await page.goto('/search?s2n=CALIPSO')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'tiling-system', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-tiling-system').click()
        await expect(page.locator('label[title="CALIPSO"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Horizontal Data Resolution Facets Group', () => {
    test.describe('When the path is loaded with the `0 - 1 meter` horizontal data resolution param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 41

        await page.route('**/search/collections.json', async (route) => {
          const req = route.request()
          expect(req.postData()).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&horizontal_data_resolution_range[]=0 to 1 meter&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

          // Delay the response to be more realistic to CMR
          await new Promise((resolve) => { setTimeout(resolve, 1000) })

          route.fulfill({
            body: JSON.stringify(horizontalDataResolutionBody),
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits
            }
          })
        })

        await page.goto('/search?hdr=0%20to%201%20meter')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'horizontal-data-resolution', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-horizontal-data-resolution').click()
        await expect(page.locator('label[title="0 to 1 meter"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Latency Facets Group', () => {
    test.describe('When the path is loaded with the `1 to 3 hours` latency param', () => {
      test('loads with the facet applied', async ({ page }) => {
        const cmrHits = 11

        await page.route('**/search/collections.json', async (route) => {
          const req = route.request()
          expect(req.postData()).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&latency[]=1 to 3 hours&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

          // Delay the response to be more realistic to CMR
          await new Promise((resolve) => { setTimeout(resolve, 1000) })

          route.fulfill({
            body: JSON.stringify(latencyBody),
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits
            }
          })
        })

        await page.goto('/search?lf=1%20to%203%20hours')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure the number of selected elements is displayed correctly
        await testFacetGroupSelectedCount(page, 'latency', 1)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the facet is selected
        await page.getByTestId('facet_group-latency').click()

        // Assert the checkbox is checked
        await expect(page.locator('label[title="1 to 3 hours"] input[type="checkbox"]')).toBeChecked()
      })
    })
  })

  test.describe('Collections without granules', () => {
    test.describe('When the path is loaded with the ac param', () => {
      test('loads with the checkbox selected', async ({ page }) => {
        const cmrHits = 28270

        await page.route('**/search/collections.json', (route) => {
          const req = route.request()
          expect(req.postData()).toBe('include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=-score&sort_key[]=-create-data-date')

          route.fulfill({
            body: JSON.stringify(noGranulesBody),
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits
            }
          })
        })

        await page.goto('/search?ac=true')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the correct checkbox is checked
        await expect(page.getByTestId('input_only-granules')).toBeChecked()
      })
    })
  })

  test.describe('EOSDIS only collections', () => {
    test.describe('When the path is loaded with the tag_key param', () => {
      test('loads with the checkbox selected', async ({ page }) => {
        const cmrHits = 7704

        await page.route('**/search/collections.json', (route) => {
          const req = route.request()
          expect(req.postData()).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&consortium[]=EOSDIS&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

          route.fulfill({
            body: JSON.stringify(nonEosdisBody),
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits
            }
          })
        })

        await page.goto('/search?oe=t')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Ensure that the correct feature facets are selected
        await expect(page.getByTestId('facet_item-available-in-earthdata-cloud')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-customizable')).not.toBeChecked()
        await expect(page.getByTestId('facet_item-map-imagery')).not.toBeChecked()

        // Keyword input is empty
        await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

        // Ensure facet group bodies are shown correctly
        await testFacetGroupExistence(page, 'features')

        // Ensure the correct checkbox is checked
        await expect(page.getByTestId('input_non-eosdis')).toBeChecked()
      })
    })
  })

  test.describe('When the path is loaded with an ee parameter', () => {
    test('loads in the correct environment', async ({ page }) => {
      const cmrHits = 6209

      await page.route('**/search/collections.json', async (route, request) => {
        const url = request.url()
        expect(url).toBe('https://cmr.uat.earthdata.nasa.gov/search/collections.json')

        route.fulfill({
          body: JSON.stringify(eeBody),
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits
          }
        })
      })

      await page.goto('/search?ee=uat')

      // Ensure the correct number of results were loaded
      await expect(page.getByTestId('panel-group-header__heading-meta-text')).toHaveText('Showing 20 of 6,209 matching collections')

      // Keyword input is empty
      await expect(page.getByRole('textbox', { name: keywordInputPlaceholderText })).toHaveValue('')

      // Ensure facet group bodies are shown correctly
      await testFacetGroupExistence(page, 'features')
    })
  })
})
