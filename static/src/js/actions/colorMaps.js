import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import {
  ERRORED_COLOR_MAPS,
  SET_COLOR_MAPS_LOADED,
  SET_COLOR_MAPS_LOADING
} from '../constants/actionTypes'

import ColorMapRequest from '../util/request/colorMapRequest'
import actions from './index'

export const setColorMapsErrored = (payload) => ({
  type: ERRORED_COLOR_MAPS,
  payload
})

export const setColorMapsLoaded = (payload) => ({
  type: SET_COLOR_MAPS_LOADED,
  payload
})

export const setColorMapsLoading = (payload) => ({
  type: SET_COLOR_MAPS_LOADING,
  payload
})

export const getColorMap = (payload) => async (dispatch, getState) => {
  const { product } = payload

  const state = getState()

  const { authToken } = state
  const earthdataEnvironment = getEarthdataEnvironment(state)
  dispatch(setColorMapsLoading({ product }))

  const requestObject = new ColorMapRequest(authToken, earthdataEnvironment)

  await requestObject.getColorMap(product)
    .then((response) => {
      const { data } = response
      dispatch(setColorMapsLoaded({ product, jsondata: data }))
    })
    .catch((error) => {
      dispatch(setColorMapsErrored({ product }))
      dispatch(actions.handleError({
        error,
        action: 'getColorMap',
        resource: 'colormaps',
        requestObject
      }))
    })
}
