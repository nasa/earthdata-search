import jwt from 'jsonwebtoken'

import { getSecretEarthdataConfig, getSecretCypressConfig } from '../../sharedUtils/config'
import cmrEnv from '../../sharedUtils/cmrEnv'

/**
 * Creates a jwtToken based on the Cypress user config in secret.config.json
 */
export const getJwtToken = () => {
  const { secret } = getSecretEarthdataConfig(cmrEnv())
  const { user } = getSecretCypressConfig()
  const jwtToken = jwt.sign({ ...user }, secret)

  return jwtToken
}
