import { transformCollectionEntries } from '../transformCollectionEntries'

// Mock the config modules
vi.mock('../../../../../../sharedUtils/config', () => ({
  getApplicationConfig: () => ({
    thumbnailSize: {
      height: 85,
      width: 85
    }
  }),
  getEnvironmentConfig: () => ({
    apiHost: 'http://localhost:3000'
  })
}))

// Mock the shared utilities
vi.mock('../../../../../../sharedUtils/tags', () => ({
  hasTag: vi.fn()
}))

vi.mock('../../isCSDACollection', () => ({
  isCSDACollection: vi.fn()
}))

vi.mock('../../../../../../sharedUtils/getOpenSearchOsddLink', () => ({
  getOpenSearchOsddLink: vi.fn()
}))

describe('transformCollectionEntries', () => {
  test('returns empty array for non-array input', () => {
    expect(transformCollectionEntries(null, 'prod')).toEqual([])
    expect(transformCollectionEntries(undefined, 'prod')).toEqual([])
    expect(transformCollectionEntries('invalid', 'prod')).toEqual([])
  })

  test('transforms collection entries correctly', () => {
    const mockEntries = [
      {
        id: 'collection-1',
        title: 'Test Collection',
        browse_flag: true,
        collection_data_type: 'NEAR_REAL_TIME',
        organizations: ['NASA'],
        tags: [],
        links: [{
          rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
          hreflang: 'en-US',
          href: 'https://sample.nasa.gov/thumbnails/thumbnail.jpg'
        }]
      }
    ]

    const result = transformCollectionEntries(mockEntries, 'prod')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)

    // Check that conceptId is set
    expect(result[0]).toHaveProperty('conceptId', 'collection-1')

    // Check that thumbnail is set for collections with browse_flag
    expect(result[0]).toHaveProperty('thumbnail')
    expect(result[0].thumbnail).toBe('http://localhost:3000/scale?h=85&w=85&imageSrc=https%3A%2F%2Fsample.nasa.gov%2Fthumbnails%2Fthumbnail.jpg')

    // Check that near real time flag is set
    expect(result[0]).toHaveProperty('isNrt', true)
  })

  test('handles collections without browse_flag', () => {
    const mockEntries = [
      {
        id: 'collection-2',
        title: 'Test Collection 2',
        browse_flag: false
      }
    ]

    const result = transformCollectionEntries(mockEntries, 'prod')

    expect(result[0]).toHaveProperty('isDefaultImage', true)
    expect(result[0].thumbnail).toBe('test-file-stub')
  })

  test('handles empty entries array', () => {
    const result = transformCollectionEntries([], 'prod')
    expect(result).toEqual([])
  })
})
