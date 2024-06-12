import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../support/graphQlGetCollection'
import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'

import boundingBoxBody from './__mocks__/bounding_box_collections.body.json'
import circleBody from './__mocks__/circle_collections.body.json'
import cmrGranulesBody from './__mocks__/cmr_granules/granules.body.json'
import cmrGranulesCollectionBody from './__mocks__/cmr_granules/collections.body.json'
import cmrGranulesCollectionGraphQlBody from './__mocks__/cmr_granules/collection_graphql.body.json'
import colormapOneBody from './__mocks__/colormaps/colormap_1.body.json'
import colormapTwoBody from './__mocks__/colormaps/colormap_2.body.json'
import colormapCollectionsBody from './__mocks__/colormaps/collections.body.json'
import colormapGranulesOneBody from './__mocks__/colormaps/granules_1.body.json'
import colormapGranulesTwoBody from './__mocks__/colormaps/granules_2.body.json'
import colormapGranulesHeaders from './__mocks__/colormaps/granules.headers.json'
import colormapCollectionOneGraphQlBody from './__mocks__/colormaps/collection_graphql_1.body.json'
import colormapCollectionTwoGraphQlBody from './__mocks__/colormaps/collection_graphql_2.body.json'
import colormapCollectionGraphQlHeaders from './__mocks__/colormaps/graphql.headers.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'
import cmrGranulesCollectionGraphQlHeaders from './__mocks__/cmr_granules/graphql.headers.json'
import cmrGranulesHeaders from './__mocks__/cmr_granules/granules.headers.json'
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import multipleShapesShapefileBody from './__mocks__/multiple_shapes_shapefile_collections.body.json'
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
import simpleShapefileBody from './__mocks__/simple_shapefile_collections.body.json'
import tooManyPointsShapefileBody from './__mocks__/too_many_points_shapefile_collections.body.json'
import arcticShapefileBody from './__mocks__/arctic_shapefile_collections.body.json'
import antarcticShapefileBody from './__mocks__/antarctic_shapefile_collections.body.json'
import uploadShapefile from '../../support/uploadShapefile'

// When testing map values we don't need to test the exact values coming from leaflet. The inconsistencies
// with testing locally and in GitHub Actions make the tests unusable. By testing that the right type of spatial
// value is present in the URL and SpatialDisplay, with rounded numbers, we are verifying that we are getting the
// values we expect from leaflet and we are putting them into the store. The Jest tests verify that exact values
// from the store are being displayed correctly.

test.describe('Map interactions', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())

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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the point spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Point' }).click()

        // Add the point to the map
        await page.mouse.click(1000, 450)

        // Updates the URL
        await expect(page).toHaveURL(/search\?sp\[0\]=42\.\d+%2C4\.\d+/)

        // Draws a point on the map
        await expect(page.locator('.leaflet-marker-pane img')).toHaveAttribute('style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1000px, 385px, 0px); z-index: 385;')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_point')).toHaveValue(/4\.\d+,42\.\d+/)
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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the point spatial type
        await page.locator('.leaflet-draw-draw-marker').click()

        // Add the point to the map
        await page.mouse.click(1000, 450)

        // Updates the URL
        await expect(page).toHaveURL(/search\?sp\[0\]=42\.\d+%2C4\.\d+/)

        // Draws a point on the map
        await expect(page.locator('.leaflet-marker-pane img')).toHaveAttribute('style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1000px, 385px, 0px); z-index: 385;')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_point')).toHaveValue(/4\.\d+,42\.\d+/)
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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0]?.match(/42\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the point spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Point' }).click()

        // Enter the spatial point
        await page.getByTestId('spatial-display_point').focus()
        await page.keyboard.type('4.5297,42.1875')
        await page.keyboard.up('Enter')

        // Updates the URL
        await expect(page).toHaveURL('search?sp[0]=42.1875%2C4.5297&lat=4.5297&long=42.1875&zoom=7')

        // Draws a point on the map
        await expect(page.locator('.leaflet-marker-pane img')).toHaveAttribute('style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(700px, 417px, 0px); z-index: 417;')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_point')).toHaveValue('4.5297,42.1875')
      })
    })

    test.describe.skip('When editing a point', () => {
      test.skip('renders correctly', async ({ page }) => {
        await interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42.1875,-2.40647&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          },
          {
            body: pointBodyEdited,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42,-2&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        await page.goto('/')

        // Select the point spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Need to rewrite this in playwright if we try to add it back in
        // // Add the point to the map
        // cy.get('.map').click(1000, 450)

        // // Edit the point
        // cy.get('.leaflet-draw-edit-edit').click()

        // cy.get('.leaflet-edit-marker-selected')
        //   .trigger('pointerdown', {
        //     pointerId: 1,
        //     clientX: 1000,
        //     clientY: 450,
        //     force: true
        //   })
        //   .trigger('pointermove', {
        //     pointerId: 1,
        //     clientX: 1200,
        //     clientY: 450,
        //     force: true
        //   })
        //   .trigger('pointerup', {
        //     pointerId: 1,
        //     force: true
        //   })

        // cy.get('.leaflet-draw-actions').within(() => {
        //   cy.contains('Save').click()
        // })

        // aliases.forEach((alias) => {
        //   cy.wait(`@${alias}`)
        // })

        // // Updates the URL
        // cy.url().should('include', '?sp[0]=42%2C-2')

        // // Draws a point on the map
        // cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(700px, 433px, 0px); z-index: 433;')

        // // Populates the spatial display field
        // await page.getByTestId('spatial-display_point').should('have.value', '-2,42')
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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,4\.\d+,156\d+/)
          }]
        })

        await page.goto('/')

        // Select the circle spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Circle' }).click()

        // Add the circle to the map
        await page.mouse.move(1000, 450)
        await page.mouse.down()
        await page.mouse.move(1000, 460)
        await page.mouse.up()

        // Updates the URL
        await expect(page).toHaveURL(/search\?circle\[0\]=42\.\d+%2C4\.\d+%2C156\d+/)

        // Draws a circle on the map
        // These values aren't consistant in GitHub, but they all start with `384.`
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', /M990,384\..*,10 0 1,0 20,0 a10,10 0 1,0 -20,0 /)

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/4\.\d+,42\.\d+/)
        await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/156\d+/)
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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,4\.\d+,156\d+/)
          }]
        })

        await page.goto('/')

        // Select the circle spatial type
        await page.locator('.leaflet-draw-draw-circle').click()

        // Add the point to the map
        await page.mouse.move(1000, 450)
        await page.mouse.down()
        await page.mouse.move(1000, 460)
        await page.mouse.up()

        // Updates the URL
        await expect(page).toHaveURL(/search\?circle\[0\]=42\.\d+%2C4\.\d+%2C156\d+/)

        // Draws a circle on the map
        // These values aren't consistant in GitHub, but they all start with `384.`
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', /M990,384\..*,10 0 1,0 20,0 a10,10 0 1,0 -20,0 /)

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue(/4\.\d+,42\.\d+/)
        await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue(/156\d+/)
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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.circle?.[0]?.match(/42\.\d+,4\.\d+,156\d+/)
          }]
        })

        await page.goto('/')

        // Select the circle spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Circle' }).click()

        // Enter the circle values
        await page.getByTestId('spatial-display_circle-center').focus()
        await page.keyboard.type('4.5297,42.1875')
        await page.getByTestId('spatial-display_circle-radius').focus()
        await page.keyboard.type('156444')
        await page.keyboard.up('Enter')

        // Updates the URL
        await expect(page).toHaveURL('search?circle[0]=42.1875%2C4.5297%2C156444&lat=4.529699999999991&long=42.187500000000014&zoom=6')

        // Draws a circle on the map
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', 'M539,417.6208000000006a161,160 0 1,0 322,0 a161,160 0 1,0 -322,0 ')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_circle-center')).toHaveValue('4.5297,42.1875')
        await expect(page.getByTestId('spatial-display_circle-radius')).toHaveValue('156444')
      })
    })

    test.describe.skip('When editing a circle', () => {})
  })

  test.describe('When drawing bounding box spatial', () => {
    test.describe('When drawing a new bounding box from the spatial selection', () => {
      test('renders correctly', async ({ page }, testInfo) => {
        const browser = testInfo.project.name

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
              ?.match(/42\.\d+,-9\.\d+,56\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the bounding box spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Rectangle' }).click()

        // Add the bounding box to the map
        await page.mouse.click(1000, 450)
        await page.mouse.click(1100, 550)

        // Updates the URL
        await expect(page).toHaveURL(/search\?sb\[0\]=42\.\d+%2C-9\.\d+%2C56\.\d+%2C4\.\d+/)

        // Draws a bounding box on the map
        const leafletValues = {
          chromium: 'M1000 485L1000 385L1100 385L1100 485L1000 485z',
          firefox: 'M1000 485L1000 385L1100 385L1100 485L1000 485z',
          webkit: 'M1000 485L1000 385L1100 385L1100 485L1000 485z'
        }
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', leafletValues[browser])

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/-9\.\d+,42\.\d+/)
        await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/4\.\d+,56\.\d+/)
      })
    })

    test.describe('When drawing a new bounding box from the leaflet controls', () => {
      test('renders correctly', async ({ page }, testInfo) => {
        const browser = testInfo.project.name

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
              ?.match(/42\.\d+,-9\.\d+,56\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the bounding box spatial type
        await page.locator('.leaflet-draw-draw-rectangle').click()

        // Add the bounding box to the map
        await page.mouse.click(1000, 450)
        await page.mouse.click(1100, 550)

        // Updates the URL
        await expect(page).toHaveURL(/search\?sb\[0\]=42\.\d+%2C-9\.\d+%2C56\.\d+%2C4\.\d+/)

        // Draws a bounding box on the map
        const leafletValues = {
          chromium: 'M1000 485L1000 385L1100 385L1100 485L1000 485z',
          firefox: 'M1000 485L1000 385L1100 385L1100 485L1000 485z',
          webkit: 'M1000 485L1000 385L1100 385L1100 485L1000 485z'
        }
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', leafletValues[browser])

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue(/-9\.\d+,42\.\d+/)
        await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue(/4\.\d+,56\.\d+/)
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
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.bounding_box?.[0]
              ?.match(/42\.\d+,-9\.\d+,56\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the bounding box spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Rectangle' }).click()

        // Enter the bounding box values
        await page.getByTestId('spatial-display_southwest-point').focus()
        await page.keyboard.type('-9.53964,42.1875')
        await page.getByTestId('spatial-display_northeast-point').focus()
        await page.keyboard.type('4.5297,56.25')
        await page.keyboard.up('Enter')

        // Updates the URL
        await expect(page).toHaveURL('search?sb[0]=42.1875%2C-9.53964%2C56.25%2C4.5297&lat=-2.50497&long=49.21875&zoom=4')

        // Draws a bounding box on the map
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', 'M500 617L500 217L900 217L900 617L500 617z')

        // Populates the spatial display field
        await expect(page.getByTestId('spatial-display_southwest-point')).toHaveValue('-9.53964,42.1875')
        await expect(page.getByTestId('spatial-display_northeast-point')).toHaveValue('4.5297,56.25')
      })
    })

    test.describe.skip('When editing a bounding box', () => {})
  })

  test.describe('When drawing polygon spatial', () => {
    test.describe('When drawing a new polygon from the spatial selection', () => {
      test('renders correctly', async ({ page }, testInfo) => {
        const browser = testInfo.project.name

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: polygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0]
              ?.match(/42\.\d+,4\.\d+,42\.\d+,-9\.\d+,56\.\d+,-9\.\d+,42\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the polygon spatial type
        await page.getByTestId('spatial-selection-dropdown').click()
        await page.getByRole('button', { name: 'Select Polygon' }).click()

        // Add the polygon to the map
        await page.mouse.click(1000, 450)

        await page.waitForTimeout(200)
        await page.mouse.click(1100, 550)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 550)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 450)

        // Updates the URL
        // eslint-disable-next-line max-len
        await expect(page).toHaveURL(/search\?polygon\[0\]=42\.\d+%2C4\.\d+%2C42\.\d+%2C-9\.\d+%2C56\.\d+%2C-9\.\d+%2C42\.\d+%2C4\.\d+/)

        // Draws a polygon on the map
        const leafletValues = {
          chromium: 'M1000 385L1100 485L1000 485L1000 385z',
          firefox: 'M1000 385L1100 485L1000 485L1000 385z',
          webkit: 'M1000 385L1100 485L1000 485L1000 385z'
        }
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', leafletValues[browser])

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Polygon')

        await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')
      })
    })

    test.describe('When drawing a new polygon from the leaflet controls', () => {
      test('renders correctly', async ({ page }, testInfo) => {
        const browser = testInfo.project.name

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: polygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            paramCheck: (parsedQuery) => parsedQuery?.point?.[0]
              ?.match(/42\.\d+,4\.\d+,42\.\d+,-9\.\d+,56\.\d+,-9\.\d+,42\.\d+,4\.\d+/)
          }]
        })

        await page.goto('/')

        // Select the polygon spatial type
        await page.locator('.leaflet-draw-draw-polygon').click()

        // Add the polygon to the map
        await page.mouse.click(1000, 450)

        await page.waitForTimeout(200)
        await page.mouse.click(1100, 550)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 550)

        await page.waitForTimeout(200)
        await page.mouse.click(1000, 450)

        // Updates the URL
        // eslint-disable-next-line max-len
        await expect(page).toHaveURL(/search\?polygon\[0\]=42\.\d+%2C4\.\d+%2C42\.\d+%2C-9\.\d+%2C56\.\d+%2C-9\.\d+%2C42\.\d+%2C4\.\d+/)

        // Draws a polygon on the map
        const leafletValues = {
          chromium: 'M1000 385L1100 485L1000 485L1000 385z',
          firefox: 'M1000 385L1100 485L1000 485L1000 385z',
          webkit: 'M1000 385L1100 485L1000 485L1000 385z'
        }
        await expect(page.locator('.leaflet-interactive')).toHaveAttribute('d', leafletValues[browser])

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Polygon')

        await expect(page.getByTestId('spatial-display_polygon')).toHaveText('3 Points')
      })
    })

    test.describe.skip('When editing a polygon', () => {})
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
              'cmr-hits': '5151'
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

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&sf=1&sfs[0]=0&lat=-9.435819999999993&long=49.21875&zoom=5')

        // Draws a polygon on the map
        await expect(page.locator('.leaflet-interactive').first()).toHaveAttribute('d', 'M300 18L300 818L600 824L900 823L1100 818L996 720L792 522L692 422L300 18z')
        await expect(page.locator('.leaflet-interactive').nth(1)).toHaveAttribute('d', 'M300 818L600 824L900 823L1100 818L996 720L792 522L692 422L300 18L300 818z')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
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
              'cmr-hits': '5151'
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

        // Collapse the collectionpanel
        await page.getByRole('button', { name: 'Collapse panel (])' }).click()

        // Select the line
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.locator('g path').nth(2).dispatchEvent('click')

        // Updates the URL
        await expect(page).toHaveURL('search?line[0]=31%2C-15%2C36%2C-17%2C41%2C-15&sf=1&sfs[0]=2&lat=-8.296765000000008&long=44.625&zoom=4')

        // Draws a polygon on the map
        await expect(page.locator('.leaflet-interactive').nth(2)).toHaveAttribute('d', 'M313 609L455 666L597 609')
        await expect(page.locator('.leaflet-interactive').nth(4)).toHaveAttribute('d', 'M313 609L455 666L597 609')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
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
              'cmr-hits': '5151'
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

        // Collapse the collection panel
        await page.getByRole('button', { name: 'Collapse panel (])' }).click()

        // Select the circle
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.locator('g path').nth(3).dispatchEvent('click')

        // Updates the URL
        await expect(page).toHaveURL('search?circle[0]=35%2C-5%2C50000&sf=1&sfs[0]=3&lat=-8.296765000000008&long=44.625&zoom=4')

        // Draws a circle on the map
        await expect(page.locator('.leaflet-interactive').nth(3)).toHaveAttribute('d', 'M413.55555555555566,324.2222222222222a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 ')
        await expect(page.locator('.leaflet-interactive').nth(4)).toHaveAttribute('d', 'M413.55555555555566,324.2222222222222a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 ')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
      })
    })

    test.describe('When the shapefile has a point shape', () => {
      test('renders correctly', async ({ page }, testInfo) => {
        const browser = testInfo.project.name

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
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

        // Collapse the collection panel
        await page.getByRole('button', { name: 'Collapse panel (])' }).click()

        // Select the point
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.getByRole('button', { name: 'Marker' }).click()

        // Updates the URL
        await expect(page).toHaveURL('search?sp[0]=35%2C0&sf=1&sfs[0]=4&lat=-8.296765000000008&long=44.625&zoom=4')

        // Point
        const pointValues = {
          chromium: 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 182px, 0px); z-index: 182; outline: none;',
          firefox: 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 182px, 0px); z-index: 182; outline: none;',
          webkit: 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 182px, 0px); z-index: 182; outline: currentcolor;'
        }
        await expect(page.locator('.leaflet-marker-icon.leaflet-interactive').nth(0)).toHaveAttribute('style', pointValues[browser])

        // Selected point
        await expect(page.locator('.leaflet-marker-icon.leaflet-interactive').nth(1)).toHaveAttribute('style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 182px, 0px); z-index: 182;')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
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
              'cmr-hits': '5151'
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

        // Collapse the collection panel
        await page.getByRole('button', { name: 'Collapse panel (])' }).click()

        // Select the circle
        // Playwright has trouble clicking the shape because of the leaflet-control-container, dispatchEvent('click') works
        await page.locator('g path').nth(0).dispatchEvent('click')
        await page.locator('g path').nth(1).dispatchEvent('click')

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&polygon[1]=58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647%2C58.25%2C-14.46517&sf=1&sfs[0]=0&sfs[1]=1&lat=-8.296765000000008&long=44.625&zoom=4')

        // Draws a circle on the map
        await expect(page.locator('.leaflet-interactive').nth(0)).toHaveAttribute('d', 'M631 250L631 650L831 654L1031 650L877 502L728 352L631 250z')
        await expect(page.locator('.leaflet-interactive').nth(1)).toHaveAttribute('d', 'M688 170L786 277L985 489L1088 593L1088 170L688 170z')
        await expect(page.locator('.leaflet-interactive').nth(4)).toHaveAttribute('d', 'M631 650L831 654L1031 650L877 502L728 352L631 250L631 650z')
        await expect(page.locator('.leaflet-interactive').nth(5)).toHaveAttribute('d', 'M1088 593L1088 170L688 170L786 277L985 489L1088 593z')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('2 shapes selected')
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
              'cmr-hits': '5151'
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

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=-114.04999%2C36.95777%2C-114.0506%2C37.0004%2C-114.04826%2C41.99381%2C-119.99917%2C41.99454%2C-120.00101%2C38.99957%2C-118.71431%2C38.10218%2C-117.50012%2C37.22038%2C-116.0936%2C36.15581%2C-114.63667%2C35.00881%2C-114.63689%2C35.02837%2C-114.60362%2C35.06423%2C-114.64435%2C35.1059%2C-114.57852%2C35.12875%2C-114.56924%2C35.18348%2C-114.60431%2C35.35358%2C-114.67764%2C35.48974%2C-114.65431%2C35.59759%2C-114.68941%2C35.65141%2C-114.68321%2C35.68939%2C-114.70531%2C35.71159%2C-114.69571%2C35.75599%2C-114.71211%2C35.80618%2C-114.67742%2C35.87473%2C-114.73116%2C35.94392%2C-114.74376%2C35.9851%2C-114.73043%2C36.03132%2C-114.75562%2C36.08717%2C-114.57203%2C36.15161%2C-114.51172%2C36.15096%2C-114.50217%2C36.1288%2C-114.45837%2C36.13859%2C-114.44661%2C36.12597%2C-114.40547%2C36.14737%2C-114.37211%2C36.14311%2C-114.30843%2C36.08244%2C-114.31403%2C36.05817%2C-114.25265%2C36.02019%2C-114.14819%2C36.02801%2C-114.11416%2C36.09698%2C-114.12086%2C36.1146%2C-114.09987%2C36.12165%2C-114.04684%2C36.19407%2C-114.04999%2C36.95777&sf=1&sfs[0]=0&lat=38.502146&long=-117.02269700000001&zoom=6')

        // Displays a modal
        await expect(page.getByTestId('edsc-modal__title')).toHaveText('Shape file has too many points')

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click()

        // Draws a circle on the map
        await expect(page.locator('.leaflet-interactive').nth(0)).toHaveAttribute('d', 'M1039 588L1039 680L1037 680L1033 688L1030 690L1031 691L1029 697L1027 699L1016 700L1009 695L1010 693L1000 685L994 688L992 686L988 687L986 685L979 685L975 687L973 686L968 689L962 690L958 693L961 695L961 708L967 715L963 724L965 726L964 735L967 738L966 741L970 746L969 755L967 759L969 765L973 769L976 776L976 782L980 795L979 801L973 802L971 804L976 808L972 812L972 816L834 705L831 704L644 561L441 415L362 361L362 20L1039 20L1039 588z')
        await expect(page.locator('.leaflet-interactive').last()).toHaveAttribute('d', 'M1039 593L1039 20L785 16L531 17L362 20L362 361L508 463L687 593L890 749L972 815L976 808L971 804L979 801L980 795L976 776L967 760L970 748L966 742L967 737L964 735L965 730L963 724L967 716L960 706L961 698L958 692L979 685L986 685L990 687L992 686L994 688L1000 685L1006 689L1012 698L1016 700L1027 699L1031 689L1039 680L1039 593z')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
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
              'cmr-hits': '5151'
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

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C76.46517%2C56.25%2C76.46517%2C42.1875%2C82.40647%2C42.1875%2C76.46517&sf=1&sfs[0]=0&lat=90&projection=EPSG%3A3413&zoom=0')

        // Draws a polygon on the map
        await expect(page.locator('.geojson-svg.leaflet-interactive')).toHaveAttribute('d', 'M800 422L880 426L876 382L800 422z')
        await expect(page.locator('.leaflet-interactive').nth(0)).toHaveAttribute('d', 'M880 426L876 382L800 422L880 426z')
        await expect(page.locator('.leaflet-interactive').nth(2)).toHaveAttribute('d', 'M880 426L876 382L800 422L880 426z')
        await expect(page.locator('.leaflet-interactive').nth(3)).toHaveAttribute('d', 'M880 426L876 382L800 422L880 426z')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
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
              'cmr-hits': '5151'
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

        // Updates the URL
        await expect(page).toHaveURL('search?polygon[0]=42.1875%2C-76.46517%2C42.1875%2C-82.40647%2C56.25%2C-76.46517%2C42.1875%2C-76.46517&sf=1&sfs[0]=0&lat=-90&projection=EPSG%3A3031&zoom=0')

        // Draws a polygon on the map
        await expect(page.locator('.geojson-svg.leaflet-interactive')).toHaveAttribute('d', 'M768 342L821 283L850 317L768 342z')
        await expect(page.locator('.leaflet-interactive').nth(0)).toHaveAttribute('d', 'M821 283L768 342L850 317L821 283z')
        await expect(page.locator('.leaflet-interactive').nth(2)).toHaveAttribute('d', 'M821 283L850 317L768 342L821 283z')
        await expect(page.locator('.leaflet-interactive').nth(3)).toHaveAttribute('d', 'M821 283L850 317L768 342L821 283z')

        // Populates the spatial display field
        await expect(
          page.getByTestId('filter-stack__spatial')
            .locator('.filter-stack-item__secondary-title')
        ).toHaveText('Shape File')

        await expect(page.getByTestId('spatial-display_shapefile-name')).toHaveText('test.geojson')
        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')
      })
    })
  })

  test.describe('When moving the map', () => {
    test.describe('When dragging the map', () => {
      test('updates the URL with the new map parameter', async ({ page }, testInfo) => {
        const browser = testInfo.project.name

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Drag the map
        await page.mouse.move(1000, 500)
        await page.mouse.down()
        await page.mouse.move(1000, 600)
        await page.mouse.up()

        const urlValues = {
          chromium: 'search?lat=13.999032615512775',
          firefox: 'search?lat=13.99892766713073',
          webkit: 'search?lat=13.999032615512775'
        }
        await expect(page).toHaveURL(urlValues[browser])
      })
    })

    test.describe('When zooming the map', () => {
      test('updates the URL with the new map parameter', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Zoom the map
        await page.locator('.leaflet-control-zoom-in').click()

        await expect(page).toHaveURL('search?zoom=3')
      })
    })
  })

  test.describe('When switching projections', () => {
    test.describe('When switching to the North Polar Stereographic projection', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection
        await page.getByTestId('projection-switcher__arctic').click()

        await expect(page).toHaveURL('search?lat=90&projection=EPSG%3A3413&zoom=0')

        await expect(page.locator('img.leaflet-tile').first()).toHaveAttribute('src', /epsg3413/)
      })
    })

    test.describe('When switching to the Geographic projection', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection
        await page.getByTestId('projection-switcher__arctic').click()
        // Switch back to Geographic
        await page.getByTestId('projection-switcher__geo').click()

        // Removes the map parameter when it is centered
        await expect(page).toHaveURL('search')

        await expect(page.locator('img.leaflet-tile').first()).toHaveAttribute('src', /epsg4326/)
      })
    })

    test.describe('When switching to the South Polar Stereographic projection', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection
        await page.getByTestId('projection-switcher__antarctic').click()

        await expect(page).toHaveURL('search?lat=-90&projection=EPSG%3A3031&zoom=0')

        await expect(page.locator('img.leaflet-tile').first()).toHaveAttribute('src', /epsg3031/)
      })
    })

    test.describe('When switching from the North Polar Stereographic projection to the South Polar Stereographic projection', () => {
      test('updates the URL with the new map parameter and updates the src of tile images', async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
        })

        await page.goto('/')

        // Change the projection to North Polar
        await page.getByTestId('projection-switcher__arctic').click()

        await expect(page).toHaveURL('search?lat=90&projection=EPSG%3A3413&zoom=0')

        await expect(page.locator('img.leaflet-tile').first()).toHaveAttribute('src', /epsg3413/)

        // Change the projection to South Polar
        await page.getByTestId('projection-switcher__antarctic').click()

        await expect(page).toHaveURL('search?lat=-90&projection=EPSG%3A3031&zoom=0')

        await expect(page.locator('img.leaflet-tile').first()).toHaveAttribute('src', /epsg3031/)
      })
    })
  })

  test.describe('When changing the map layers', () => {
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

    test.describe('When changing the Place Labels overlay layer', () => {
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

  test.describe('When viewing granule results', () => {
    test.describe('When viewing CMR granules', () => {
      test.beforeEach(async ({ page }) => {
        const conceptId = 'C1214470488-ASF'

        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders,
          additionalRequests: [{
            body: cmrGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            paramCheck: (parsedQuery) => parsedQuery?.keyword === conceptId && parsedQuery?.polygon?.[0] === '42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647'
          }],
          includeDefault: false
        })

        await page.route(/search\/granules.json/, async (route) => {
          const query = route.request().postData()

          expect(query).toEqual('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&sort_key=-start_date')

          await route.fulfill({
            json: cmrGranulesBody,
            headers: cmrGranulesHeaders
          })
        })

        await page.route(/api$/, async (route) => {
          const query = route.request().postData()

          expect(query).toEqual(graphQlGetCollection(conceptId))

          await route.fulfill({
            json: cmrGranulesCollectionGraphQlBody,
            headers: cmrGranulesCollectionGraphQlHeaders
          })
        })

        await page.route(/autocomplete/, async (route) => {
          await route.fulfill({
            json: { feed: { entry: [] } }
          })
        })

        await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!`)
      })

      // TODO find a way to verify the granules are drawn on the map

      test.describe('When hovering over a granule', () => {
        test('highlights the granule in the granule results list', async ({ page }) => {
          await page.locator('.map').hover({
            force: true,
            position: {
              x: 1000,
              y: 450
            }
          })

          await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20210531T153052_20210531T153122_038133_04802B_C09D/ })).toHaveClass(/granule-results-item--active/)
        })
      })

      test.describe('When clicking on a granule', () => {
        test.beforeEach(async ({ page }) => {
          await page.route(/api$/, async (route) => {
            const query = route.request().postData()

            expect(query).toEqual('{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"G2061166811-ASF"}}}')

            await route.fulfill({
              json: granuleGraphQlBody,
              headers: { 'content-type': 'application/json' }
            })
          })

          await page.locator('.map').click({
            force: true,
            position: {
              x: 1000,
              y: 450
            }
          })
        })

        test('shows the granule and a label on the map', async ({ page }) => {
          await expect(page.locator('.leaflet-interactive').nth(1)).toHaveAttribute('d', 'M994 441L996 454L1012 451L1009 438L994 441z')
          await expect(page.locator('.granule-spatial-label-temporal')).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')
        })

        test('focuses the selected granule', async ({ page }) => {
          await expect(page.getByRole('button', { name: /S1A_IW_SLC__1SDV_20210531T153052_20210531T153122_038133_04802B_C09D/ })).toHaveClass(/granule-results-item--active/)
        })

        test('updates the URL', async ({ page }) => {
          await expect(page).toHaveURL(/\/search\/granules.*g=G2061166811-ASF/)
        })

        test.describe('when returning to the collections results list', () => {
          test('removes the granule label from the map', async ({ page }) => {
            await page.getByTestId('panel-group_granule-results')
              .getByTestId('breadcrumb-button')
              .click()

            await expect(page.locator('.granule-spatial-label-temporal')).not.toBeInViewport()
          })
        })

        test.describe('when panning the map', () => {
          test('does not remove the stickied granule', async ({ page }) => {
            // Drag the map
            await page.mouse.move(1000, 500)
            await page.mouse.down()
            await page.mouse.move(1000, 600)
            await page.mouse.up()

            await expect(page.locator('.leaflet-interactive').nth(1)).toHaveAttribute('d', 'M994 441L996 454L1012 451L1009 438L994 441z')
            await expect(page.locator('.granule-spatial-label-temporal')).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')
          })
        })

        test.describe('when zooming the map', () => {
          test('does not remove the stickied granule', async ({ page }) => {
            // Zoom the map
            await page.locator('.leaflet-control-zoom-in').click()

            await expect(page.locator('.leaflet-interactive').nth(1)).toHaveAttribute('d', 'M1287 466L1293 491L1324 484L1319 459L1287 466z')
            await expect(page.locator('.granule-spatial-label-temporal')).toHaveText('2021-05-31 15:30:522021-05-31 15:31:22')
          })
        })

        test.describe('when clicking on an empty spot on the map', () => {
          test('removes the stickied granule', async ({ page }) => {
            await page.locator('.map').click({
              force: true,
              position: {
                x: 1100,
                y: 720
              }
            })

            await expect(page.locator('.granule-spatial-label-temporal')).not.toBeInViewport()
          })
        })

        test.describe('when clicking the same granule again', () => {
          test('removes the stickied granule', async ({ page }) => {
            await page.locator('.map').click({
              force: true,
              position: {
                x: 1000,
                y: 720
              }
            })

            await expect(page.locator('.granule-spatial-label-temporal')).not.toBeInViewport()
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
            echoCollectionId: 'C1972468359-SCIOPS',
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

          expect(query).toEqual('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1972468359-SCIOPS')

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

        await page.route(/autocomplete/, async (route) => {
          await route.fulfill({
            json: { feed: { entry: [] } }
          })
        })

        await page.goto(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!`)
      })

      test('displays an outline of the minimum bounding rectangle', async ({ page }) => {
        await expect(page.locator('.leaflet-interactive').first()).toHaveAttribute('d', 'M1000 434L1000 484L1050 484L1000 434z')
        await expect(page.locator('.leaflet-interactive').last()).toHaveAttribute('d', 'M1000 484L1000 434L1050 434L1050 484L1000 484z')
      })

      test('displays a hint about using a bounding box instead of polygon', async ({ page }) => {
        await expect(
          page.getByTestId('filter-stack__spatial').locator('.filter-stack-item__error')
        ).toHaveText('This collection does not support polygon search. Your polygon has been converted to a bounding box.')
      })
    })
  })

  test.describe('When viewing granules with colormap data', () => {
    test.beforeEach(async ({ page }) => {
      const conceptIdOne = 'C1996881146-POCLOUD'
      const conceptIdTwo = 'C1243477369-GES_DISC'

      await interceptUnauthenticatedCollections({
        page,
        body: colormapCollectionsBody,
        headers: commonHeaders
      })

      await page.route(/search\/granules.json/, async (route) => {
        const query = route.request().postData()

        if (query === `echo_collection_id=${conceptIdOne}&page_num=1&page_size=20`) {
          await route.fulfill({
            json: colormapGranulesOneBody,
            headers: colormapGranulesHeaders
          })
        }

        if (query === `echo_collection_id=${conceptIdTwo}&page_num=1&page_size=20`) {
          await route.fulfill({
            json: colormapGranulesTwoBody,
            headers: colormapGranulesHeaders
          })
        }
      })

      await page.route(/api$/, async (route) => {
        const query = route.request().postData()

        if (query === graphQlGetCollection(conceptIdOne)) {
          await route.fulfill({
            json: colormapCollectionOneGraphQlBody,
            headers: colormapCollectionGraphQlHeaders
          })
        }

        if (query === graphQlGetCollection(conceptIdTwo)) {
          await route.fulfill({
            json: colormapCollectionTwoGraphQlBody,
            headers: colormapCollectionGraphQlHeaders
          })
        }
      })

      await page.route(/autocomplete/, async (route) => {
        await route.fulfill({
          json: { feed: { entry: [] } }
        })
      })

      await page.route(/colormaps\/GHRSST_L4_MUR_Sea_Ice_Concentration/, async (route) => {
        await route.fulfill({
          json: colormapOneBody
        })
      })

      await page.route(/colormaps\/AIRS_Prata_SO2_Index_Day/, async (route) => {
        await route.fulfill({
          json: colormapTwoBody
        })
      })

      await page.goto('search/granules?p=C1996881146-POCLOUD')
    })

    test('displays the color map on the page', async ({ page }) => {
      await expect(page).toHaveScreenshot('colormap-screenshot.png', {
        clip: {
          x: 1125,
          y: 75,
          width: 275,
          height: 50
        }
      })

      await expect(page.getByTestId('legend-label-min')).toHaveText('0 – 1 %')
      await expect(page.getByTestId('legend-label-max')).toHaveText('100 %')
    })

    test.describe('when hovering over the colormap', () => {
      test('displays color map data to the user', async ({ page }) => {
        await page.locator('.map').hover({
          position: {
            x: 1250,
            y: 25
          }
        })

        await expect(page.getByTestId('legend-label-color')).toHaveAttribute('style', 'background-color: rgb(0, 250, 241);')
        await expect(page.getByTestId('legend-label')).toHaveText('44 – 45 %')
      })
    })

    test.describe('when returning to the search results page', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('panel-group_granule-results')
          .getByTestId('breadcrumb-button')
          .click()
      })

      test('does not show the colormap', async ({ page }) => {
        await expect(page.getByTestId('legend')).not.toBeInViewport()
      })

      test.describe('when visiting another collection with a colormap', () => {
        test('displays a new colormap', async ({ page }) => {
          await page.getByTestId('collection-result-item_C1243477369-GES_DISC').click()

          await expect(page).toHaveScreenshot('colormap-2-screenshot.png', {
            clip: {
              x: 1125,
              y: 75,
              width: 275,
              height: 50
            }
          })

          await expect(page.getByTestId('legend-label-min')).toHaveText('0.00 – 0.12 DU')
          await expect(page.getByTestId('legend-label-max')).toHaveText('500.00 DU')
        })
      })
    })

    test.describe('when switching the projection', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('projection-switcher__arctic').click()
      })

      test('does not show the colormap', async ({ page }) => {
        await expect(page.getByTestId('legend')).not.toBeInViewport()
      })

      test.describe('when switching back to the geographic projection', () => {
        test.beforeEach(async ({ page }) => {
          await page.getByTestId('projection-switcher__geo').click()
        })

        test('displays the colormap', async ({ page }) => {
          await expect(page.getByTestId('legend')).toBeInViewport()
        })
      })
    })
  })
})
