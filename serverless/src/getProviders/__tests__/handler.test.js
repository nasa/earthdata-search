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

    const result = await getProviders({
      requestContext: {
        authorizer: {
          jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'
        }
      }
    }, {})

    expect(result.statusCode).toBe(200)
  })

  test('correctly returns false when the warmUp payload is received', async () => {
    const payload = {
      source: 'serverless-plugin-warmup'
    }

    const response = await getProviders(payload, {})

    expect(response).toEqual(false)
  })
})
