import { difference } from 'lodash'
import murmurhash3 from './murmurhash3'

/**
 * Returns granuleIds that are not excluded
 * @param {Object} granules Granules from the searchResults store
 * @param {Array} excludedGranuleIds Excluded granule IDs
 * @param {Boolean} isCwic Are the granules CWIC granules
 * @param {Integer} limit Optional, limit the number of granule IDs returned
 */
export const getGranuleIds = ({
  allIds,
  excludedGranuleIds,
  isCwic,
  limit
}) => {
  const allGranuleIds = allIds

  let granuleIds

  if (isCwic) {
    granuleIds = allGranuleIds.filter((id) => {
      const hashedId = murmurhash3(id).toString()
      return excludedGranuleIds.indexOf(hashedId) === -1
    })
  } else {
    granuleIds = difference(allGranuleIds, excludedGranuleIds)
  }

  // TODO: This value should always be a number
  if (limit) {
    return granuleIds.slice(0, limit)
  }

  return granuleIds
}
