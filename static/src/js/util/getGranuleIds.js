import { difference } from 'lodash'
import murmurhash3 from './murmurhash3'

/**
 * Returns granuleIds that are not excluded
 * @param {Array} allIds Granules IDs from the searchResults store
 * @param {Array} excludedGranuleIds Excluded granule IDs
 * @param {Boolean} isOpenSearch Are the granules CWIC granules
 * @param {Integer} limit Optional, limit the number of granule IDs returned
 */
export const getGranuleIds = ({
  allIds = [],
  excludedGranuleIds,
  isOpenSearch,
  limit
}) => {
  let granuleIds

  if (isOpenSearch) {
    granuleIds = allIds.filter((id) => {
      const hashedId = murmurhash3(id).toString()
      return excludedGranuleIds.indexOf(hashedId) === -1
    })
  } else {
    granuleIds = difference(allIds, excludedGranuleIds)
  }

  // TODO: This value should always be a number
  if (limit) {
    return granuleIds.slice(0, limit)
  }

  return granuleIds
}
