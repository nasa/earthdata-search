import { stringify } from 'qs'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'

/**
 * Construct a CMR url provided a path and query params
 * @param {String} path The path component of the url to be generated
 * @param {Object} queryParams An object that will represent the query parameters in the url
 * @return {String} A completed and valid url to CMR
 */
export const cmrUrl = (path, queryParams = {}) => {
  const baseUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/${path}`

  if (Object.keys(queryParams).length) {
    return `${baseUrl}?${stringify(queryParams, { indices: false, arrayFormat: 'brackets' })}`
  }

  return baseUrl
}
