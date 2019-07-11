import knex from 'knex'
import mockKnex from 'mock-knex'
import AWS from 'aws-sdk'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import submitOrder from '../handler'
import { orderPayload, echoOrderPayload, badOrderPayload } from './mocks'
import * as generateOrderPayloads from '../generateOrderPayloads'

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
      } else if (step === 4) {
        query.response([{
          id: 2,
          access_method: {
            type: 'ECHO ORDERS',
            id: 'S10000001-EDSC',
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          collection_metadata: {},
          granule_count: 27
        }])
      } else if (step === 5) {
        query.response({
          id: 19,
          granule_params: {
            bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          }
        })
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
    process.env.catalogRestQueueUrl = 'http://example.com/echoQueue'

    const retreivalCollectionRecord = {
      id: 2,
      access_method: {
        type: 'ECHO ORDERS',
        id: 'S10000001-EDSC',
        url: 'https://n5eil09e.ecs.edsc.org/egi/request'
      },
      collection_metadata: {},
      granule_count: 27
    }
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
      } else if (step === 4) {
        query.response([retreivalCollectionRecord])
      } else {
        query.response([])
      }
    })

    const generateOrderPayloadsSpy = jest.spyOn(generateOrderPayloads, 'generateOrderPayloads')
      .mockImplementationOnce(() => [{
        page_num: 1,
        page_size: 2000
      }])

    const sqsSendMessagePromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessageBatch: sqsSendMessagePromise
      }))

    const orderResponse = await submitOrder(echoOrderPayload)

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')
    expect(queries[3].method).toEqual('insert')
    expect(queries[4].method).toEqual('insert')
    expect(queries[5].sql).toContain('COMMIT')
    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/echoQueue',
      Entries: [{
        Id: '2-1',
        MessageBody: JSON.stringify({
          url: 'https://n5eil09e.ecs.edsc.org/egi/request'
        })
      }]
    }])

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      environment: 'prod',
      id: 1,
      user_id: 19
    })

    expect(generateOrderPayloadsSpy).toBeCalledTimes(1)
    expect(generateOrderPayloadsSpy).toBeCalledWith(retreivalCollectionRecord)
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
