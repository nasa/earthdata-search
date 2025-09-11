import { transformCollectionEntries } from '../transformCollectionEntries'

// Mock the config modules
jest.mock('../../../../../../sharedUtils/config', () => ({
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
jest.mock('../../../../../../sharedUtils/tags', () => ({
  hasTag: jest.fn()
}))

jest.mock('../../isCSDACollection', () => ({
  isCSDACollection: jest.fn()
}))

jest.mock('../../../../../../sharedUtils/getOpenSearchOsddLink', () => ({
  getOpenSearchOsddLink: jest.fn()
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
        links: []
      }
    ]

    const result = transformCollectionEntries(mockEntries, 'prod')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    
    // Check that conceptId is set
    expect(result[0]).toHaveProperty('conceptId', 'collection-1')
    
    // Check that thumbnail is set for collections with browse_flag
    expect(result[0]).toHaveProperty('thumbnail')
    expect(result[0].thumbnail).toContain('collection-1')
    
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
    expect(result[0].thumbnail).toContain('image-unavailable.svg')
  })

  test('handles empty entries array', () => {
    const result = transformCollectionEntries([], 'prod')
    expect(result).toEqual([])
  })
})