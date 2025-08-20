import type { GranulesMetadata } from '../../types/sharedTypes'
import type { EdscStore } from '../types'

/**
 * Retrieve the granules
 */
export const getGranules = (
  state: EdscStore
) => state.granules.granules

/**
 * Retrieve the granules in an object keyed by their ID
 */
export const getGranulesById = (
  state: EdscStore
) => {
  const granules = getGranules(state)
  const { items = [] } = granules

  const granulesById = {} as GranulesMetadata

  items.forEach((granule) => {
    granulesById[granule.id] = granule
  })

  return granulesById
}
