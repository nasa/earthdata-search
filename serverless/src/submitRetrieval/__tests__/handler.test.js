import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import submitRetrieval from '../handler'
import {
  orderPayload,
  echoOrderPayload,
  badOrderPayload
} from './mocks'
import * as generateRetrievalPayloads from '../generateRetrievalPayloads'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'

let dbConnectionToMock
let dbTracker

const OLD_ENV = process.env

const mockSend = jest.fn().mockResolvedValue({})

jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn().mockImplementation(() => ({
    send: mockSend
  })),
  SendMessageBatchCommand: jest.fn().mockImplementation((params) => params)
}))

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({
    access_token: '2e8e995e7511c2c6620336797b',
    user_id: 1
  }))

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
  process.env.orderDelaySeconds = 30
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  dbTracker.uninstall()

  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('submitRetrieval', () => {
  test('correctly submits an order', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response([{
          id: 1,
          user_id: 19,
          environment: 'prod'
        }])
      } else if (step === 3) {
        query.response([{
          id: 2,
          access_method: {
            type: 'ECHO ORDERS',
            id: 'S10000001-EDSC',
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          collection_metadata: {},
          granule_count: 27,
          granule_link_count: 17
        }])
      } else if (step === 4) {
        query.response({
          id: 19,
          granule_params: {
            echo_collection_id: 'C10000005-EDSC',
            bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          }
        })
      } else {
        query.response([])
      }
    })

    const orderResponse = await submitRetrieval(orderPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('insert')
    expect(queries[2].method).toEqual('insert')
    // Granule_params should be snaked cased before inserting into db
    expect(queries[2].bindings[4]).toEqual(JSON.stringify({
      echo_collection_id: 'C10000005-EDSC',
      bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
    }))

    // Retrieve saved access configuration
    expect(queries[3].method).toEqual('select')
    // Add new access configuration
    expect(queries[4].method).toEqual('insert')
    expect(queries[5].sql).toContain('COMMIT')

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      environment: 'prod',
      id: '4517239960',
      user_id: 19
    })
  })

  test('correctly submits an order and queues order messages', async () => {
    process.env.catalogRestQueueUrl = 'http://example.com/echoQueue'

    const retrievalCollectionRecord = {
      id: 2,
      access_method: {
        type: 'ESI',
        id: 'S10000001-EDSC',
        url: 'https://n5eil09e.ecs.edsc.org/egi/request'
      },
      collection_metadata: {},
      granule_count: 27,
      granule_link_count: 17
    }
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response([{
          id: 1,
          user_id: 19,
          environment: 'prod'
        }])
      } else if (step === 3) {
        query.response([retrievalCollectionRecord])
      } else if (step === 6) {
        query.response([{
          id: 5
        }])
      } else if (step === 7) {
        query.response([{
          id: 6
        }])
      } else if (step === 8) {
        query.response([{
          id: 7
        }])
      } else {
        query.response([])
      }
    })

    const generateRetrievalPayloadsSpy = jest.spyOn(generateRetrievalPayloads, 'generateRetrievalPayloads')
      .mockImplementationOnce(() => [{
        page_num: 1,
        page_size: 2000
      }, {
        page_num: 2,
        page_size: 2000
      }, {
        page_num: 3,
        page_size: 2000
      }])

    const orderResponse = await submitRetrieval(echoOrderPayload, {})

    const { queries } = dbTracker.queries
    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('insert')
    expect(queries[2].method).toEqual('insert')
    // Granule_params should be snaked cased before inserting into db
    expect(queries[2].bindings[4]).toEqual(JSON.stringify({
      echo_collection_id: 'C10000005-EDSC',
      bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
    }))

    // Retrieve saved access configuration
    expect(queries[3].method).toEqual('select')
    // Add new access configuration
    expect(queries[4].method).toEqual('insert')
    expect(queries[5].method).toEqual('insert')
    expect(queries[6].method).toEqual('insert')
    expect(queries[7].method).toEqual('insert')
    expect(queries[8].sql).toContain('COMMIT')
    expect(mockSend.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/echoQueue',
      Entries: [{
        DelaySeconds: 3,
        Id: '2-1',
        MessageBody: JSON.stringify({
          accessToken: '2e8e995e7511c2c6620336797b',
          id: 5
        })
      }, {
        DelaySeconds: 33,
        Id: '2-2',
        MessageBody: JSON.stringify({
          accessToken: '2e8e995e7511c2c6620336797b',
          id: 6
        })
      }, {
        DelaySeconds: 63,
        Id: '2-3',
        MessageBody: JSON.stringify({
          accessToken: '2e8e995e7511c2c6620336797b',
          id: 7
        })
      }]
    }])

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      environment: 'prod',
      id: '4517239960',
      user_id: 19
    })

    expect(generateRetrievalPayloadsSpy).toBeCalledTimes(1)
    expect(generateRetrievalPayloadsSpy).toBeCalledWith(retrievalCollectionRecord, {
      id: 'S10000001-EDSC',
      type: 'ESI',
      url: 'https://n5eil09e.ecs.edsc.org/egi/request'
    })
  })

  test('correctly rolls back the transaction on failure', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        // Force a failure to ensure ROLLBACK is working
        query.reject('INSERT failed')
      } else {
        query.response([])
      }
    })

    const response = await submitRetrieval(badOrderPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('insert')
    expect(queries[2].sql).toContain('ROLLBACK')

    expect(response.statusCode).toEqual(500)
  })
})
