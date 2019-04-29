import populateGranuleResults from '../util/granules'
import { GranuleRequest } from '../util/request/cmr'
import CwicGranuleRequest from '../util/request/cwic'
import {
  LOADING_GRANULES,
  LOADED_GRANULES,
  UPDATE_GRANULES,
  ERRORED_GRANULES,
  STARTED_GRANULES_TIMER,
  FINISHED_GRANULES_TIMER
} from '../constants/actionTypes'
import { encodeTemporal } from '../util/url/temporalEncoders'

export const updateGranules = payload => ({
  type: UPDATE_GRANULES,
  payload
})

export const onGranulesLoading = () => ({
  type: LOADING_GRANULES
})

export const onGranulesLoaded = payload => ({
  type: LOADED_GRANULES,
  payload
})

export const onGranulesErrored = () => ({
  type: ERRORED_GRANULES
})

export const startGranulesTimer = () => ({
  type: STARTED_GRANULES_TIMER
})

export const finishGranulesTimer = () => ({
  type: FINISHED_GRANULES_TIMER
})

export const getGranules = () => (dispatch, getState) => {
  const {
    focusedCollection = {},
    query = {}
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

  dispatch(onGranulesLoading())
  dispatch(startGranulesTimer())

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
    sortKey: '-start_date',
    temporal: temporalString
  })
    .then((response) => {
      const payload = populateGranuleResults(collectionId, isCwicCollection, response)

      dispatch(finishGranulesTimer())
      dispatch(onGranulesLoaded({
        loaded: true
      }))
      dispatch(updateGranules(payload))
    })
    .catch((e) => {
      dispatch(onGranulesErrored())
      dispatch(finishGranulesTimer())
      dispatch(onGranulesLoaded({
        loaded: false
      }))

      if (e.response) {
        const { data } = e.response
        const { errors = [] } = data

        console.log(errors)
      } else {
        console.log(e)
      }
    })

  return response
}
