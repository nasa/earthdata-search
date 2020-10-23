import lowercaseKeys from 'lowercase-keys'

import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'

/**
 * Determimine which environment to use for static config lookups
 * @param {Object} headers HTTP Request headers provided to the lambda
 */
export const determineEarthdataEnvironment = (headers = {}) => {
  // Pull the default environment from the static application config
  let defaultDeployedEnvironment = deployedEnvironment()

  // Default to production when developing locally
  if (defaultDeployedEnvironment === 'dev') defaultDeployedEnvironment = 'prod'

  const { 'earthdata-env': earthdataEnvironment = defaultDeployedEnvironment } = lowercaseKeys(headers)

  return earthdataEnvironment.toLowerCase()
}
