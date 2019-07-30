import jwt from 'jsonwebtoken'

import { getSecretEarthdataConfig } from '../../sharedUtils/config'
import { getEdlConfig } from './configUtil'

/**
 * Handler to perform an authenticated CMR concept metadata download
 */
const conceptMetadata = async (event, context, callback) => {
  const { url, token: jwtToken } = event.queryStringParameters

  const { secret } = getSecretEarthdataConfig('sit')
  const token = jwt.verify(jwtToken, secret)

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const conceptUrl = `${url}?token=${token.token.access_token}:${clientId}`

  callback(null, {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  })
}

export default conceptMetadata
