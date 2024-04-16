import { getApplicationConfig } from './config'

/**
 * Replaces ENV and PORTAL in a clientId string
 * @param {String} clientId - clientId to replace ENV and PORTAL
 * @param {String} envOverride - Optional, override the actual env with supplied value
 */
const replaceClientIdEnvPortal = (clientId, envOverride) => (
  clientId
    .replace('ENV', envOverride || getApplicationConfig().env)
    .replace('PORTAL', getApplicationConfig().defaultPortal)
)

/**
 * Returns the clientId to send with CMR requests
 */
export const getClientId = () => {
  // Override the Env with 'test' if we are in CI
  const { ciMode, clientId } = getApplicationConfig()
  let envOverride
  if (ciMode) envOverride = 'test'

  const {
    background,
    lambda,
    client
  } = clientId

  clientId.background = replaceClientIdEnvPortal(background, envOverride)
  clientId.lambda = replaceClientIdEnvPortal(lambda, envOverride)
  clientId.client = replaceClientIdEnvPortal(client, envOverride)

  return clientId
}
