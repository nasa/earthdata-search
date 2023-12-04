import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { set } from 'tiny-cookie'
import { connect } from 'react-redux'
import { parse } from 'qs'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { locationPropType } from '../../util/propTypes/location'
import history from '../../util/history'

import actions from '../../actions'

export const mapStateToProps = (state) => ({
  location: state.router.location
})

export const mapDispatchToProps = (dispatch) => ({
  onAddEarthdataDownloadRedirect:
    (data) => dispatch(actions.addEarthdataDownloadRedirect(data))
})

/**
 * This class handles the authenticated redirect from our edlCallback lambda function.
 * We get the jwt and redirect path from the URL, store the jwt in a cookie and redirect
 * the user to the correct location based on where they were trying to get before logging
 * in.
 */
export const AuthCallbackContainer = ({
  location,
  onAddEarthdataDownloadRedirect
}) => {
  console.log('🚀 ~ file: AuthCallbackContainer.js:31 ~ location:', location)
  const { edscHost } = getEnvironmentConfig()

  useEffect(() => {
    const { search } = location

    const params = parse(search, { ignoreQueryPrefix: true })
    const {
      eddRedirect,
      jwt = '',
      accessToken,
      redirect = '/'
    } = params

    // Handle EDD redirects
    // EDD redirects must begin with `earthdata-download`
    const validEddRedirect = eddRedirect && eddRedirect.startsWith('earthdata-download')
    console.log('🚀 ~ file: AuthCallbackContainer.js:49 ~ useEffect ~ eddRedirect:', eddRedirect)
    console.log('🚀 ~ file: AuthCallbackContainer.js:49 ~ useEffect ~ validEddRedirect:', validEddRedirect)

    console.log('🚀 ~ file: AuthCallbackContainer.js:54 ~ useEffect💀 ', redirect.includes('earthdata-download'))

    if (eddRedirect && !validEddRedirect) {
      console.log('🚀 ~ file: AuthCallbackContainer.js:54 ~ useEffect ~ redirect:', redirect)

      // Redirect to an error page or a safe location if the URL is not a relative path
      // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace assign prevents back-button use in history
      window.location.replace('/')

      return
    }

    // If the redirect includes earthdata-download, redirect to the edd callback
    if (validEddRedirect || redirect.includes('earthdata-download')) {
      console.log('🚀 ~ file: AuthCallbackContainer.js:48 ~ useEffect ~ eddRedirect:', eddRedirect)
      let eddRedirectUrl = eddRedirect || redirect
      if (accessToken) eddRedirectUrl += `&token=${accessToken}`

      // Add the redirect information to the store
      onAddEarthdataDownloadRedirect({
        redirect: eddRedirectUrl
      })

      // Redirect to the edd callback
      history.push('/earthdata-download-callback')

      return
    }

    // Handle redirects
    // If we are not redirecting to earthdata-search relative path for redirects that have a value
    const invalidRedirectUrl = redirect !== '/' && !redirect.startsWith(edscHost)

    if (invalidRedirectUrl) {
      console.log('🚀 ~ file: AuthCallbackContainer.js:54 ~ useEffect ~ redirect:', redirect)

      // Redirect to an error page or a safe location if the URL is not a relative path
      // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace assign prevents back-button use in history
      window.location.replace('/')

      return
    }

    // Set the authToken cookie
    set('authToken', jwt)

    // Redirect the user to the correct location
    window.location.replace(redirect)
  }, [])

  return (
    <div className="route-wrapper" />
  )
}

AuthCallbackContainer.propTypes = {
  location: locationPropType.isRequired,
  onAddEarthdataDownloadRedirect: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthCallbackContainer)
