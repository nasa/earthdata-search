import axios from 'axios'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { getEchoToken } from '../util/urs/getEchoToken'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'

/**
 * Perform a loop through collection results and return the full results in the requested format.
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearch = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { body, headers } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  const { data, requestId } = JSON.parse(body)

  const { format, variables, query } = data

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const requestHeaders = {
    'X-Request-Id': requestId
  }

  const jwtToken = getJwtToken(event)
  if (jwtToken) {
    // Support endpoints that have optional authentication
    const token = await getEchoToken(jwtToken, earthdataEnvironment)

    requestHeaders.Authorization = `Bearer ${token}`
  }

  const { graphQlHost } = getEarthdataConfig(earthdataEnvironment)

  const graphQlUrl = `${graphQlHost}/api`

  try {
    let cursor
    let finished = false
    const returnItems = []
    let status
    let responseHeaders

    // Loop until the request comes back with no items
    while (!finished) {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios({
        url: graphQlUrl,
        method: 'post',
        data: {
          query,
          variables: {
            ...variables,
            cursor
          }
        },
        headers: requestHeaders
      })

      const {
        data: responseData
      } = response;
      ({ headers: responseHeaders, status } = response)

      const { collections = {} } = responseData.data
      const { cursor: responseCursor, items = [] } = collections

      // Set the cursor returned from GraphQl so the next loop will use it
      cursor = responseCursor

      // Push the items returned onto the returnItems array
      returnItems.push(...items.map((item) => {
        const { platforms = [] } = item

        // Only return an array of the platform short names
        return {
          ...item,
          platforms: platforms.map(platform => platform.shortName)
        }
      }))

      // If there are no items returned, set finished to true to exit the loop
      if (!items || !items.length) finished = true
    }

    // Format the returnItems into the requested format
    let returnBody = null
    if (format === 'json') returnBody = JSON.stringify(returnItems)

    return {
      isBase64Encoded: false,
      statusCode: status,
      headers: {
        ...defaultResponseHeaders,
        'access-control-allow-origin': responseHeaders['access-control-allow-origin'],
        'access-control-expose-headers': prepareExposeHeaders(responseHeaders),
        'jwt-token': jwtToken
      },
      body: returnBody
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default exportSearch
