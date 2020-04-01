import ProviderRequest from '../util/request/providerRequest'

import { SET_PROVIDERS } from '../constants/actionTypes'
import { handleError } from './errors'

export const setProviders = providerData => ({
  type: SET_PROVIDERS,
  payload: providerData
})

/**
 * Fetch all providers form legacy services
 */
export const fetchProviders = () => (dispatch, getState) => {
  const { authToken, providers } = getState()

  // If providers have already be retrieved or there is no authToken
  if (authToken === '' || providers.length > 0) {
    return new Promise(resolve => resolve(null))
  }

  const requestObject = new ProviderRequest(authToken)

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
