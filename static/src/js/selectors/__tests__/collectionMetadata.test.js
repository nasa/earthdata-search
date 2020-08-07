import { getFocusedCollectionMetadata } from '../collectionMetadata'

describe('getFocusedCollectionMetadata selector', () => {
  test('returns the collection metadata', () => {
    const state = {
      focusedCollection: 'collectionId',
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      }
    }
    expect(getFocusedCollectionMetadata(state)).toEqual({ mock: 'data' })
  })

  test('returns an empty object when there is no focusedCollection', () => {
    const state = {
      focusedCollection: '',
      metadata: {}
    }

    expect(getFocusedCollectionMetadata(state)).toEqual({})
  })
})
