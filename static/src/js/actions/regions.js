import {
  UPDATE_REGION_RESULTS,
  LOADING_REGIONS,
  LOADED_REGIONS,
  STARTED_REGIONS_TIMER,
  FINISHED_REGIONS_TIMER,
  ERRORED_REGIONS
} from '../constants/actionTypes'

import { displayNotificationType } from '../constants/enums'
import { prepareRegionParams } from '../util/regions'

import RegionRequest from '../util/request/regionRequest'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

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
 */
export const getRegions = () => (dispatch) => {
  const zustandState = useEdscStore.getState()
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const regionParams = prepareRegionParams(zustandState.query.region)

  const {
    query
  } = regionParams

  dispatch(onRegionsLoading())
  dispatch(startRegionsTimer())

  const requestObject = new RegionRequest(earthdataEnvironment)

  const response = requestObject.search(regionParams)
    .then((responseObject) => {
      const payload = {}
      const { data } = responseObject
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

      const { response: responseObject } = error
      const { data } = responseObject
      const { errors } = data

      dispatch(onRegionsErrored(errors))
      dispatch(onRegionsLoaded({
        loaded: false
      }))

      useEdscStore.getState().errors.handleError({
        error,
        action: 'getRegions',
        resource: 'regions',
        notificationType: displayNotificationType.none,
        requestObject
      })
    })

  return response
}
