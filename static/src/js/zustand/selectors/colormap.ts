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

  console.log('🚀 ~ file: colormap.ts:11 ~ collectionMetadata:', collectionMetadata)
  const { colormaps = {} } = collectionMetadata[collectionId]
  console.log('🚀 ~ file: colormap.ts:18 ~ colormaps:', colormaps)

  return colormaps
}
