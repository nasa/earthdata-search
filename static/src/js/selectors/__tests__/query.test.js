import { getFocusedCollectionGranuleQuery } from '../query'

describe('getFocusedCollectionGranuleQuery selector', () => {
  test('returns the granule query', () => {
    const state = {
      focusedCollection: 'collectionId',
      query: {
        collection: {
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

    expect(getFocusedCollectionGranuleQuery(state)).toEqual({ mock: 'data' })
  })

  test('returns an empty object when there is no focusedCollection', () => {
    const state = {
      focusedCollection: '',
      query: {}
    }

    expect(getFocusedCollectionGranuleQuery(state)).toEqual({})
  })
})
