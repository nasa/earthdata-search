import knex from 'knex'
import mockKnex from 'mock-knex'

import getSavedAccessConfigs from '../handler'
import * as getAuthorizerContext from '../../util/getAuthorizerContext'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  vi.spyOn(getAuthorizerContext, 'getAuthorizerContext').mockImplementation(() => ({ userId: 1 }))

  vi.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    dbConnectionToMock = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbConnectionToMock)

    return dbConnectionToMock
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('getSavedAccessConfigs', () => {
  test('does not return configuration if none exist', async () => {
    const consoleMock = vi.spyOn(console, 'log')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([])
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionIds: ['collectionId']
        }
      })
    }

    const result = await getSavedAccessConfigs(event, {})
    expect(consoleMock).toHaveBeenCalledTimes(0)

    expect(result).toEqual({
      body: JSON.stringify({}),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('returns an error', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          collection_id: 'collectionId',
          access_method: {
            mbr: {
              neLat: 31.08850198924431,
              neLng: -94.19999999999999,
              swLat: 28.275300000000215,
              swLng: -99.50000000000001
            },
            url: 'https://harmony.earthdata.nasa.gov',
            type: 'Harmony',
            selectedOutputFormat: 'application/netcdf',
            supportsConcatenation: true,
            enableSpatialSubsetting: true,
            enableTemporalSubsetting: true,
            enableConcatenateDownload: true,
            supportsShapefileSubsetting: true,
            supportsBoundingBoxSubsetting: true
          }
        }])
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId'
        }
      })
    }

    const result = await getSavedAccessConfigs(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        statusCode: 500,
        errors: ['Error: Undefined binding(s) detected when compiling SELECT. Undefined column(s): [collection_id] query: select "collection_id", "access_method" from "access_configurations" where "user_id" = ? and "collection_id" in ?']
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 500
    })
  })
})
