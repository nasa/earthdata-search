import { getCollections, getCollectionsPageInfo } from '../collections'

import useEdscStore from '../../useEdscStore'

describe('collections selectors', () => {
  describe('getCollections', () => {
    test('returns the collections', () => {
      useEdscStore.setState(() => ({
        collections: {
          collections: {
            count: 1,
            isLoaded: true,
            isLoading: false,
            loadTime: 100,
            items: [{
              id: 'collection1',
              title: 'Collection 1',
              description: 'Description for Collection 1'
            }]
          }
        }
      }))

      const result = getCollections(useEdscStore.getState())
      expect(result).toEqual({
        count: 1,
        isLoaded: true,
        isLoading: false,
        loadTime: 100,
        items: [{
          id: 'collection1',
          title: 'Collection 1',
          description: 'Description for Collection 1'
        }]
      })
    })
  })

  describe('getCollectionsPageInfo', () => {
    test('returns the pagination information for the collections', () => {
      useEdscStore.setState(() => ({
        collections: {
          collections: {
            count: 1,
            isLoaded: true,
            isLoading: false,
            loadTime: 100,
            items: [{
              id: 'collection1',
              title: 'Collection 1',
              description: 'Description for Collection 1'
            }]
          }
        }
      }))

      const result = getCollectionsPageInfo(useEdscStore.getState())
      expect(result).toEqual({
        count: 1,
        isLoaded: true,
        isLoading: false,
        loadTime: 100
      })
    })
  })
})
