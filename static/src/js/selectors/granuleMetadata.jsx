import { createSelector } from 'reselect'

import { getFocusedGranuleId } from './focusedGranule'

/**
 * Retrieve all granule metadata from Redux
 * @param {Object} state Current state of Redux
 */
export const getGranulesMetadata = (state) => {
  const { metadata = {} } = state
  const { granules = {} } = metadata

  return granules
}

/**
 * Retrieve metadata from Redux pertaining to the focused granule id
 */
export const getFocusedGranuleMetadata = createSelector(
  [getFocusedGranuleId, getGranulesMetadata],
  (focusedGranuleId, granulesMetadata) => {
    const { [focusedGranuleId]: granuleMetadata = {} } = granulesMetadata

    return granuleMetadata
  }
)
