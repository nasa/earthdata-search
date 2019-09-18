import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as cmrEnv from '../../../../sharedUtils/cmrEnv'
import fetchLegacyServicesOrder from '../handler'


let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))

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

  nock.disableNetConnect()
})

afterEach(() => {
  dbTracker.uninstall()
  nock.cleanAll()
  nock.enableNetConnect()
})

describe('fetchLegacyServicesOrder', () => {
  test('correctly retrieves a known catalog rest order currently processing', async () => {
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .get('/legacy-services/rest/orders.json?id=ABCD-1234-EFGH-5678')
      .reply(200, [
        {
          order: {
            client_identity: 'kzAY1v0kVjQ7QVpwBw-kLQ',
            created_at: '2019-08-14T12:26:37Z',
            id: 'ABCD-1234-EFGH-5678',
            notification_level: 'INFO',
            order_price: 0,
            owner_id: 'CF8F45-8138-232E-7C36-5D023FEF8',
            provider_orders: [
              {
                reference: {
                  id: 'EDF_DEV06',
                  location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/orders/ABCD-1234-EFGH-5678/provider_orders/EDF_DEV06',
                  name: 'EDF_DEV06'
                }
              }
            ],
            state: 'SUBMITTING',
            submitted_at: '2019-08-14T12:26:42Z',
            updated_at: '2019-08-14T12:27:13Z',
            user_domain: 'OTHER',
            user_region: 'USA'
          }
        }
      ])

    const legacyServicesResponse = await fetchLegacyServicesOrder({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(legacyServicesResponse).toEqual({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderStatus: 'in_progress',
      orderType: 'ECHO ORDERS'
    })
  })

  test('correctly retrieves a known catalog rest order that is complete', async () => {
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .get('/legacy-services/rest/orders.json?id=ABCD-1234-EFGH-5678')
      .reply(200, [
        {
          order: {
            client_identity: 'kzAY1v0kVjQ7QVpwBw-kLQ',
            created_at: '2019-08-14T12:26:37Z',
            id: 'ABCD-1234-EFGH-5678',
            notification_level: 'INFO',
            order_price: 0,
            owner_id: 'CF8F45-8138-232E-7C36-5D023FEF8',
            provider_orders: [
              {
                reference: {
                  id: 'EDF_DEV06',
                  location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/orders/ABCD-1234-EFGH-5678/provider_orders/EDF_DEV06',
                  name: 'EDF_DEV06'
                }
              }
            ],
            state: 'CLOSED',
            submitted_at: '2019-08-14T12:26:42Z',
            updated_at: '2019-08-14T12:27:13Z',
            user_domain: 'OTHER',
            user_region: 'USA'
          }
        }
      ])

    const legacyServicesResponse = await fetchLegacyServicesOrder({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(legacyServicesResponse).toEqual({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderStatus: 'complete',
      orderType: 'ECHO ORDERS'
    })
  })

  test('correctly retrieves a known catalog rest order that has failed', async () => {
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          order_number: 'ABCD-1234-EFGH-5678'
        })
      } else {
        query.response([])
      }
    })

    nock('https://cmr.earthdata.nasa.gov')
      .get('/legacy-services/rest/orders.json?id=ABCD-1234-EFGH-5678')
      .reply(200, [
        {
          order: {
            client_identity: 'kzAY1v0kVjQ7QVpwBw-kLQ',
            created_at: '2019-08-14T12:26:37Z',
            id: 'ABCD-1234-EFGH-5678',
            notification_level: 'INFO',
            order_price: 0,
            owner_id: 'CF8F45-8138-232E-7C36-5D023FEF8',
            provider_orders: [
              {
                reference: {
                  id: 'EDF_DEV06',
                  location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/orders/ABCD-1234-EFGH-5678/provider_orders/EDF_DEV06',
                  name: 'EDF_DEV06'
                }
              }
            ],
            state: 'NOT_VALIDATED',
            submitted_at: '2019-08-14T12:26:42Z',
            updated_at: '2019-08-14T12:27:13Z',
            user_domain: 'OTHER',
            user_region: 'USA'
          }
        }
      ])

    const legacyServicesResponse = await fetchLegacyServicesOrder({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(legacyServicesResponse).toEqual({
      accessToken: 'fake.access.token:clientId',
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

    const legacyServicesResponse = await fetchLegacyServicesOrder({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderType: 'ECHO ORDERS'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(legacyServicesResponse).toEqual({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderStatus: 'not_found',
      orderType: 'ECHO ORDERS'
    })
  })
})
