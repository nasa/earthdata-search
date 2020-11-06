import { getAccessTokenFromJwtToken } from './getAccessTokenFromJwtToken'

/**
 * Returns and EDL access token
 * @param {String} jwtToken
 */
export const getEchoToken = async (jwtToken, earthdataEnvironment) => {
  const {
    access_token: accessToken
  } = await getAccessTokenFromJwtToken(jwtToken, earthdataEnvironment)

  return accessToken
}
