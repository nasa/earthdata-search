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

  const { short_name: shortName } = collectionMetadata

  const params = {
    product: shortName
  }

  const { spatial, temporal } = collectionSearch

  if (temporal) {
    const { endDate, startDate } = temporal

    if (startDate) {
      params.start_date = moment.utc(startDate).format('YYYY-MM-DD')
    }

    if (endDate) {
      params.end_date = moment.utc(endDate).format('YYYY-MM-DD')
    }
  }

  if (spatial) {
    const {
      boundingBox = [],
      circle = [],
      point = [],
      polygon = []
    } = spatial
    // Find the minimum bounding rectangle to use for spatial
    const spatialMbr = mbr({
      boundingBox: boundingBox[0],
      circle: circle[0],
      point: point[0],
      polygon: polygon[0]
    })

    if (spatialMbr) {
      const {
        swLat,
        swLng,
        neLat,
        neLng
      } = spatialMbr

      params.minx = swLng
      params.miny = swLat
      params.maxx = neLng
      params.maxy = neLat
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
