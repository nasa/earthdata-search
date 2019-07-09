import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import submitOrder from '../handler'
import { orderPayload, echoOrderPayload, badOrderPayload } from './mocks'
import * as queueOrders from '../queueOrders'

let dbConnectionToMock
let dbTracker

const OLD_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
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

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  dbTracker.uninstall()

  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('submitOrder', () => {
  test('correctly submits an order', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response({
          id: 19
        })
      } else if (step === 3) {
        query.response([{
          id: 1,
          user_id: 19,
          environment: 'prod'
        }])
      } else {
        query.response([])
      }
    })

    const orderResponse = await submitOrder(orderPayload)

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')
    expect(queries[3].method).toEqual('insert')
    expect(queries[4].sql).toContain('COMMIT')

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      environment: 'prod',
      id: 1,
      user_id: 19
    })
  })

  test('correctly submits an order and queues order messages', async () => {
    process.env.catalogRestQueueUrl = 'http://example.com/queue'

    const retreivalCollectionRecord = {
      access_method: {
        type: 'echo_orders',
        id: 'S10000001-EDSC',
        url: 'https://n5eil09e.ecs.edsc.org/egi/request'
      },
      collection_metadata: {},
      granule_count: 27
    }
    dbTracker.on('query', (query, step) => {
      console.log(query)
      if (step === 2) {
        query.response({
          id: 19
        })
      } else if (step === 3) {
        query.response([{
          id: 1,
          user_id: 19,
          environment: 'prod'
        }])
      } else if (step === 4) {
        query.response([retreivalCollectionRecord])
      } else {
        query.response([])
      }
    })

    const queueOrdersSpy = jest.spyOn(queueOrders, 'queueOrders')
      .mockImplementationOnce(() => jest.fn())

    const orderResponse = await submitOrder(echoOrderPayload)

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')
    expect(queries[3].method).toEqual('insert')
    expect(queries[4].sql).toContain('COMMIT')

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      environment: 'prod',
      id: 1,
      user_id: 19
    })

    expect(queueOrdersSpy).toBeCalledTimes(1)
    expect(queueOrdersSpy).toBeCalledWith(
      'http://example.com/queue',
      dbConnectionToMock,
      retreivalCollectionRecord
    )
  })

  test('correctly rolls back the transaction on failure', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response({
          id: 19
        })
      } else if (step === 3) {
        // Force a failure to ensure ROLLBACK is working
        query.reject('INSERT failed')
      } else {
        query.response([])
      }
    })

    const orderResponse = await submitOrder(badOrderPayload)

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')
    expect(queries[3].sql).toContain('ROLLBACK')

    const { statusCode } = orderResponse

    expect(statusCode).toEqual(500)
  })
})
