import { cacheImage } from '../cacheImage'
import { getImageFromCache } from '../getImageFromCache'

const OLD_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()

  // Manage resetting ENV variables
  jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('getImageFromCache', () => {
  test('returns null when key is not found in the cache', async () => {
    process.env.cacheKeyExpireSeconds = 84000

    const imageFromCache = await getImageFromCache('test-image-contents')

    expect(imageFromCache).toEqual(null)
  })

  test('returns stored value when key is found in the cache', async () => {
    process.env.cacheKeyExpireSeconds = 84000

    // Set an entry in the cache to test cache hit
    await cacheImage('empty-200-200', 'test-image-contents')

    const imageFromCache = await getImageFromCache('empty-200-200')

    expect(imageFromCache).toEqual('test-image-contents')
  })
})
