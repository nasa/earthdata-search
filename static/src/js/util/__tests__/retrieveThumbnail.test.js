import { retrieveThumbnail } from '../retrieveThumbnail'

describe('retrieveThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockThumbnailEndpoint = 'https://test.com'
  const mockBuffer = Buffer.from('abc')
  const mockArrayBuffer = Buffer.from('cde')

  global.fetch = jest.fn(() => Promise.resolve({
    arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    data: mockBuffer
  }))

  describe('retrieving hte image from the endpoint', () => {
    test('returns the buffer data as a response', async () => {
      const thumbnail = await retrieveThumbnail(mockThumbnailEndpoint)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(mockThumbnailEndpoint, { Accept: 'image/png' })
      expect(thumbnail).toEqual('data:image/png;base64, Y2Rl')
    })
  })

  describe('when the image retrieval errors out', () => {
    test('should return an error ', async () => {
      // Mock the promise with an error
      global.fetch = jest.fn(() => Promise.resolve({
        data: 'error'
      }))

      const thumbnail = await retrieveThumbnail(mockThumbnailEndpoint)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(mockThumbnailEndpoint, { Accept: 'image/png' })
      expect(thumbnail).toEqual('test-file-stub')
    })
  })
})
