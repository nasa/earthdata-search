import { createSelector } from 'reselect'
import { parse } from 'qs'

import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Retrieve the earthdataEnvironment param from the router location in Redux
 * @param {Object} state Current state of Redux
 */
export const getEarthdataEnvironmentFromUrl = (state) => {
  const { router = {} } = state
  const { location = {} } = router
  const { search = '' } = location

  const { ee: earthdataEnvironment } = parse(search, { ignoreQueryPrefix: true })

  return earthdataEnvironment
}

/**
 * Retrieve current Earthdata Environment from Redux
 * @param {Object} state Current state of Redux
 */
export const getEarthdataEnvironmentParam = (state) => {
  // Pull the default environment from the static application config
  let { env: defaultdeployedEnvironment } = getApplicationConfig()

  // Default to production when developing locally
  if (defaultdeployedEnvironment === 'dev') defaultdeployedEnvironment = 'prod'

  const { earthdataEnvironment = defaultdeployedEnvironment } = state

  return earthdataEnvironment
}

/**
 * Retrieve Earthdata Environment from Redux favoring the URL over the value stored in earthdataEnvironment reducer
 */
export const getEarthdataEnvironment = createSelector(
  [getEarthdataEnvironmentParam, getEarthdataEnvironmentFromUrl],
  (eeParam, eeFromUrl) => {
    if (eeFromUrl) {
      return eeFromUrl
    }

    return eeParam
  }
)
