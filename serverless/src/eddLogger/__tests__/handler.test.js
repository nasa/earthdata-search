import MockDate from 'mockdate'

import eddLogger from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('eddLogger', () => {
  beforeEach(() => {
    // Mock the date so the timestamp log is predictable
    MockDate.set(Date.now())
  })

  afterEach(() => {
    MockDate.reset()
  })

  test('logs the event body', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {
          eventType: 'downloadComplete',
          data: {
            fileCount: 10,
            fileSize: 512,
            failedFiles: 0,
            downloadDuration: 123456
          }
        }
      })
    }

    const response = await eddLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith(`[metrics] {"event":"downloadComplete","fileCount":10,"fileSize":512,"failedFiles":0,"downloadDuration":123456,"timestamp":${Date.now()}}`)
  })
})
