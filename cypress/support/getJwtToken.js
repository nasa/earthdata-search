import jwt from 'jsonwebtoken'

import { getSecretEarthdataConfig, getSecretCypressConfig } from '../../sharedUtils/config'

/**
 * Creates a jwtToken based on the Cypress user config in secret.config.json
 */
export const getJwtToken = (earthdataEnvironment) => {
  const { secret } = getSecretEarthdataConfig(earthdataEnvironment)
  const cypressConfig = getSecretCypressConfig()

  const jwtToken = jwt.sign({ ...cypressConfig }, secret)

  return jwtToken
}
