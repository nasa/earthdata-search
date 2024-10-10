import knex from 'knex'
import mockKnex from 'mock-knex'
import { AuthorizationCode } from 'simple-oauth2'

import * as getDbConnection from '../../database/getDbConnection'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getEdlConfig from '../../getEdlConfig'

import { validateToken } from '../validateToken'

let dbTracker

jest.mock('simple-oauth2')

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
    test('returns false', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      AuthorizationCode.mockImplementationOnce(() => ({
        createToken: jest.fn().mockImplementation(() => ({
          token: {
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/edsc',
            expires_at: '2019-09-10T20:00:23.313Z'
          },
          expired: jest.fn(() => false)
        }))
      }))

      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1,
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
            expires_at: '2020-10-010 16:54:35.710382'
          })
        } else {
          query.response([])
        }
      })

      const response = await validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTU3ODQzMzQ3NiwiZWFydGhkYXRhRW52aXJvbm1lbnQiOiJ0ZXN0In0.0WJdf_c93ZCIzFSchcKMzIRgwaL2HhihXGg0y9pDm2M', 'test')

      expect(response).toEqual(false)

      expect(consoleMock).toBeCalledTimes(1)
      expect(consoleMock.mock.calls[0]).toEqual(['JWT Token Invalid. JsonWebTokenError: invalid signature'])
    })
  })

  describe('when the provided token is valid', () => {
    test('returns the username associated with the token', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      AuthorizationCode.mockImplementation(() => ({
        createToken: jest.fn().mockImplementation(() => ({
          token: {
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/edsc',
            expires_at: '2019-09-10T20:00:23.313Z'
          },
          expired: jest.fn(() => false)
        }))
      }))

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1,
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
            expires_at: '2020-10-010 16:54:35.710382'
          })
        } else {
          query.response([])
        }
      })

      const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

      const response = await validateToken(jwtToken, 'test')

      expect(response).toEqual('testuser')
    })
  })

  describe('when the provided token is valid but expired', () => {
    test('returns the username associated with the token', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      AuthorizationCode.mockImplementation(() => ({
        createToken: jest.fn().mockImplementation(() => ({
          token: {
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/edsc',
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
      }))

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1,
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
            expires_at: '2020-10-010 16:54:35.710382'
          })
        } else {
          query.response([])
        }
      })

      const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

      const response = await validateToken(jwtToken, 'test')

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
      expect(queries[1].method).toEqual('del')
      expect(queries[2].method).toEqual('insert')
      expect(queries[2].bindings).toEqual([
        'accessToken',
        'test',
        '2019-09-10T20:00:23.313Z',
        'refreshedToken',
        1
      ])

      expect(response).toEqual('testuser')
    })
  })

  describe('when the provided token has no user_token', () => {
    test('returns false', async () => {
      jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

      AuthorizationCode.mockImplementationOnce(() => ({
        createToken: jest.fn().mockImplementation(() => ({
          token: {
            access_token: 'accessToken',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'refreshToken',
            endpoint: '/api/users/edsc',
            expires_at: '2019-09-10T20:00:23.313Z'
          },
          expired: jest.fn(() => false)
        }))
      }))

      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response(undefined)
        } else {
          query.response([])
        }
      })

      const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

      const response = await validateToken(jwtToken, 'test')

      expect(response).toEqual(false)

      expect(consoleMock).toBeCalledTimes(0)
    })
  })
})
