import useEdscStore from '../../zustand/useEdscStore'
import {
  getFocusedCollectionMetadata,
  getFocusedCollectionSubscriptions,
  getFocusedCollectionTags
} from '../collectionMetadata'

describe('getFocusedCollectionMetadata selector', () => {
  test('returns the collection metadata', () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.collection.collectionId = 'collectionId'
    })

    const state = {
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
      metadata: {}
    }

    expect(getFocusedCollectionMetadata(state)).toEqual({})
  })
})

describe('getFocusedCollectionSubscriptions', () => {
  test('returns the subscriptions', () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.collection.collectionId = 'C100000-EDSC'
    })

    const state = {
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

describe('getFocusedCollectionTags', () => {
  test('returns the subscriptions', () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.collection.collectionId = 'C100000-EDSC'
    })

    const state = {
      metadata: {
        collections: {
          'C100000-EDSC': {
            tags: {
              'edsc.extra.serverless.test': {
                data: {
                  tagKey: 'tagData'
                }
              }
            }
          }
        }
      }
    }

    expect(getFocusedCollectionTags(state)).toEqual({
      'edsc.extra.serverless.test': {
        data: {
          tagKey: 'tagData'
        }
      }
    })
  })
})
