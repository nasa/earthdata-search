import { createSelector } from 'reselect'

import { getFocusedGranuleId } from './focusedGranule'

export const getGranulesMetadata = (state) => {
  const { metadata = {} } = state
  const { granules = {} } = metadata

  return granules
}

export const getGranuleMetadata = id => createSelector(
  getGranulesMetadata,
  (GranulesMetadata) => {
    const { [id]: GranuleMetadata = {} } = GranulesMetadata

    return GranuleMetadata
  }
)

export const getFocusedGranuleMetadata = createSelector(
  [getFocusedGranuleId, getGranulesMetadata],
  (focusedGranuleId, GranulesMetadata) => {
    const { [focusedGranuleId]: GranuleMetadata = {} } = GranulesMetadata

    return GranuleMetadata
  }
)
