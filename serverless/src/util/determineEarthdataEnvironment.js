import { getApplicationConfig } from '../../../sharedUtils/config'

/**
 * Determimine which environment to use for static config lookups
 * @param {Object} headers HTTP Request headers provided to the lambda
 */
export const determineEarthdataEnvironment = (headers = {}) => {
  // Pull the default environment from the static application config
  let { env: defaultdeployedEnvironment } = getApplicationConfig()

  // Default to production when developing locally
  if (defaultdeployedEnvironment === 'dev') defaultdeployedEnvironment = 'prod'

  const { 'Earthdata-ENV': earthdataEnvironment = defaultdeployedEnvironment } = headers

  return earthdataEnvironment
}
