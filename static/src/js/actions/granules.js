import { populateGranuleResults, prepareGranuleParams } from '../util/granules'
import { GranuleRequest } from '../util/request/cmr'
import CwicGranuleRequest from '../util/request/cwic'
import {
  ADD_MORE_GRANULES,
  ERRORED_GRANULES,
  EXCLUDE_GRANULE_ID,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  UPDATE_GRANULES,
  ADD_GRANULES_FROM_COLLECTIONS
} from '../constants/actionTypes'

export const addGranulesFromCollection = payload => ({
  type: ADD_GRANULES_FROM_COLLECTIONS,
  payload
})

export const addMoreGranules = payload => ({
  type: ADD_MORE_GRANULES,
  payload
})

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

export const onExcludeGranule = payload => ({
  type: EXCLUDE_GRANULE_ID,
  payload
})

export const excludeGranule = data => (dispatch) => {
  const { collectionId, granuleId } = data
  dispatch(onExcludeGranule({
    collectionId,
    granuleId
  }))
}

export const getGranules = () => (dispatch, getState) => {
  const granuleParams = prepareGranuleParams(getState())

  if (!granuleParams) {
    dispatch(updateGranules({
      results: []
    }))
    return null
  }

  const {
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
    requestObject = new GranuleRequest()
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
      dispatch(onGranulesLoaded({
        loaded: true
      }))

      if (pageNum === 1) {
        dispatch(updateGranules(payload))
      } else {
        dispatch(addMoreGranules(payload))
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
