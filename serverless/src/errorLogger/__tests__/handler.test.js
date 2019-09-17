import errorLogger from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('errorLogger', () => {
  test('logs the event body', async () => {
    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {
          error: {
            mock: 'error'
          }
        }
      })
    }

    const response = await errorLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toBeCalledTimes(1)
  })
})
