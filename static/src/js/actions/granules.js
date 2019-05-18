import { populateGranuleResults, prepareGranuleParams } from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import CwicGranuleRequest from '../util/request/cwic'
import {
  ADD_MORE_GRANULES,
  LOADING_GRANULES,
  LOADED_GRANULES,
  UPDATE_GRANULES,
  ERRORED_GRANULES,
  STARTED_GRANULES_TIMER,
  FINISHED_GRANULES_TIMER
} from '../constants/actionTypes'
import { updateAuthFromHeaders } from './auth'

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

export const getGranules = () => (dispatch, getState) => {
  const granuleParams = prepareGranuleParams(getState())

  if (!granuleParams) {
    dispatch(updateGranules({
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
