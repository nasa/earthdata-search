import {
  getCollectionId,
  getCollectionsMetadata,
  getFocusedCollectionMetadata,
  getFocusedCollectionSubscriptions,
  getFocusedCollectionTags
} from '../collection'

import useEdscStore from '../../useEdscStore'

describe('collection selectors', () => {
  describe('getCollectionId', () => {
    test('returns the focused collection ID', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1'
        }
      }))

      const result = getCollectionId(useEdscStore.getState())
      expect(result).toEqual('collection1')
    })
  })

  describe('getCollectionsMetadata', () => {
    test('returns the metadata for all fetched collections', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionMetadata: {
            collection1: {
              id: 'collection1',
              title: 'Collection 1',
              description: 'Description for Collection 1'
            },
            collection2: {
              id: 'collection2',
              title: 'Collection 2',
              description: 'Description for Collection 2'
            }
          }
        }
      }))

      const result = getCollectionsMetadata(useEdscStore.getState())
      expect(result).toEqual({
        collection1: {
          id: 'collection1',
          title: 'Collection 1',
          description: 'Description for Collection 1'
        },
        collection2: {
          id: 'collection2',
          title: 'Collection 2',
          description: 'Description for Collection 2'
        }
      })
    })
  })

  describe('getFocusedCollectionMetadata', () => {
    test('returns the metadata for the focused collection', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1',
          collectionMetadata: {
            collection1: {
              id: 'collection1',
              title: 'Collection 1',
              description: 'Description for Collection 1'
            },
            collection2: {
              id: 'collection2',
              title: 'Collection 2',
              description: 'Description for Collection 2'
            }
          }
        }
      }))

      const result = getFocusedCollectionMetadata(useEdscStore.getState())
      expect(result).toEqual({
        id: 'collection1',
        title: 'Collection 1',
        description: 'Description for Collection 1'
      })
    })
  })

  describe('getFocusedCollectionSubscriptions', () => {
    test('returns the subscriptions for the focused collection', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1',
          collectionMetadata: {
            collection1: {
              id: 'collection1',
              title: 'Collection 1',
              description: 'Description for Collection 1',
              subscriptions: {
                items: [
                  {
                    id: 'sub1',
                    title: 'Subscription 1'
                  },
                  {
                    id: 'sub2',
                    title: 'Subscription 2'
                  }
                ]
              }
            },
            collection2: {
              id: 'collection2',
              title: 'Collection 2',
              description: 'Description for Collection 2',
              subscriptions: {
                items: [
                  {
                    id: 'sub3',
                    title: 'Subscription 3'
                  },
                  {
                    id: 'sub4',
                    title: 'Subscription 4'
                  }
                ]
              }
            }
          }
        }
      }))

      const result = getFocusedCollectionSubscriptions(useEdscStore.getState())
      expect(result).toEqual([
        {
          id: 'sub1',
          title: 'Subscription 1'
        },
        {
          id: 'sub2',
          title: 'Subscription 2'
        }
      ])
    })
  })

  describe('getFocusedCollectionTags', () => {
    test('returns the tags for the focused collection', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1',
          collectionMetadata: {
            collection1: {
              id: 'collection1',
              title: 'Collection 1',
              description: 'Description for Collection 1',
              tags: {
                'example.tag': {
                  mock: 'data'
                }
              }
            },
            collection2: {
              id: 'collection2',
              title: 'Collection 2',
              description: 'Description for Collection 2',
              tags: {
                'example.tag': {
                  mock: 'data 2'
                }
              }
            }
          }
        }
      }))

      const result = getFocusedCollectionTags(useEdscStore.getState())
      expect(result).toEqual({
        'example.tag': {
          mock: 'data'
        }
      })
    })
  })
})
