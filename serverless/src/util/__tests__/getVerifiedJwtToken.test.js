import { getVerifiedJwtToken } from '../getVerifiedJwtToken'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

describe('getVerifiedJwtToken', () => {
  test('returns the contents of the jwtToken', () => {
    const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'JWT_SIGNING_SECRET_KEY' }))

    expect(getVerifiedJwtToken(jwtToken, 'test')).toEqual({
      id: 1,
      username: 'testuser',
      iat: 1578433476,
      earthdataEnvironment: 'test'
    })
  })
})
