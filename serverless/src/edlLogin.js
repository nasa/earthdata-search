import { getConfig, getSecretConfig } from '../../sharedUtils/config'

/**
 * Handler for redirecting the user to the correct EDL login URL
 */
export default function edlLogin(event, context, callback) {
  const params = event.queryStringParameters

  const { state } = params

  const { clientId } = getSecretConfig('prod')

  const {
    apiHost,
    edlHost,
    redirectUriPath
  } = getConfig('prod')
  const redirectUri = `${apiHost}${redirectUriPath}`

  callback(null, {
    statusCode: 307,
    headers: {
      Location: `${edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
    }
  })
}
