import { getApplicationConfig } from '../../../sharedUtils/config'
/**
 * Logs an alert reported by a client
 * @param {Object} event Details about the HTTP request that it received
 */
const alertLogger = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event
  const { params } = JSON.parse(body)
  const { alert } = params
  const {
    action,
    guid,
    location,
    message,
    resource
  } = alert

  console.log('Alert reported', `[${guid}] - Message: ${message} - Action: ${action} - Resource: ${resource} - Location: ${JSON.stringify(location)}`)

  return {
    statusCode: 200,
    headers: defaultResponseHeaders
  }
}

export default alertLogger
