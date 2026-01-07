import { getApplicationConfig } from '../../../sharedUtils/config'
import { getProjectionCapabilities } from './getProjectionCapabilities'

/**
 * Handler to process colormap records from GIBS
 * @param {Object} event EventBridge event (scheduled event)
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const generateColorMaps = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // The headers we'll send back regardless of our response
  const { defaultResponseHeaders } = getApplicationConfig()

  const projectionCapabilities = await getProjectionCapabilities(event.projection)

  const { statusCode, body } = projectionCapabilities

  console.log(`Completed Capabilities request with status ${statusCode}.`)

  const parsedBody = JSON.parse(body)

  if (statusCode !== 200) {
    return {
      isBase64Encoded: false,
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify(parsedBody)
    }
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify(parsedBody)
  }
}

export default generateColorMaps
