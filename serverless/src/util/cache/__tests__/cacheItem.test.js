import { cacheItem } from '../cacheItem'

const mockSet = vi.hoisted(() => vi.fn())
vi.mock('../getCacheConnection', () => ({
  getCacheConnection: vi.fn().mockReturnValue({
    set: mockSet
  })
}))

describe('cacheItem', () => {
  describe('when an empty value is provided', () => {
    test('does not attempt to cache', () => {
      cacheItem('empty-200-200', null, '84000')

      expect(mockSet).toHaveBeenCalledTimes(0)
    })
  })

  describe('when a valid value is provided', () => {
    test('successfully caches the image', async () => {
      process.env.IMAGE_CACHE_EXPIRE_SECONDS = '84000'

      await cacheItem('empty-200-200', 'test-image-contents', '84000')

      expect(mockSet).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledWith('empty-200-200', 'test-image-contents', 'EX', '84000')
    })

    test('successfully caches the image', async () => {
      mockSet.mockImplementation(() => {
        throw new Error('Exception calling `set`')
      })

      const cachedImage = cacheItem('empty-200-200', 'test-image-contents', '84000')

      await expect(cachedImage).rejects.toThrow()
    })
  })
})
