import moment from 'moment'
import { stringify } from 'qs'
import { mbr } from '../map/mbr'
import projections from '../map/projections'

/**
 * Generate and return a URL to handoff the EDSC context to Open Altimetry
 * @param {Object} collectionMetadata Collection metadata from CMR
 * @param {Object} collectionSearch Collection Search data from Redux
 */
export const fetchOpenAltimetryHandoffUrl = (
  collectionMetadata,
  collectionSearch = {},
  mapProjection
) => {
  const openAltimetryRoot = 'https://openaltimetry.org/data/icesat2/'

  const {
    time_end: endDate = null,
    time_start: startDate = null
  } = collectionMetadata

  const params = {}

  const { spatial } = collectionSearch

  if (endDate || startDate) {
    params.start_date = moment.utc(startDate || Date.now()).format('YYYY-MM-DD')
    params.end_date = moment.utc(endDate || Date.now()).format('YYYY-MM-DD')
  }

  if (spatial) {
    // Find the minimum bounding rectangle to use for spatial
    const spatialMbr = mbr(spatial)

    if (spatialMbr) {
      const [miny, minx, maxy, maxx] = spatialMbr

      params.minx = minx
      params.miny = miny
      params.maxx = maxx
      params.maxy = maxy
    }
  }

  let mapType
  switch (mapProjection) {
    case projections.arctic:
      mapType = 'arctic'
      break
    case projections.antarctic:
      mapType = 'antarctic'
      break
    default:
      mapType = 'geographic'
  }
  params.mapType = mapType

  const openAltimetryUrl = `${openAltimetryRoot}?${stringify(params)}`

  return {
    title: 'Open Altimetry',
    href: openAltimetryUrl
  }
}
