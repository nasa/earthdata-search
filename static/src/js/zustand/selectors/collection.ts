import { EdscStore } from '../types'

/**
 * Retrieve the id of the focused collection
 */
export const getCollectionId = (
  state: EdscStore
) => state.collection.collectionId || ''
