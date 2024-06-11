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
      accessToken: 'fake.access.token',
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

    nock('https://harmony.uat.earthdata.nasa.gov')
      .get('/jobs/ABCD-1234-EFGH-5678')
      .reply(200, {
        username: 'rabbott',
        status: 'successful',
        message: 'CMR query identified 24 granules, but the request has been limited to process only the first 20 granules.',
        progress: 100,
        createdAt: '2020-09-14T15:39:02.723Z',
        updatedAt: '2020-09-14T15:40:51.164Z',
        links: [
          {
            title: 'Job Status',
            href: 'https://harmony.uat.earthdata.nasa.gov/jobs/ABCD-1234-EFGH-5678',
            rel: 'self',
            type: 'application/json'
          },
          {
            title: 'STAC catalog',
            href: 'https://harmony.uat.earthdata.nasa.gov/stac/ABCD-1234-EFGH-5678/',
            rel: 'stac-catalog-json',
            type: 'application/json'
          },
          {
            href: 'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/1eaff8ce-2bc6-496b-8446-54ea807d55e9/006_00_00feff_global_regridded_subsetted.png',
            title: 'G1233800388-EEDTEST',
            type: 'image/png',
            rel: 'data',
            bbox: [
              -180,
              -90,
              180,
              90
            ],
            temporal: {
              start: '2020-01-06T00:00:00.000Z',
              end: '2020-01-06T01:59:59.000Z'
            }
          }
        ],
        request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800505-EEDTEST%2CG1233800504-EEDTEST%2CG1233800389-EEDTEST%2CG1233800388-EEDTEST&subset=lat(-51.2089%3A56.77791000000001)&subset=lon(19.157529999999984%3A44.47175999999997)&subset=time(%222020-01-06T00%3A42%3A36.408Z%22%3A%222020-01-09T22%3A30%3A21.748Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
        jobID: 'ABCD-1234-EFGH-5678'
      })

    const harmonyResponse = await fetchSwodlrOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(harmonyResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'complete',
      orderType: 'Harmony'
    })
  })

  test('correctly retrieves a known harmony order that has failed', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          order_information: {
            jobID: 'ABCD-1234-EFGH-5678',
            links: [
              {
                rel: 'self',
                href: 'https://harmony.uat.earthdata.nasa.gov/jobs/ABCD-1234-EFGH-5678',
                type: 'application/json',
                title: 'Job Status'
              }
            ],
            status: 'running',
            message: 'CMR query identified 24 granules, but the request has been limited to process only the first 20 granules.',
            request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800505-EEDTEST%2CG1233800504-EEDTEST%2CG1233800389-EEDTEST%2CG1233800388-EEDTEST&subset=lat(-51.2089%3A56.77791000000001)&subset=lon(19.157529999999984%3A44.47175999999997)&subset=time(%222020-01-06T00%3A42%3A36.408Z%22%3A%222020-01-09T22%3A30%3A21.748Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
            progress: 0,
            username: 'rabbott',
            createdAt: '2020-09-14T15:39:02.723Z',
            updatedAt: '2020-09-14T15:39:02.723Z'
          }
        })
      } else {
        query.response([])
      }
    })

    nock('https://harmony.uat.earthdata.nasa.gov')
      .get('/jobs/ABCD-1234-EFGH-5678')
      .reply(200, {
        username: 'rabbott3',
        status: 'failed',
        message: 'Service request failed with an unknown error.',
        progress: 0,
        createdAt: '2020-06-24T15:55:55.023Z',
        updatedAt: '2020-06-24T15:55:55.314Z',
        links: [
          {
            title: 'Job Status',
            href: 'https://harmony.uat.earthdata.nasa.gov/jobs/ABCD-1234-EFGH-5678',
            rel: 'self',
            type: 'application/json'
          }
        ],
        request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800505-EEDTEST%2CG1233800504-EEDTEST%2CG1233800389-EEDTEST%2CG1233800388-EEDTEST&subset=lat(-51.2089%3A56.77791000000001)&subset=lon(19.157529999999984%3A44.47175999999997)&subset=time(%222020-01-06T00%3A42%3A36.408Z%22%3A%222020-01-09T22%3A30%3A21.748Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
        jobID: 'ABCD-1234-EFGH-5678'
      })

    const harmonyResponse = await fetchSwodlrOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(harmonyResponse).toEqual({
      accessToken: 'fake.access.token',
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

    const harmonyResponse = await fetchSwodlrOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'SWODLR'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(harmonyResponse).toEqual({
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
          order_information: {
            jobID: 'ABCD-1234-EFGH-5678',
            links: [
              {
                rel: 'self',
                href: 'https://harmony.uat.earthdata.nasa.gov/jobs/ABCD-1234-EFGH-5678',
                type: 'application/json',
                title: 'Job Status'
              }
            ],
            status: 'running',
            message: 'CMR query identified 24 granules, but the request has been limited to process only the first 20 granules.',
            request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800505-EEDTEST%2CG1233800504-EEDTEST%2CG1233800389-EEDTEST%2CG1233800388-EEDTEST&subset=lat(-51.2089%3A56.77791000000001)&subset=lon(19.157529999999984%3A44.47175999999997)&subset=time(%222020-01-06T00%3A42%3A36.408Z%22%3A%222020-01-09T22%3A30%3A21.748Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
            progress: 0,
            username: 'rabbott',
            createdAt: '2020-09-14T15:39:02.723Z',
            updatedAt: '2020-09-14T15:39:02.723Z'
          }
        })
      } else {
        query.response([])
      }
    })

    nock('https://harmony.uat.earthdata.nasa.gov')
      .get('/jobs/ABCD-1234-EFGH-5678')
      .reply(404, {
        code: 'harmony.RequestValidationError',
        description: 'Error: Invalid format for Job ID \'ABCD-1234-EFGH-5678\'. Job ID must be a UUID.'
      })

    await expect(fetchSwodlrOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'SWODLR'
    })).rejects.toThrow('Error: Invalid format for Job ID \'ABCD-1234-EFGH-5678\'. Job ID must be a UUID.')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })
})
