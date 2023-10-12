import { getApplicationConfig } from '../../../sharedUtils/config'
/**
 * Logs an error reported by a client
 * @param {Object} event Details about the HTTP request that it received
 */
const eddLogger = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event
  const { params = {} } = JSON.parse(body)
  const { data = {} } = params
  const { eventType } = params

  const eventData = {
    event: eventType,
    ...data,
    timestamp: Date.now()
  }

  console.log(`[metrics] ${JSON.stringify(eventData)}`)

  return {
    statusCode: 200,
    headers: defaultResponseHeaders
  }
}

export default eddLogger
