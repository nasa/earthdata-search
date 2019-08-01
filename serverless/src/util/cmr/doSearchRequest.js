import request from 'request-promise'
import jwt from 'jsonwebtoken'
import { prepareExposeHeaders } from './prepareExposeHeaders'
import { getSecretEarthdataConfig, getClientId } from '../../../../sharedUtils/config'
import { getEdlConfig } from '../../configUtil'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'

/**
 * Performs a search request and returns the result body and the JWT
 * @param {string} jwtToken JWT returned from edlAuthorizer
 * @param {string} url URL for to perform search
 */
export const doSearchRequest = async (jwtToken, url) => {
  // Get the access token and clientId to build the Echo-Token header
  const { secret } = getSecretEarthdataConfig(cmrEnv())

  const token = jwt.verify(jwtToken, secret)

  try {
    // The client id is part of our Earthdata Login credentials
    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const response = await request.get({
      uri: url,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': `${token.token.access_token}:${clientId}`
      }
    })

    const { body, headers } = response

    return {
      statusCode: response.statusCode,
      headers: {
        'cmr-hits': headers['cmr-hits'],
        'cmr-took': headers['cmr-took'],
        'cmr-request-id': headers['cmr-request-id'],
        'access-control-allow-origin': headers['access-control-allow-origin'],
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
