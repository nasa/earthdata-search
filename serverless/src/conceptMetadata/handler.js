import jwt from 'jsonwebtoken'
import { getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/configUtil'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

/**
 * Handler to perform an authenticated CMR concept metadata download
 */
const conceptMetadata = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const { url, token: jwtToken } = event.queryStringParameters

  const { secret } = getSecretEarthdataConfig(cmrEnv())
  const token = jwt.verify(jwtToken, secret)

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const conceptUrl = `${url}?token=${token.token.access_token}:${clientId}`

  return {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  }
}

export default conceptMetadata
