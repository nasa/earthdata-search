import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Retrieve current CMR environment from Redux
 * @param {Object} state Current state of Redux
 */
export const getEarthdataEnvironment = (state) => {
  // Pull the default environment from the static application config
  let { env: defaultdeployedEnvironment } = getApplicationConfig()

  // Default to production when developing locally
  if (defaultdeployedEnvironment === 'dev') defaultdeployedEnvironment = 'prod'

  const { earthdataEnvironment = defaultdeployedEnvironment } = state

  return earthdataEnvironment
}
