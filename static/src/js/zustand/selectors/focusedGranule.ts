import { EdscStore } from '../types'

/**
 * Retrieve the id of the focused granule
 */
export const getFocusedGranuleId = (
  state: EdscStore
) => state.focusedGranule.focusedGranule || ''
