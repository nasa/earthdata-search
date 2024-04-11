import { stringify } from 'qs'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Construct a url to a lambda that is responsible for redirecting the user with an appropriate cmr token
 * @param {String} url The url to be redirected to after a token has been retrieved
 * @param {String} jwtToken JWT Token that the lambda will use to lookup a user token
 * @param {String} earthdataEnvironment The active earthdata environment string
 */
export const buildAuthenticatedRedirectUrl = (url, jwtToken, earthdataEnvironment) => {
  const { apiHost } = getEnvironmentConfig()

  const queryString = stringify({
    ee: earthdataEnvironment,
    url,
    token: jwtToken
  }, { encode: false })

  return `${apiHost}/concepts/metadata?${queryString}`
}
