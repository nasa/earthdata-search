import React, { useEffect } from 'react'
import { set } from 'tiny-cookie'
import { parse } from 'qs'
import { useLocation, useNavigate } from 'react-router-dom'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import useEdscStore from '../../zustand/useEdscStore'
import { routes } from '../../constants/routes'

/**
 * This class handles the authenticated redirect from our edlCallback lambda function.
 * We get the jwt and redirect path from the URL, store the jwt in a cookie and redirect
 * the user to the correct location based on where they were trying to get before logging
 * in.
 */
export const AuthCallbackContainer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { edscHost } = getEnvironmentConfig()

  const setRedirectUrl = useEdscStore((state) => state.earthdataDownloadRedirect.setRedirectUrl)

  useEffect(() => {
    const { search } = location

    const params = parse(search, { ignoreQueryPrefix: true })
    const {
      eddRedirect,
      edlToken,
      redirect = routes.HOME
    } = params

    let eddRedirectUrl = eddRedirect

    if (redirect.includes('earthdata-download')) {
      eddRedirectUrl = redirect
    }

    // Handle EDD redirects
    if (eddRedirectUrl) {
      const validEddRedirect = eddRedirectUrl.startsWith('earthdata-download')

      if (validEddRedirect) {
        if (edlToken) eddRedirectUrl += `&token=${edlToken}`

        // Add the redirect information to the store
        setRedirectUrl(eddRedirectUrl)

        // Redirect to the edd callback
        setTimeout(() => {
          // There is a bug in this redirect because UrlQueryContainer is triggering updates from both Redux and Zustand (for now). For some reason that is causing the URL to stay on /auth_callback instead of redirecting to /earthdata-download-callback.

          // This setTimeout should only be temporary, it should be removed once UrlQueryContainer is removed.
          navigate(routes.EARTHDATA_DOWNLOAD_CALLBACK)
        }, 0)

        return
      }

      window.location.replace('/not-found')

      return
    }

    // Handle redirects
    const invalidRedirectUrl = redirect !== routes.HOME && !redirect.startsWith(edscHost)

    if (invalidRedirectUrl) {
      // Redirect to an error page or a safe location if the URL is not a relative path
      window.location.replace('/not-found')

      return
    }

    // Set the edlToken cookie
    set('edlToken', edlToken)

    // Redirect the user to the correct location
    window.location.replace(redirect)
  }, [])

  return (
    <div className="route-wrapper" />
  )
}

export default AuthCallbackContainer
