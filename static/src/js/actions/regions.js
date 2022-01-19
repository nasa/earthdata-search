import actions from './index'

import {
  UPDATE_REGION_RESULTS,
  LOADING_REGIONS,
  LOADED_REGIONS,
  STARTED_REGIONS_TIMER,
  FINISHED_REGIONS_TIMER,
  ERRORED_REGIONS
} from '../constants/actionTypes'

import { displayNotificationType } from '../constants/enums'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { prepareRegionParams } from '../util/regions'

import RegionRequest from '../util/request/regionRequest'

export const updateRegionResults = (payload) => ({
  type: UPDATE_REGION_RESULTS,
  payload
})

export const onRegionsLoading = () => ({
  type: LOADING_REGIONS
})

export const onRegionsLoaded = (payload) => ({
  type: LOADED_REGIONS,
  payload
})

export const onRegionsErrored = (payload) => ({
  type: ERRORED_REGIONS,
  payload
})

export const startRegionsTimer = () => ({
  type: STARTED_REGIONS_TIMER
})

export const finishRegionsTimer = () => ({
  type: FINISHED_REGIONS_TIMER
})

/**
 * Perform a collections request based on the current redux state.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */
export const getRegions = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const regionParams = prepareRegionParams(state)

  const {
    query
  } = regionParams

  dispatch(onRegionsLoading())
  dispatch(startRegionsTimer())

  const requestObject = new RegionRequest(earthdataEnvironment)

  const response = requestObject.search(regionParams)
    .then((response) => {
      const payload = {}
      const { data } = response
      const { hits, results } = data

      payload.hits = hits
      payload.keyword = query
      payload.results = results

      dispatch(finishRegionsTimer())
      dispatch(onRegionsLoaded({
        loaded: true
      }))
      dispatch(updateRegionResults(payload))
    })
    .catch((error) => {
      dispatch(finishRegionsTimer())

      const { response } = error
      const { data } = response
      const { errors } = data

      dispatch(onRegionsErrored(errors))
      dispatch(onRegionsLoaded({
        loaded: false
      }))
      dispatch(actions.handleError({
        error,
        action: 'getRegions',
        resource: 'regions',
        notificationType: displayNotificationType.none,
        requestObject
      }))
    })

  return response
}
