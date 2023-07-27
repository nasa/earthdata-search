import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { set } from 'tiny-cookie'
import { connect } from 'react-redux'
import { parse } from 'qs'

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
  useEffect(() => {
    const { search } = location

    const params = parse(search, { ignoreQueryPrefix: true })
    const {
      eddRedirect,
      jwt = '',
      accessToken,
      redirect = '/'
    } = params

    // Verify that the redirect params are real URLs
    try {
      let redirectUrl
      if (eddRedirect) redirectUrl = new URL(eddRedirect)
      if (redirect && redirect !== '/') redirectUrl = new URL(redirect)

      if (
        redirectUrl
        && redirectUrl.protocol !== 'http:'
        && redirectUrl.protocol !== 'https:'
        && redirectUrl.protocol !== 'earthdata-download:'
      ) {
        // The redirectUrl is not a valid protocol
        console.log('The redirectUrl is not a valid protocol')
        window.location.replace('/')
        return
      }
    } catch (error) {
      window.location.replace('/')
      return
    }

    // If the redirect includes earthdata-download, redirect to the edd callback
    if (eddRedirect || redirect.includes('earthdata-download')) {
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
