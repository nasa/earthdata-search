import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

/**
 * Encodes the earthdata environment
 * @param {object} query A string representing an earthdata environment
 */
export const encodeEarthdataEnvironment = (environment) => {
  if (!environment) return ''

  // If the provided environment matches the deployed environment return
  // an empty string, this will prevent the parameter from being added to the URL
  if (environment === cmrEnv()) return ''

  return environment
}

/**
 * Decodes the earthdata environment parameter
 * @param {string} string A string representing an earthdata environment
 */
export const decodeEarthdataEnvironment = (environment) => {
  // If no value is found in the URL, fall back to the cmrEnv
  if (!environment) {
    return cmrEnv()
  }

  return environment
}
