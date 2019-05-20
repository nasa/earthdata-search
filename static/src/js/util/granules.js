import { encodeTemporal } from './url/temporalEncoders'

/**
 * Populate granule payload used to update the store
 * @param {string} collectionId
 * @param {boolean} isCwic
 * @param {object} response
 * @returns Granule payload
 */
export const populateGranuleResults = (collectionId, isCwic, response) => {
  const payload = {}

  payload.collectionId = collectionId
  payload.results = response.data.feed.entry
  payload.isCwic = isCwic

  if (isCwic) {
    payload.hits = response.data.feed.hits
  } else {
    payload.hits = parseInt(response.headers['cmr-hits'], 10)
  }

  return payload
}

/**
 * Prepare parameters used in getGranules() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in Granules request
 */
export const prepareGranuleParams = (state) => {
  const {
    authToken,
    focusedCollection = {},
    query = {}
  } = state

  // If we don't have a focusedCollection, bail out!
  const { collectionId } = focusedCollection
  if (!collectionId) {
    return null
  }

  const {
    collection: collectionQuery,
    granule: granuleQuery
  } = query

  const {
    spatial = {},
    temporal = {}
  } = collectionQuery

  const { pageNum } = granuleQuery

  const {
    boundingBox,
    point,
    polygon
  } = spatial

  const { metadata = {} } = focusedCollection
  const { tags = {} } = metadata

  const temporalString = encodeTemporal(temporal)

  const isCwicCollection = Object.keys(tags).includes('org.ceos.wgiss.cwic.granules.prod')
    && !focusedCollection.metadata.has_granules

  return {
    authToken,
    boundingBox,
    collectionId,
    isCwicCollection,
    pageNum,
    point,
    polygon,
    temporalString
  }
}
