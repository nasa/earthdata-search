import { EdscStore } from '../types'

/**
 * Retrieve the id of the focused granule
 */
export const getGranuleId = (
  state: EdscStore
) => state.granule.granuleId || ''

/**
 * Retrieve the metadata of all focused granules
 */
export const getGranuleMetadata = (
  state: EdscStore
) => state.granule.granuleMetadata || {}

/**
 * Retrieve the metadata of the focused granule
 */
export const getFocusedGranule = (
  state: EdscStore
) => {
  const granuleId = getGranuleId(state)
  const granuleMetadata = getGranuleMetadata(state)

  return granuleMetadata[granuleId] || {}
}
