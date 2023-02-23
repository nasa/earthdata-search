import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getSystemToken from '../../util/urs/getSystemToken'

import fetchCmrOrderingOrder from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))

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

describe('fetchCmrOrderingOrder', () => {
  test('correctly retrieves a known cmr-ordering order currently processing', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          environment: 'prod',
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .post('/ordering/api')
      .reply(200, {
        data: {
          order: {
            id: 'ABCD-1234-EFGH-5678',
            state: 'SUBMITTING',
            collectionConceptId: 'C1000000085-EDF_DEV06',
            providerId: 'EDF_DEV06',
            providerTrackingId: null,
            notificationLevel: 'INFO',
            createdAt: '2019-08-14T12:26:37Z',
            updatedAt: '2019-08-14T12:27:13Z',
            submittedAt: null,
            closedDate: null
          }
        }
      })

    const cmrOrderingResponse = await fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(cmrOrderingResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'in_progress',
      orderType: 'ECHO ORDERS'
    })
  })

  test('correctly retrieves a known cmr-ordering order that is complete', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          environment: 'prod',
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .post('/ordering/api')
      .reply(200, {
        data: {
          order: {
            id: 'ABCD-1234-EFGH-5678',
            state: 'CLOSED',
            collectionConceptId: 'C1000000085-EDF_DEV06',
            providerId: 'EDF_DEV06',
            providerTrackingId: null,
            notificationLevel: 'INFO',
            createdAt: '2019-08-14T12:26:37Z',
            updatedAt: '2019-08-14T12:27:13Z',
            submittedAt: '2019-08-14T12:28:13Z',
            closedDate: '2019-08-14T12:29:13Z'
          }
        }
      })

    const cmrOrderingResponse = await fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(cmrOrderingResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'complete',
      orderType: 'ECHO ORDERS'
    })
  })

  test('correctly retrieves a known cmr-ordering order that has failed', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          environment: 'prod',
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .post('/ordering/api')
      .reply(200, {
        data: {
          order: {
            id: '81da2666-0f93-4adb-bc58-c2bd1be76888',
            state: 'SUBMIT_FAILED',
            collectionConceptId: 'C1000000085-EDF_DEV06',
            providerId: 'EDF_DEV06',
            providerTrackingId: null,
            notificationLevel: 'INFO',
            createdAt: '2023-02-23T18:11:28.472Z',
            updatedAt: '2023-02-23T18:11:30.721Z',
            submittedAt: null,
            closedDate: null
          }
        }
      })

    const cmrOrderingResponse = await fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(cmrOrderingResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'failed',
      orderType: 'ECHO ORDERS'
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

    const cmrOrderingResponse = await fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(cmrOrderingResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'not_found',
      orderType: 'ECHO ORDERS'
    })
  })

  test('responds correctly on code error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    // Exclude an error message from the `toThrow` matcher because its
    // a specific sql statement and not necessary
    await expect(fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })).rejects.toThrow()

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })

  test('responds correctly on http error', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          environment: 'prod',
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .post('/ordering/api')
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    await expect(fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })).rejects.toThrow('Test error message')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })

  test('responds correctly on cmr-ordering error', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          environment: 'prod',
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .post('/ordering/api')
      .reply(200, {
        errors: [
          'Test error message'
        ]
      })

    await expect(fetchCmrOrderingOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ECHO ORDERS'
    })).rejects.toThrow('Test error message')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })
})
