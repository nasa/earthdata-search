import { getApplicationConfig } from '../../../sharedUtils/config'

/**
 * Determimine which environment to use for static config lookups
 * @param {Object} headers HTTP Request headers provided to the lambda
 */
export const determineEarthdataEnvironment = (headers = {}) => {
  // Pull the default environment from the static application config
  let { env: defaultCmrEnvironment } = getApplicationConfig()

  // Default to production when developing locally
  if (defaultCmrEnvironment === 'dev') defaultCmrEnvironment = 'prod'

  const { 'Earthdata-ENV': earthdataEnvironment = defaultCmrEnvironment } = headers

  return earthdataEnvironment
}
