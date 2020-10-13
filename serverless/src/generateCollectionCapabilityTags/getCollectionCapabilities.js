import { getSingleGranule } from '../util/cmr/getSingleGranule'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Returns tags for a collection based on a single granule sample
 * @param {String} cmrToken The CMR token used to authenticate the request
 * @param {Object} collection Collection metadata
 */
export const getCollectionCapabilities = async (cmrToken, collection) => {
  const {
    id
  } = collection

  try {
    const singleGranule = await getSingleGranule(cmrToken, id)

    const {
      cloud_cover: cloudCover = '',
      day_night_flag: dayNightFlag,
      online_access_flag: onlineAccessFlag = false,
      orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains = {}
    } = singleGranule

    return {
      cloud_cover: !!cloudCover,
      day_night_flag: !!dayNightFlag && ['DAY', 'NIGHT', 'BOTH'].includes(dayNightFlag.toUpperCase()),
      granule_online_access_flag: onlineAccessFlag,
      orbit_calculated_spatial_domains: Object.keys(orbitCalculatedSpatialDomains).length > 0
    }
  } catch (e) {
    parseError(e)

    // In the event of an error set all capabilities to false
    return {
      cloud_cover: false,
      day_night_flag: false,
      granule_online_access_flag: false,
      orbit_calculated_spatial_domains: false
    }
  }
}
