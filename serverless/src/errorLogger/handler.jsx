import { getApplicationConfig } from '../../../sharedUtils/config'
/**
 * Logs an error reported by a client
 * @param {Object} event Details about the HTTP request that it received
 */
const errorLogger = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event
  const { params } = JSON.parse(body)
  const { error } = params
  const {
    error: providedError,
    guid,
    location,
    message,
    stack
  } = error

  console.error('Error reported', `[${guid}] - Message: ${message} - Stack: ${JSON.stringify(stack)} - Error: ${JSON.stringify(providedError)} - Location: ${JSON.stringify(location)}`)

  return {
    statusCode: 200,
    headers: defaultResponseHeaders
  }
}

export default errorLogger
