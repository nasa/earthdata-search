import MockDate from 'mockdate'

import relevancyLogger from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('relevancyLogger', () => {
  beforeEach(() => {
    // mock the date so the timestamp log is predictable
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
          data: {
            mock: 'error'
          }
        }
      })
    }

    const response = await relevancyLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith(`[metrics] {"event":"collection_relevancy","mock":"error","timestamp":${Date.now()}}`)
  })
})
