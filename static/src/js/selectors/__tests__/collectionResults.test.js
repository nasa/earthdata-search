import useEdscStore from '../../zustand/useEdscStore'
import {
  getFocusedCollectionGranuleResults,
  getFocusedCollectionGranuleMetadata
} from '../collectionResults'

describe('getFocusedCollectionGranuleResults selector', () => {
  test('returns the granule results', () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.collection.collectionId = 'collectionId'
    })

    const state = {
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
      searchResults: {}
    }

    expect(getFocusedCollectionGranuleResults(state)).toEqual({})
  })
})

describe('getFocusedCollectionGranuleMetadata selector', () => {
  test('returns the granule metadata', () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.collection.collectionId = 'collectionId'
    })

    const state = {
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
      searchResults: {}
    }

    expect(getFocusedCollectionGranuleMetadata(state)).toEqual({})
  })
})
