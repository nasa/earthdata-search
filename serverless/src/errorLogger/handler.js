/**
 * Logs an error reported by a client
 * @param {Object} event
 */
const errorLogger = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)

  console.error('Error reported', params)

  return {
    statusCode: 200
  }
}

export default errorLogger
