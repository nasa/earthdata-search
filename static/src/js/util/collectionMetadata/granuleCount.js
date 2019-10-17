/**
 * Returns the granule hits minus the number of excluded granules
 * @param {Object} granules Granules object from the redux store
 * @param {Object} collection Collection object from the redux store
 */
export const getGranuleCount = (granules, collection) => {
  const { hits } = granules
  const { excludedGranuleIds = [] } = collection

  let granuleCount

  if (hits > 0) {
    if (excludedGranuleIds.length > 0) {
      granuleCount = hits - excludedGranuleIds.length
    } else {
      granuleCount = hits
    }
  }

  return granuleCount
}
