import { getItemFromCache } from '../getItemFromCache'

const mockGet = vi.hoisted(() => vi.fn())
vi.mock('../getCacheConnection', () => ({
  getCacheConnection: vi.fn().mockResolvedValue({
    get: mockGet
  })
}))

describe('getItemFromCache', () => {
  test('returns null when key is not found in the cache', async () => {
    mockGet.mockResolvedValueOnce(null)

    const itemFromCache = await getItemFromCache('test-image-contents')

    expect(itemFromCache).toEqual(null)
  })

  test('returns stored value when key is found in the cache', async () => {
    mockGet.mockResolvedValueOnce('test-image-contents')

    const itemFromCache = await getItemFromCache('empty-200-200')

    expect(itemFromCache).toEqual('test-image-contents')
  })
})
