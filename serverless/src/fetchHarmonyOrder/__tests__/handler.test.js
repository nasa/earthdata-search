import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import * as getDbConnection from '../../util/database/getDbConnection'
import fetchHarmonyOrder from '../handler'

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

describe('fetchHarmonyOrder', () => {
  test('correctly retrieves a known harmony order currently processing', async () => {
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
      })

    const harmonyResponse = await fetchHarmonyOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'Harmony'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(harmonyResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'in_progress',
      orderType: 'Harmony'
    })
  })

  test('correctly retrieves a known harmony order that is complete', async () => {
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

    const harmonyResponse = await fetchHarmonyOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'Harmony'
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

    const harmonyResponse = await fetchHarmonyOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'Harmony'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(harmonyResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'failed',
      orderType: 'Harmony'
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

    const harmonyResponse = await fetchHarmonyOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'Harmony'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(harmonyResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'not_found',
      orderType: 'Harmony'
    })
  })

  test('responds correctly on code error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    // Exclude an error message from the `toThrow` matcher because its
    // a specific sql statement and not necessary
    await expect(fetchHarmonyOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'Harmony'
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

    await expect(fetchHarmonyOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'Harmony'
    })).rejects.toThrow('Error: Invalid format for Job ID \'ABCD-1234-EFGH-5678\'. Job ID must be a UUID.')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })
})
