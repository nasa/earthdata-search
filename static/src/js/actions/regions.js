import RegionRequest from '../util/request/regionRequest'
import {
  prepareRegionParams
} from '../util/regions'
import { handleError } from './errors'

import {
  UPDATE_REGION_RESULTS,
  LOADING_REGIONS,
  LOADED_REGIONS,
  STARTED_REGIONS_TIMER,
  FINISHED_REGIONS_TIMER,
  ERRORED_REGIONS,
  RESTORE_REGIONS
} from '../constants/actionTypes'

export const updateRegionResults = payload => ({
  type: UPDATE_REGION_RESULTS,
  payload
})

export const onRegionsLoading = () => ({
  type: LOADING_REGIONS
})

export const onRegionsLoaded = payload => ({
  type: LOADED_REGIONS,
  payload
})

export const onRegionsErrored = () => ({
  type: ERRORED_REGIONS
})

export const startRegionsTimer = () => ({
  type: STARTED_REGIONS_TIMER
})

export const finishRegionsTimer = () => ({
  type: FINISHED_REGIONS_TIMER
})

export const restoreRegions = payload => (dispatch) => {
  dispatch({
    type: RESTORE_REGIONS,
    payload
  })
}

/**
 * Perform a collections request based on the current redux state.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */
export const getRegions = () => (dispatch, getState) => {
  const regionParams = prepareRegionParams(getState())

  const {
    query
  } = regionParams

  dispatch(onRegionsLoading())
  dispatch(startRegionsTimer())

  const requestObject = new RegionRequest()

  const response = requestObject.search(regionParams)
    .then((response) => {
      const payload = {}

      const { hits, results } = response
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
      dispatch(onRegionsErrored())
      dispatch(onRegionsLoaded({
        loaded: false
      }))
      dispatch(handleError({
        error,
        action: 'getRegions',
        resource: 'regions'
      }))
    })

  return response
}
