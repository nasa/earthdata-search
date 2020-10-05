import knex from 'knex'
import mockKnex from 'mock-knex'
import simpleOAuth2 from 'simple-oauth2'

import * as getDbConnection from '../../database/getDbConnection'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getEdlConfig from '../../getEdlConfig'

import { validateToken } from '../validateToken'

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

describe('validateToken', () => {
  describe('when the provided token is invalid', () => {
    test('returns the username associated with the token', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      jest.spyOn(simpleOAuth2, 'create').mockImplementation(() => ({
        accessToken: {
          create: jest.fn().mockImplementation(() => ({
            token: {
              access_token: 'accessToken',
              token_type: 'Bearer',
              expires_in: 3600,
              refresh_token: 'refreshToken',
              endpoint: '/api/users/testuser',
              expires_at: '2019-09-10T20:00:23.313Z'
            },
            expired: jest.fn(() => false)
          }))
        },
        ownerPassword: { getToken: jest.fn() },
        authorizationCode: {
          authorizeURL: jest.fn(),
          getToken: jest.fn().mockImplementation(() => Promise.resolve({
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/testuser',
            expires_at: '2019-09-10T20:00:23.313Z'
          }))
        },
        clientCredentials: { getToken: jest.fn() }
      }))

      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{
            id: 1,
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
            expires_at: '2020-10-010 16:54:35.710382'
          }])
        } else {
          query.response([])
        }
      })

      const response = await validateToken('invalid.jwtToken')

      expect(response).toEqual(false)

      expect(consoleMock).toBeCalledTimes(1)
      expect(consoleMock.mock.calls[0]).toEqual(['JWT Token Invalid. JsonWebTokenError: jwt malformed'])
    })
  })

  describe('when the provided token is valid', () => {
    test('returns the username associated with the token', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      jest.spyOn(simpleOAuth2, 'create').mockImplementation(() => ({
        accessToken: {
          create: jest.fn().mockImplementation(() => ({
            token: {
              access_token: 'accessToken',
              token_type: 'Bearer',
              expires_in: 3600,
              refresh_token: 'refreshToken',
              endpoint: '/api/users/testuser',
              expires_at: '2019-09-10T20:00:23.313Z'
            },
            expired: jest.fn(() => false)
          }))
        },
        ownerPassword: { getToken: jest.fn() },
        authorizationCode: {
          authorizeURL: jest.fn(),
          getToken: jest.fn().mockImplementation(() => Promise.resolve({
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/testuser',
            expires_at: '2019-09-10T20:00:23.313Z'
          }))
        },
        clientCredentials: { getToken: jest.fn() }
      }))

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{
            id: 1,
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
            expires_at: '2020-10-010 16:54:35.710382'
          }])
        } else {
          query.response([])
        }
      })

      const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

      const response = await validateToken(jwtToken)

      expect(response).toEqual('testuser')
    })
  })

  describe('when the provided token is valid but expired', () => {
    test('returns the username associated with the token', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      jest.spyOn(simpleOAuth2, 'create').mockImplementation(() => ({
        accessToken: {
          create: jest.fn().mockImplementation(() => ({
            token: {
              access_token: 'accessToken',
              token_type: 'Bearer',
              expires_in: 3600,
              refresh_token: 'refreshToken',
              endpoint: '/api/users/testuser',
              expires_at: '2019-09-10T20:00:23.313Z'
            },
            expired: jest.fn(() => true),
            refresh: jest.fn().mockImplementation(() => ({
              token: {
                access_token: 'accessToken',
                token_type: 'Bearer',
                expires_in: 3600,
                refresh_token: 'refreshedToken',
                endpoint: '/api/users/testuser',
                expires_at: '2019-09-10T20:00:23.313Z'
              }
            }))
          }))
        },
        ownerPassword: { getToken: jest.fn() },
        authorizationCode: {
          authorizeURL: jest.fn(),
          getToken: jest.fn().mockImplementation(() => Promise.resolve({
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/testuser',
            expires_at: '2019-09-10T20:00:23.313Z'
          }))
        },
        clientCredentials: { getToken: jest.fn() }
      }))

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{
            id: 1,
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
            expires_at: '2020-10-010 16:54:35.710382'
          }])
        } else {
          query.response([])
        }
      })

      const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

      const response = await validateToken(jwtToken)

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('select')
      expect(queries[1].method).toEqual('del')
      expect(queries[2].method).toEqual('insert')
      expect(queries[2].bindings).toEqual([
        'accessToken',
        'prod',
        '2019-09-10T20:00:23.313Z',
        'refreshedToken',
        1
      ])

      expect(response).toEqual('testuser')
    })
  })
})
