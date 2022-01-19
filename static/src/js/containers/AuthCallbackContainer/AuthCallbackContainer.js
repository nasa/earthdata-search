import React, { Component } from 'react'
import { set } from 'tiny-cookie'
import { connect } from 'react-redux'
import { parse } from 'qs'

import { locationPropType } from '../../util/propTypes/location'

export const mapStateToProps = (state) => ({
  location: state.router.location
})

/**
 * This class handles the authenticated redirect from our edlCallback lambda function.
 * We get the jwt and redirect path from the URL, store the jwt in a cookie and redirect
 * the user to the correct location based on where they were trying to get before logging
 * in.
 */
export class AuthCallbackContainer extends Component {
  componentWillMount() {
    // Pull the jwt and redirect params out of the URL
    const { location } = this.props
    const { search } = location

    const params = parse(search, { ignoreQueryPrefix: true })
    const {
      jwt = '',
      redirect = '/'
    } = params

    // Set the authToken cookie
    set('authToken', jwt)

    // Redirect the user to the correct location
    window.location.replace(redirect)
  }

  render() {
    return (
      <div className="route-wrapper" />
    )
  }
}

AuthCallbackContainer.propTypes = {
  location: locationPropType.isRequired
}

export default connect(mapStateToProps)(AuthCallbackContainer)
