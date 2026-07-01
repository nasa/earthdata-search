import React from 'react'

import Spinner from '../Spinner/Spinner'

import './RedirectingAuthState.scss'

const RedirectingAuthState: React.FC = () => (
  <div className="route-wrapper route-wrapper--light route-wrapper--content-page route-wrapper--content-page-centered redirecting-auth-state">
    <div className="route-wrapper__content redirecting-auth-state__content">
      <div className="route-wrapper__content-inner redirecting-auth-state__inner">
        <Spinner
          className="root__spinner spinner--dots spinner--small"
          type="dots"
        />
        <p className="redirecting-auth-state__message">Redirecting to sign in...</p>
      </div>
    </div>
  </div>
)

export default RedirectingAuthState
