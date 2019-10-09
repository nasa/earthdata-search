import { isWarmUp } from '../util/isWarmup'

/**
 * Logs an error reported by a client
 * @param {Object} event
 */
const errorLogger = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { body } = event
  const { params = {} } = JSON.parse(body)
  const { error = {} } = params
  const {
    error: providedError,
    guid,
    location,
    message,
    stack
  } = error

  console.error('Error reported', `[${guid}] - Message: ${message} - Stack: ${JSON.stringify(stack)} - Error: ${JSON.stringify(providedError)} - Location: ${JSON.stringify(location)}`)

  return {
    statusCode: 200
  }
}

export default errorLogger
