import { EdscStore } from '../types'
import { getCollectionId } from './collection'

/**
 * Retrieve the map layers for the focused collection
 */
export const getFocusedCollectionMapLayers = (
  state: EdscStore
) => {
  const collectionId = getCollectionId(state)
  const { mapLayers } = state.map

  return mapLayers[collectionId] || []
}
