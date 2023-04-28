import AWS from 'aws-sdk'
import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import exportSearch from '../handler'

const OLD_ENV = process.env

const MOCK_USER_ID = 1234
const MOCK_UUID = '00000000-0000-0000-0000-000000000000'

let dbTracker
let sqs

jest.mock('aws-sdk', () => {
  const instance = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn()
  }
  return {
    SQS: jest.fn(() => instance)
  }
})

beforeEach(() => {
  jest.clearAllMocks()

  sqs = new AWS.SQS()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementation(() => {
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

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('1988-09-03T10:00:00.000Z')
})

afterEach(() => {
  jest.clearAllMocks()

  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  // reset hacks on built-ins
  MockDate.reset()

  dbTracker.uninstall()
})

afterAll(() => {
  jest.clearAllMocks()
})

describe('exportSearch', () => {
  test('returns csv response correctly', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    const format = 'csv'

    const event = {
      body: JSON.stringify({
        data: {
          format,
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportSearch(event, {})

    expect(result.body).toEqual(`{"key":"${MOCK_UUID}"}`)

    const { queries } = dbTracker.queries

    expect(queries.length).toEqual(1)
    expect(queries[0].method).toEqual('insert')
    expect(queries[0].sql).toEqual('insert into "exports" ("filename", "key", "state", "user_id") values ($1, $2, $3, $4)')

    expect(sqs.sendMessage().promise).toBeCalledTimes(1)
    expect(JSON.parse(sqs.sendMessage.mock.calls[0][0].MessageBody)).toEqual({
      params: {
        format,
        query: {},
        variables: {}
      },
      extra: {
        earthdataEnvironment: 'prod',
        filename: 'search_results_export_00000000.csv',
        jwt: 'mockJwt',
        key: MOCK_UUID,
        requestId: 'asdf-1234-qwer-5678',
        userId: MOCK_USER_ID
      }
    })
  })

  test('returns json response correctly', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    const format = 'json'

    const event = {
      body: JSON.stringify({
        data: {
          format,
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportSearch(event, {})

    expect(result.body).toEqual(`{"key":"${MOCK_UUID}"}`)

    const { queries } = dbTracker.queries

    expect(queries.length).toEqual(1)
    expect(queries[0].method).toEqual('insert')
    expect(queries[0].sql).toEqual('insert into "exports" ("filename", "key", "state", "user_id") values ($1, $2, $3, $4)')

    expect(sqs.sendMessage().promise).toBeCalledTimes(1)
    expect(JSON.parse(sqs.sendMessage.mock.calls[0][0].MessageBody)).toEqual({
      params: {
        format,
        query: {},
        variables: {}
      },
      extra: {
        earthdataEnvironment: 'prod',
        filename: 'search_results_export_00000000.json',
        jwt: 'mockJwt',
        key: MOCK_UUID,
        requestId: 'asdf-1234-qwer-5678',
        userId: MOCK_USER_ID
      }
    })
  })

  test('responds correctly on malformed input', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    const event = {
      body: ''
    }

    const response = await exportSearch(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const errorMessage = errors[0]

    expect(errorMessage).toEqual('SyntaxError: Unexpected end of JSON input')

    expect(sqs.sendMessage().promise).toBeCalledTimes(0)
    expect(dbTracker.queries.queries).toHaveLength(0)
  })
})
