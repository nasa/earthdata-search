import knex from 'knex'
import mockKnex from 'mock-knex'
import jwt from 'jsonwebtoken'
import { SQSClient } from '@aws-sdk/client-sqs'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEdlConfig from '../../util/getEdlConfig'
import * as getSecretEarthdataConfig from '../../../../sharedUtils/config'

import edlCallback from '../handler'

let dbConnectionToMock
let dbTracker

jest.mock('simple-oauth2', () => ({
  AuthorizationCode: jest.fn().mockImplementation(() => ({
    getToken: jest.fn().mockImplementation(() => (Promise.resolve({
      token: {
        access_token: 'accessToken',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refreshToken',
        endpoint: '/api/users/edsc',
        expires_at: '2019-09-10T20:00:23.313Z'
      }
    })))
  }))
}))

jest.mock('@aws-sdk/client-sqs', () => {
  const original = jest.requireActual('@aws-sdk/client-sqs')
  const sendMock = jest.fn().mockResolvedValue()

  return {
    ...original,
    SQSClient: jest.fn().mockImplementation(() => ({
      send: sendMock
    }))
  }
})

const client = new SQSClient()

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getSecretEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'secret' }))
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

  // SQSClient.mockClear()
  // SendMessageCommand.mockClear()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('edlCallback', () => {
  test('logs in the user and redirects to edscHost', async () => {
    const code = '2057964173'
    const state = 'http://example.com?ee=prod'

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

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        MessageBody: '{"environment":"prod","userId":1,"username":"edsc"}',
        QueueUrl: undefined
      }
    }))

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('insert')

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?redirect=http%3A%2F%2Fexample.com%3Fee%3Dprod&jwt=mockToken' })
  })

  test('includes the accessToken when redirecting to earthdata-download', async () => {
    const code = '2057964173'
    const state = 'earthdata-download://example.com?ee=prod'

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

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        MessageBody: '{"environment":"prod","userId":1,"username":"edsc"}',
        QueueUrl: undefined
      }
    }))

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('insert')

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?redirect=earthdata-download%3A%2F%2Fexample.com%3Fee%3Dprod&jwt=mockToken&accessToken=accessToken' })
  })

  test('creates a new user if one does not exist', async () => {
    const code = '2057964173'
    const state = 'http://example.com?ee=prod'

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
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?redirect=http%3A%2F%2Fexample.com%3Fee%3Dprod&jwt=mockToken' })
  })

  test('catches and logs errors correctly', async () => {
    const code = '2057964173'
    const state = 'http://example.com?ee=prod'

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
    expect(consoleMock).toHaveBeenCalledTimes(1)

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:3000/login?ee=prod&state=http%3A%2F%2Fexample.com%3Fee%3Dprod' })
  })
})
