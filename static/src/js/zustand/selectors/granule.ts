import { EdscStore } from '../types'

/**
 * Retrieve the id of the focused granule
 */
export const getGranuleId = (
  state: EdscStore
) => state.granule.granuleId || ''
