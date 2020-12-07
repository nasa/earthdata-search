import { getFocusedCollectionGranuleQuery, getFocusedGranuleQueryString } from '../query'

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

describe('getFocusedGranuleQueryString selector', () => {
  test('returns the granule query string', () => {
    const state = {
      focusedCollection: 'collectionId',
      metadata: {
        collections: {
          collectionId: {
            id: 'collectionId'
          }
        }
      },
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                browseOnly: true,
                pageNum: 2,
                sortKey: '-start_date'
              }
            }
          },
          spatial: {
            point: '0,0'
          }
        }
      }
    }

    expect(getFocusedGranuleQueryString(state)).toEqual('browseOnly=true&options%5Bspatial%5D%5Bor%5D=true&point=0%2C0')
  })
})
