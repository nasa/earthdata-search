import { encodeTemporal } from './url/temporalEncoders'

/**
 * Prepare parameters used in getCollections() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in Collections request
 */
const prepareCollectionParams = (state) => {
  const {
    facetsParams,
    query
  } = state

  const { collection: collectionQuery } = query

  const {
    keyword,
    pageNum,
    spatial = {},
    temporal = {}
  } = collectionQuery

  const {
    boundingBox,
    point,
    polygon
  } = spatial

  const temporalString = encodeTemporal(temporal)

  const {
    cmr: cmrFacets = {},
    feature: featureFacets = {}
  } = facetsParams

  const tagKey = []
  if (featureFacets.customizable) tagKey.push('edsc.extra.subset_service.*')
  if (featureFacets.mapImagery) tagKey.push('edsc.extra.gibs')

  return {
    boundingBox,
    cmrFacets,
    featureFacets,
    keyword,
    pageNum,
    point,
    polygon,
    tagKey,
    temporalString
  }
}

export default prepareCollectionParams
