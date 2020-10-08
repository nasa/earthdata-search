import RegionRequest from '../util/request/regionRequest'
import {
  prepareRegionParams
} from '../util/regions'
import { handleError } from './errors'
import { displayNotificationType } from '../constants/enums'

import {
  UPDATE_REGION_RESULTS,
  LOADING_REGIONS,
  LOADED_REGIONS,
  STARTED_REGIONS_TIMER,
  FINISHED_REGIONS_TIMER,
  ERRORED_REGIONS
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

export const onRegionsErrored = payload => ({
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
      dispatch(handleError({
        error,
        action: 'getRegions',
        resource: 'regions',
        notificationType: displayNotificationType.none,
        requestObject
      }))
    })

  return response
}
