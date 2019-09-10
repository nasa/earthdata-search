import { getEdlConfig } from '../util/configUtil'
import { isWarmUp } from '../util/isWarmup'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'

/**
 * Handler to perform an authenticated CMR concept metadata download
 */
const conceptMetadata = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const { url, token: jwtToken } = event.queryStringParameters

  const { access_token: accessToken } = await getAccessTokenFromJwtToken(jwtToken)

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const conceptUrl = `${url}?token=${accessToken}:${clientId}`

  return {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  }
}

export default conceptMetadata
