import { getVerifiedJwtToken } from '../getVerifiedJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

describe('getVerifiedJwtToken', () => {
  test('returns the contents of the jwtToken', () => {
    const { jwtToken } = getEarthdataConfig.getEnvironmentConfig('test')

    expect(getVerifiedJwtToken(jwtToken)).toEqual({
      id: 1,
      username: 'testuser',
      iat: 1578433476
    })
  })
})
