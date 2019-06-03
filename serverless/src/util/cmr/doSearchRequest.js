import request from 'request-promise'
import jwt from 'jsonwebtoken'
import { prepareExposeHeaders } from './prepareExposeHeaders'
import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'

/**
 * Performs a search request and returns the result body and the JWT
 * @param {string} jwtToken JWT returned from edlAuthorizer
 * @param {string} url URL for to perform search
 */
export const doSearchRequest = async (jwtToken, url) => {
  // Get the access token and clientId to build the Echo-Token header
  const { clientId, secret } = getSecretEarthdataConfig('prod')

  const token = jwt.verify(jwtToken, secret)

  try {
    const response = await request.get({
      uri: url,
      resolveWithFullResponse: true,
      headers: {
        'Echo-Token': `${token.token.access_token}:${clientId}`
      }
    })

    const { body, headers } = response

    return {
      statusCode: response.statusCode,
      headers: {
        ...headers,
        'access-control-expose-headers': prepareExposeHeaders(headers),
        'jwt-token': jwtToken
      },
      body
    }
  } catch (e) {
    console.log('error', e)

    if (e.response) {
      return {
        statusCode: e.statusCode,
        body: JSON.stringify({ errors: [e.response.body] })
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ errors: ['Unexpected error encountered!', e] })
    }
  }
}
