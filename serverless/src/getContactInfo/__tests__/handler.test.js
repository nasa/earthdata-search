import knex from 'knex'
import mockKnex from 'mock-knex'

import getContactInfo from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: '1' }))

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

describe('getContactInfo', () => {
  test('returns the user\'s contact info', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            echo_preferences: { mock: 'echo' },
            urs_profile: { mock: 'urs' }
          }
        ])
      } else {
        query.response(undefined)
      }
    })

    const result = await getContactInfo({}, {})

    const expectedBody = JSON.stringify({
      echo_preferences: { mock: 'echo' },
      urs_profile: { mock: 'urs' }
    })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
  })

  test('responds correctly on error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await getContactInfo({}, {})

    expect(response.statusCode).toEqual(500)
  })
})
