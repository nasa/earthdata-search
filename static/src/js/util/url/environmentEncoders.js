import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'

/**
 * Encodes the earthdata environment
 * @param {object} query A string representing an earthdata environment
 */
export const encodeEarthdataEnvironment = (environment) => {
  if (!environment) return ''

  // If the provided environment matches the deployed environment return
  // an empty string, this will prevent the parameter from being added to the URL
  if (environment === deployedEnvironment()) return ''

  return environment
}

/**
 * Decodes the earthdata environment parameter
 * @param {string} string A string representing an earthdata environment
 */
export const decodeEarthdataEnvironment = (environment) => {
  // If no value is found in the URL, fall back to the deployedEnvironment
  if (!environment) {
    return deployedEnvironment()
  }

  return environment.toLowerCase()
}
