import { getEdlConfig } from './configUtil'
import { cmrEnv } from '../../sharedUtils/cmrEnv'
import { getEarthdataConfig, getEnvironmentConfig } from '../../sharedUtils/config'

/**
 * Handler for redirecting the user to the correct EDL login URL
 */
const edlLogin = async (event, context, callback) => {
  const params = event.queryStringParameters

  const { state } = params

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

  callback(null, {
    statusCode: 307,
    headers: {
      Location: `${edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
    }
  })
}

export default edlLogin
