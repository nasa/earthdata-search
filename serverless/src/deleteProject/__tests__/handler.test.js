import knex from 'knex'
import mockKnex from 'mock-knex'

import deleteProject from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))
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

describe('deleteProject', () => {
  test('deletes the project and returns a 204', async () => {
    const projectId = '7023641925'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(1)
      }
    })

    const event = {
      pathParameters: {
        id: projectId
      }
    }

    const result = await deleteProject(event, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('del')

    expect(result.body).toBeNull()
    expect(result.statusCode).toBe(204)
  })

  test('returns a 404 if nothing was deleted', async () => {
    const projectId = '7023641925'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(0)
      }
    })

    const event = {
      pathParameters: {
        id: projectId
      }
    }

    const result = await deleteProject(event, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('del')

    expect(result.body).toEqual(JSON.stringify({ errors: ['Project \'7023641925\' not found.'] }))
    expect(result.statusCode).toBe(404)
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

    const response = await deleteProject(event, {})

    expect(response.statusCode).toEqual(500)
  })
})
