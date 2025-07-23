import {
  ERRORED_COLOR_MAPS,
  SET_COLOR_MAPS_LOADED,
  SET_COLOR_MAPS_LOADING
} from '../constants/actionTypes'

import ColorMapRequest from '../util/request/colorMapRequest'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

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

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const requestObject = new ColorMapRequest(earthdataEnvironment)

  await requestObject.getColorMap(product)
    .then((response) => {
      const { data } = response
      dispatch(setColorMapsLoaded({
        product,
        colorMapData: data
      }))
    })
    .catch((error) => {
      dispatch(setColorMapsErrored({ product }))
      console.log(`ColorMap loading has errored with: ${error}`)
    })
}
