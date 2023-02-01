import knex from 'knex'
import mockKnex from 'mock-knex'
import AWS from 'aws-sdk'
import * as getDbConnection from '../../util/database/getDbConnection'
import requeueOrder from '../handler'

let dbConnectionToMock
let dbTracker

const OLD_ENV = process.env

const sqsSendMessagePromise = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue()
})

AWS.SQS = jest.fn()
  .mockImplementationOnce(() => ({
    sendMessageBatch: sqsSendMessagePromise
  }))

export const orderPayload = {
  body: JSON.stringify({
    params: {
      orderId: 1234
    }
  })
}

beforeEach(() => {
  jest.clearAllMocks()

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

describe('requeueOrder', () => {
  test('correctly requeues an ESI order', async () => {
    process.env.catalogRestQueueUrl = 'http://example.com/echoQueue'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          retrieval_collection_id: 1,
          token: 'mock-token',
          type: 'ESI'
        }])
      } else {
        query.response([])
      }
    })

    const orderResponse = await requeueOrder(orderPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toContain('select')

    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/echoQueue',
      Entries: [{
        Id: '1',
        MessageBody: JSON.stringify({
          accessToken: 'mock-token',
          id: 1234
        })
      }]
    }])

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      orderId: 1234
    })
  })

  test('correctly requeues an ECHO ORDERS order', async () => {
    process.env.legacyServicesQueueUrl = 'http://example.com/echoQueue'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          retrieval_collection_id: 1,
          token: 'mock-token',
          type: 'ECHO ORDERS'
        }])
      } else {
        query.response([])
      }
    })

    const orderResponse = await requeueOrder(orderPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toContain('select')

    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/echoQueue',
      Entries: [{
        Id: '1',
        MessageBody: JSON.stringify({
          accessToken: 'mock-token',
          id: 1234
        })
      }]
    }])

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      orderId: 1234
    })
  })

  test('correctly requeues a Harmony order', async () => {
    process.env.harmonyQueueUrl = 'http://example.com/echoQueue'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          retrieval_collection_id: 1,
          token: 'mock-token',
          type: 'Harmony'
        }])
      } else {
        query.response([])
      }
    })

    const orderResponse = await requeueOrder(orderPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toContain('select')

    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/echoQueue',
      Entries: [{
        Id: '1',
        MessageBody: JSON.stringify({
          accessToken: 'mock-token',
          id: 1234
        })
      }]
    }])

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      orderId: 1234
    })
  })
})
