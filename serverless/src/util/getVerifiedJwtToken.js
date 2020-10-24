import jwt from 'jsonwebtoken'

import { getSecretEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Verifies the JWT Token and returns the contents
 * @param {String} jwtToken
 */
export const getVerifiedJwtToken = (jwtToken, earthdataEnvironment) => {
  const { secret } = getSecretEarthdataConfig(earthdataEnvironment)

  const verifiedJwtToken = jwt.verify(jwtToken, secret)

  return verifiedJwtToken
}
