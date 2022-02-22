import alertLogger from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('alertLogger', () => {
  test('logs the event body', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {
          alert: {
            mock: 'alert'
          }
        }
      })
    }

    const response = await alertLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toBeCalledTimes(1)
  })
})
