import MockDate from 'mockdate'

import eddLogger from '../handler'

describe('eddLogger', () => {
  beforeEach(() => {
    // Mock the date so the timestamp log is predictable
    MockDate.set(Date.now())
  })

  afterEach(() => {
    MockDate.reset()
  })

  test('logs the event body', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

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
    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith(`[metrics] {"event":"downloadComplete","fileCount":10,"fileSize":512,"failedFiles":0,"downloadDuration":123456,"timestamp":${Date.now()}}`)
  })
})
