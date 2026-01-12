import { EdscStore } from '../types'

/**
 * Retrieve the viewAllFacets
 */
export const getViewAllFacets = (state: EdscStore) => state.facets.viewAllFacets

/**
 * Retrieve the pagination information for the viewAllFacets
 */
export const getViewAllFacetsPageInfo = (state: EdscStore) => {
  const {
    isLoaded,
    isLoading
  } = getViewAllFacets(state)

  return {
    isLoaded,
    isLoading
  }
}
