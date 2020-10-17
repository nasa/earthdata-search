import jwt from 'jsonwebtoken'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSecretEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Create a signed JWT Token with user information
 * @param {Object} user User object from database
 */
export const createJwtToken = (user) => {
  const {
    id,
    urs_id: username,
    site_preferences: preferences
  } = user

  const { secret } = getSecretEarthdataConfig(cmrEnv())

  return jwt.sign({
    id,
    username,
    preferences
  }, secret)
}
