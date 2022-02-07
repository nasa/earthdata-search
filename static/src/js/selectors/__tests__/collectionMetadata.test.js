import {
  getFocusedCollectionMetadata,
  getFocusedCollectionSubscriptions
} from '../collectionMetadata'

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

describe('getFocusedCollectionSubscriptions', () => {
  test('returns the subscriptions', () => {
    const state = {
      focusedCollection: 'C100000-EDSC',
      metadata: {
        collections: {
          'C100000-EDSC': {
            subscriptions: {
              items: [
                {
                  collectionConceptId: 'C100000-EDSC',
                  conceptId: 'SUB100000-EDSC',
                  name: 'Test Subscription',
                  query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
                }
              ]
            }
          }
        }
      }
    }

    expect(getFocusedCollectionSubscriptions(state)).toEqual([
      {
        collectionConceptId: 'C100000-EDSC',
        conceptId: 'SUB100000-EDSC',
        name: 'Test Subscription',
        query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
      }
    ])
  })
})
