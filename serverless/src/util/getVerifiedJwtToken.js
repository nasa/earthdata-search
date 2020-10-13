import jwt from 'jsonwebtoken'

import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSecretEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Verifies the JWT Token and returns the contents
 * @param {String} jwtToken
 */
export const getVerifiedJwtToken = (jwtToken) => {
  const { secret } = getSecretEarthdataConfig(cmrEnv())

  const verifiedJwtToken = jwt.verify(jwtToken, secret)

  return verifiedJwtToken
}
