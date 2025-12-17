import { test, expect } from 'playwright-test-coverage'

import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import uploadShapefile from '../../support/uploadShapefile'
import { setupTests } from '../../support/setupTests'
import { getShapefileFromRequest } from '../../support/getShapefileFromRequest'

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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [42.1875, -2.40647],
                      [42.1875, -16.46517],
                      [56.25, -16.46517],
                      [42.1875, -2.40647]
                    ]]
                  },
                  properties: {},
                  id: 'simple-id'
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=-9\.\d+&long=49\.\d+&zoom=4\.\d+/)
      })
    })

    test.describe('When the shapefile has a MultiPolygon shape', () => {
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'MultiPolygon',
                    coordinates: [
                      [
                        [
                          [-109.6, 38.81],
                          [-109.6, 38.83],
                          [-109.62, 38.83],
                          [-109.62, 38.81],
                          [-109.6, 38.81]
                        ]
                      ],
                      [
                        [
                          [-109.55, 38.75],
                          [-109.55, 38.77],
                          [-109.57, 38.77],
                          [-109.57, 38.75],
                          [-109.55, 38.75]
                        ]
                      ]
                    ]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=12/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multipolygon.png', {
          clip: screenshotClip
        })

        // Updates the URL
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+&zoom=12\.\d+/)
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [-106, 35],
                      [-105, 36],
                      [-94, 33],
                      [-95, 30],
                      [-93, 31],
                      [-92, 30]
                    ]
                  },
                  properties: {},
                  id: 'simple-id-3'
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=33&long=-98\.\d+&zoom=4\.\d+/)
      })
    })

    test.describe('When the shapefile has a MultiLineString shape', () => {
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'MultiLineString',
                    coordinates: [
                      [
                        [-109.6, 38.81],
                        [-109.62, 38.83],
                        [-109.64, 38.85]
                      ],
                      [
                        [-109.55, 38.75],
                        [-109.57, 38.77],
                        [-109.59, 38.79]
                      ]
                    ]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=11/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multilinestring.png', {
          clip: screenshotClip,
          maxDiffPixelRatio: 0.1
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+&zoom=11\.\d+/)
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [-77.0163, 39.332660181862266],
                        [-77.07327967787164, 39.33048114362778],
                        [-77.12970009970127, 39.32396541933871],
                        [-77.18500781102183, 39.31317695811312],
                        [-77.23866088763444, 39.298221604205615],
                        [-77.29013451998654, 39.27924600036558],
                        [-77.33892638465004, 39.25643607187793],
                        [-77.38456173845805, 39.23001511015715],
                        [-77.42659817615888, 39.20024147950813],
                        [-77.46462999872024, 39.16740597495481],
                        [-77.49829214646135, 39.13182886280424],
                        [-77.52726365878408, 39.093856638809584],
                        [-77.55127063018857, 39.05385854138847],
                        [-77.57008864027264, 39.01222285933061],
                        [-77.58354464331732, 38.96935307479347],
                        [-77.59151831066757, 38.92566388315665],
                        [-77.59394282626685, 38.8815771315156],
                        [-77.59080514226979, 38.837517717287206],
                        [-77.58214570754379, 38.7939094876235],
                        [-77.56805768701986, 38.751171179141316],
                        [-77.54868569423536, 38.70971243593329],
                        [-77.52422406303128, 38.6699299419873],
                        [-77.49491468725206, 38.632203702063634],
                        [-77.46104445949474, 38.59689350281435],
                        [-77.42294234153687, 38.564335583524446],
                        [-77.38097610011208, 38.5348395433518],
                        [-77.33554874229, 38.50868550937757],
                        [-77.28709468493577, 38.4861215871784],
                        [-77.23607569266694, 38.4673616130208],
                        [-77.18297661847107, 38.452583224170446],
                        [-77.12830098077697, 38.44192626121731],
                        [-77.07256641035339, 38.43549151374661],
                        [-77.0163, 38.433339818137725],
                        [-76.96003358964661, 38.43549151374661],
                        [-76.90429901922305, 38.44192626121731],
                        [-76.84962338152894, 38.452583224170446],
                        [-76.79652430733307, 38.4673616130208],
                        [-76.74550531506425, 38.4861215871784],
                        [-76.69705125771002, 38.50868550937757],
                        [-76.65162389988794, 38.5348395433518],
                        [-76.60965765846315, 38.564335583524446],
                        [-76.57155554050527, 38.59689350281435],
                        [-76.53768531274795, 38.632203702063634],
                        [-76.50837593696873, 38.6699299419873],
                        [-76.48391430576466, 38.70971243593329],
                        [-76.46454231298014, 38.751171179141316],
                        [-76.45045429245623, 38.7939094876235],
                        [-76.44179485773023, 38.837517717287206],
                        [-76.43865717373316, 38.8815771315156],
                        [-76.44108168933245, 38.92566388315665],
                        [-76.44905535668269, 38.96935307479347],
                        [-76.46251135972737, 39.01222285933061],
                        [-76.48132936981145, 39.05385854138847],
                        [-76.50533634121594, 39.093856638809584],
                        [-76.53430785353866, 39.13182886280424],
                        [-76.56797000127978, 39.16740597495481],
                        [-76.60600182384114, 39.20024147950813],
                        [-76.64803826154197, 39.23001511015715],
                        [-76.69367361534998, 39.25643607187793],
                        [-76.74246548001348, 39.27924600036558],
                        [-76.79393911236556, 39.298221604205615],
                        [-76.84759218897817, 39.31317695811312],
                        [-76.90289990029875, 39.32396541933871],
                        [-76.95932032212836, 39.33048114362778],
                        [-77.0163, 39.332660181862266]
                      ]
                    ]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=38\.\d+&long=-76\.\d+&zoom=8\.\d+/)
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-77.0163, 38.883]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL('search?sf=1&sfs[0]=0&lat=38.883&long=-77.01629161809683&zoom=21')
      })
    })

    test.describe('When the shapefile has a MultiPoint shape', () => {
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'MultiPoint',
                    coordinates: [
                      [-109.6, 38.81],
                      [-109.55, 38.75],
                      [-109.5, 38.7]
                    ]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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

        // Waiting for the URL to include the correct zoom level ensures the map is finished drawing
        await page.waitForURL(/zoom=11/, { timeout: 3000 })

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multipoint.png', {
          clip: screenshotClip,
          maxDiffPixelRatio: 0.005
        })

        await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

        // Checking that the right number of results are loaded ensures that the route
        // was fulfilled correctly with the succesfull paramCheck
        await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

        // Updates the URL
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=38\.\d+&long=-109\.\d+&zoom=11\.\d+/)
      })
    })

    test.describe('When the shapefile has multiple shapes', () => {
      test.beforeEach(async ({ page }) => {
        await interceptUnauthenticatedCollections({
          page,
          body: commonBody,
          headers: commonHeaders
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

        // Draws the spatial on the map
        await expect(page).toHaveScreenshot('multiple-shapes.png', {
          clip: screenshotClip,
          maxDiffPixelRatio: 0.005
        })
      })

      test.describe('when selecting multiple shapes', () => {
        test.beforeEach(async ({ page }) => {
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
              paramCheck: async (request) => {
                const shapefile = await getShapefileFromRequest(request)

                return shapefile === JSON.stringify({
                  type: 'FeatureCollection',
                  features: [{
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [
                        [
                          [42.1875, -2.40647],
                          [42.1875, -16.46517],
                          [56.25, -16.46517],
                          [42.1875, -2.40647]
                        ]
                      ]
                    },
                    properties: {},
                    id: 'simple-id-1'
                  }, {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [
                        [
                          [44.1875, 0.40647],
                          [58.25, -14.46517],
                          [58.25, 0.40647],
                          [44.1875, 0.40647]
                        ]
                      ]
                    },
                    properties: {},
                    id: 'simple-id-2'
                  }]
                })
              }
            }]
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
        })

        test('renders and selects correctly @screenshot', async ({ page }) => {
          // Draws the spatial on the map
          await expect(page).toHaveScreenshot('multiple-shapes-selected.png', {
            clip: screenshotClip,
            maxDiffPixelRatio: 0.005
          })

          await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('2 shapes selected')

          // Checking that the right number of results are loaded ensures that the route
          // was fulfilled correctly with the succesfull paramCheck
          await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

          // Updates the URL
          await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&sfs\[1\]=1&lat=-8\.\d+&long=46\.\d+&zoom=3\.\d+/)
        })

        test.describe('when deselecting a shape', () => {
          test('renders and deselects correctly @screenshot', async ({ page }) => {
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
                paramCheck: async (request) => {
                  const shapefile = await getShapefileFromRequest(request)

                  return shapefile === JSON.stringify({
                    type: 'FeatureCollection',
                    features: [{
                      type: 'Feature',
                      geometry: {
                        type: 'Polygon',
                        coordinates: [
                          [
                            [44.1875, 0.40647],
                            [58.25, -14.46517],
                            [58.25, 0.40647],
                            [44.1875, 0.40647]
                          ]
                        ]
                      },
                      properties: {},
                      id: 'simple-id-2'
                    }]
                  })
                }
              }]
            })

            // Wait to avoid a double click
            await page.waitForTimeout(300)

            // Lower Polygon
            await page.locator('.map').click({
              position: {
                x: 1200,
                y: 448
              }
            })

            // Draws the spatial on the map
            await expect(page).toHaveScreenshot('multiple-shapes-deselected.png', {
              clip: screenshotClip,
              maxDiffPixelRatio: 0.005
            })

            await expect(page.getByTestId('filter-stack-item__hint')).toHaveText('1 shape selected')

            // Checking that the right number of results are loaded ensures that the route
            // was fulfilled correctly with the succesfull paramCheck
            await expect(page.getByText('Showing 2 of 2 matching collections')).toBeVisible()

            // Updates the URL
            await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=1&lat=-8\.\d+&long=46\.\d+&zoom=3\.\d+/)
          })
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [-114.0506, 37.000396],
                        [-114.041723, 41.99372],
                        [-119.999168, 41.99454],
                        [-120.001014, 38.999574],
                        [-118.714312, 38.102185],
                        [-117.500117, 37.22038],
                        [-115.852908, 35.96966],
                        [-114.633013, 35.002085],
                        [-114.636893, 35.028367],
                        [-114.602908, 35.068588],
                        [-114.646759, 35.101872],
                        [-114.629934, 35.118272],
                        [-114.578524, 35.12875],
                        [-114.569238, 35.18348],
                        [-114.604314, 35.353584],
                        [-114.677643, 35.489742],
                        [-114.677205, 35.513491],
                        [-114.656905, 35.534391],
                        [-114.666184, 35.577576],
                        [-114.653406, 35.610789],
                        [-114.689407, 35.651412],
                        [-114.680607, 35.685488],
                        [-114.705409, 35.708287],
                        [-114.695709, 35.755986],
                        [-114.71211, 35.806185],
                        [-114.697767, 35.854844],
                        [-114.67742, 35.874728],
                        [-114.731159, 35.943916],
                        [-114.743756, 35.985095],
                        [-114.729707, 36.028166],
                        [-114.755618, 36.087166],
                        [-114.631716, 36.142306],
                        [-114.616694, 36.130101],
                        [-114.572031, 36.15161],
                        [-114.511721, 36.150956],
                        [-114.502172, 36.128796],
                        [-114.463637, 36.139695],
                        [-114.446605, 36.12597],
                        [-114.405475, 36.147371],
                        [-114.372106, 36.143114],
                        [-114.30843, 36.082443],
                        [-114.315557, 36.059494],
                        [-114.252651, 36.020193],
                        [-114.148191, 36.028013],
                        [-114.114531, 36.095217],
                        [-114.123144, 36.111576],
                        [-114.09987, 36.121654],
                        [-114.068027, 36.180663],
                        [-114.046838, 36.194069],
                        [-114.0506, 37.000396]
                      ]
                    ]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=38\.\d+&long=-116\.\d+&zoom=5\.\d+/)
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [29.6312666109084, 11.02035732582157, 0],
                        [30.18903160266947, 10.23921782354143, 0],
                        [31.22854077295004, 11.10230637746821, 0],
                        [30.71143962083393, 11.73679325255558, 0],
                        [29.6312666109084, 11.02035732582157, 0]
                      ]
                    ]
                  },
                  properties: {}
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=10\.\d+&long=30\.\d+&zoom=7\.\d+/)
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [42.1875, 82.40647],
                        [42.1875, 76.46517],
                        [56.25, 76.46517],
                        [42.1875, 82.40647]
                      ]
                    ]
                  },
                  properties: {},
                  id: 'simple-id'
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=79\.\d+&long=50\.\d+&projection=EPSG%3A3413&zoom=3\.\d+/)
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
            paramCheck: async (request) => {
              const shapefile = await getShapefileFromRequest(request)

              const matches = shapefile === JSON.stringify({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [42.1875, -82.40647],
                        [56.25, -76.46517],
                        [42.1875, -76.46517],
                        [42.1875, -82.40647]
                      ]
                    ]
                  },
                  properties: {},
                  id: 'simple-id'
                }]
              })

              expect(matches).toBe(true)

              return matches
            }
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
        await expect(page).toHaveURL(/search\?sf=1&sfs\[0\]=0&lat=-78\.\d+&long=47\.\d+&projection=EPSG%3A3031&zoom=3\.\d+/)
      })
    })
  })
})
