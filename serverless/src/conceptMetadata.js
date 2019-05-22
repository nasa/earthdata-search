import jwt from 'jsonwebtoken'

import { getSecretConfig } from '../../sharedUtils/config'

/**
 * Handler to perform an authenticated CMR concept metadata download
 */
function conceptMetadata(event, context, callback) {
  const { url, token: jwtToken } = event.queryStringParameters

  const { clientId, secret } = getSecretConfig('prod')
  const token = jwt.verify(jwtToken, secret)

  const conceptUrl = `${url}?token=${token.token.access_token}:${clientId}`

  console.log(conceptUrl)

  callback(null, {
    statusCode: 307,
    headers: {
      Location: conceptUrl
    }
  })
}

export default conceptMetadata
