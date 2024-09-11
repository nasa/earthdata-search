import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import adminGetPreferencesMetrics from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

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
                baseLayer: 'blueMarble',
                longitude: 0,
                projection: 'epsg4326',
                overlayLayers: ['referenceFeatures', 'referenceLabels']
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
                baseLayer: 'blueMarble',
                longitude: 0,
                projection: 'epsg4326',
                overlayLayers: ['referenceFeatures', 'referenceLabels']
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

    console.log(queries)

    expect(queries[0].method).toEqual('select')
    expect(queries[0].sql).toContain('site_preferences')

    const { body, statusCode } = preferencesResponse

    const responseObj = {
      results: {
        preferences: {
          panelState: {
            open: '100% (2)'
          },
          granuleSort: {
            start_date: '50% (1)',
            '-start_date': '50% (1)'
          },
          granuleListView: {
            default: '100% (2)'
          },
          collectionSort: {
            '-score': '100% (2)'
          },
          collectionListView: {
            list: '50% (1)',
            default: '50% (1)'
          },
          zoom: {
            2: '100% (2)'
          },
          latitude: {
            0: '100% (2)'
          },
          longitude: {
            0: '100% (2)'
          },
          projection: {
            epsg4326: '100% (2)'
          },
          overlayLayers: {
            referenceFeatures: '100% (2)',
            referenceLabels: '100% (2)'
          },
          baseLayer: {
            blueMarble: '100% (2)'
          }
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
                baseLayer: 'blueMarble',
                longitude: 0,
                projection: 'epsg4326',
                overlayLayers: ['referenceFeatures', 'referenceLabels']
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
                baseLayer: 'blueMarble',
                longitude: 0,
                projection: 'epsg4326',
                overlayLayers: ['referenceFeatures', 'referenceLabels']
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
          panelState: {
            open: '50% (2)',
            'not set (open)': '50% (2)'
          },
          granuleSort: {
            'not set (-start_date)': '50% (2)',
            start_date: '25% (1)',
            '-start_date': '25% (1)'
          },
          granuleListView: {
            default: '50% (2)',
            'not set (default)': '50% (2)'
          },
          collectionSort: {
            '-score': '50% (2)',
            'not set (-score)': '50% (2)'
          },
          collectionListView: {
            'not set (default)': '50% (2)',
            list: '25% (1)',
            default: '25% (1)'
          },
          zoom: {
            2: '50% (2)',
            'not set (2)': '50% (2)'
          },
          latitude: {
            0: '50% (2)',
            'not set (0)': '50% (2)'
          },
          longitude: {
            0: '50% (2)',
            'not set (0)': '50% (2)'
          },
          projection: {
            epsg4326: '50% (2)',
            'not set (epsg4326)': '50% (2)'
          },
          overlayLayers: {
            referenceFeatures: '50% (2)',
            referenceLabels: '50% (2)',
            'not set (referenceFeatures & referenceLabels)': '50% (2)'
          },
          baseLayer: {
            blueMarble: '50% (2)',
            'not set (blueMarble)': '50% (2)'
          }
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
