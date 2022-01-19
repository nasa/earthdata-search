import ProviderRequest from '../util/request/providerRequest'

import { SET_PROVIDERS } from '../constants/actionTypes'

import { buildPromise } from '../util/buildPromise'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getProviders } from '../selectors/providers'
import { handleError } from './errors'

export const setProviders = (providerData) => ({
  type: SET_PROVIDERS,
  payload: providerData
})

/**
 * Fetch all providers form legacy services
 */
export const fetchProviders = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const providers = getProviders(state)

  const { authToken } = state

  // If providers have already be retrieved or there is no authToken
  if (authToken === '' || providers.length > 0) {
    return buildPromise(null)
  }

  const requestObject = new ProviderRequest(authToken, earthdataEnvironment)

  const response = requestObject.all()
    .then((response) => {
      dispatch(setProviders(response.data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchProviders',
        resource: 'providers',
        requestObject
      }))
    })

  return response
}
