import moment from 'moment'
import { stringify } from 'qs'

/**
 * Generate and return a URL to handoff the EDSC context to Giovanni
 * @param {Object} collectionMetadata Collection metadata from CMR
 * @param {Object} collectionSearch Collection Search data from Redux
 */
export const fetchGiovanniHandoffUrl = (collectionMetadata, collectionSearch = {}) => {
  const giovanniRoot = 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'

  const { short_name: shortName } = collectionMetadata

  const subsettingParams = {
    dataKeyword: shortName
  }

  const {
    temporal,
    spatial
  } = collectionSearch

  if (temporal) {
    const { endDate, startDate } = temporal

    // Giovanni requires both start and end dates for temporal searching
    if (startDate && endDate) {
      subsettingParams.starttime = moment.utc(startDate).toISOString()
      subsettingParams.endtime = moment.utc(endDate).toISOString()
    }
  }

  if (spatial) {
    // Giovanni only supports bounding box for spatial serach
    const { boundingBox } = spatial

    if (boundingBox) {
      subsettingParams.bbox = boundingBox
    }
  }

  const giovanniUrl = [
    giovanniRoot,
    stringify(subsettingParams)
  ].join('&')

  return {
    title: 'Giovanni',
    href: giovanniUrl
  }
}
