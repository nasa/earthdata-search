import { createSelector } from 'reselect'

import useEdscStore from '../zustand/useEdscStore'
import { getGranuleId } from '../zustand/selectors/granule'

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
 * Temporary selector to retrieve the focused granule id from Zustand. This
 * will be removed when the Redux selectors using it are moved to Zustand.
 */
// eslint-disable-next-line camelcase
export const TEMP_getGranuleId = () => getGranuleId(useEdscStore.getState())

/**
 * Retrieve metadata from Redux pertaining to the focused granule id
 */
export const getFocusedGranuleMetadata = createSelector(
  // eslint-disable-next-line camelcase
  [TEMP_getGranuleId, getGranulesMetadata],
  (focusedGranuleId, granulesMetadata) => {
    const { [focusedGranuleId]: granuleMetadata = {} } = granulesMetadata

    return granuleMetadata
  }
)
