import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Retrieve current CMR environment from Redux
 * @param {Object} state Current state of Redux
 */
export const getEarthdataEnvironment = (state) => {
  // Pull the default environment from the static application config
  let { env: defaultCmrEnvironment } = getApplicationConfig()

  // Default to production when developing locally
  if (defaultCmrEnvironment === 'dev') defaultCmrEnvironment = 'prod'

  const { earthdataEnvironment = defaultCmrEnvironment } = state

  return earthdataEnvironment
}
