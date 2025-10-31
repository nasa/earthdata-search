import knex from 'knex'
import mockKnex from 'mock-knex'

import deleteRetrieval from '../handler'
import * as getAuthorizerContext from '../../util/getAuthorizerContext'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.spyOn(getAuthorizerContext, 'getAuthorizerContext').mockImplementation(() => ({ userId: 1 }))
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

describe('deleteRetrieval', () => {
  test('deletes the retrieval when it belongs to the authenticated user', async () => {
    const retrievalId = '2057964173'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(1)
      } else if (step === 2) {
        query.response(2)
      } else {
        query.response(undefined)
      }
    })

    const event = {
      pathParameters: {
        id: retrievalId
      }
    }

    const response = await deleteRetrieval(event, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('update')
    expect(queries[1].method).toEqual('del')

    expect(response.statusCode).toEqual(204)
  })

  test('returns a 404 for the retrieval if it does not belong to the authenticated user', async () => {
    const retrievalId = '7023641925'

    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response(0)
      } else {
        query.response(undefined)
      }
    })

    const event = {
      pathParameters: {
        id: retrievalId
      }
    }

    const response = await deleteRetrieval(event, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('update')
    expect(queries[1].method).toEqual('del')

    expect(response.statusCode).toEqual(404)
  })

  test('returns a 500 when an error occurs', async () => {
    const retrievalId = '7023641925'

    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      pathParameters: {
        id: retrievalId
      }
    }

    const response = await deleteRetrieval(event, {})

    expect(response.statusCode).toEqual(500)
  })
})
