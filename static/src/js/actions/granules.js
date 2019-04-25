import populateGranuleResults from '../util/granules'
import { GranuleRequest } from '../util/request/cmr'
import CwicGranuleRequest from '../util/request/cwic'
import { UPDATE_GRANULES } from '../constants/actionTypes'
import { encodeTemporal } from '../util/url/temporalEncoders'

export const updateGranules = payload => ({
  type: UPDATE_GRANULES,
  payload
})

export const getGranules = () => (dispatch, getState) => {
  const {
    focusedCollection = {},
    query
  } = getState()

  const {
    spatial = {},
    temporal = {}
  } = query

  const {
    boundingBox,
    point
  } = spatial

  const { collectionId } = focusedCollection

  if (!collectionId) {
    dispatch(updateGranules({
      results: []
    }))
    return null
  }

  const { metadata = {} } = focusedCollection
  const { tags = {} } = metadata

  const temporalString = encodeTemporal(temporal)

  const isCwicCollection = Object.keys(tags).includes('org.ceos.wgiss.cwic.granules.prod')
    && !focusedCollection.metadata.has_granules

  let requestObject = null
  if (isCwicCollection) {
    requestObject = new CwicGranuleRequest()
  } else {
    requestObject = new GranuleRequest()
  }

  const response = requestObject.search({
    boundingBox,
    echoCollectionId: collectionId,
    pageNum: 1,
    pageSize: 20,
    point,
    temporal: temporalString
  })
    .then((response) => {
      const payload = populateGranuleResults(collectionId, isCwicCollection, response)

      dispatch(updateGranules(payload))
    }, (error) => {
      throw new Error('Request failed', error)
    })
    .catch(() => {
      console.log('Promise Rejected')
    })

  return response
}
