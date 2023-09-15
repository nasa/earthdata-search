import { getEnvironmentConfig } from '../../../../sharedUtils/config'

import {
  ERRORED_COLOR_MAPS,
  SET_COLOR_MAPS_LOADED,
  SET_COLOR_MAPS_LOADING
} from '../constants/actionTypes'

const { apiHost } = getEnvironmentConfig()

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

export const getColorMap = (payload) => async (dispatch) => {
  const { product } = payload

  dispatch(setColorMapsLoading({ product }))
  try {
    const response = await fetch(`${apiHost}/colormaps/${product}`)
    if (response.status === 200) {
      const json = await response.json()

      dispatch(setColorMapsLoaded({ product, jsondata: json }))
    } else {
      dispatch(setColorMapsErrored({ product }))
    }
  } catch (error) {
    dispatch(setColorMapsErrored({ product }))
  }
}
