import { getVerifiedJwtToken } from '../getVerifiedJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))
})

describe('getVerifiedJwtToken', () => {
  test('returns the contents of the jwtToken', () => {
    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'

    expect(getVerifiedJwtToken(jwtToken)).toEqual({
      token: {
        access_token: '2e8e995e7511c2c6620336797b',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: '5a10865eeb3f44a80ab95',
        endpoint: '/api/users/edsc',
        expires_at: '2019-06-16T01:01:49.545Z'
      },
      iat: 1560643309
    })
  })
})
