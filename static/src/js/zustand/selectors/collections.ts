import type { CollectionsMetadata } from '../../types/sharedTypes'
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

/**
 * Retrieve the collections in an object keyed by their ID
 */
export const getCollectionsById = (
  state: EdscStore
) => {
  const collections = getCollections(state)
  const { items = [] } = collections

  const collectionsById = {} as Record<string, CollectionsMetadata>

  items.forEach((collection) => {
    collectionsById[collection.id!] = collection
  })

  return collectionsById
}
