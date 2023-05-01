import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'

import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEdlConfig from '../../util/getEdlConfig'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getClientId from '../../../../sharedUtils/getClientId'
import * as determineEarthdataEnvironment from '../../util/determineEarthdataEnvironment'

import saveContactInfo from '../handler'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: '1' }))
  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'mock token' }))
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

describe('saveContactInfo', () => {
  test('returns the user\'s contact info', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ lambda: 'eed-edsc-test-serverless-lambda' }))
    jest.spyOn(determineEarthdataEnvironment, 'determineEarthdataEnvironment').mockImplementation(() => ('test'))

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer mock token')
      .matchHeader('Client-Id', 'eed-edsc-test-serverless-lambda')
      .matchHeader('X-Request-Id', 'mock-request-id')
      .post(/ordering\/api/)
      .reply(200, {
        data: {
          updateUser: {
            mock: 'cmr'
          }
        }
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            urs_id: 'testuser'
          }
        ])
      } else {
        query.response(undefined)
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          preferences: { mock: 'cmr' }
        },
        requestId: 'mock-request-id'
      })
    }

    const result = await saveContactInfo(event)

    const expectedBody = JSON.stringify({ mock: 'cmr' })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
  })

  test('logs an error if CMR-ordering request fails', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ lambda: 'eed-edsc-test-serverless-lambda' }))

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer mock token')
      .matchHeader('Client-Id', 'eed-edsc-test-serverless-lambda')
      .matchHeader('X-Request-Id', 'mock-request-id')
      .post(/ordering\/api/)
      .reply(200, {
        errors: [
          'Test error message'
        ]
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            urs_id: 'testuser'
          }
        ])
      } else {
        query.response(undefined)
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          preferences: { mock: 'cmr' }
        },
        requestId: 'mock-request-id'
      })
    }

    const result = await saveContactInfo(event)

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')
    const expectedError = JSON.stringify({
      statusCode: 500,
      errors: ['Error: ["Test error message"]']
    })

    expect(result.statusCode).toEqual(500)
    expect(result.body).toEqual(expectedError)
  })
})
