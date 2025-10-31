import type { EdscStore } from '../types'

/**
 * Get colormap data from collection metadata
 * @param state - The Zustand state
 * @returns Object with colormap data by product name
 */
export const getColormapsMetadata = (state: EdscStore) => {
  const { collection } = state
  const { collectionMetadata } = collection
  const { collectionId } = collection

  if (!collectionId || !collectionMetadata[collectionId]) {
    return {}
  }

  const { colormaps = {} } = collectionMetadata[collectionId]

  return colormaps
}
