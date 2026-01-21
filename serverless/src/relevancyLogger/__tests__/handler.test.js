import MockDate from 'mockdate'

import relevancyLogger from '../handler'

describe('relevancyLogger', () => {
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
          data: {
            mock: 'error'
          }
        }
      })
    }

    const response = await relevancyLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith(`[metrics] {"event":"collection_relevancy","mock":"error","timestamp":${Date.now()}}`)
  })
})
