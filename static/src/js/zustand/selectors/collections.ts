import type { EdscStore } from '../types'

/**
 * Retrieve the collections
 */
export const getCollections = (state: EdscStore) => state.collections.collections

/**
 * Retrieve the pagination information for the collections
 */
export const getCollectionsPageInfo = (state: EdscStore) => {
  const {
    count,
    isLoaded,
    isLoading,
    loadTime
  } = getCollections(state)

  return {
    count,
    isLoaded,
    isLoading,
    loadTime
  }
}
