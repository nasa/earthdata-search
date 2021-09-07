import moment from 'moment'
import { getValueForTag } from '../../../../../sharedUtils/tags'
import { mbr } from '../map/mbr'

/**
 * Returns the value for a given UMM-T handoff input
 * @param {Object} params
 * @param {Object} params.collectionMetadata Collection metadata from CMR
 * @param {Object} params.collectionQuery Collection Query data from Redux
 * @param {Object} params.handoffInput UMM-T handoff query input
 * @param {Object} params.handoffs Handoffs data from from Redux
 */
export const getHandoffValue = ({
  collectionMetadata = {},
  collectionQuery = {},
  handoffInput,
  handoffs
}) => {
  const {
    valueType
  } = handoffInput

  const {
    temporal = {},
    spatial = {}
  } = collectionQuery

  const { endDate, startDate } = temporal

  let value = ''

  // Bounding Box value
  if (valueType === 'https://schema.org/box') {
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

      value = `${swLng},${swLat},${neLng},${neLat}`
    }
  }

  // Start Date value
  if (valueType === 'https://schema.org/startDate' && startDate) {
    value = moment.utc(startDate).toISOString()
  }

  // End Date value
  if (valueType === 'https://schema.org/endDate' && endDate) {
    value = moment.utc(endDate).toISOString()
  }

  // Layers value
  if (valueType === 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming') {
    // There is SOTO specific logic here. In the future this might need to be more generic, or the name
    // of the handoff passed in to this util function
    const { sotoLayers = [] } = handoffs
    const { tags } = collectionMetadata
    const gibsOptions = getValueForTag('gibs', tags)

    if (gibsOptions) {
      const gibsLayers = gibsOptions.map(data => data.product)

      // Filter out layers that are not included in SOTO's capabilities
      const includedSotoLayers = gibsLayers.filter(layer => sotoLayers.includes(layer))

      // In order for the layers in SOTO to be active when the user is handed off, `(la=true)` needs to be
      // added to each layer in the URL
      value = includedSotoLayers.map(data => `${data}(la=true)`)
    }
  }

  // Data Keyword value (probably needs a different valueType after Giovanni UMM-T exists)
  if (valueType === 'dataKeyword') {
    const { shortName = '' } = collectionMetadata
    value = shortName
  }

  return value
}
