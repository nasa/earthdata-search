import knex from 'knex'
import mockKnex from 'mock-knex'

import logout from '../handler'
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

describe('logout', () => {
  test('deletes the user token and returns a 204', async () => {
    dbTracker.on('query', (query) => {
      query.response(1)
    })

    const result = await logout({}, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('del')

    expect(result.body).toBeNull()
    expect(result.statusCode).toBe(204)
  })

  test('returns a 404 if nothing was deleted', async () => {
    dbTracker.on('query', (query) => {
      query.response(0)
    })

    const result = await logout({}, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('del')

    expect(result.body).toEqual(JSON.stringify({ errors: ['User token for user \'1\' not found.'] }))
    expect(result.statusCode).toBe(404)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const result = await logout({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('del')

    expect(result.statusCode).toEqual(500)
  })
})
