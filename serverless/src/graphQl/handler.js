import axios from 'axios'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'

/**
 * Query GraphQL endpoint
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const graphQl = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { body, headers } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  const { data, requestId } = JSON.parse(body)

  const { variables, query } = data

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const jwtToken = getJwtToken(event)

  const echoToken = await getEchoToken(jwtToken, earthdataEnvironment)

  const { graphQlHost } = getEarthdataConfig(earthdataEnvironment)

  const graphQlUrl = `${graphQlHost}/api`

  try {
    const response = await axios({
      url: graphQlUrl,
      method: 'post',
      data: {
        query,
        variables
      },
      headers: {
        Authorization: `Bearer ${echoToken}`,
        'X-Request-Id': requestId
      }
    })

    const {
      data: responseData,
      headers: responseHeaders,
      status
    } = response

    return {
      isBase64Encoded: false,
      statusCode: status,
      headers: {
        ...defaultResponseHeaders,
        'access-control-allow-origin': responseHeaders['access-control-allow-origin'],
        'access-control-expose-headers': prepareExposeHeaders(responseHeaders),
        'jwt-token': jwtToken
      },
      body: JSON.stringify(responseData)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default graphQl
