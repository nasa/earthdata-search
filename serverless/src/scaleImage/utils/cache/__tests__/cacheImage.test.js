import { cacheImage } from '../cacheImage'

const mockSet = vi.hoisted(() => vi.fn())
vi.mock('../getCacheConnection', () => ({
  getCacheConnection: vi.fn().mockResolvedValue({
    set: mockSet
  })
}))

describe('cacheImage', () => {
  describe('when an empty value is provided', () => {
    test('does not attempt to cache', () => {
      cacheImage('empty-200-200', null)

      expect(mockSet).toHaveBeenCalledTimes(0)
    })
  })

  describe('when a valid value is provided', () => {
    test('successfully caches the image', async () => {
      process.env.CACHE_KEY_EXPIRE_SECONDS = '84000'

      await cacheImage('empty-200-200', 'test-image-contents')

      expect(mockSet).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledWith('empty-200-200', 'test-image-contents', 'EX', '84000')
    })

    test('successfully caches the image', async () => {
      mockSet.mockImplementation(() => {
        throw new Error('Exception calling `set`')
      })

      const cachedImage = cacheImage('empty-200-200', 'test-image-contents')

      await expect(cachedImage).rejects.toThrow()
    })
  })
})
