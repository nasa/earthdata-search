import { getAccessTokenFromJwtToken } from './getAccessTokenFromJwtToken'
import { getEdlConfig } from '../getEdlConfig'

/**
 * Returns the Echo-Token header for requests to CMR
 * @param {String} jwtToken
 */
export const getEchoToken = async (jwtToken, earthdataEnvironment) => {
  const {
    access_token: accessToken
  } = await getAccessTokenFromJwtToken(jwtToken, earthdataEnvironment)

  const edlConfig = await getEdlConfig(earthdataEnvironment)
  const { client } = edlConfig
  const { id: clientId } = client

  return `${accessToken}:${clientId}`
}
