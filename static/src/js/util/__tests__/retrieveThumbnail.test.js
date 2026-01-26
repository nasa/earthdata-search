import { vi } from 'vitest'
import { retrieveThumbnail } from '../retrieveThumbnail'

describe('retrieveThumbnail', () => {
  const mockThumbnailEndpoint = 'https://test.com'
  const mockBuffer = Buffer.from('abc')
  const mockArrayBuffer = Buffer.from('cde')

  global.fetch = vi.fn(() => Promise.resolve({
    arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    data: mockBuffer
  }))

  describe('retrieving the image from the endpoint', () => {
    test('returns the buffer data as a response', async () => {
      const thumbnail = await retrieveThumbnail(mockThumbnailEndpoint)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(mockThumbnailEndpoint, {
        headers: {
          Accept: 'image/png'
        }
      })

      expect(thumbnail).toEqual('data:image/png;base64, Y2Rl')
    })
  })

  describe('when the image retrieval errors out', () => {
    test('should return an error ', async () => {
      // Mock the promise with an error
      global.fetch = vi.fn(() => Promise.resolve({
        data: 'error'
      }))

      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      const thumbnail = await retrieveThumbnail(mockThumbnailEndpoint)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(mockThumbnailEndpoint, {
        headers: {
          Accept: 'image/png'
        }
      })

      expect(thumbnail).toEqual('test-file-stub')
      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('There was an error retrieving the thumbnail from', 'https://test.com')
    })
  })
})
