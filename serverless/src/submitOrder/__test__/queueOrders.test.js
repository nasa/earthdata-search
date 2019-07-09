import AWS from 'aws-sdk'
import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'

import { queueOrders } from '../queueOrders'

let dbConnectionToMock
let dbTracker

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
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('generateSubsettingTags', () => {
  test('submits the correct data to sqs', async () => {
    dbTracker.on('query', (query, step) => {
      console.log(query)
      if (step === 1) {
        query.response({
          id: 19,
          granule_params: {
            bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          }
        })
      }
    })

    const sqsSendMessagePromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessageBatch: sqsSendMessagePromise
      }))

    await queueOrders(
      'http://example.com/queue',
      null,
      {
        id: 'C10000001-EDSC',
        access_method: {
          type: 'echo_orders',
          id: 'S10000001-EDSC',
          url: 'https://n5eil09e.ecs.edsc.org/egi/request'
        },
        collection_metadata: {

        },
        granule_count: 25,
        granule_params: {
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
        }
      }
    )

    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      Entries: [{
        MessageBody: JSON.stringify({
          id: 19,
          granule_params: {
            bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          },
          orderEndpoint: 'https://n5eil09e.ecs.edsc.org/egi/request'
        })
      }],
      QueueUrl: 'http://example.com/queue'
    }])
  })
})
