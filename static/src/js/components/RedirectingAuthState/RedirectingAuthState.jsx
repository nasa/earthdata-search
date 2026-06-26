import React from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error This file does not have types
import Spinner from '../Spinner/Spinner'

const RedirectingAuthState = ({
  message = 'Redirecting to sign in...',
  showSpinner = false
}) => (
  <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
    <div className="route-wrapper__content">
      <div className="route-wrapper__content-inner">
        {
          showSpinner && (
            <Spinner
              className="root__spinner spinner--dots spinner--small"
              type="dots"
            />
          )
        }
        <p>{message}</p>
      </div>
    </div>
  </div>
)

RedirectingAuthState.propTypes = {
  message: PropTypes.string,
  showSpinner: PropTypes.bool
}

export default RedirectingAuthState
