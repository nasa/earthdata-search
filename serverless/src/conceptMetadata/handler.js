import { parse, stringify } from 'qs'
import { getEdlConfig } from '../util/configUtil'
import { isWarmUp } from '../util/isWarmup'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'

/**
 * Perform an authenticated CMR Concept Metadata search
 * @param {Object} event Details about the HTTP request that it received
 */
const conceptMetadata = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { url, token: jwtToken } = event.queryStringParameters

  const [desiredPath, desiredQueryParams] = url.split('?')
  const parsedQueryParams = parse(desiredQueryParams)

  const { access_token: accessToken } = await getAccessTokenFromJwtToken(jwtToken)

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const conceptUrl = `${desiredPath}?${stringify({ ...parsedQueryParams, token: `${accessToken}:${clientId}` }, { encode: false })}`

  return {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  }
}

export default conceptMetadata
