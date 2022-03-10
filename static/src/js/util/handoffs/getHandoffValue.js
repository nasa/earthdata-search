import moment from 'moment'

import { getValueForTag } from '../../../../../sharedUtils/tags'
import { mbr } from '../map/mbr'
import projections from '../map/projections'

/**
 * Returns the MBR of the collection query spatial
 * @param {Object} spatial Collection Query spatial
 */
const spatialMbr = (spatial) => {
  const {
    boundingBox = [],
    circle = [],
    point = [],
    polygon = []
  } = spatial

  // Find the minimum bounding rectangle to use for spatial
  return mbr({
    boundingBox: boundingBox[0],
    circle: circle[0],
    point: point[0],
    polygon: polygon[0]
  })
}

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
  handoffs,
  map = {}
}) => {
  const {
    valueType
  } = handoffInput

  const {
    temporal = {},
    spatial = {}
  } = collectionQuery
  const spatialExists = Object.values(spatial).filter(Boolean).length > 0

  const { endDate, startDate } = temporal

  let value

  // Concept ID value
  if (valueType === 'conceptId') {
    const { conceptId } = collectionMetadata
    value = conceptId
  }

  // Bounding box value
  if (valueType === 'https://schema.org/box' && spatialExists) {
    const {
      swLat,
      swLng,
      neLat,
      neLng
    } = spatialMbr(spatial)

    value = `${swLng},${swLat},${neLng},${neLat}`
  }

  // Bounding box values used in open altimetry
  if (valueType === 'minx' && spatialExists) {
    const { swLng } = spatialMbr(spatial)
    value = swLng
  }
  if (valueType === 'miny' && spatialExists) {
    const { swLat } = spatialMbr(spatial)
    value = swLat
  }
  if (valueType === 'maxx' && spatialExists) {
    const { neLng } = spatialMbr(spatial)
    value = neLng
  }
  if (valueType === 'maxy' && spatialExists) {
    const { neLat } = spatialMbr(spatial)
    value = neLat
  }

  // Start Time value
  if (valueType === 'https://schema.org/startDate' && startDate) {
    value = moment.utc(startDate).toISOString()
  }
  // Start date value
  if (valueType === 'startDate' && startDate) {
    value = moment.utc(startDate).format('YYYY-MM-DD')
  }

  // End Time value
  if (valueType === 'https://schema.org/endDate' && endDate) {
    value = moment.utc(endDate).toISOString()
  }
  // End Date value
  if (valueType === 'endDate' && endDate) {
    value = moment.utc(endDate).format('YYYY-MM-DD')
  }

  // Layers value
  if (valueType === 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming') {
    // There is SOTO specific logic here. In the future this might need to be more generic, or the name
    // of the handoff passed in to this util function
    const { sotoLayers = [] } = handoffs
    const { tags } = collectionMetadata
    const gibsOptions = getValueForTag('gibs', tags)

    if (gibsOptions) {
      const gibsLayers = gibsOptions.map((data) => data.product)

      // Filter out layers that are not included in SOTO's capabilities
      const includedSotoLayers = gibsLayers.filter((layer) => sotoLayers.includes(layer))

      // In order for the layers in SOTO to be active when the user is handed off, `(la=true)` needs to be
      // added to each layer in the URL
      value = includedSotoLayers.map((data) => `${data}(la=true)`)
    }
  }

  // Short name value
  if (valueType === 'shortName') {
    const { shortName } = collectionMetadata
    value = shortName
  }

  // Map projection value, translate to descriptive name from epsg value
  if (valueType === 'mapProjection') {
    const { projection } = map
    switch (projection) {
      case projections.arctic:
        value = 'arctic'
        break
      case projections.antarctic:
        value = 'antarctic'
        break
      default:
        value = 'geographic'
    }
  }

  // Map projection in EPSG code values
  if (valueType === 'https://spatialreference.org/ref/epsg/') {
    const { projection } = map
    switch (projection) {
      case projections.arctic:
        value = 'EPSG:3413'
        break
      case projections.antarctic:
        value = 'EPSG:3031'
        break
      default:
        value = 'EPSG:4326'
    }
  }

  // Map center point latitude
  if (valueType === 'https://schema.org/latitude') {
    const { latitude } = map
    value = latitude
  }

  // Map center point longitude
  if (valueType === 'https://schema.org/longitude') {
    const { longitude } = map
    value = longitude
  }

  // Zoom level of map
  if (valueType === 'zoom') {
    const { zoom } = map
    value = zoom
  }

  /*
  * The following valueTypes are specific to EDSC, but are handled here as a test for our UMM-T record
  */
  // EDSC map base layer
  if (valueType === 'edscBaseLayer') {
    const { base = {} } = map
    const {
      blueMarble,
      trueColor,
      landWaterMap
    } = base

    if (blueMarble) value = 'blueMarble'
    if (trueColor) value = 'trueColor'
    if (landWaterMap) value = 'landWaterMap'
  }

  // EDSC map overlay layers
  if (valueType === 'edscOverlayLayers') {
    const { overlays = {} } = map
    const {
      coastlines,
      referenceFeatures,
      referenceLabels
    } = overlays
    const values = []

    if (coastlines) values.push('coastlines')
    if (referenceFeatures) values.push('referenceFeatures')
    if (referenceLabels) values.push('referenceLabels')

    if (values.length > 0) {
      value = values.join(',')
    }
  }

  // EDSC keyword search box value
  if (valueType === 'edscTextQuery') {
    const { keyword } = collectionQuery
    value = keyword
  }

  return value
}
