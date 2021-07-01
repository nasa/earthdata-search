import { getPageOfGranules } from '../util/cmr/getPageOfGranules'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Returns a small object related to collection capabilities based on the granules provided or those retrieved using the token and collection id
 * @param {String} cmrToken The CMR token used to authenticate the request
 * @param {String} collection Collection metadata
 * @param {Array<Object>} granules List of granules to examine
 */
export const getCollectionCapabilities = async ({
  cmrToken,
  collection,
  granules = []
}) => {
  const {
    id
  } = collection

  try {
    let granuleList = granules

    // If no granules were provided, retrieve them
    if (granuleList.length === 0) {
      granuleList = await getPageOfGranules(cmrToken, id)
    }

    let collectionCloudCover = ''
    let collectionDayNightFlag = false
    let collectionOnlineAccessFlag = false
    let collectionOrbitCalculatedSpatialDomains = {}

    granuleList.forEach((granule) => {
      const {
        cloud_cover: cloudCover = '',
        day_night_flag: dayNightFlag = '',
        online_access_flag: onlineAccessFlag = false,
        orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains = {}
      } = granule

      if (cloudCover) collectionCloudCover = cloudCover

      // Prevent changing the value once it has been set to true by only setting the value
      // if the flag is still false
      if (collectionDayNightFlag === false) {
        collectionDayNightFlag = !!dayNightFlag && ['DAY', 'NIGHT', 'BOTH'].includes(dayNightFlag.toUpperCase())
      }

      if (onlineAccessFlag) collectionOnlineAccessFlag = true

      collectionOrbitCalculatedSpatialDomains = {
        ...collectionOrbitCalculatedSpatialDomains,
        ...orbitCalculatedSpatialDomains
      }
    })

    return {
      cloud_cover: !!collectionCloudCover,
      day_night_flag: collectionDayNightFlag,
      granule_online_access_flag: collectionOnlineAccessFlag,
      orbit_calculated_spatial_domains: Object.keys(
        collectionOrbitCalculatedSpatialDomains
      ).length > 0,
      updated_at: new Date().toISOString()
    }
  } catch (e) {
    parseError(e)

    // In the event of an error set all capabilities to false
    return {
      cloud_cover: false,
      day_night_flag: false,
      granule_online_access_flag: false,
      orbit_calculated_spatial_domains: false,
      updated_at: new Date().toISOString()
    }
  }
}
