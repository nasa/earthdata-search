import nock from 'nock'

import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getEdlConfig from '../../util/getEdlConfig'
import * as getJwtToken from '../../util/getJwtToken'

import getProviders from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
})

describe('getProviders', () => {
  test('correctly returns providers', async () => {
    nock(/cmr/)
      .get(/providers/)
      .reply(200, [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NONE-EDSC-TEST',
            provider_id: 'NONE-EDSC-TEST'
          }
        }
      ])

    const result = await getProviders({}, {})

    expect(result.statusCode).toBe(200)
  })

  test('catches and logs errors correctly', async () => {
    nock(/cmr/)
      .get(/providers/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const response = await getProviders({}, {})

    expect(response.statusCode).toEqual(500)

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(1)

    expect(consoleMock.mock.calls[0]).toEqual([
      'StatusCodeError (500): Test error message'
    ])
  })
})
