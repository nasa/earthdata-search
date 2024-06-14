import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import * as getDbConnection from '../../util/database/getDbConnection'
import fetchSwodlrOrder from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementation(() => {
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

describe('fetchSwodlrOrder', () => {
  test('correctly retrieves a known swodlr order currently processing', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 1,
          order_number: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
          state: 'creating',
          access_method: {
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR',
            swodlrData: {
              params: {
                rasterResolution: '200',
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: true
              },
              custom_params: {
                'G3083334059-POCLOUD': {
                  utmZoneAdjust: 0,
                  mgrsBandAdjust: 0
                }
              }
            }
          },
          order_information: {
            jobId: 'ABCD-1234-EFGH-5678',
            status: 'creating',
            reason: null,
            product_id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100'
          }
        })
      } else {
        query.response([])
      }
    })

    console.log('api stuff')

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(200, {
        data: {
          status: [
            {
              id: '79b4d596-9fa0-4da7-b0a3-810337f59a5d',
              timestamp: '2024-06-11T18:22:51.444',
              state: 'GENERATING',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            },
            {
              id: '2d910c1c-ffcd-438b-ab5b-af4833e39aee',
              timestamp: '2024-06-11T18:07:20.990384',
              state: 'NEW',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            }
          ]
        }
      })

    const swodlrResponse = await fetchSwodlrOrder({
      accessToken: 'access-token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(swodlrResponse).toEqual({
      accessToken: 'access-token',
      id: 1,
      orderStatus: 'in_progress',
      orderType: 'SWODLR'
    })
  })

  test('correctly retrieves a known SWODLR order that is complete', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 1,
          order_number: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
          state: 'in_progress',
          access_method: {
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR',
            swodlrData: {
              params: {
                rasterResolution: '200',
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: true
              },
              custom_params: {
                'G3083334059-POCLOUD': {
                  utmZoneAdjust: 0,
                  mgrsBandAdjust: 0
                }
              }
            }
          },
          order_information: {
            jobId: 'ABCD-1234-EFGH-5678',
            status: 'in_progress',
            reason: null,
            product_id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100'
          }
        })
      } else {
        query.response([])
      }
    })

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(200, {
        data: {
          status: [
            {
              id: '69b4d596-9fa0-4da7-b0a3-810337f59a5d',
              timestamp: '2024-06-11T20:22:51.444',
              state: 'READY',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: [
                  {
                    id: '2432caac-f465-4d8f-88ba-5f2107e44a98',
                    timestamp: '2024-06-12T02:10:19.491',
                    uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-uat-swodlr-protected/L2_HR_Raster/c1aa3f80-6a30-487a-85d7-15b9a72dcef1/1713474613/SWOT_L2_HR_Raster_6arcsec_GEO_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_DGC0_01.nc'
                  }
                ]
              }
            },
            {
              id: '79b4d596-9fa0-4da7-b0a3-810337f59a5d',
              timestamp: '2024-06-11T18:22:51.444',
              state: 'GENERATING',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            },
            {
              id: '2d910c1c-ffcd-438b-ab5b-af4833e39aee',
              timestamp: '2024-06-11T18:07:20.990384',
              state: 'NEW',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            }
          ]
        }
      })

    const swoldrResponse = await fetchSwodlrOrder({
      accessToken: 'access-token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(swoldrResponse).toEqual({
      accessToken: 'access-token',
      id: 1,
      orderStatus: 'complete',
      orderType: 'SWODLR'
    })
  })

  test('correctly retrieves a known SWODLR order that has failed', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 1,
          order_number: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
          state: 'in_progress',
          access_method: {
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR',
            swodlrData: {
              params: {
                rasterResolution: '200',
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: true
              },
              custom_params: {
                'G3083334059-POCLOUD': {
                  utmZoneAdjust: 0,
                  mgrsBandAdjust: 0
                }
              }
            }
          },
          order_information: {
            jobId: 'ABCD-1234-EFGH-5678',
            status: 'in_progress',
            reason: null,
            product_id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100'
          }
        })
      } else {
        query.response([])
      }
    })

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(200, {
        data: {
          status: [
            {
              id: '69b4d596-9fa0-4da7-b0a3-810337f59a5d',
              timestamp: '2024-06-11T20:22:51.444',
              state: 'FAILED',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            },
            {
              id: '79b4d596-9fa0-4da7-b0a3-810337f59a5d',
              timestamp: '2024-06-11T18:22:51.444',
              state: 'GENERATING',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            },
            {
              id: '2d910c1c-ffcd-438b-ab5b-af4833e39aee',
              timestamp: '2024-06-11T18:07:20.990384',
              state: 'NEW',
              reason: null,
              product: {
                id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
                timestamp: '2024-06-11T18:07:20.990375',
                granules: []
              }
            }
          ]
        }
      })

    const swodlrResponse = await fetchSwodlrOrder({
      accessToken: 'access-token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(swodlrResponse).toEqual({
      accessToken: 'access-token',
      id: 1,
      orderStatus: 'failed',
      orderType: 'SWODLR'
    })
  })

  test('correctly returns when the order cannot be found', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(null)
      } else {
        query.response([])
      }
    })

    const swodlrResponse = await fetchSwodlrOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(swodlrResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'not_found',
      orderType: 'SWODLR'
    })
  })

  test('responds correctly on code error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    // Exclude an error message from the `toThrow` matcher because its
    // a specific sql statement and not necessary
    await expect(fetchSwodlrOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'SWODLR'
    })).rejects.toThrow()

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })

  test('responds correctly on http error', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 1,
          order_number: 'f5f23d9f-ca85-4c89-a7d5-811817afc100',
          state: 'in_progress',
          access_method: {
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR',
            swodlrData: {
              params: {
                rasterResolution: '200',
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: true
              },
              custom_params: {
                'G3083334059-POCLOUD': {
                  utmZoneAdjust: 0,
                  mgrsBandAdjust: 0
                }
              }
            }
          },
          order_information: {
            jobId: 'ABCD-1234-EFGH-5678',
            status: 'in_progress',
            reason: null,
            product_id: 'f5f23d9f-ca85-4c89-a7d5-811817afc100'
          }
        })
      } else {
        query.response([])
      }
    })

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(404, {
        code: 'SWODLR.RequestValidationError',
        description: 'Error: Invalid format for Job ID \'ABCD-1234-EFGH-5678\'. Job ID must be a UUID.'
      })

    await expect(fetchSwodlrOrder({
      accessToken: 'access-token',
      id: 1,
      orderType: 'SWODLR'
    })).rejects.toThrow('Error: Invalid format for Job ID \'ABCD-1234-EFGH-5678\'. Job ID must be a UUID.')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })
})
