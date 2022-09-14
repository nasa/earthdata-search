import knex from 'knex'
import mockKnex from 'mock-knex'

import adminGetProject from '../handler'
import * as getDbConnection from '../../util/database/getDbConnection'

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

describe('adminGetProject', () => {
  test('returns the project name and path', async () => {
    const projectId = 123
    const name = 'Test project'
    const path = '/search?p=C123456-EDSC'
    const username = 'testUser'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          name,
          path,
          username
        })
      } else {
        query.response(undefined)
      }
    })

    const event = {
      pathParameters: {
        id: projectId
      }
    }

    const result = await adminGetProject(event, {})

    const expectedBody = JSON.stringify({
      name,
      path,
      username,
      obfuscated_id: 123
    })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
  })

  test('returns a 404 if the project is not found', async () => {
    const projectId = 123

    dbTracker.on('query', (query) => {
      query.response(undefined)
    })

    const event = {
      pathParameters: {
        id: projectId
      }
    }

    const result = await adminGetProject(event, {})

    const expectedBody = JSON.stringify({ errors: ['Project \'123\' not found.'] })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
    expect(result.statusCode).toBe(404)
  })

  test('responds correctly on error', async () => {
    const projectId = 123

    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      pathParameters: {
        id: projectId
      }
    }

    const response = await adminGetProject(event, {})

    expect(response.statusCode).toEqual(500)
  })
})
