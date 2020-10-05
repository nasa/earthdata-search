import axios from 'axios'

import { cmrEnv } from '../../../sharedUtils/cmrEnv'
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

  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event
  const { data, requestId } = JSON.parse(body)

  const { variables, query } = data

  const jwtToken = getJwtToken(event)

  const echoToken = await getEchoToken(jwtToken)

  const { graphQlHost } = getEarthdataConfig(cmrEnv())

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
        'X-Request-Id': requestId,
        'Echo-Token': echoToken
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
