import axios from 'axios'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { getEchoToken } from '../util/urs/getEchoToken'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'
import { jsonToCsv } from './jsonToCsv'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

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
      // We need this await inside the loop because we have to wait on the response from the previous
      // call before making the next request
      // eslint-disable-next-line no-await-in-loop
      const response = await wrappedAxios({
        url: graphQlUrl,
        method: 'post',
        data: {
          query,
          variables: {
            ...variables,
            params: {
              ...variables.params,
              cursor
            }
          }
        },
        headers: requestHeaders
      })

      const {
        data: responseData,
        config
      } = response;
      ({ headers: responseHeaders, status } = response)

      const { elapsedTime } = config

      const { collections = {} } = responseData.data
      const { cursor: responseCursor, items = [] } = collections

      console.log(`Request for ${items.length} exportSearch collections successfully completed in ${elapsedTime} ms`)

      // Set the cursor returned from GraphQl so the next loop will use it
      cursor = responseCursor

      // If there are no items returned, set finished to true to exit the loop
      if (!items || !items.length) {
        finished = true
        break
      }

      // Push the items returned onto the returnItems array
      returnItems.push(...items)
    }

    // Format the returnItems into the requested format
    let returnBody = null
    if (format === 'json') returnBody = JSON.stringify(returnItems)
    if (format === 'csv') returnBody = jsonToCsv(returnItems)

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
