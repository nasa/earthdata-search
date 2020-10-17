import { getApplicationConfig } from '../../../sharedUtils/config'
/**
 * This lambda basically does nothing. The edlAuthorizer is setup on this lambda to determine if the user
 * is authorized as an admin. If not, the authorizer will return a 401
 */
const adminIsAuthorized = () => {
  const { defaultResponseHeaders } = getApplicationConfig()

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify({ authorized: true })
  }
}

export default adminIsAuthorized
