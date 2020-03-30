import MockDate from 'mockdate'

import autocompleteLogger from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('autocompleteLogger', () => {
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
            suggestion: { mock: 'data' },
            params: { mock: 'data' }
          }
        }
      })
    }

    const response = await autocompleteLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith(`[metrics] {"event":"autocomplete_selected","suggestion":{"mock":"data"},"params":{"mock":"data"},"timestamp":${Date.now()}}`)
  })
})
