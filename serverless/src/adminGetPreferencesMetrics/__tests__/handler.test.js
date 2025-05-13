import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import adminGetPreferencesMetrics from '../handler'
import mapLayers from '../../../../static/src/js/constants/mapLayers'
import projectionCodes from '../../../../static/src/js/constants/projectionCodes'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    const dbCon = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    return dbCon
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('adminGetPreferencesMetrics', () => {
  test('correctly retrieves preferencesMetrics', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 0,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [
                  mapLayers.bordersRoads,
                  mapLayers.placeLabels
                ]
              },
              panelState: 'open',
              granuleSort: 'start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'list'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 0,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          }
        ])
      }
    })

    const preferencesResponse = await adminGetPreferencesMetrics({
      queryStringParameters: null
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')
    expect(queries[0].sql).toContain('site_preferences')

    const { body, statusCode } = preferencesResponse

    const responseObj = {
      results: {
        preferences: {
          panelState: [
            ['open', '100% (2)']
          ],
          granuleSort: [
            ['start_date', '50.0% (1)'],
            ['-start_date', '50.0% (1)']
          ],
          granuleListView: [
            ['default', '100% (2)']
          ],
          collectionSort: [
            ['-score', '100% (2)']
          ],
          collectionListView: [
            ['list', '50.0% (1)'],
            ['default', '50.0% (1)']
          ],
          zoom: [
            ['2', '100% (2)']
          ],
          latitude: [
            ['0', '100% (2)']
          ],
          longitude: [
            ['0', '100% (2)']
          ],
          projection: [
            [projectionCodes.geographic, '100% (2)']
          ],
          overlayLayers: [
            [mapLayers.bordersRoads, '100% (2)'],
            [mapLayers.placeLabels, '100% (2)']
          ],
          baseLayer: [
            [mapLayers.worldImagery, '100% (2)']
          ]
        }
      }
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves preferences metrics that include null site_preferences', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 0,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: 'start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'list'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 0,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          },
          {
            site_preferences: {}
          },
          {
            site_preferences: {}
          }
        ])
      }
    })

    const retrievalResponse = await adminGetPreferencesMetrics({
      queryStringParameters: null
    }, {})

    const { queries } = dbTracker.queries

    // Ensure only 1 sql call is made
    expect(queries.length === 1)
    // Ensure sql call is correct.
    expect(queries[0].sql).toEqual('select "users"."site_preferences" from "users" where "users"."environment" = $1')
    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      results: {
        preferences: {
          panelState: [
            ['open', '50.0% (2)'],
            ['not set (open)', '50.0% (2)']
          ],
          granuleSort: [
            ['not set (-start_date)', '50.0% (2)'],
            ['start_date', '25.0% (1)'],
            ['-start_date', '25.0% (1)']
          ],
          granuleListView: [
            ['default', '50.0% (2)'],
            ['not set (default)', '50.0% (2)']
          ],
          collectionSort: [
            ['-score', '50.0% (2)'],
            ['not set (-score)', '50.0% (2)']
          ],
          collectionListView: [
            ['not set (default)', '50.0% (2)'],
            ['list', '25.0% (1)'],
            ['default', '25.0% (1)']
          ],
          zoom: [
            ['2', '50.0% (2)'],
            ['not set (3)', '50.0% (2)']
          ],
          latitude: [
            ['0', '50.0% (2)'],
            ['not set (0)', '50.0% (2)']
          ],
          longitude: [
            ['0', '50.0% (2)'],
            ['not set (0)', '50.0% (2)']
          ],
          projection: [
            [projectionCodes.geographic, '50.0% (2)'],
            [`not set (${projectionCodes.geographic})`, '50.0% (2)']
          ],
          overlayLayers: [
            [mapLayers.bordersRoads, '50.0% (2)'],
            [mapLayers.placeLabels, '50.0% (2)'],
            [`not set (${mapLayers.bordersRoads} & ${mapLayers.placeLabels})`, '50.0% (2)']
          ],
          baseLayer: [
            [mapLayers.worldImagery, '50.0% (2)'],
            [`not set (${mapLayers.worldImagery})`, '50.0% (2)']
          ]
        }
      }
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves only top 5 preferences metrics when there is more than 5 options', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 0,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: 'start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'list'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 1,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 2,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 3,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 4,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          },
          {
            site_preferences: {
              mapView: {
                zoom: 2,
                latitude: 5,
                baseLayer: mapLayers.worldImagery,
                longitude: 0,
                projection: projectionCodes.geographic,
                overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
              },
              panelState: 'open',
              granuleSort: '-start_date',
              collectionSort: '-score',
              granuleListView: 'default',
              collectionListView: 'default'
            }
          },
          {
            site_preferences: {}
          },
          {
            site_preferences: {}
          }
        ])
      }
    })

    const retrievalResponse = await adminGetPreferencesMetrics({
      queryStringParameters: null
    }, {})

    const { queries } = dbTracker.queries

    // Ensure only 1 sql call is made
    expect(queries.length === 1)
    // Ensure sql call is correct.
    expect(queries[0].sql).toEqual('select "users"."site_preferences" from "users" where "users"."environment" = $1')
    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      results: {
        preferences: {
          panelState: [
            ['open', '75.0% (6)'],
            ['not set (open)', '25.0% (2)']
          ],
          granuleSort: [
            ['-start_date', '62.5% (5)'],
            ['not set (-start_date)', '25.0% (2)'],
            ['start_date', '12.5% (1)']
          ],
          granuleListView: [
            ['default', '75.0% (6)'],
            ['not set (default)', '25.0% (2)']
          ],
          collectionSort: [
            ['-score', '75.0% (6)'],
            ['not set (-score)', '25.0% (2)']
          ],
          collectionListView: [
            ['default', '62.5% (5)'],
            ['not set (default)', '25.0% (2)'],
            ['list', '12.5% (1)']
          ],
          zoom: [
            ['2', '75.0% (6)'],
            ['not set (3)', '25.0% (2)']
          ],
          latitude: [
            ['not set (0)', '25.0% (2)'],
            ['0', '12.5% (1)'],
            ['1', '12.5% (1)'],
            ['2', '12.5% (1)'],
            ['3', '12.5% (1)'],
            ['4', '12.5% (1)']
          ],
          longitude: [
            ['0', '75.0% (6)'],
            ['not set (0)', '25.0% (2)']
          ],
          projection: [
            [projectionCodes.geographic, '75.0% (6)'],
            [`not set (${projectionCodes.geographic})`, '25.0% (2)']
          ],
          overlayLayers: [
            [mapLayers.bordersRoads, '75.0% (6)'],
            [mapLayers.placeLabels, '75.0% (6)'],
            [`not set (${mapLayers.bordersRoads} & ${mapLayers.placeLabels})`, '25.0% (2)']
          ],
          baseLayer: [
            [mapLayers.worldImagery, '75.0% (6)'],
            [`not set (${mapLayers.worldImagery})`, '25.0% (2)']
          ]
        }
      }
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const retrievalResponse = await adminGetPreferencesMetrics({}, {})

    const { queries } = dbTracker.queries

    // If the first query fails exit
    expect(queries[0].method).toEqual('select')

    const { statusCode } = retrievalResponse

    expect(statusCode).toEqual(500)
  })
})
