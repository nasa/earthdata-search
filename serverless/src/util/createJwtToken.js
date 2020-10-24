import jwt from 'jsonwebtoken'

import { getSecretEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Create a signed JWT Token with user information
 * @param {Object} user User object from database
 */
export const createJwtToken = (user, earthdataEnvironment) => {
  const {
    id,
    urs_id: username,
    site_preferences: preferences
  } = user

  const { secret } = getSecretEarthdataConfig(earthdataEnvironment)

  return jwt.sign({
    id,
    username,
    preferences,
    earthdataEnvironment
  }, secret)
}
