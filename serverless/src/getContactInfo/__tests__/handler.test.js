import knex from 'knex'
import mockKnex from 'mock-knex'

import getContactInfo from '../handler'
import * as getCmrPreferencesData from '../getCmrPreferencesData'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: '1' }))
  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))

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
            urs_id: { mock: 'ursId' },
            urs_profile: { mock: 'urs' }
          }
        ])
      } else {
        query.response(undefined)
      }
    })

    jest.spyOn(getCmrPreferencesData, 'getCmrPreferencesData').mockResolvedValue({
      data: {
        data: {
          user: {
            mock: 'cmr'
          }
        }
      },
      status: 200
    })

    const result = await getContactInfo({}, {})
    const expectedBody = JSON.stringify({
      urs_profile: { mock: 'urs' },
      cmr_preferences: { mock: 'cmr' }
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
