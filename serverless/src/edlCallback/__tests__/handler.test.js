import AWS from 'aws-sdk'
import knex from 'knex'
import mockKnex from 'mock-knex'
import simpleOAuth2 from 'simple-oauth2'
import jwt from 'jsonwebtoken'

import * as cmrEnv from '../../../../sharedUtils/cmrEnv'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEdlConfig from '../../util/getEdlConfig'
import * as getSecretEarthdataConfig from '../../../../sharedUtils/config'

import edlCallback from '../handler'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(simpleOAuth2, 'create').mockImplementation(() => ({
    accessToken: {
      create: jest.fn().mockImplementation(() => ({
        token: {
          access_token: 'accessToken',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token:
            'refreshToken',
          endpoint: '/api/users/edsc',
          expires_at: '2019-09-10T20:00:23.313Z'
        }
      }))
    },
    ownerPassword: { getToken: jest.fn() },
    authorizationCode: {
      authorizeURL: jest.fn(),
      getToken: jest.fn().mockImplementation(() => (Promise.resolve({
        access_token: 'accessToken',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token:
          'refreshToken',
        endpoint: '/api/users/edsc',
        expires_at: '2019-09-10T20:00:23.313Z'
      })))
    },
    clientCredentials: { getToken: jest.fn() }
  }))

  jest.spyOn(getSecretEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'secret' }))
  jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')
  jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockToken')
  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))
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

describe('edlCallback', () => {
  test('logs in the user and redirects to edscHost', async () => {
    const code = '2057964173'
    const state = 'http://example.com'

    const sqsUserData = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsUserData
      }))

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({ id: 1 })
      } else {
        query.response(undefined)
      }
    })

    const event = {
      queryStringParameters: {
        code,
        state
      }
    }

    const response = await edlCallback(event, {})

    expect(sqsUserData).toBeCalledTimes(1)
    expect(sqsUserData.mock.calls[0]).toEqual([expect.objectContaining({
      MessageBody: JSON.stringify({
        environment: 'prod',
        userId: 1,
        username: 'edsc'
      })
    })])

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('insert')

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?redirect=http%3A%2F%2Fexample.com&jwt=mockToken' })
  })

  test('creates a new user if one does not exist', async () => {
    const code = '2057964173'
    const state = 'http://example.com'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(null)
      } else if (step === 2) {
        query.response([{ id: 1 }])
      } else {
        query.response(undefined)
      }
    })

    const event = {
      queryStringParameters: {
        code,
        state
      }
    }

    const response = await edlCallback(event, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('insert')
    expect(queries[2].method).toEqual('insert')

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?redirect=http%3A%2F%2Fexample.com&jwt=mockToken' })
  })

  test('catches and logs errors correctly', async () => {
    const code = '2057964173'
    const state = 'http://example.com'

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      queryStringParameters: {
        code,
        state
      }
    }

    const response = await edlCallback(event, {})

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(1)

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?redirect=http%3A%2F%2Fexample.com' })
  })
})
