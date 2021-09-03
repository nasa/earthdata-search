import moment from 'moment'
import { getValueForTag } from '../../../../../sharedUtils/tags'

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
    const { boundingBox } = spatial

    if (boundingBox) {
      const [firstBoundingBox] = boundingBox
      value = firstBoundingBox
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
    const { sotoLayers = [] } = handoffs
    const { tags } = collectionMetadata
    const gibsOptions = getValueForTag('gibs', tags)

    if (gibsOptions) {
      const gibsLayers = gibsOptions.map(data => data.product)

      // Filter out layers that are not included in SOTO's capabilities
      const includedSotoLayers = gibsLayers.filter(layer => sotoLayers.includes(layer))
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
