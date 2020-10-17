import knex from 'knex'
import mockKnex from 'mock-knex'
import AWS from 'aws-sdk'

import nock from 'nock'

import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEdlConfig from '../../util/getEdlConfig'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'

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
    nock(/cmr/)
      .put(/preferences/)
      .reply(201, {
        preferences: {
          mock: 'echo'
        }
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            echo_id: 'test echo id',
            urs_id: 'testuser'
          }
        ])
      } else {
        query.response(undefined)
      }
    })

    const sqsSendMessagePromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsSendMessagePromise
      }))

    const event = {
      body: JSON.stringify({
        params: {
          preferences: { mock: 'echo' }
        }
      })
    }

    const result = await saveContactInfo(event)

    const expectedBody = JSON.stringify({ preferences: { mock: 'echo' } })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
  })
})
