import { parse, stringify } from 'qs'
import { getEdlConfig } from '../util/getEdlConfig'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'

/**
 * Perform an authenticated CMR Concept Metadata search
 * @param {Object} event Details about the HTTP request that it received
 */
const conceptMetadata = async (event) => {
  const { queryStringParameters } = event

  const {
    ee: earthdataEnvironment,
    url,
    token: jwtToken
  } = queryStringParameters

  const [desiredPath, desiredQueryParams] = url.split('?')
  const parsedQueryParams = parse(desiredQueryParams)

  const {
    access_token: accessToken
  } = await getAccessTokenFromJwtToken(jwtToken, earthdataEnvironment)

  const edlConfig = await getEdlConfig(earthdataEnvironment)
  const { client } = edlConfig
  const { id: clientId } = client

  // Access tokens used in the URL still require the client id
  const conceptUrl = `${desiredPath}?${stringify({ ...parsedQueryParams, token: `${accessToken}:${clientId}` }, { encode: false })}`

  return {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  }
}

export default conceptMetadata
