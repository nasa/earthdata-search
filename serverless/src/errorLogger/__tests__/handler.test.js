import errorLogger from '../handler'

describe('errorLogger', () => {
  test('logs the event body', async () => {
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

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
    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})
