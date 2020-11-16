import { parse, stringify } from 'qs'

import { getEarthdataConfig, getEnvironmentConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'

/**
 * Redirects the user to the correct EDL login URL
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlLogin = async (event) => {
  const { queryStringParameters } = event

  const { ee: earthdataEnvironment, state } = queryStringParameters

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig(earthdataEnvironment)
  const { client } = edlConfig
  const { id: clientId } = client

  const {
    edlHost,
    redirectUriPath
  } = getEarthdataConfig(earthdataEnvironment)

  const { apiHost } = getEnvironmentConfig()
  const redirectUri = `${apiHost}${redirectUriPath}`

  // In the event that the user has the earthdata environment set to the deployed environment
  // the ee param will not exist, we need to ensure its provided on the `state` param for redirect purposes
  const [path, queryParams] = state.split('?')

  // Parse the query string into an object
  const paramsObj = parse(queryParams, { parseArrays: false })

  // If the earthdata environment variable
  if (!Object.keys(paramsObj).includes('ee')) {
    paramsObj.ee = earthdataEnvironment
  }

  return {
    statusCode: 307,
    headers: {
      Location: `${edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(`${path}?${stringify(paramsObj)}`)}`
    }
  }
}

export default edlLogin
