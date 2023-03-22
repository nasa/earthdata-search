import React from 'react'
import PropTypes from 'prop-types'
import {
  Link,
  Route,
  Switch
} from 'react-router-dom'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './AppLogo.scss'

const AppLogo = () => (
  <nav className="app-logo">
    <span className="app-logo__site-logo">
      <h1 className="mb-0">
        <a
          className="app-logo__site-meatball"
          href="/"
          title="Earthdata Search Home"
        >
          <span className="visually-hidden">
            Earthdata Search
          </span>
        </a>
      </h1>
      <Link
        className="app-logo__site-name"
        to="/"
      >
        <span className="app-logo__site-name-ent app-logo__site-name-ent--e">Earthdata</span>
        <span className="app-logo__site-name-ent app-logo__site-name-ent--s">Search</span>
      </Link>
    </span>
    <Switch>
      <Route path="/admin">
        <PortalLinkContainer
          className="app-logo__header-site-area-link"
          to="/admin"
        >
          <h2 className="app-logo__header-site-area-title">Admin</h2>
        </PortalLinkContainer>
      </Route>
    </Switch>
  </nav>
)

AppLogo.propTypes = {
  portal: PropTypes.shape({
    logo: PropTypes.shape({}),
    portalId: PropTypes.string,
    pageTitle: PropTypes.string
  }).isRequired
}

export default AppLogo
