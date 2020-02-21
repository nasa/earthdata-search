import { getApplicationConfig } from '../../../sharedUtils/config'
/**
 * Logs an error reported by a client
 * @param {Object} event Details about the HTTP request that it received
 */
const relevancyLogger = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

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
    headers: defaultResponseHeaders
  }
}

export default relevancyLogger
