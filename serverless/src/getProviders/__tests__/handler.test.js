import nock from 'nock'

import getProviders from '../handler'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getProviders', () => {
  test('correctly returns providers', async () => {
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))

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

    const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

    const result = await getProviders({
      requestContext: {
        authorizer: {
          jwtToken
        }
      }
    }, {})

    expect(result.statusCode).toBe(200)
  })
})
