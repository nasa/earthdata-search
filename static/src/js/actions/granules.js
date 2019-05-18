import { populateGranuleResults, prepareGranuleParams } from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import CwicGranuleRequest from '../util/request/cwic'
import {
  ADD_MORE_GRANULE_RESULTS,
  ERRORED_GRANULES,
  EXCLUDE_GRANULE_ID,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  UPDATE_GRANULE_RESULTS,
  ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_GRANULE_METADATA
} from '../constants/actionTypes'
import { updateAuthFromHeaders } from './auth'

export const addGranulesFromCollection = payload => ({
  type: ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  payload
})

export const addMoreGranuleResults = payload => ({
  type: ADD_MORE_GRANULE_RESULTS,
  payload
})

export const updateGranuleResults = payload => ({
  type: UPDATE_GRANULE_RESULTS,
  payload
})

export const updateGranuleMetadata = payload => ({
  type: UPDATE_GRANULE_METADATA,
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

export const onExcludeGranule = payload => ({
  type: EXCLUDE_GRANULE_ID,
  payload
})

export const onUndoExcludeGranule = payload => ({
  type: UNDO_EXCLUDE_GRANULE_ID,
  payload
})

export const excludeGranule = data => (dispatch) => {
  const { collectionId, granuleId } = data
  dispatch(onExcludeGranule({
    collectionId,
    granuleId
  }))
}

export const undoExcludeGranule = collectionId => (dispatch) => {
  dispatch(onUndoExcludeGranule(collectionId))
}

export const getGranules = () => (dispatch, getState) => {
  const granuleParams = prepareGranuleParams(getState())

  if (!granuleParams) {
    dispatch(updateGranuleResults({
      results: []
    }))
    return null
  }

  const {
    auth,
    boundingBox,
    collectionId,
    isCwicCollection,
    pageNum,
    point,
    polygon,
    temporalString
  } = granuleParams

  dispatch(onGranulesLoading())
  dispatch(startGranulesTimer())

  let requestObject = null
  if (isCwicCollection) {
    requestObject = new CwicGranuleRequest()
  } else {
    requestObject = new GranuleRequest(auth !== '')
  }

  const response = requestObject.search({
    boundingBox,
    echoCollectionId: collectionId,
    pageNum,
    pageSize: 20,
    point,
    polygon,
    sortKey: '-start_date',
    temporal: temporalString
  })
    .then((response) => {
      const payload = populateGranuleResults(collectionId, isCwicCollection, response)

      dispatch(finishGranulesTimer())
      dispatch(updateAuthFromHeaders(response.headers))
      dispatch(onGranulesLoaded({
        loaded: true
      }))

      if (pageNum === 1) {
        dispatch(updateGranuleResults(payload))
      } else {
        dispatch(addMoreGranuleResults(payload))
      }
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
