/**
 * Returns the granule hits minus the number of excluded granules
 * @param {Object} collection - Collection object from the redux store
 * @param {Object} projectCollection - An optional projectCollection to account for added or removed granules.
 */
export const getGranuleCount = (collection, projectCollection = {}) => {
  const { excludedGranuleIds = [], granules = {} } = collection
  const { hits = 0 } = granules
  const {
    addedGranuleIds = [],
    removedGranuleIds = []
  } = projectCollection

  if (hits > 0) {
    // If granules have been added, use that count.
    if (addedGranuleIds.length > 0) {
      return addedGranuleIds.length
    }

    // If removed granules exist, remove any duplicate exluded granules
    // and subtract that count from hits.
    if (removedGranuleIds.length > 0 || excludedGranuleIds.length > 0) {
      const uniqueRemovedIds = [
        ...new Set(
          [
            ...removedGranuleIds,
            ...excludedGranuleIds
          ]
        )
      ]

      const projectCount = hits - uniqueRemovedIds.length

      if (projectCount > 0) return projectCount

      return hits
    }
  }

  return hits
}
