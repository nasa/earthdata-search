import { getAccessTokenFromJwtToken } from './getAccessTokenFromJwtToken'
import { getEdlConfig } from '../getEdlConfig'

/**
 * Returns the Echo-Token header for requests to CMR
 * @param {String} jwtToken
 */
export const getEchoToken = async (jwtToken) => {
  const { access_token: accessToken } = await getAccessTokenFromJwtToken(jwtToken)

  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  return `${accessToken}:${clientId}`
}
