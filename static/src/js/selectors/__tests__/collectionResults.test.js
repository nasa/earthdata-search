import {
  getFocusedCollectionGranuleResults,
  getFocusedCollectionGranuleMetadata
} from '../collectionResults'

describe('getFocusedCollectionGranuleResults selector', () => {
  test('returns the granule results', () => {
    const state = {
      focusedCollection: 'collectionId',
      searchResults: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                mock: 'data'
              }
            }
          }
        }
      }
    }

    expect(getFocusedCollectionGranuleResults(state)).toEqual({ mock: 'data' })
  })

  test('returns an empty object when there is no focusedCollection', () => {
    const state = {
      focusedCollection: '',
      searchResults: {}
    }

    expect(getFocusedCollectionGranuleResults(state)).toEqual({})
  })
})

describe('getFocusedCollectionGranuleMetadata selector', () => {
  test('returns the granule metadata', () => {
    const state = {
      focusedCollection: 'collectionId',
      metadata: {
        granules: {
          granuleId: {
            mock: 'data'
          }
        }
      },
      searchResults: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                allIds: ['granuleId']
              }
            }
          }
        }
      }
    }

    expect(getFocusedCollectionGranuleMetadata(state)).toEqual({
      granuleId: {
        mock: 'data'
      }
    })
  })

  test('returns an empty object when there is no focusedCollection', () => {
    const state = {
      focusedCollection: '',
      searchResults: {}
    }

    expect(getFocusedCollectionGranuleMetadata(state)).toEqual({})
  })
})
