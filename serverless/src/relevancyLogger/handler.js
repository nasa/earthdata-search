/**
 * Logs an error reported by a client
 * @param {Object} event
 */
const relevancyLogger = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)
  const { data = {} } = params

  const eventData = {
    event: 'collection_relevancy',
    ...data,
    timestamp: Date.now()
  }

  console.log(`[metrics] ${JSON.stringify(eventData)}`)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

export default relevancyLogger
