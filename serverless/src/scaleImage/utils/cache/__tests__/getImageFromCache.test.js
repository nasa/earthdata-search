import { getImageFromCache } from '../getImageFromCache'

const mockGet = vi.hoisted(() => vi.fn())
vi.mock('../getCacheConnection', () => ({
  getCacheConnection: vi.fn().mockResolvedValue({
    get: mockGet
  })
}))

describe('getImageFromCache', () => {
  test('returns null when key is not found in the cache', async () => {
    mockGet.mockResolvedValueOnce(null)

    const imageFromCache = await getImageFromCache('test-image-contents')

    expect(imageFromCache).toEqual(null)
  })

  test('returns stored value when key is found in the cache', async () => {
    mockGet.mockResolvedValueOnce('test-image-contents')

    const imageFromCache = await getImageFromCache('empty-200-200')

    expect(imageFromCache).toEqual('test-image-contents')
  })
})
