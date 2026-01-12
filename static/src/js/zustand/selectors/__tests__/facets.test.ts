import { getViewAllFacets, getViewAllFacetsPageInfo } from '../facets'

import useEdscStore from '../../useEdscStore'

describe('facets selectors', () => {
  describe('getViewAllFacets', () => {
    test('returns the viewAllFacets', () => {
      useEdscStore.setState(() => ({
        facets: {
          viewAllFacets: {
            allIds: [],
            byId: {},
            collectionCount: 0,
            isLoaded: false,
            isLoading: false,
            selectedCatagory: null
          }
        }
      }))

      const result = getViewAllFacets(useEdscStore.getState())
      expect(result).toEqual({
        allIds: [],
        byId: {},
        collectionCount: 0,
        isLoaded: false,
        isLoading: false,
        selectedCatagory: null
      })
    })
  })

  describe('getViewAllFacetsPageInfo', () => {
    test('returns the pagination information for the viewAllFacets', () => {
      useEdscStore.setState(() => ({
        facets: {
          viewAllFacets: {
            allIds: [],
            byId: {},
            collectionCount: 0,
            isLoaded: false,
            isLoading: false,
            selectedCatagory: null
          }
        }
      }))

      const result = getViewAllFacetsPageInfo(useEdscStore.getState())
      expect(result).toEqual({
        isLoaded: false,
        isLoading: false
      })
    })
  })
})
