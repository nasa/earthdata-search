import HandoffRequest from '../util/request/handoffRequest'

import { SET_SOTO_LAYERS } from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getSotoLayers } from '../selectors/handoffs'

import { handleError } from './errors'

export const setSotoLayers = (payload) => ({
  type: SET_SOTO_LAYERS,
  payload
})

export const fetchSotoLayers = () => (dispatch, getState) => {
  const state = getState()

  // If sotoLayers already exist, don't fetch
  const sotoLayers = getSotoLayers(state)
  if (sotoLayers.length) {
    return null
  }

  const earthdataEnvironment = getEarthdataEnvironment(state)

  const handoffRequestObject = new HandoffRequest(earthdataEnvironment)

  const response = handoffRequestObject.fetchSotoLayers()
    .then((response) => {
      dispatch(setSotoLayers(response.data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchSotoLayers',
        resource: 'sotoLayers',
        handoffRequestObject
      }))
    })

  return response
}
