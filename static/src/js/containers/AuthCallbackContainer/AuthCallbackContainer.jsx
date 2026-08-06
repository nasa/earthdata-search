import React, { useEffect } from 'react'
import { set } from 'tiny-cookie'
import { parse } from 'qs'
import { useLocation, useNavigate } from 'react-router-dom'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import useEdscStore from '../../zustand/useEdscStore'
import { routes } from '../../constants/routes'

import { getSafeRedirectUrl } from '../../../../../sharedUtils/getSafeRedirectUrl'

/**
 * This class handles the authenticated redirect from our edlCallback lambda function.
 * We get the edlToken and redirect path from the URL, store the edlToken in a cookie and redirect
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

    if (redirect && redirect.includes('earthdata-download')) {
      eddRedirectUrl = redirect
    }

    // Handle EDD redirects
    if (eddRedirectUrl) {
      // Validate the EDD redirect against our allow-list, returns null if invalid
      const safeEddUrl = getSafeRedirectUrl(eddRedirectUrl, edscHost)

      if (safeEddUrl && safeEddUrl.startsWith('earthdata-download:')) {
        let finalEddUrl = safeEddUrl

        if (edlToken) {
          // Append token
          finalEddUrl += `&token=${edlToken}`
        }

        setRedirectUrl(finalEddUrl)
        navigate(routes.EARTHDATA_DOWNLOAD_CALLBACK)

        return
      }

      window.location.replace('/not-found')

      return
    }

    // Handle redirects
    const safeRedirectUrl = getSafeRedirectUrl(redirect, edscHost)

    if (!safeRedirectUrl) {
      window.location.replace('/not-found')

      return
    }

    // Set the edlToken cookie
    set('edlToken', edlToken)

    // Redirect the user to the safe, validated location
    window.location.replace(safeRedirectUrl)
  }, [location, navigate, edscHost, setRedirectUrl])

  return (
    <div className="route-wrapper" />
  )
}

export default AuthCallbackContainer
