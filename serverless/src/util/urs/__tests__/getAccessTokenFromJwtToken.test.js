import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnection from '../../database/getDbConnection'
import * as getEdlConfig from '../../getEdlConfig'
import * as getVerifiedJwtToken from '../../getVerifiedJwtToken'

import { getAccessTokenFromJwtToken } from '../getAccessTokenFromJwtToken'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    const dbCon = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    return dbCon
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('getAccessTokenFromJwtToken', () => {
  describe('when the authenticated user does not have any access tokens', () => {
    test('returns an empty array', async () => {
      jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

      dbTracker.on('query', (query) => {
        query.response(null)
      })

      const response = await getAccessTokenFromJwtToken('jwtToken')

      expect(response).toEqual(null)

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
    })
  })

  describe('when the authenticated user has access tokens', () => {
    test('returns an the most recently created token', async () => {
      jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

      dbTracker.on('query', (query) => {
        query.response({
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_at: '2020-08-12 16:20:42.480688',
          user_id: 1
        })
      })

      const response = await getAccessTokenFromJwtToken('jwtToken')

      expect(response).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_at: '2020-08-12 16:20:42.480688',
        user_id: 1
      })

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
    })
  })
})
