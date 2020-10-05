import { getEdlConfig } from '../util/getEdlConfig'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEarthdataConfig, getEnvironmentConfig } from '../../../sharedUtils/config'

/**
 * Redirects the user to the correct EDL login URL
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlLogin = async (event) => {
  const { queryStringParameters } = event
  const { state } = queryStringParameters

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const {
    edlHost,
    redirectUriPath
  } = getEarthdataConfig(cmrEnv())

  const { apiHost } = getEnvironmentConfig()
  const redirectUri = `${apiHost}${redirectUriPath}`

  return {
    statusCode: 307,
    headers: {
      Location: `${edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
    }
  }
}

export default edlLogin
