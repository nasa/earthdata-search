import jwt from 'jsonwebtoken'

import { getSecretEarthdataConfig } from '../../sharedUtils/config'

/**
 * Handler to perform an authenticated CMR concept metadata download
 */
function conceptMetadata(event, context, callback) {
  const { url, token: jwtToken } = event.queryStringParameters

  const { clientId, secret } = getSecretEarthdataConfig('prod')
  const token = jwt.verify(jwtToken, secret)

  console.log(url)
  const conceptUrl = `${url}?token=${token.token.access_token}:${clientId}`

  callback(null, {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  })
}

export default conceptMetadata
