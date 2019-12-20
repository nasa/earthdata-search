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

  if (authToken === '' || providers.length > 0) {
    return new Promise(resolve => resolve(null))
  }

  const requestObject = new ProviderRequest(authToken)
  const request = requestObject.all()

  return request.then(
    response => dispatch(setProviders(response.data)),
    error => dispatch(handleError({
      error,
      action: 'fetchProviders',
      resource: 'providers',
      requestObject
    }))
  )
}
