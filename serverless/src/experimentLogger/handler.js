import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'

import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'

let firehoseClient

/**
 * Logs an experiment event reported by a client
 * @param {Object} event Details about the HTTP request that it received
 */
const experimentLogger = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)
  const { eventData } = params

  const {
    eventType,
    userId
  } = eventData

  if (!firehoseClient) {
    firehoseClient = new FirehoseClient({ region: 'us-east-1' })
  }

  const payload = {
    event_id: crypto.randomUUID(),
    user_id: userId || 'anonymous',
    event_type: eventType,
    timestamp: new Date().toISOString(),
    ...eventData
  }

  const { growthbookFirehoseStreamName } = getEnvironmentConfig()

  const command = new PutRecordCommand({
    DeliveryStreamName: growthbookFirehoseStreamName,
    Record: {
      Data: new TextEncoder().encode(JSON.stringify(payload))
    }
  })

  try {
    await firehoseClient.send(command)
  } catch (error) {
    console.error('Error streaming to Firehose:', error)
  }

  const { defaultResponseHeaders } = getApplicationConfig()

  return {
    statusCode: 200,
    headers: defaultResponseHeaders
  }
}

export default experimentLogger
