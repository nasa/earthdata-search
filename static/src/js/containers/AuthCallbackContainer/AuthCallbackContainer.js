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

    let eddRedirectUrl = eddRedirect

    if (redirect.includes('earthdata-download')) {
      eddRedirectUrl = redirect
    }

    // Handle EDD redirects
    if (eddRedirectUrl) {
      const validEddRedirect = eddRedirectUrl.startsWith('earthdata-download')

      if (validEddRedirect) {
        if (accessToken) eddRedirectUrl += `&token=${accessToken}`

        // Add the redirect information to the store
        onAddEarthdataDownloadRedirect({
          redirect: eddRedirectUrl
        })

        // Redirect to the edd callback
        history.push('/earthdata-download-callback')

        return
      }

      window.location.replace('/not-found')

      return
    }

    // Handle redirects
    const invalidRedirectUrl = redirect !== '/' && !redirect.startsWith(edscHost)

    if (invalidRedirectUrl) {
      // Redirect to an error page or a safe location if the URL is not a relative path
      // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace assign prevents back-button use in history
      window.location.replace('/not-found')

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
