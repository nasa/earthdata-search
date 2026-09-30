import { FirehoseClient } from '@aws-sdk/client-firehose'

import experimentLogger from '../handler'

import * as getEnvironmentConfig from '../../../../sharedUtils/config'

vi.mock('@aws-sdk/client-firehose', async () => {
  const original = await vi.importActual('@aws-sdk/client-firehose')
  const sendMock = vi.fn().mockResolvedValue()

  return {
    ...original,
    FirehoseClient: vi.fn(class {
      send = sendMock
    })
  }
})

const client = new FirehoseClient()

beforeEach(() => {
  vi.spyOn(getEnvironmentConfig, 'getEnvironmentConfig').mockImplementation(() => ({ growthbookFirehoseStreamName: 'mock-stream-name' }))
})

describe('experimentLogger', () => {
  test('logs the event body', async () => {
    const event = {
      body: JSON.stringify({
        params: {
          eventData: {
            eventType: 'test_event',
            userId: 'test_user'
          }
        }
      })
    }

    const response = await experimentLogger(event)

    expect(response.statusCode).toBe(200)

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: expect.objectContaining({
        DeliveryStreamName: 'mock-stream-name'
      })
    }))
  })

  describe('when the Firehose client throws an error', () => {
    test('logs the error and returns a 200 response', async () => {
      const error = new Error('Firehose error')
      client.send.mockRejectedValueOnce(error)

      const event = {
        body: JSON.stringify({
          params: {
            eventData: {
              eventType: 'test_event',
              userId: 'test_user'
            }
          }
        })
      }

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const response = await experimentLogger(event)

      expect(response.statusCode).toBe(200)

      expect(client.send).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error streaming to Firehose:', error)
    })
  })
})
