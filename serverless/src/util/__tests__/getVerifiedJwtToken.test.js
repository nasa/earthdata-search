import { getVerifiedJwtToken } from '../getVerifiedJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))
})

describe('getVerifiedJwtToken', () => {
  test('returns the contents of the jwtToken', () => {
    const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

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
