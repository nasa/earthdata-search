/**
 * Logs an error reported by a client
 * @param {Object} event
 */
const errorLogger = async (event) => {
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
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

export default errorLogger
