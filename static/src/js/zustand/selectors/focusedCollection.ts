import { EdscStore } from '../types'

/**
 * Retrieve the id of the focused collection
 */
export const getFocusedCollectionId = (
  state: EdscStore
) => state.focusedCollection.focusedCollection || ''
