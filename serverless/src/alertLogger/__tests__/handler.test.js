import alertLogger from '../handler'

describe('alertLogger', () => {
  test('logs the event body', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

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
    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})
