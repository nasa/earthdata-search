import {
  getFocusedProjectCollection,
  getProjectCollections,
  getProjectCollectionsIds,
  getProjectCollectionsMetadata,
  getProjectCollectionsRequiringChunking
} from '../project'

import useEdscStore from '../../useEdscStore'

describe('project selectors', () => {
  describe('getProjectCollectionsIds', () => {
    test('returns the project collection IDs', () => {
      useEdscStore.setState(() => ({
        project: {
          collections: {
            allIds: ['collection1', 'collection2']
          }
        }
      }))

      const result = getProjectCollectionsIds(useEdscStore.getState())
      expect(result).toEqual(['collection1', 'collection2'])
    })
  })

  describe('getProjectCollections', () => {
    test('returns the project collections metadata', () => {
      useEdscStore.setState(() => ({
        project: {
          collections: {
            allIds: ['collection1', 'collection2'],
            byId: {
              collection1: { id: 'collection1' },
              collection2: { id: 'collection2' }
            }
          }
        }
      }))

      const result = getProjectCollections(useEdscStore.getState())
      expect(result).toEqual({
        collection1: { id: 'collection1' },
        collection2: { id: 'collection2' }
      })
    })
  })

  describe('getProjectCollectionsMetadata', () => {
    test('returns metadata for project collections', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionMetadata: {
            collection1: {
              title: 'Collection 1'
            },
            collection2: {
              title: 'Collection 2'
            },
            collection3: {
              title: 'Collection 3'
            }
          }
        },
        project: {
          collections: {
            allIds: ['collection1', 'collection2']
          }
        }
      }))

      const result = getProjectCollectionsMetadata(useEdscStore.getState())
      expect(result).toEqual({
        collection1: { title: 'Collection 1' },
        collection2: { title: 'Collection 2' }
      })
    })

    test('returns an empty object if no project collections exist', () => {
      useEdscStore.setState(() => ({
        project: {
          collections: {
            allIds: [],
            byId: {}
          }
        }
      }))

      const result = getProjectCollectionsMetadata(useEdscStore.getState())
      expect(result).toEqual({})
    })
  })

  describe('getFocusedProjectCollection', () => {
    test('returns the project collection for the focused collection ID', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1'
        },
        project: {
          collections: {
            allIds: ['collection1', 'collection2'],
            byId: {
              collection1: { id: 'collection1' },
              collection2: { id: 'collection2' }
            }
          }
        }
      }))

      const result = getFocusedProjectCollection(useEdscStore.getState())
      expect(result).toEqual({ id: 'collection1' })
    })

    test('returns an empty object if the focused collection is not in the project', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection3' // Not in project collections
        },
        project: {
          collections: {
            allIds: ['collection1', 'collection2'],
            byId: {}
          }
        }
      }))

      const result = getFocusedProjectCollection(useEdscStore.getState())
      expect(result).toEqual({})
    })

    test('returns an empty object if no focused collection exists', () => {
      const result = getFocusedProjectCollection(useEdscStore.getInitialState())
      expect(result).toEqual({})
    })
  })

  describe('getProjectCollectionsRequiringChunking', () => {
    test('returns project collections requiring chunking', () => {
      useEdscStore.setState(() => ({
        project: {
          collections: {
            allIds: ['collection1', 'collection2'],
            byId: {
              collection1: {
                granules: {
                  count: 3000
                },
                selectedAccessMethod: 'download'
              },
              collection2: {
                granules: {
                  count: 3000
                },
                selectedAccessMethod: 'esi0'
              }
            }
          }
        }
      }))

      const result = getProjectCollectionsRequiringChunking(useEdscStore.getState())
      expect(result).toEqual({
        collection2: {
          granules: {
            count: 3000
          },
          selectedAccessMethod: 'esi0'
        }
      })
    })
  })
})
