// Two classes are mocked in this test
/* eslint-disable max-classes-per-file */

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

vi.mock('simple-oauth2', () => ({
  AuthorizationCode: vi.fn(class {
    getToken = vi.fn().mockImplementation(() => (Promise.resolve({
      token: {
        access_token: 'accessToken',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refreshToken',
        endpoint: '/api/users/edsc',
        expires_at: '2019-09-10T20:00:23.313Z'
      }
    })))
  })
}))

vi.mock('@aws-sdk/client-sqs', async () => {
  const original = await vi.importActual('@aws-sdk/client-sqs')
  const sendMock = vi.fn().mockResolvedValue()

  return {
    ...original,
    SQSClient: vi.fn(class {
      send = sendMock
    })
  }
})

const client = new SQSClient()

beforeEach(() => {
  vi.spyOn(getSecretEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'secret' }))
  vi.spyOn(jwt, 'sign').mockImplementation(() => 'mockToken')
  vi.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

  vi.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
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
        MessageBody: '{"edlToken":"accessToken","environment":"prod","userId":1,"username":"edsc"}',
        QueueUrl: undefined
      }
    }))

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?edlToken=accessToken&redirect=http%3A%2F%2Fexample.com%3Fee%3Dprod' })
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
        MessageBody: '{"edlToken":"accessToken","environment":"prod","userId":1,"username":"edsc"}',
        QueueUrl: undefined
      }
    }))

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?edlToken=accessToken&redirect=earthdata-download%3A%2F%2Fexample.com%3Fee%3Dprod' })
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

    expect(response.statusCode).toEqual(307)
    expect(response.headers).toEqual({ Location: 'http://localhost:8080/auth_callback?edlToken=accessToken&redirect=http%3A%2F%2Fexample.com%3Fee%3Dprod' })
  })

  test('catches and logs errors correctly', async () => {
    const code = '2057964173'
    const state = 'http://example.com?ee=prod'

    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

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
